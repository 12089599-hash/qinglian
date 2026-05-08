import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../browserGame.js', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

assert.match(source, /<details class="attribute-row">/);
assert.match(source, /detail-row/);
assert.match(source, /卦象/);
assert.match(styles, /\.detail-row\s*\{\s*display: block;/);
assert.doesNotMatch(source, /<details class="system-row detail-row">/);
assert.match(source, /<details class="equipment-detail-card detail-row">/);
assert.match(styles, /\.equipment-detail-card\s*\{/);
assert.match(html, /styles\.css\?v=/);
assert.match(html, /browserGame\.js\?v=/);
assert.match(source, /function createRealmTrack/);
assert.match(source, /currentBalanceVersion\s*=\s*4/);
assert.match(source, /元婴.*九变/);
assert.match(source, /\/ 分钟/);
assert.doesNotMatch(source, /\/ 秒/);
assert.match(html, /1\.5 \/ 分钟/);
assert.match(source, /openLootDetails\s*=\s*new Set/);
assert.match(source, /data-loot-detail=/);
assert.match(source, /openLootDetails\.has\(item\.uid\)/);
assert.match(source, /addEventListener\('toggle'/);
assert.match(html, /data-tab-group="practice"/);
assert.match(html, /data-tab-group="travel"/);
assert.match(html, /data-tab-group="vault"/);
assert.match(html, /data-tab-group="mountain"/);
assert.match(html, /data-sub-tabs/);
assert.match(html, />修行</);
assert.match(html, />行游</);
assert.match(html, />库藏</);
assert.match(html, />山门</);
assert.match(source, /const tabGroups/);
assert.match(source, /function renderSubTabs/);
assert.match(html, /class="vital-grid"/);
assert.match(html, /resource-drawer/);
assert.match(html, /材料丹药/);
assert.match(html, /状态根基/);
assert.match(html, /data-gear-subtabs/);
assert.match(html, /data-gear-section-panel="wear"/);
assert.match(html, /data-gear-section-panel="loot"/);
assert.match(html, /法宝灵兽/);
assert.match(source, /activeGearSection/);
assert.match(source, /function renderGearSections/);
assert.match(styles, /\.sub-tabs/);
assert.match(styles, /\.vital-grid/);
assert.match(styles, /\.gear-subtabs/);
assert.match(html, /data-mission-report/);
assert.match(source, /function renderMissionReport/);
assert.match(source, /data-dismiss-mission-report/);
assert.match(styles, /\.mission-report/);
assert.match(source, /function renderMapSelector/);
assert.match(source, /data-select-mission-map/);
assert.match(source, /activeMissionMapId/);
assert.match(styles, /\.mission-map-layout/);
assert.match(styles, /\.mission-map-selector/);
assert.match(styles, /\.mission-map-detail/);
assert.match(source, /data-organize-loot/);
assert.match(source, /data-toggle-loot-lock/);
assert.match(source, /data-loot-filter/);
assert.match(source, /function renderLootComparison/);
assert.match(styles, /\.loot-toolbar/);
assert.match(styles, /\.comparison-list/);
assert.match(source, /result\.reason === 'notEnoughResources'/);
assert.match(source, /data-opportunity-affordable/);
assert.doesNotMatch(source, /data-resolve-opportunity="\$\{choice\.id\}" \$\{canAfford\(state, choice\.cost \|\| \{\}\) \? '' : 'disabled'\}/);
assert.match(source, /function getOpportunityResourceSignature/);
assert.doesNotMatch(source, /active \? `\$\{active\.id\}:\$\{state\.spiritStones\}:\$\{state\.artifacts\}:\$\{state\.arrayFlags\}:\$\{state\.qi\}` : 'none'/);

function element() {
  return {
    addEventListener() {},
    appendChild() {},
    children: [],
    dataset: {},
    disabled: false,
    getContext: () => ({
      arc() {},
      beginPath() {},
      clearRect() {},
      closePath() {},
      createLinearGradient: () => ({ addColorStop() {} }),
      ellipse() {},
      fill() {},
      fillRect() {},
      lineTo() {},
      moveTo() {},
      quadraticCurveTo() {},
      restore() {},
      save() {},
      stroke() {},
      translate() {},
    }),
    innerHTML: '',
    lastElementChild: { remove() {} },
    prepend() {},
    remove() {},
    style: {},
    textContent: '',
  };
}

function documentWithoutOptionalPanels() {
  const required = new Map([
    ['[data-realm]', element()],
    ['[data-qi]', element()],
    ['[data-qi-rate]', element()],
    ['[data-stones]', element()],
    ['[data-herbs]', element()],
    ['[data-pills]', element()],
    ['[data-beast-cores]', element()],
    ['[data-artifacts]', element()],
    ['[data-heart-demon]', element()],
    ['[data-power]', element()],
    ['[data-breakthrough-chance]', element()],
    ['[data-progress]', element()],
    ['[data-progress-text]', element()],
    ['[data-mission]', element()],
    ['[data-mission-time]', element()],
    ['[data-log]', element()],
    ['[data-world]', element()],
    ['[data-breakthrough]', element()],
    ['[data-craft-pill]', element()],
    ['[data-consume-pill]', element()],
    ['[data-reset]', element()],
  ]);

  return {
    createElement() {
      return element();
    },
    querySelector(selector) {
      return required.get(selector) ?? null;
    },
    querySelectorAll(selector) {
      if (selector === '[data-start-mission]' || selector === '[data-upgrade-building]' || selector === '[data-building-level]' || selector === '[data-building-cost]') {
        return [];
      }
      return [];
    },
  };
}

const context = {
  Date,
  Math,
  localStorage: {
    getItem: () => null,
    removeItem() {},
    setItem() {},
  },
  document: documentWithoutOptionalPanels(),
  performance: { now: () => 0 },
  requestAnimationFrame() {},
  setInterval() {},
};

vm.createContext(context);
assert.doesNotThrow(() => vm.runInContext(source, context));
