# 战利品展开与历练难度 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复战利品展开被刷新打断的问题，并让历练路线在中后期需要更明确的装备、法袍和地图熟练度准备。

**Architecture:** 展开状态属于浏览器界面交互状态，不写入存档，只在 `src/browserGame.js` 的渲染层记录并恢复。历练难度属于核心规则，调整 `src/gameCore.mjs` 的地图压力公式，并把相同逻辑同步到网页脚本。

**Tech Stack:** 静态 HTML/CSS/JavaScript，Node.js 原生测试。

---

### Task 1: 战利品展开状态保持

**Files:**
- Modify: `tests/browser-smoke.test.mjs`
- Modify: `src/browserGame.js`
- Modify: `browserGame.js`

- [ ] **Step 1: Write the failing test**

Add smoke checks that the browser script contains a loot-detail open-state set, records `toggle` events on `details[data-loot-detail]`, and renders `open` for previously opened loot cards.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/browser-smoke.test.mjs`
Expected: FAIL because the current browser script does not preserve loot detail open state.

- [ ] **Step 3: Write minimal implementation**

Add `const openLootDetails = new Set();`, listen for `toggle` events on `refs.lootList`, mark each loot details element with `data-loot-detail`, and render `open` when its uid is in the set.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/browser-smoke.test.mjs`
Expected: PASS.

### Task 2: 历练难度重新拉开

**Files:**
- Modify: `tests/game.test.mjs`
- Modify: `src/gameCore.mjs`
- Modify: `src/browserGame.js`
- Modify: `browserGame.js`

- [ ] **Step 1: Write the failing test**

Add a core test asserting that entering `ancientSwordTomb` immediately at unlock with only realm power is unfavorable, and that preparation through weapon, robe, map mastery, and cultivation path improves the omen.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/game.test.mjs`
Expected: FAIL because current mission pressure is too easily overcome at unlock.

- [ ] **Step 3: Write minimal implementation**

Add a mission pressure multiplier based on route unlock stage and completed-count scaling, while preserving early `qinglanMountain` comfort. Use that adjusted pressure in `getMissionDanger` for both core and browser script.

- [ ] **Step 4: Run full verification**

Run:
`node tests/game.test.mjs`
`node tests/browser-smoke.test.mjs`
`node --check browserGame.js`
`node --check src/browserGame.js`
`node --check src/gameCore.mjs`
`cmp -s browserGame.js src/browserGame.js`

Expected: all commands exit 0.
