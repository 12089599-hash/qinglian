# 36 Realm Minute Pacing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand cultivation from 8 realms to 36 small realms and slow passive cultivation from per-second pacing to per-minute pacing so Yuan Ying becomes a week-plus long-term target instead of an hours-long rush.

**Architecture:** Keep the existing static browser-game structure: `src/gameCore.mjs` remains the tested source of truth, and `src/browserGame.js`/`browserGame.js` mirror browser runtime behavior. Add a realm-track generator plus legacy realm migration in both core and browser code, then update tests and cache versions.

**Tech Stack:** Plain JavaScript ES modules for core tests, static browser JavaScript for GitHub Pages, Node test scripts.

---

### Task 1: Add Failing Core Tests For Realm Track And Pacing

**Files:**
- Modify: `tests/game.test.mjs`

- [ ] **Step 1: Add tests for the 36 realm names and one-week Yuan Ying pacing**

```js
test('realm track expands to four nine-step stages', () => {
  assert.equal(REALMS.length, 36);
  assert.equal(REALMS[0].name, '炼气一层');
  assert.equal(REALMS[8].name, '炼气九层');
  assert.equal(REALMS[9].name, '筑基一层');
  assert.equal(REALMS[17].name, '筑基九层');
  assert.equal(REALMS[18].name, '金丹一转');
  assert.equal(REALMS[26].name, '金丹九转');
  assert.equal(REALMS[27].name, '元婴一变');
  assert.equal(REALMS[35].name, '元婴九变');
});

test('passive cultivation is paced per minute instead of per second', () => {
  const state = createGameState(1000);
  updateGame(state, 60, 61_000);
  assert.equal(Math.round(state.qi), Math.round(REALMS[0].qiRate));
  assert.equal(calculateQiRate(state, 61_000), REALMS[0].qiRate);
});

test('accelerated play does not reach yuan ying in two hours but can approach it over a week', () => {
  const state = createGameState(1000);
  state.buildings.meditationSeat = 8;
  state.formations.spiritGathering = 6;
  state.cultivationPaths.formation = 4;
  state.permanentBonuses.qiRate = 0.18;
  state.inventoryPills.gatherQiPill = 80;
  state.pills = 80;

  for (let minute = 1; minute <= 120; minute += 1) {
    updateGame(state, 60, 1000 + minute * 60_000);
    if (minute % 12 === 0 && state.inventoryPills.gatherQiPill > 0) {
      consumePill(state, 'gatherQiPill', 1000 + minute * 60_000);
    }
    if (state.qi >= REALMS[state.realmIndex].requiredQi) {
      performBreakthrough(state, 1000 + minute * 60_000, () => 0);
    }
  }
  assert.equal(state.realmIndex < 27, true);
});
```

- [ ] **Step 2: Run tests and verify they fail**

Run: `node tests/game.test.mjs`

Expected: FAIL because `REALMS.length` is still 8 and `updateGame` still treats `qiRate` as per-second.

### Task 2: Implement 36 Realms And Legacy Migration

**Files:**
- Modify: `src/gameCore.mjs`
- Modify: `src/browserGame.js`
- Modify: `browserGame.js`

- [ ] **Step 1: Replace the old realm array with a generated 36-step track**

Implement `createRealmTrack()` in both core and browser code, producing:

```js
const REALM_GROUPS = [
  { prefix: '炼气', suffixes: ['一层','二层','三层','四层','五层','六层','七层','八层','九层'], startQi: 25, endQi: 4_500, startRate: 1.5, endRate: 7, startStone: 2, endStone: 9 },
  { prefix: '筑基', suffixes: ['一层','二层','三层','四层','五层','六层','七层','八层','九层'], startQi: 8_000, endQi: 85_000, startRate: 8.67, endRate: 24.17, startStone: 11, endStone: 26 },
  { prefix: '金丹', suffixes: ['一转','二转','三转','四转','五转','六转','七转','八转','九转'], startQi: 130_000, endQi: 1_100_000, startRate: 29.17, endRate: 73.33, startStone: 32, endStone: 75 },
  { prefix: '元婴', suffixes: ['一变','二变','三变','四变','五变','六变','七变','八变','九变'], startQi: 1_800_000, endQi: 8_000_000, startRate: 90, endRate: 208.33, startStone: 90, endStone: 180 },
];
```

Use a smooth interpolation helper with exponent `1.24` for requiredQi and linear interpolation for rates.

- [ ] **Step 2: Add legacy realm migration**

Add this mapping when `balanceVersion < 3`:

```js
const LEGACY_REALM_INDEX_MAP = [0, 1, 2, 9, 13, 18, 26, 27];
```

`reviveGameState` should map old saves before clamping Qi to the new realm's requirement. New saves keep their exact `realmIndex`.

### Task 3: Convert Passive Cultivation To Per-Minute Pacing

**Files:**
- Modify: `src/gameCore.mjs`
- Modify: `src/browserGame.js`
- Modify: `browserGame.js`
- Modify: `index.html`

- [ ] **Step 1: Update passive Qi accumulation**

Change `updateGame` from adding `calculateQiRate(...) * seconds` to:

```js
state.qi = round(state.qi + (calculateQiRate(state, now) / 60) * seconds);
```

Keep `calculateQiRate` returning the visible per-minute number.

- [ ] **Step 2: Update UI labels**

Change browser render text from:

```js
refs.qiRate.textContent = `${calculateQiRate(state, Date.now()).toFixed(1)} / 秒`;
```

to:

```js
refs.qiRate.textContent = `${Math.round(calculateQiRate(state, Date.now()))} / 分钟`;
```

Update script/style cache versions in `index.html`.

### Task 4: Update Unlocks, Pacing Tests, And Docs

**Files:**
- Modify: `src/gameCore.mjs`
- Modify: `src/browserGame.js`
- Modify: `browserGame.js`
- Modify: `tests/game.test.mjs`
- Modify: `tests/browser-smoke.test.mjs`
- Modify: `README.md`

- [ ] **Step 1: Move realm-based unlocks to the new indices**

Use these target unlocks:

```js
灵草谷: 4
雾隐秘境: 7
古剑冢: 9
魔气裂隙: 14
上古遗迹: 18
灵阶升级上限: 9
玄阶升级上限: 18
地阶升级上限: 27
宗门解锁: realmIndex >= 2
```

- [ ] **Step 2: Update tests expecting old realm indices**

Replace old index assertions with named-index helpers in tests:

```js
const realmIndexByName = (name) => REALMS.findIndex((realm) => realm.name === name);
```

Tests should assert behavior against names like `筑基一层`, not magic old indices.

### Task 5: Verify And Publish

**Files:**
- Publish copy: `/tmp/qinglian-publish`

- [ ] **Step 1: Run complete verification**

Run:

```bash
node --check src/gameCore.mjs
node --check src/browserGame.js
node --check browserGame.js
node tests/game.test.mjs
node tests/browser-smoke.test.mjs
```

Expected: all commands exit 0.

- [ ] **Step 2: Sync and verify publish directory**

Run:

```bash
rsync -a --delete --exclude '.git' ./ /tmp/qinglian-publish/
rm -f /tmp/qinglian-publish/src/app.mjs
cd /tmp/qinglian-publish
node --check src/gameCore.mjs
node --check src/browserGame.js
node --check browserGame.js
node tests/game.test.mjs
node tests/browser-smoke.test.mjs
```

Expected: all commands exit 0.

- [ ] **Step 3: Commit and push**

Run:

```bash
git -C /tmp/qinglian-publish add .
git -C /tmp/qinglian-publish commit -m "Expand realm pacing"
git -C /tmp/qinglian-publish push origin main
```

Expected: GitHub Pages receives the new commit.
