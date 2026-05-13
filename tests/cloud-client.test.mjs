import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../cloudClient.js', import.meta.url), 'utf8');

function createMemoryStorage() {
  const data = new Map();
  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, String(value));
    },
    removeItem(key) {
      data.delete(key);
    },
  };
}

function loadFactory() {
  const context = {
    console,
    URL,
    globalThis: {},
  };
  context.window = context.globalThis;
  vm.runInNewContext(source, context);
  return context.globalThis.createQinglanCloudClient;
}

const createQinglanCloudClient = loadFactory();

{
  const client = createQinglanCloudClient({}, { storage: createMemoryStorage() });
  assert.equal(client.isConfigured(), false);
  const result = await client.signIn('a@example.com', 'secret');
  assert.equal(result.ok, false);
  assert.equal(result.code, 'not-configured');
}

{
  const calls = [];
  const storage = createMemoryStorage();
  const client = createQinglanCloudClient(
    { supabaseUrl: 'https://demo.supabase.co', anonKey: 'anon-key' },
    {
      storage,
      fetch: async (url, options) => {
        calls.push({ url, options });
        return {
          ok: true,
          json: async () => ({
            access_token: 'token-1',
            refresh_token: 'refresh-1',
            expires_in: 3600,
            user: { id: 'user-1', email: 'a@example.com' },
          }),
        };
      },
      now: () => 1000,
    },
  );

  const result = await client.signIn('a@example.com', 'secret');
  assert.equal(result.ok, true);
  assert.equal(calls[0].url, 'https://demo.supabase.co/auth/v1/token?grant_type=password');
  assert.equal(calls[0].options.method, 'POST');
  assert.equal(calls[0].options.headers.apikey, 'anon-key');
  assert.deepEqual(JSON.parse(calls[0].options.body), { email: 'a@example.com', password: 'secret' });
  assert.equal(client.getSession().accessToken, 'token-1');
}

{
  const calls = [];
  const storage = createMemoryStorage();
  storage.setItem('qinglan-cloud-session-v1', JSON.stringify({ accessToken: 'token-2', user: { id: 'user-2' } }));
  const client = createQinglanCloudClient(
    { supabaseUrl: 'https://demo.supabase.co', anonKey: 'anon-key' },
    {
      storage,
      fetch: async (url, options) => {
        calls.push({ url, options });
        return { ok: true, json: async () => ({ ok: true, revision: 3 }) };
      },
    },
  );

  const result = await client.saveSnapshot({ realmIndex: 2 }, { source: 'test' });
  assert.equal(result.ok, true);
  assert.equal(calls[0].url, 'https://demo.supabase.co/functions/v1/qinglan-save');
  assert.equal(calls[0].options.method, 'POST');
  assert.equal(calls[0].options.headers.Authorization, 'Bearer token-2');
  assert.deepEqual(JSON.parse(calls[0].options.body), { state: { realmIndex: 2 }, meta: { source: 'test' } });
}

{
  const calls = [];
  const client = createQinglanCloudClient(
    { supabaseUrl: 'https://demo.supabase.co', anonKey: 'anon-key' },
    {
      storage: createMemoryStorage(),
      fetch: async (url, options) => {
        calls.push({ url, options });
        return { ok: true, json: async () => ({ rows: [{ displayName: '青岚', score: 12 }] }) };
      },
    },
  );

  const result = await client.getLeaderboard('depth');
  assert.equal(result.ok, true);
  assert.equal(calls[0].url, 'https://demo.supabase.co/functions/v1/qinglan-leaderboard?board=depth');
  assert.equal(calls[0].options.headers.apikey, 'anon-key');
}
