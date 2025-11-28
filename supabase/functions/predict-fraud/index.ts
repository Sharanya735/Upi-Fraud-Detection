import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TransactionInput {
  amount: number;
  user_id: string;
  merchant_id: string;
  device_id: string;
  hour: number;
  weekday: number;
  is_new_payee: number;
  device_changed: number;
  tx_count_24h: number;
  timestamp?: string;
}

interface PredictionResult {
  risk_score: number;
  fraud_label: number;
  supervised_prob: number;
  anomaly_flag: number;
  shap_top_features: Record<string, number>;
  latency_ms?: number;
}

// Call the real Python ML API
async function predictFraud(transaction: TransactionInput): Promise<PredictionResult> {
  const PYTHON_ML_API_URL = Deno.env.get('PYTHON_ML_API_URL');
  
  if (!PYTHON_ML_API_URL) {
    throw new Error('PYTHON_ML_API_URL environment variable not configured');
  }

  // Prepare timestamp if not provided
  const timestamp = transaction.timestamp || new Date().toISOString();
  
  // Prepare the payload for the Python API
  const payload = {
    transaction_id: `TXN_${Date.now()}`,
    user_id: transaction.user_id,
    merchant_id: transaction.merchant_id,
    device_id: transaction.device_id,
    amount: transaction.amount,
    timestamp: timestamp,
    tx_count_24h: transaction.tx_count_24h || 0,
    is_new_payee: transaction.is_new_payee || 0,
    device_changed: transaction.device_changed || 0,
  };

  try {
    // Call the /predict endpoint
    const predictResponse = await fetch(`${PYTHON_ML_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!predictResponse.ok) {
      const errorText = await predictResponse.text();
      throw new Error(`Python API predict error: ${predictResponse.status} - ${errorText}`);
    }

    const predictData = await predictResponse.json();

    // Call the /explain endpoint for SHAP values
    const explainResponse = await fetch(`${PYTHON_ML_API_URL}/explain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    let shap_top_features = {};
    if (explainResponse.ok) {
      const explainData = await explainResponse.json();
      shap_top_features = explainData.shap_top_features || {};
    }

    return {
      risk_score: predictData.risk_score,
      fraud_label: predictData.fraud_label,
      supervised_prob: predictData.supervised_prob || predictData.risk_score,
      anomaly_flag: predictData.anomaly_flag || 0,
      shap_top_features: shap_top_features,
      latency_ms: predictData.latency_ms,
    };
  } catch (error) {
    console.error('Error calling Python ML API:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const transaction: TransactionInput = await req.json();
    
    // Validate input
    if (!transaction.amount || !transaction.user_id || !transaction.merchant_id || !transaction.device_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required transaction fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Processing transaction:', transaction);
    
    const prediction = await predictFraud(transaction);
    
    console.log('Prediction result:', prediction);

    // Convert fraud_label to is_fraud for backward compatibility
    const response = {
      ...prediction,
      is_fraud: prediction.fraud_label,
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Prediction error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
