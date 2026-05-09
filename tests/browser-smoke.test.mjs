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
assert.match(source, /class="nested-detail"/);
assert.match(styles, /\.equipment-detail-card\s*\{/);
assert.match(styles, /\.nested-detail\s*\{/);
assert.match(source, /const rarityTiers/);
assert.match(source, /function buildLootVariant/);
assert.match(source, /lootDropSerial/);
assert.match(source, /function getLootKeepAdvice/);
assert.match(source, /rarity-badge/);
assert.match(source, /formations: Object\.values\(formations\)/);
assert.match(styles, /\.rarity-badge\s*\{/);
assert.match(html, /styles\.css\?v=/);
assert.match(html, /browserGame\.js\?v=/);
assert.match(source, /localStorage\.setItem\(saveKey, JSON\.stringify\(revived\)\)/);
assert.match(source, /function createRealmTrack/);
assert.match(source, /currentBalanceVersion\s*=\s*6/);
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
assert.match(html, /class="mobile-cultivation-hud"/);
assert.match(html, /data-hud-qi/);
assert.match(html, /data-hud-rate/);
assert.match(html, /data-hud-action/);
assert.match(source, /const tabGroups/);
assert.match(source, /hudQi: document\.querySelector\('\[data-hud-qi\]'\)/);
assert.match(source, /refs\.hudQi\.textContent =/);
assert.match(source, /refs\.hudAction\.textContent =/);
assert.match(source, /panelTabs\s*=\s*\['overview'/);
assert.match(source, /practice:\s*\{\s*label:\s*'修行',\s*tabs:\s*\['overview', 'goals', 'daily', 'cultivation'\]/);
assert.match(source, /document\.body\.dataset\.activeTab\s*=\s*activeTab/);
assert.match(source, /function renderSubTabs/);
assert.match(source, /function syncMobileOverviewDrawers/);
assert.match(source, /drawer\.open = !mobile/);
assert.match(styles, /body\[data-active-tab="overview"\]\s+\.stats-panel/);
assert.match(styles, /body:not\(\[data-active-tab="overview"\]\)\s+\.stats-panel/);
assert.match(styles, /body\[data-active-tab="overview"\]\s+\.stats-panel\s*\{[^}]*display:\s*flex[^}]*flex-direction:\s*column/s);
assert.match(styles, /body\[data-active-tab="overview"\]\s+\.hero\s*\{[^}]*min-height:\s*286px/s);
assert.match(styles, /body\[data-active-tab="overview"\]\s+\.hero canvas\s*\{[^}]*height:\s*286px/s);
assert.match(styles, /\.mobile-cultivation-hud\s*\{[^}]*display:\s*none/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.mobile-cultivation-hud\s*\{[^}]*display:\s*grid/s);
assert.match(html, /<details class="attribute-card mobile-fold-card"/);
assert.match(source, /attributeCard\.open = !mobile/);
assert.match(styles, /\.stats-panel\s*>\s*\.attribute-card\s*\{\s*order:\s*1/s);
assert.match(styles, /\.stats-panel\s*>\s*header\s*\{\s*order:\s*2/s);
assert.match(styles, /\.stats-panel\s*>\s*\.vital-grid\s*\{\s*order:\s*3/s);
assert.match(styles, /\.stats-panel\s*>\s*\.action-row\s*\{\s*order:\s*4/s);
assert.match(styles, /\.stats-panel\s*>\s*\.state-drawer\s*\{\s*order:\s*5/s);
assert.match(styles, /\.stats-panel\s*>\s*\.resource-drawer:not\(\.state-drawer\)\s*\{\s*order:\s*6/s);
assert.match(styles, /\.stats-panel\s*>\s*\.dao-heart-card\s*\{\s*order:\s*7/s);
assert.match(styles, /\.stats-panel\s*>\s*\.tribulation-card\s*\{\s*order:\s*8/s);
assert.match(styles, /body:not\(\[data-active-tab="overview"\]\)\s+\.hero\s*\{[^}]*min-height:\s*104px/s);
assert.match(styles, /body:not\(\[data-active-tab="overview"\]\)\s+\.hero canvas\s*\{[^}]*height:\s*104px/s);
assert.match(styles, /\.toast-stack\s*\{[\s\S]*top:\s*calc\(10px \+ env\(safe-area-inset-top\)\)[\s\S]*bottom:\s*auto/);
assert.match(source, /scrolledMissionReportId/);
assert.match(html, /data-dao-heart-list/);
assert.match(html, /data-breakthrough-prep/);
assert.match(source, /function renderDaoHeart/);
assert.match(source, /function renderBreakthroughPreparation/);
assert.match(source, /data-choose-dao-heart/);
assert.match(html, /class="vital-grid"/);
assert.match(html, /resource-drawer/);
assert.match(html, /材料丹药/);
assert.match(html, /状态根基/);
assert.match(html, /data-gear-subtabs/);
assert.match(html, /data-gear-section-panel="wear"/);
assert.match(html, /data-gear-section-panel="loot"/);
assert.match(html, /data-gear-section-panel="treasures"/);
assert.match(html, /data-gear-section-panel="beasts"/);
assert.match(html, />法宝</);
assert.match(html, />灵兽</);
assert.match(source, /data-goal-goto/);
assert.match(source, /function getGoalActionTarget/);
assert.match(source, /function focusGuidanceTarget/);
assert.match(source, /dataset\.guidanceTarget/);
assert.match(source, /function getSpiritBeastGuidance/);
assert.match(source, /targetId:\s*'beasts'/);
assert.match(source, /action:\s*'claimChapter'/);
assert.match(source, /function claimGoalById/);
assert.match(source, /function claimChapterById/);
assert.match(source, /guidanceAction === 'claimChapter'/);
assert.match(source, /activeGearSection/);
assert.match(source, /function renderGearSections/);
assert.match(source, /gearAffixSets/);
assert.match(source, /function getGearSetStatus/);
assert.match(source, /function rerollGearAffix/);
assert.match(source, /data-reroll-gear/);
assert.match(source, /function formatAffixRerollImpact/);
assert.match(source, /function getGearAffixRerollPreview/);
assert.match(source, /洗练风险/);
assert.match(source, /套装影响/);
assert.match(source, /器象同调/);
assert.match(source, /洗练词条/);
assert.match(styles, /\.sub-tabs/);
assert.match(styles, /\.vital-grid/);
assert.match(styles, /\.gear-subtabs/);
assert.match(styles, /\.gear-set-panel/);
const mobileDashboardPadding = styles.match(/@media \(max-width: 760px\)[\s\S]*\.dashboard\s*\{[^}]*padding-bottom:\s*calc\((\d+)px \+ env\(safe-area-inset-bottom\)\)/);
assert.ok(mobileDashboardPadding, 'mobile dashboard keeps safe bottom padding');
assert.equal(Number(mobileDashboardPadding[1]) >= 190, true);
assert.match(html, /data-mission-report/);
assert.match(source, /function renderMissionReport/);
assert.match(source, /function showMainlineClaimHint/);
assert.match(source, /主线可领/);
assert.match(source, /篇章可领/);
assert.match(source, /data-dismiss-mission-report/);
assert.match(source, /missionReportHistory/);
assert.match(source, /mission-report-history/);
assert.match(source, /mapProgress/);
assert.match(source, /challenge/);
assert.match(source, /readiness/);
assert.match(source, /failurePreview/);
assert.match(source, /formatApproachComparison/);
assert.match(source, /function formatApproachSummary/);
assert.match(source, /depth-stat-row/);
assert.match(source, /depth-reward-row/);
assert.match(source, /boss-requirements/);
assert.match(source, /boss-counsel/);
assert.match(source, /boss-action-list/);
assert.match(source, /boss-next-step/);
assert.match(source, /function renderMapActionPanel/);
assert.match(source, /function getMapCombatAdvice/);
assert.match(source, /combat-advice/);
assert.match(source, /const combatElements/);
assert.match(source, /function getCombatProfile/);
assert.match(source, /function simulateBossBattle/);
assert.match(source, /function runTurnBattle/);
assert.match(source, /function createBattleDiagnosis/);
assert.match(source, /DEPTH_TRIBULATIONS/);
assert.match(source, /function getDepthTribulation/);
assert.match(source, /function getLootResonanceStatus/);
assert.match(source, /战利共鸣/);
assert.match(source, /function deploySpiritBeast/);
assert.match(source, /data-deploy-beast/);
assert.match(source, /autoDeployed/);
assert.match(source, /collectionEffects/);
assert.match(source, /battleEffects/);
assert.match(source, /skillName/);
assert.match(source, /战技/);
assert.match(source, /actor === 'beast'/);
assert.match(source, /function formatBattleActorName/);
assert.match(source, /function formatActiveSpiritBeastBrief/);
assert.match(source, /active-beast-status/);
assert.match(source, /roundOrActor\?\.actorName/);
assert.match(source, /class="ally-stack"/);
assert.match(source, /battleLost/);
assert.match(source, /battle-report/);
assert.match(source, /battle-diagnosis/);
assert.match(source, /function startBattlePlayback/);
assert.match(source, /battlePlaybackActive/);
assert.doesNotMatch(source, /function createActiveDepthBattleReport/);
assert.doesNotMatch(source, /function ensureActiveDepthPlayback/);
assert.doesNotMatch(source, /holdUntilMissionEnd/);
assert.doesNotMatch(source, /候结算/);
assert.match(source, /function renderBattlePlayback/);
assert.match(source, /data-skip-battle-playback/);
assert.match(source, /battlePlaybackTimer/);
assert.match(source, /battle-round-list/);
assert.match(source, /battle-flow/);
assert.match(source, /targetMaxHp/);
assert.match(source, /flameEdge/);
assert.match(source, /shadowPierce/);
assert.match(source, /fivePhaseTemper/);
assert.match(source, /eclipseMirror/);
assert.match(styles, /\.mission-report/);
assert.match(styles, /\.mission-report-history/);
assert.match(styles, /\.battle-report/);
assert.match(styles, /\.battle-diagnosis/);
assert.match(styles, /\.battle-playback/);
assert.match(styles, /\.combatant-card/);
assert.match(styles, /\.battle-flow/);
assert.match(styles, /\.beast-row\.active/);
assert.match(styles, /\.ally-stack/);
assert.match(styles, /\.combatant-card\.beast/);
assert.match(styles, /\.battle-playback-log li\.beast/);
assert.doesNotMatch(styles, /battle-playback-state/);
assert.match(styles, /\.battle-round-list/);
assert.match(source, /function renderMapSelector/);
assert.match(source, /data-select-mission-map/);
assert.match(source, /activeMissionMapId/);
assert.match(source, /const missionApproaches/);
assert.match(source, /function renderApproachSelector/);
assert.match(source, /data-select-approach/);
assert.match(styles, /\.approach-selector/);
assert.match(source, /function renderDepthCard/);
assert.match(source, /data-start-depth/);
assert.match(source, /function getMarketStock/);
assert.match(source, /data-refresh-market/);
assert.match(source, /const caveStages/);
assert.match(source, /青岚洞天/);
assert.match(source, /function renderCave/);
assert.match(source, /data-select-building/);
assert.match(source, /function upgradeBuilding/);
assert.match(source, /return \{ ok: true, level: nextLevel \}/);
assert.match(html, /data-cave-list/);
assert.match(styles, /\.cave-panel/);
assert.match(styles, /\.cave-summary-grid/);
assert.match(styles, /\.building-card/);
assert.match(styles, /\.mission-map-layout/);
assert.match(styles, /\.mission-map-selector/);
assert.match(styles, /\.mission-map-detail/);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*body\s*\{[^}]*padding-bottom:\s*calc\(150px \+ env\(safe-area-inset-bottom\)\)/);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.mission-map-selector\s*\{[^}]*display:\s*flex[^}]*overflow-x:\s*auto/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.approach-selector\s*\{[^}]*display:\s*flex[^}]*overflow-x:\s*auto/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.map-select-button\s*\{[^}]*flex:\s*0 0 136px/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\[data-mission-list\][\s\S]*max-width:\s*100%/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.mission-map-selector,\s*[\s\S]*\.approach-selector\s*\{[^}]*width:\s*100%/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*body\[data-battle-playback-active="true"\]\s+\[data-mission-list\]/);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.approach-selector span\s*\{[^}]*-webkit-line-clamp:\s*2/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.approach-selector button small \+ small\s*\{[^}]*display:\s*none/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.mission-card\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) 52px/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.building-grid\s*\{[^}]*display:\s*flex/s);
assert.match(styles, /\.depth-card/);
assert.match(styles, /\.depth-stat-row/);
assert.match(styles, /\.depth-reward-row/);
assert.match(styles, /\.resonance-card/);
assert.match(styles, /\.boss-requirements/);
assert.match(styles, /\.boss-counsel/);
assert.match(styles, /\.map-action-panel/);
assert.match(styles, /\.map-action-grid/);
assert.match(styles, /\.combat-advice/);
assert.match(styles, /\.market-refresh-row/);
assert.match(source, /data-organize-loot/);
assert.match(source, /getOrganizableLootCount/);
assert.match(source, /无可整理/);
assert.match(source, /data-toggle-loot-lock/);
assert.match(source, /data-loot-filter/);
assert.match(source, /function renderLootComparison/);
assert.match(source, /lootVariantAffixes/);
assert.match(source, /function createLootVariant/);
assert.match(source, /loot-variant/);
assert.match(source, /repeatReward/);
assert.match(source, /function getResolvedOpportunityChoiceCount/);
assert.match(styles, /\.loot-toolbar/);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.loot-filters\s*\{[^}]*flex-wrap:\s*wrap/s);
assert.match(styles, /\.loot-variant/);
assert.match(styles, /\.comparison-list/);
assert.match(source, /result\.reason === 'notEnoughResources'/);
assert.match(source, /data-opportunity-affordable/);
assert.doesNotMatch(source, /data-resolve-opportunity="\$\{choice\.id\}" \$\{canAfford\(state, choice\.cost \|\| \{\}\) \? '' : 'disabled'\}/);
assert.match(source, /function getOpportunityResourceSignature/);
assert.match(source, /dailyDepth/);
assert.match(source, /depthTrials/);
assert.match(source, /function formatDailyClaimHint/);
assert.match(html, /data-resource-guidance/);
assert.match(source, /function getResourceGuidance/);
assert.match(source, /function renderResourceGuidance/);
assert.match(source, /resourceGuides/);
assert.match(source, /寻材指引/);
assert.match(source, /resource-guidance-detail/);
assert.match(source, /resource-guidance-toggle/);
assert.match(source, /primary\.route\.fallback/);
assert.match(source, /地势/);
assert.match(source, /monsterHunt/);
assert.match(source, /relicSearch/);
assert.match(styles, /\.resource-guidance-card/);
assert.match(styles, /\.resource-guidance-detail summary/);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.resource-guidance-detail:not\(\[open\]\) summary small\s*\{[^}]*display:\s*none/s);
assert.match(source, /function getSectRecommendation/);
assert.match(source, /委托建议/);
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
    body: element(),
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
