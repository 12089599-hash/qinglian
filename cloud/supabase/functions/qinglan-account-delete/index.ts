import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function getBearerToken(request: Request) {
  const header = request.headers.get('Authorization') || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || '';
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (request.method !== 'POST') {
    return json({ code: 'method-not-allowed', message: 'Use POST.' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ code: 'missing-env', message: 'Supabase function environment is not configured.' }, 500);
  }

  const token = getBearerToken(request);
  if (!token) {
    return json({ code: 'not-signed-in', message: 'Missing Authorization bearer token.' }, 401);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  const user = authData?.user;
  if (authError || !user) {
    return json({ code: 'not-signed-in', message: 'Invalid or expired session.' }, 401);
  }

  const requestedAt = new Date().toISOString();
  const { error: profileError } = await supabase.from('profiles').upsert({
    user_id: user.id,
    display_name: user.email?.split('@')[0] || '青岚道友',
    deletion_requested_at: requestedAt,
    updated_at: requestedAt,
  });
  if (profileError) {
    return json({ code: 'delete-request-failed', message: profileError.message }, 500);
  }

  await supabase.from('audit_events').insert({
    user_id: user.id,
    event_type: 'account.delete_requested',
    detail: { requestedAt },
  });

  return json({
    ok: true,
    requestedAt,
    message: 'Account deletion request recorded. Complete deletion can be processed from Supabase Auth admin.',
  });
});
