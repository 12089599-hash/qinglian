import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function clampLimit(value: string | null) {
  const parsed = Number(value || 20);
  if (!Number.isFinite(parsed)) return 20;
  return Math.max(1, Math.min(100, Math.floor(parsed)));
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (request.method !== 'GET') {
    return json({ code: 'method-not-allowed', message: 'Use GET.' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) {
    return json({ code: 'missing-env', message: 'Supabase function environment is not configured.' }, 500);
  }

  const url = new URL(request.url);
  const board = url.searchParams.get('board') || 'depth';
  const limit = clampLimit(url.searchParams.get('limit'));
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await supabase
    .from('leaderboard_snapshots')
    .select('user_id,board,realm_index,realm_name,best_depth,defeated_bosses,combat_power,score,accepted_at,profiles(display_name)')
    .eq('board', board)
    .eq('verified', true)
    .order('score', { ascending: false })
    .order('accepted_at', { ascending: true })
    .limit(limit);
  if (error) {
    return json({ code: 'leaderboard-load-failed', message: error.message }, 500);
  }

  const rows = (data || []).map((row, index) => {
    const nestedProfiles = row.profiles as unknown;
    const profile = (Array.isArray(nestedProfiles) ? nestedProfiles[0] : nestedProfiles) as { display_name?: string } | null;
    return {
      rank: index + 1,
      userId: row.user_id,
      displayName: profile?.display_name || `青岚道友 ${index + 1}`,
      board: row.board,
      realmIndex: row.realm_index,
      realm: row.realm_name,
      bestDepth: row.best_depth,
      defeatedBosses: row.defeated_bosses,
      combatPower: row.combat_power,
      score: row.score,
      acceptedAt: row.accepted_at,
    };
  });

  return json({ board, rows });
});
