import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const schema = readFileSync(new URL('../cloud/supabase/schema.sql', import.meta.url), 'utf8');
const saveFunction = readFileSync(new URL('../cloud/supabase/functions/qinglan-save/index.ts', import.meta.url), 'utf8');
const leaderboardFunction = readFileSync(new URL('../cloud/supabase/functions/qinglan-leaderboard/index.ts', import.meta.url), 'utf8');
const accountDeleteFunction = readFileSync(new URL('../cloud/supabase/functions/qinglan-account-delete/index.ts', import.meta.url), 'utf8');
const readme = readFileSync(new URL('../cloud/supabase/README.md', import.meta.url), 'utf8');

for (const table of ['profiles', 'cloud_saves', 'leaderboard_snapshots', 'audit_events']) {
  assert.match(schema, new RegExp(`create table[^;]+${table}`, 'is'), `${table} table should be defined`);
  assert.match(schema, new RegExp(`alter table[^;]+${table}[^;]+enable row level security`, 'is'), `${table} should enable RLS`);
}

assert.match(schema, /auth\.uid\(\)/);
assert.match(schema, /verified\s+boolean\s+not null\s+default\s+false/i);

assert.match(saveFunction, /Deno\.serve/);
assert.match(saveFunction, /Authorization/);
assert.match(saveFunction, /cloud_saves/);
assert.match(saveFunction, /leaderboard_snapshots/);
assert.match(saveFunction, /realmIndex/);
assert.match(saveFunction, /bestDepth/);

assert.match(leaderboardFunction, /Deno\.serve/);
assert.match(leaderboardFunction, /leaderboard_snapshots/);
assert.match(leaderboardFunction, /verified/);
assert.match(leaderboardFunction, /limit/);

assert.match(accountDeleteFunction, /Deno\.serve/);
assert.match(accountDeleteFunction, /Authorization/);
assert.match(accountDeleteFunction, /deletion_requested_at/);
assert.match(accountDeleteFunction, /audit_events/);

assert.match(readme, /SUPABASE_URL/);
assert.match(readme, /SUPABASE_ANON_KEY/);
assert.match(readme, /qinglan-save/);
assert.match(readme, /qinglan-leaderboard/);
assert.match(readme, /qinglan-account-delete/);
assert.match(readme, /App Store/i);

console.log('ok - cloud backend stubs document Supabase schema and functions');
