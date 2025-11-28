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
    const PYTHON_ML_API_URL = Deno.env.get('PYTHON_ML_API_URL');
    
    if (!PYTHON_ML_API_URL) {
      // Return empty metrics if API URL not configured
      return new Response(
        JSON.stringify({
          window_seconds: 300,
          transactions: 0,
          fraud_count: 0,
          detection_rate: null,
          avg_latency_ms: null,
          avg_risk_score: null,
          anomaly_count: 0,
          throughput_tps: 0.0,
          recent_alerts: [],
          api_available: false
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get window_seconds from query params (default 300)
    const url = new URL(req.url);
    const windowSeconds = url.searchParams.get('window_seconds') || '300';

    const response = await fetch(`${PYTHON_ML_API_URL}/metrics?window_seconds=${windowSeconds}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Return empty metrics if Python API is not available (instead of throwing error)
      console.log(`Python API metrics endpoint not available: ${response.status}`);
      return new Response(
        JSON.stringify({
          window_seconds: parseInt(windowSeconds),
          transactions: 0,
          fraud_count: 0,
          detection_rate: null,
          avg_latency_ms: null,
          avg_risk_score: null,
          anomaly_count: 0,
          throughput_tps: 0.0,
          recent_alerts: [],
          api_available: false
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const metrics = await response.json();

    return new Response(
      JSON.stringify({ ...metrics, api_available: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Metrics error:', error);
    // Return empty metrics instead of error
    return new Response(
      JSON.stringify({
        window_seconds: 300,
        transactions: 0,
        fraud_count: 0,
        detection_rate: null,
        avg_latency_ms: null,
        avg_risk_score: null,
        anomaly_count: 0,
        throughput_tps: 0.0,
        recent_alerts: [],
        api_available: false
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
