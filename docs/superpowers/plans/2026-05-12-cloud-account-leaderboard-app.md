# Cloud Account, Leaderboard, and App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a cloud-ready account, save, leaderboard, and App Store packaging path without breaking guest play.

**Architecture:** Keep guest local saves intact, add a small cloud adapter that is disabled until Supabase config exists, and expose account/cloud controls in the existing log panel. The server-side source of truth lives behind Supabase edge functions; the current client can render and cache but ranked saves are pulled from cloud rows only.

**Tech Stack:** Vanilla JS browser game, Capacitor iOS, Supabase Auth/Postgres/Edge Functions, existing Node smoke tests.

---

### Task 1: Cloud Client Adapter

**Files:**
- Create: `/Users/a123/Documents/Codex/2026-05-07/web/cloudClient.js`
- Test: `/Users/a123/Documents/Codex/2026-05-07/web/tests/cloud-client.test.mjs`
- Modify: `/Users/a123/Documents/Codex/2026-05-07/web/scripts/build-app-web.mjs`

- [x] Write tests for unconfigured mode, email login request shape, session persistence, save upload request, and leaderboard request.
- [x] Implement a global `createQinglanCloudClient(config, deps)` factory.
- [x] Copy `cloudClient.js` into `www` during App builds.

### Task 2: Account and Leaderboard UI

**Files:**
- Modify: `/Users/a123/Documents/Codex/2026-05-07/web/index.html`
- Modify: `/Users/a123/Documents/Codex/2026-05-07/web/browserGame.js`
- Modify: `/Users/a123/Documents/Codex/2026-05-07/web/styles.css`
- Test: `/Users/a123/Documents/Codex/2026-05-07/web/tests/browser-smoke.test.mjs`

- [x] Add cloud/account markup under `山门 -> 日志`.
- [x] Add refs and handlers for register, login, logout, upload local save, pull cloud save, refresh leaderboard, and delete-account request.
- [x] Save remains local for guests. When logged in and configured, cloud sync is explicit plus debounced after normal saves.
- [x] Add compact desktop/mobile styling.

### Task 3: Supabase Backend Stubs

**Files:**
- Create: `/Users/a123/Documents/Codex/2026-05-07/web/cloud/supabase/schema.sql`
- Create: `/Users/a123/Documents/Codex/2026-05-07/web/cloud/supabase/functions/qinglan-save/index.ts`
- Create: `/Users/a123/Documents/Codex/2026-05-07/web/cloud/supabase/functions/qinglan-leaderboard/index.ts`
- Create: `/Users/a123/Documents/Codex/2026-05-07/web/cloud/supabase/functions/qinglan-account-delete/index.ts`
- Create: `/Users/a123/Documents/Codex/2026-05-07/web/cloud/supabase/README.md`

- [x] Define profiles, cloud saves, leaderboard snapshots, and audit events.
- [x] Add an authenticated save function that stores snapshots and writes a score row.
- [x] Add a public leaderboard function that returns only verified score rows.
- [x] Add an authenticated account deletion request function for the in-app delete entry.
- [x] Document exact Supabase setup values needed by the app.

### Task 4: iOS Build and Upload Preparation

**Files:**
- Modify: `/Users/a123/Documents/Codex/2026-05-07/web/capacitor.config.json` if bundle metadata needs updating.
- Modify: `/Users/a123/Documents/Codex/2026-05-07/web/ios/App/App/Info.plist` only if App Store metadata requires it.

- [x] Build web assets.
- [x] Sync Capacitor iOS.
- [x] Run smoke tests and app build. Smoke tests pass; simulator and unsigned iPhoneOS builds pass when using `/Applications/Xcode.app`.
- [x] Create a release archive and export a signed App Store Connect IPA with team `G7DQ49ZDQA`.
- [x] Upload to App Store Connect after the App Store Connect app record exists. Apple accepted the signed App Store package and reported that the uploaded package is processing.
- [x] Upload App Store screenshots: 5 iPhone 6.5-inch screenshots and 3 iPad 13-inch screenshots are visible in App Store Connect.

### Task 5: Publish Web Update

**Files:**
- Copy intended changed files to `/tmp/qinglian-publish`.

- [x] Run local tests in the workspace.
- [x] Copy only the intended files to the publish candidate directory.
- [x] Run tests in the publish candidate directory.
- [ ] Commit and push to GitHub Pages. Blocked because no publish Git repo was found at `/tmp/qinglian-publish`.
- [ ] Confirm the live page uses the new cache version.
