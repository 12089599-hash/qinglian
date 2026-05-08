# Sect Opportunity Attributes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add sect depth, opportunity choices, long-term treasure/beast upgrades, and explicit attribute/equipment feedback.

**Architecture:** Core logic remains in `src/gameCore.mjs`; the browser copy mirrors it in `src/browserGame.js` and root `browserGame.js`. New helpers expose read-model data for UI so display details do not duplicate math.

**Tech Stack:** Static HTML/CSS/JavaScript, Node assertion tests, GitHub Pages.

---

### Task 1: Core Tests

**Files:**
- Modify: `tests/game.test.mjs`

- [ ] Add tests for sect level, roster attributes, opportunity resolution, treasure/beast upgrades, and character/equipment details.
- [ ] Run `node tests/game.test.mjs` and confirm the new tests fail because the exported functions and data do not exist yet.

### Task 2: Core Logic

**Files:**
- Modify: `src/gameCore.mjs`

- [ ] Add constants for sect levels, opportunities, treasures, and spirit beasts.
- [ ] Add save migration/normalization for new fields.
- [ ] Implement roster generation, disciple job assignment, commission experience, opportunity resolution, treasure/beast upgrades, and profile/detail read models.
- [ ] Run `node tests/game.test.mjs` and confirm all core tests pass.

### Task 3: Browser UI

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `src/browserGame.js`
- Modify: `browserGame.js`

- [ ] Add DOM targets for attribute breakdown, opportunity choices, treasure/beast rows, and sect roster.
- [ ] Render exact effect text for equipment, affixes, loot, treasures, beasts, and derived attributes.
- [ ] Sync root `browserGame.js` from `src/browserGame.js`.
- [ ] Run browser smoke and syntax checks.

### Task 4: Publish

**Files:**
- Publish changed static files and tests to `12089599-hash/qinglian`.

- [ ] Clone the GitHub repo to a temporary publishing folder.
- [ ] Copy the updated files.
- [ ] Run tests in the publishing folder.
- [ ] Commit and push to `main`.
- [ ] Wait for the GitHub Pages deployment and verify the public page contains the new UI text.
