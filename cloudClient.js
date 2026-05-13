(function attachQinglanCloud(global) {
  const sessionKey = 'qinglan-cloud-session-v1';

  function normalizeConfig(config = {}) {
    const supabaseUrl = String(config.supabaseUrl || '').replace(/\/+$/, '');
    const anonKey = String(config.anonKey || '');
    return {
      supabaseUrl,
      anonKey,
      enabled: Boolean(supabaseUrl && anonKey),
    };
  }

  function readQinglanCloudConfig() {
    const direct = global.QINGLAN_CLOUD_CONFIG || {};
    const documentRef = global.document || null;
    const metaUrl = documentRef?.querySelector?.('meta[name="qinglan-supabase-url"]')?.content || '';
    const metaKey = documentRef?.querySelector?.('meta[name="qinglan-supabase-anon-key"]')?.content || '';
    return normalizeConfig({
      supabaseUrl: direct.supabaseUrl || metaUrl,
      anonKey: direct.anonKey || metaKey,
    });
  }

  function safeParse(value) {
    if (!value) {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  function createQinglanCloudClient(config = {}, deps = {}) {
    const normalized = normalizeConfig(config);
    const storage = deps.storage || global.localStorage || null;
    const fetchFn = deps.fetch || global.fetch?.bind(global);
    const now = deps.now || Date.now;

    function getSession() {
      return safeParse(storage?.getItem?.(sessionKey)) || null;
    }

    function setSession(raw) {
      const session = {
        accessToken: raw.access_token || raw.accessToken || '',
        refreshToken: raw.refresh_token || raw.refreshToken || '',
        expiresAt: raw.expires_at || raw.expiresAt || (raw.expires_in ? now() + raw.expires_in * 1000 : 0),
        user: raw.user || null,
      };
      storage?.setItem?.(sessionKey, JSON.stringify(session));
      return session;
    }

    function clearSession() {
      storage?.removeItem?.(sessionKey);
    }

    function notConfigured() {
      return { ok: false, code: 'not-configured', message: '云端服务尚未配置。' };
    }

    function notSignedIn() {
      return { ok: false, code: 'not-signed-in', message: '请先登录云端账号。' };
    }

    async function requestJson(path, options = {}) {
      if (!normalized.enabled || !fetchFn) {
        return notConfigured();
      }
      const headers = {
        apikey: normalized.anonKey,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      };
      if (options.session) {
        headers.Authorization = `Bearer ${options.session.accessToken}`;
      }
      const response = await fetchFn(`${normalized.supabaseUrl}${path}`, {
        method: options.method || 'GET',
        headers,
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
      });
      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }
      if (!response.ok) {
        return {
          ok: false,
          code: payload?.code || payload?.error_code || `http-${response.status || 'error'}`,
          message: payload?.msg || payload?.message || payload?.error_description || payload?.error || '云端请求失败。',
          payload,
        };
      }
      return { ok: true, payload };
    }

    async function signUp(email, password) {
      const result = await requestJson('/auth/v1/signup', {
        method: 'POST',
        body: { email, password },
      });
      if (!result.ok) {
        return result;
      }
      if (result.payload?.access_token) {
        return { ok: true, session: setSession(result.payload), payload: result.payload };
      }
      return { ok: true, pendingConfirmation: true, payload: result.payload };
    }

    async function signIn(email, password) {
      const result = await requestJson('/auth/v1/token?grant_type=password', {
        method: 'POST',
        body: { email, password },
      });
      if (!result.ok) {
        return result;
      }
      return { ok: true, session: setSession(result.payload), payload: result.payload };
    }

    async function saveSnapshot(state, meta = {}) {
      const session = getSession();
      if (!session?.accessToken) {
        return notSignedIn();
      }
      return requestJson('/functions/v1/qinglan-save', {
        method: 'POST',
        session,
        body: { state, meta },
      });
    }

    async function loadSnapshot() {
      const session = getSession();
      if (!session?.accessToken) {
        return notSignedIn();
      }
      return requestJson('/functions/v1/qinglan-save', {
        method: 'GET',
        session,
      });
    }

    async function getLeaderboard(board = 'depth') {
      return requestJson(`/functions/v1/qinglan-leaderboard?board=${encodeURIComponent(board)}`);
    }

    async function requestAccountDeletion() {
      const session = getSession();
      if (!session?.accessToken) {
        return notSignedIn();
      }
      return requestJson('/functions/v1/qinglan-account-delete', {
        method: 'POST',
        session,
        body: { requestedAt: now() },
      });
    }

    return {
      isConfigured: () => normalized.enabled,
      getConfig: () => ({ ...normalized }),
      getSession,
      clearSession,
      signUp,
      signIn,
      saveSnapshot,
      loadSnapshot,
      getLeaderboard,
      requestAccountDeletion,
    };
  }

  global.readQinglanCloudConfig = readQinglanCloudConfig;
  global.createQinglanCloudClient = createQinglanCloudClient;
})(globalThis);
