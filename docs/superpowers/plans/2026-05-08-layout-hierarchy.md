# Layout Hierarchy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce screen crowding by grouping navigation, splitting resources by priority, and adding internal equipment sections.

**Architecture:** Keep the existing static DOM and browser script model. Replace the 10 always-visible bottom tabs with four top-level groups plus contextual sub-tabs, reorganize the stats panel into primary status and collapsible resource groups, and add equipment inner tabs without changing save data or core game rules.

**Tech Stack:** Static HTML/CSS/JavaScript, Node.js smoke tests.

---

### Task 1: Navigation Grouping

**Files:**
- Modify: `index.html`
- Modify: `src/browserGame.js`
- Modify: `browserGame.js`
- Modify: `styles.css`
- Test: `tests/browser-smoke.test.mjs`

- [ ] **Step 1: Write the failing smoke test**

Add assertions that `index.html` contains `data-tab-group`, `data-sub-tabs`, and the four labels `修行`, `行游`, `库藏`, `山门`. Add assertions that the browser script contains `tabGroups` and `renderSubTabs`.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/browser-smoke.test.mjs`
Expected: FAIL because grouped navigation does not exist yet.

- [ ] **Step 3: Implement grouped navigation**

Update the main nav to four group buttons and an empty sub-tab container. In `src/browserGame.js`, add group-to-tab mapping, sub-tab rendering, delegated sub-tab clicks, and active group highlighting.

### Task 2: Resource Priority Layout

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Test: `tests/browser-smoke.test.mjs`

- [ ] **Step 1: Write the failing smoke test**

Assert that `index.html` contains `vital-grid`, `resource-drawer`, `材料丹药`, and `状态根基`.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/browser-smoke.test.mjs`
Expected: FAIL because the stats panel still uses one flat stats grid.

- [ ] **Step 3: Implement resource grouping**

Move core stats into `.vital-grid`, move materials and pills into an open `details.resource-drawer`, and move heart demon, breakthrough, path, foundation, upgrade limit, and pill boost into a second drawer.

### Task 3: Equipment Inner Sections

**Files:**
- Modify: `index.html`
- Modify: `src/browserGame.js`
- Modify: `browserGame.js`
- Modify: `styles.css`
- Test: `tests/browser-smoke.test.mjs`

- [ ] **Step 1: Write the failing smoke test**

Assert that the HTML contains `data-gear-subtabs`, `data-gear-section-panel`, and the labels `穿戴`, `战利品`, `法宝灵兽`. Assert that the script contains `activeGearSection` and `renderGearSections`.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/browser-smoke.test.mjs`
Expected: FAIL because equipment sections are not interactive yet.

- [ ] **Step 3: Implement equipment sections**

Add gear-section buttons, wrap equipment lists in section panels, store the active section in local storage, and toggle visible section without touching game state.

### Task 4: Verification and Publish

**Files:**
- Modify: `index.html`
- Modify: `browserGame.js`
- Modify: `src/browserGame.js`
- Modify: `styles.css`
- Modify: `tests/browser-smoke.test.mjs`

- [ ] **Step 1: Run full local verification**

Run `node tests/game.test.mjs`, `node tests/browser-smoke.test.mjs`, `node --check browserGame.js`, `node --check src/browserGame.js`, `node --check src/gameCore.mjs`, and `cmp -s browserGame.js src/browserGame.js`.

- [ ] **Step 2: Publish**

Copy the changed files into the GitHub clone, re-run verification there, commit, push to `main`, wait for Pages deployment, and check the live HTML and script version.
