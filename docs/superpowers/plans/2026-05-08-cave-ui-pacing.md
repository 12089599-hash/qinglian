# Cave UI And Pacing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the cave into a 20-level long-term growth surface and tune YuanYing-adjacent cave and exploration progress to take at least seven days.

**Architecture:** Keep the static browser architecture. Add cave metadata and pacing helpers to `src/gameCore.mjs`, mirror them in `src/browserGame.js`, and replace the hard-coded cave button list in `index.html` with a rendered cave management surface. Use tests to lock the 20-level cave cap, stage naming, realm gating, pacing ceiling, and browser UI hooks.

**Tech Stack:** Plain JavaScript modules, static HTML/CSS, Node-based tests, GitHub Pages static publish.

---

### Task 1: Rule Tests For Cave Growth And Pacing

**Files:**
- Modify: `tests/game.test.mjs`

- [ ] Add tests that assert every cave building has max level 20, YuanYing-grade cave levels are locked before `元婴一变`, the named cave stage reaches `青岚洞天` at level 20, and an aggressively boosted seven-day simulation still has not reached `元婴一变`.
- [ ] Run `node tests/game.test.mjs` and confirm the new tests fail before implementation.

### Task 2: Browser Smoke Tests For Cave UI

**Files:**
- Modify: `tests/browser-smoke.test.mjs`

- [ ] Add static checks for the rendered cave management surface: `data-cave-list`, `function renderCave`, `data-select-building`, cave summary classes, level 20 naming, and the new cache version.
- [ ] Run `node tests/browser-smoke.test.mjs` and confirm failure before implementation.

### Task 3: Core Cave And Pacing Rules

**Files:**
- Modify: `src/gameCore.mjs`

- [ ] Expand `BUILDINGS` to six systems: meditation seat, spirit field, alchemy furnace, sword array, forging hall, scripture library.
- [ ] Set every building max level to 20 and use stronger nonlinear costs after levels 10 and 15.
- [ ] Add `CAVE_STAGES`, `getCaveStage`, and `getCaveStatus`.
- [ ] Extend realm upgrade tiers to 20 levels, with levels 16-20 gated at `元婴一变`.
- [ ] Raise late realm requirements and reduce late passive rate enough that a high-bonus seven-day simulation remains below YuanYing.
- [ ] Make late mission and depth pressure align with the slower pacing.

### Task 4: Browser Runtime And UI

**Files:**
- Modify: `src/browserGame.js`
- Modify: `index.html`
- Modify: `styles.css`

- [ ] Mirror the core cave and pacing rules in `src/browserGame.js`.
- [ ] Replace the static cave upgrade buttons with `<div data-cave-list class="cave-panel"></div>`.
- [ ] Render cave summary cards, building cards, and one selected building detail panel.
- [ ] Add desktop and mobile CSS so the cave page is card-based on desktop and compact on mobile.

### Task 5: Sync, Verify, Publish

**Files:**
- Modify: `browserGame.js`
- Modify: `README.md`

- [ ] Copy `src/browserGame.js` to `browserGame.js`.
- [ ] Update cache version in `index.html`.
- [ ] Update README gameplay notes.
- [ ] Run syntax checks, all tests, and a mobile browser check.
- [ ] Publish to `/tmp/qinglian-publish`, commit, push, and confirm GitHub Pages loads the new cache version.
