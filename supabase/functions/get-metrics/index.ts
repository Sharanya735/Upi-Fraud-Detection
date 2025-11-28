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
      throw new Error('PYTHON_ML_API_URL environment variable not configured');
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
      const errorText = await response.text();
      throw new Error(`Python API metrics error: ${response.status} - ${errorText}`);
    }

    const metrics = await response.json();

    return new Response(
      JSON.stringify(metrics),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Metrics error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
