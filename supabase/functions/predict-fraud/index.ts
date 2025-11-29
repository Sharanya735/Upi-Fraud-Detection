import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TransactionInput {
  trans_amount: number;
  category: number;
  device_type: string;
  state: number;
  trans_hour: number;
  transaction_frequency: string;
  age: number;
  previous_fraud: string;
}

interface PredictionResult {
  risk_score: number;
  is_fraud: number;
  supervised_prob: number;
  anomaly_flag: number;
  shap_top_features: Record<string, number>;
}

// Simulated ML model prediction based on actual dataset features
function predictFraud(transaction: TransactionInput): PredictionResult {
  // Feature engineering based on dataset columns
  const features = {
    amount_normalized: transaction.trans_amount / 1000,
    category: transaction.category,
    trans_hour: transaction.trans_hour,
    age: transaction.age,
    state: transaction.state,
    device_risk: transaction.device_type === 'mobile' ? 0 : transaction.device_type === 'tablet' ? 0.1 : 0.2,
    frequency_risk: transaction.transaction_frequency === 'low' ? 0 : 
                   transaction.transaction_frequency === 'normal' ? 0.1 : 
                   transaction.transaction_frequency === 'high' ? 0.3 : 0.5,
    fraud_history_risk: transaction.previous_fraud === 'no' ? 0 : 
                       transaction.previous_fraud === 'low' ? 0.3 : 
                       transaction.previous_fraud === 'medium' ? 0.5 : 0.8,
  };

  // Simulated Random Forest probability (supervised model)
  let supervised_prob = 0.05; // base probability

  // Amount-based risk
  if (features.amount_normalized > 500) supervised_prob += 0.2;
  if (features.amount_normalized > 1000) supervised_prob += 0.15;
  
  // Time-based risk (late night/early morning)
  if (features.trans_hour < 6 || features.trans_hour > 22) supervised_prob += 0.15;
  
  // High-risk categories (investments, electronics, fuel)
  if ([8, 10, 12].includes(features.category)) supervised_prob += 0.1;
  
  // Account age (newer accounts are riskier)
  if (features.age < 2) supervised_prob += 0.2;
  else if (features.age < 5) supervised_prob += 0.1;
  
  // Device and frequency risk
  supervised_prob += features.device_risk;
  supervised_prob += features.frequency_risk;
  supervised_prob += features.fraud_history_risk;

  supervised_prob = Math.min(supervised_prob, 0.98);

  // Simulated Isolation Forest anomaly detection
  let anomaly_score = 0;
  
  // Unusual amount + time combination
  if (features.amount_normalized > 800 && (features.trans_hour < 6 || features.trans_hour > 22)) {
    anomaly_score = 1;
  }
  
  // Very high transaction frequency with high amount
  if (features.frequency_risk > 0.3 && features.amount_normalized > 500) {
    anomaly_score = 1;
  }
  
  // Previous fraud history with high amount
  if (features.fraud_history_risk > 0.3 && features.amount_normalized > 300) {
    anomaly_score = 1;
  }
  
  // New account (< 1 year) with very high amount
  if (features.age < 2 && features.amount_normalized > 600) {
    anomaly_score = 1;
  }

  // Hybrid fusion (weighted combination)
  const alpha = 0.7;
  const risk_score = alpha * supervised_prob + (1 - alpha) * anomaly_score;
  const is_fraud = risk_score > 0.5 ? 1 : 0;

  // Simulated SHAP feature importance
  const shap_values: Record<string, number> = {};
  
  if (features.amount_normalized > 300) {
    shap_values.amount = 0.12 + (features.amount_normalized / 1000) * 0.1;
  }
  
  if (features.trans_hour < 6 || features.trans_hour > 22) {
    shap_values.time_of_day = 0.15;
  }
  
  if (features.fraud_history_risk > 0) {
    shap_values.fraud_history = features.fraud_history_risk * 0.25;
  }
  
  if (features.age < 5) {
    shap_values.account_age = 0.1 + ((5 - features.age) * 0.03);
  }
  
  if (features.frequency_risk > 0.1) {
    shap_values.transaction_frequency = features.frequency_risk * 0.2;
  }
  
  if ([8, 10, 12].includes(features.category)) {
    shap_values.merchant_category = 0.08;
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
    if (!transaction.trans_amount || !transaction.category || !transaction.device_type || !transaction.state) {
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
