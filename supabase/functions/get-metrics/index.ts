import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching metrics...');

    // Mock metrics data based on the edge function logs
    // In a real implementation, you'd aggregate actual prediction logs
    const metrics = {
      transaction_count: 2847,
      fraud_count: 142,
      detection_rate: 0.9577,
      avg_latency_ms: 23.4,
      avg_risk_score: 0.387,
      anomaly_count: 18,
      throughput_per_min: 47.8,
      recent_alerts: [
        {
          transaction_id: 'TXN_' + Math.random().toString(36).substr(2, 9),
          risk_score: 0.89,
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          amount: 45000,
          reason: 'High transaction amount with unusual device'
        },
        {
          transaction_id: 'TXN_' + Math.random().toString(36).substr(2, 9),
          risk_score: 0.76,
          timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
          amount: 32000,
          reason: 'New payee with high frequency'
        },
        {
          transaction_id: 'TXN_' + Math.random().toString(36).substr(2, 9),
          risk_score: 0.71,
          timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
          amount: 28500,
          reason: 'Unusual transaction hour'
        }
      ]
    };

    console.log('Metrics generated:', metrics);

    return new Response(JSON.stringify(metrics), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-metrics function:', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
