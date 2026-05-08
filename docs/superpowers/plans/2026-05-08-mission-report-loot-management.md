# Mission Report and Loot Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a readable mission-completion report and make loot decisions clearer through comparison, locking, filtering, and one-click cleanup.

**Architecture:** Store the latest mission report on game state so both tests and the browser can render it. Extend loot read models in `getEquipmentDetails` with per-stat comparison against currently equipped loot. Add core actions for locking loot and organizing weak unlocked duplicates, then mirror those actions in `src/browserGame.js`.

**Tech Stack:** Static HTML/CSS/JavaScript with Node.js rule tests and browser smoke tests.

---

### Task 1: Mission Report State and UI

**Files:**
- Modify: `src/gameCore.mjs`
- Modify: `src/browserGame.js`
- Modify: `browserGame.js`
- Modify: `index.html`
- Modify: `styles.css`
- Test: `tests/game.test.mjs`
- Test: `tests/browser-smoke.test.mjs`

- [ ] **Step 1: Write failing tests**

Add a core test that completes a mission and expects `state.lastMissionReport` to include mission name, map name, outcome, reward text, reputation gain, event name, and equipment name when present. Add a smoke test for `data-mission-report`, `renderMissionReport`, and `data-dismiss-mission-report`.

- [ ] **Step 2: Verify tests fail**

Run `node tests/game.test.mjs` and `node tests/browser-smoke.test.mjs`. Expected: both fail because mission reports do not exist.

- [ ] **Step 3: Implement report data and rendering**

Set `state.lastMissionReport` in mission success and failure paths. Render it above the map list with compact reward, event, and map progress copy. Add a dismiss button that clears the report.

### Task 2: Loot Comparison and Cleanup

**Files:**
- Modify: `src/gameCore.mjs`
- Modify: `src/browserGame.js`
- Modify: `browserGame.js`
- Modify: `styles.css`
- Test: `tests/game.test.mjs`
- Test: `tests/browser-smoke.test.mjs`

- [ ] **Step 1: Write failing tests**

Add a core test that equips one loot item, adds another same-slot item, and expects `getEquipmentDetails(state).loot` to expose comparison deltas. Add a core test that locked and equipped loot survive `organizeLootEquipment`, while weak unlocked duplicates are disassembled into resources. Add smoke tests for `data-organize-loot`, `data-toggle-loot-lock`, `data-loot-filter`, and comparison CSS.

- [ ] **Step 2: Verify tests fail**

Run `node tests/game.test.mjs` and `node tests/browser-smoke.test.mjs`. Expected: missing exports and missing UI hooks fail.

- [ ] **Step 3: Implement core loot actions**

Add `toggleLootLock`, `organizeLootEquipment`, and comparison helpers. Preserve equipped and locked loot, preserve the strongest item per slot, and disassemble weaker unlocked extras with the same reward model as manual dismantling.

- [ ] **Step 4: Implement browser controls**

Add lock/unlock buttons, one-click organize, slot filters, and comparison text inside each loot card. Keep the existing expanded-card behavior.

### Task 3: Verification and Publish

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `browserGame.js`
- Modify: `src/browserGame.js`
- Modify: `src/gameCore.mjs`
- Modify: `tests/game.test.mjs`
- Modify: `tests/browser-smoke.test.mjs`

- [ ] **Step 1: Run full verification**

Run `node tests/game.test.mjs`, `node tests/browser-smoke.test.mjs`, `node --check browserGame.js`, `node --check src/browserGame.js`, `node --check src/gameCore.mjs`, and `cmp -s browserGame.js src/browserGame.js`.

- [ ] **Step 2: Publish**

Copy changed files to the GitHub clone, re-run verification there, commit, push to `main`, wait for GitHub Pages, and verify live HTML/JS/CSS contain the new version and hooks.
