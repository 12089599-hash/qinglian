import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

type SaveMeta = {
  reason?: string;
  realm?: string;
  realmIndex?: number;
  power?: number;
  bestDepth?: number;
  defeatedBosses?: number;
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

function clampInteger(value: unknown, min: number, max: number) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.max(min, Math.min(max, Math.floor(number)));
}

function computeScore(meta: SaveMeta, state: Record<string, unknown>) {
  const realmIndex = clampInteger(meta.realmIndex ?? state.realmIndex, 0, 35);
  const bestDepth = clampInteger(meta.bestDepth, 0, 30);
  const defeatedBosses = clampInteger(meta.defeatedBosses, 0, 64);
  const combatPower = clampInteger(meta.power, 0, 1_000_000_000);
  return {
    realmIndex,
    realmName: String(meta.realm || '炼气一层').slice(0, 32),
    bestDepth,
    defeatedBosses,
    combatPower,
    score: realmIndex * 1_000_000 + bestDepth * 10_000 + defeatedBosses * 1_000 + Math.min(combatPower, 999_999),
  };
}

function isPlausibleSnapshot(meta: SaveMeta, state: Record<string, unknown>) {
  const score = computeScore(meta, state);
  return score.realmIndex >= 0 && score.bestDepth >= 0 && score.combatPower >= 0;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
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

  if (request.method === 'GET') {
    const { data, error } = await supabase
      .from('cloud_saves')
      .select('revision,state,meta,created_at')
      .eq('user_id', user.id)
      .order('revision', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      return json({ code: 'save-load-failed', message: error.message }, 500);
    }
    return json({ save: data });
  }

  if (request.method !== 'POST') {
    return json({ code: 'method-not-allowed', message: 'Use GET or POST.' }, 405);
  }

  const body = await request.json().catch(() => null);
  const state = body?.state;
  const meta: SaveMeta = body?.meta || {};
  if (!state || typeof state !== 'object') {
    return json({ code: 'invalid-save', message: 'Save state must be an object.' }, 400);
  }
  if (!isPlausibleSnapshot(meta, state)) {
    return json({ code: 'invalid-score', message: 'Snapshot score metadata is not plausible.' }, 400);
  }

  await supabase.from('profiles').upsert({
    user_id: user.id,
    display_name: user.email?.split('@')[0] || '青岚道友',
    updated_at: new Date().toISOString(),
  });

  const { data: latest } = await supabase
    .from('cloud_saves')
    .select('revision')
    .eq('user_id', user.id)
    .order('revision', { ascending: false })
    .limit(1)
    .maybeSingle();
  const revision = (latest?.revision || 0) + 1;

  const { data: save, error: saveError } = await supabase
    .from('cloud_saves')
    .insert({
      user_id: user.id,
      revision,
      state,
      meta,
      imported_guest: meta.reason === 'bind',
    })
    .select('id,revision,created_at')
    .single();
  if (saveError) {
    return json({ code: 'save-write-failed', message: saveError.message }, 500);
  }

  const score = computeScore(meta, state);
  const { error: scoreError } = await supabase.from('leaderboard_snapshots').insert({
    user_id: user.id,
    save_id: save.id,
    board: 'depth',
    realm_index: score.realmIndex,
    realm_name: score.realmName,
    best_depth: score.bestDepth,
    defeated_bosses: score.defeatedBosses,
    combat_power: score.combatPower,
    score: score.score,
    verified: true,
  });
  if (scoreError) {
    return json({ code: 'score-write-failed', message: scoreError.message }, 500);
  }

  await supabase.from('audit_events').insert({
    user_id: user.id,
    event_type: 'cloud_save.accepted',
    detail: { revision, reason: meta.reason || 'manual' },
  });

  return json({ save, score });
});
