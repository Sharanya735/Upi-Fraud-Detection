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
}

interface PredictionResult {
  risk_score: number;
  is_fraud: number;
  supervised_prob: number;
  anomaly_flag: number;
  shap_top_features: Record<string, number>;
}

// Simulated ML model prediction
// In production, this would load actual trained models
function predictFraud(transaction: TransactionInput): PredictionResult {
  // Feature engineering
  const features = {
    amount_normalized: transaction.amount / 10000,
    hour: transaction.hour,
    weekday: transaction.weekday,
    tx_count_24h: transaction.tx_count_24h,
    is_new_payee: transaction.is_new_payee,
    device_changed: transaction.device_changed,
  };

  // Simulated Random Forest probability (supervised model)
  // High risk indicators: large amounts, late hours, new payees, device changes
  let supervised_prob = 0.1; // base probability

  if (features.amount_normalized > 3) supervised_prob += 0.25;
  if (features.amount_normalized > 5) supervised_prob += 0.15;
  
  if (features.hour < 6 || features.hour > 22) supervised_prob += 0.15;
  
  if (features.is_new_payee === 1) supervised_prob += 0.2;
  
  if (features.device_changed === 1) supervised_prob += 0.25;
  
  if (features.tx_count_24h > 10) supervised_prob += 0.1;
  if (features.tx_count_24h > 20) supervised_prob += 0.15;

  supervised_prob = Math.min(supervised_prob, 0.98);

  // Simulated Isolation Forest anomaly detection
  // Detects unusual combinations of features
  let anomaly_score = 0;
  
  // Unusual amount + time combination
  if (features.amount_normalized > 4 && (features.hour < 6 || features.hour > 22)) {
    anomaly_score = 1;
  }
  
  // High velocity with device change
  if (features.tx_count_24h > 15 && features.device_changed === 1) {
    anomaly_score = 1;
  }
  
  // New payee with high amount at unusual time
  if (features.is_new_payee === 1 && features.amount_normalized > 3 && 
      (features.hour < 7 || features.hour > 21)) {
    anomaly_score = 1;
  }

  // Hybrid fusion (weighted combination)
  const alpha = 0.7;
  const risk_score = alpha * supervised_prob + (1 - alpha) * anomaly_score;
  const is_fraud = risk_score > 0.5 ? 1 : 0;

  // Simulated SHAP feature importance
  // In production, these would come from actual SHAP computation
  const shap_values: Record<string, number> = {};
  
  if (features.amount_normalized > 2) {
    shap_values.amount = 0.15 * features.amount_normalized;
  }
  
  if (features.hour < 6 || features.hour > 22) {
    shap_values.hour = 0.12;
  }
  
  if (features.is_new_payee === 1) {
    shap_values.is_new_payee = 0.18;
  }
  
  if (features.device_changed === 1) {
    shap_values.device_changed = 0.22;
  }
  
  if (features.tx_count_24h > 10) {
    shap_values.tx_count_24h = 0.08 * (features.tx_count_24h / 10);
  }

  // Sort by absolute value and take top 5
  const sorted_features = Object.entries(shap_values)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
    .slice(0, 5);
  
  const shap_top_features: Record<string, number> = {};
  for (const [key, value] of sorted_features) {
    shap_top_features[key] = value;
  }

  return {
    risk_score,
    is_fraud,
    supervised_prob,
    anomaly_flag: anomaly_score,
    shap_top_features,
  };
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
    
    const prediction = predictFraud(transaction);
    
    console.log('Prediction result:', prediction);

    return new Response(
      JSON.stringify(prediction),
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
