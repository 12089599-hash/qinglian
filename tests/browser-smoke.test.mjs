import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../browserGame.js', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const renderGearRowSource = source.slice(source.indexOf('function renderGearRow'), source.indexOf('function renderFormationRow'));

assert.match(source, /<details class="attribute-row">/);
assert.match(source, /detail-row/);
assert.match(source, /卦象/);
assert.match(styles, /\.detail-row\s*\{\s*display: block;/);
assert.doesNotMatch(source, /<details class="system-row detail-row">/);
assert.match(source, /<details class="equipment-detail-card detail-row" data-gear-detail-card/);
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
assert.match(html, /<body data-active-tab="overview" data-active-group="practice">/);
assert.doesNotMatch(html, /class="panel goals-panel active"/);
assert.match(source, /localStorage\.setItem\(saveKey, JSON\.stringify\(revived\)\)/);
assert.match(source, /function createRealmTrack/);
assert.match(source, /currentBalanceVersion\s*=\s*6/);
assert.match(source, /元婴.*九变/);
assert.match(source, /\/ 分钟/);
assert.doesNotMatch(source, /\/ 秒/);
assert.match(html, /3\.2 \/ 分钟/);
assert.match(source, /openLootDetails\s*=\s*new Set/);
assert.match(source, /data-loot-detail=/);
assert.match(source, /poolTiers:\s*\[0\]/);
assert.match(source, /function getMapLootPoolInfo/);
assert.match(source, /map-loot-pool/);
assert.match(source, /map-select-icon map-stamp/);
assert.match(source, /map-stamp-\$\{map\.id\}/);
assert.match(styles, /\.map-stamp\s*\{/);
assert.match(styles, /\.map-stamp-qinglanMountain\s*\{/);
assert.match(styles, /--map-art:/);
assert.match(styles, /assets\/map-icons\/qinglan-mountain\.svg/);
assert.match(styles, /\.map-loot-pool\s*\{/);
assert.match(source, /openLootDetails\.has\(item\.uid\)/);
assert.match(source, /openSectDetails\s*=\s*new Set/);
assert.match(source, /data-sect-detail="skills"/);
assert.match(source, /openSectDetails\.has\('commissions'\)/);
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
assert.equal((source.match(/function getSelectedMapApproach\(/g) || []).length, 1);
assert.match(source, /hudQi: document\.querySelector\('\[data-hud-qi\]'\)/);
assert.match(source, /refs\.hudQi\.textContent =/);
assert.match(source, /refs\.hudAction\.textContent =/);
assert.match(source, /panelTabs\s*=\s*\['overview'/);
assert.match(source, /practice:\s*\{\s*label:\s*'修行',\s*tabs:\s*\['overview', 'goals', 'daily', 'cultivation'\]/);
assert.match(source, /document\.body\.dataset\.activeTab\s*=\s*activeTab/);
assert.match(source, /function render\(forceLists = false\) \{\s*renderTabs\(\);/);
assert.match(source, /function renderSubTabs/);
assert.match(source, /function syncMobileOverviewDrawers/);
assert.match(source, /const openOverviewDetails = !mobile && activeTab === 'overview'/);
assert.match(source, /drawer\.open = openOverviewDetails/);
assert.match(source, /cultivationDrawer\.open = openOverviewDetails/);
assert.match(styles, /body\[data-active-tab="overview"\]\s+\.stats-panel/);
assert.match(styles, /body:not\(\[data-active-tab="overview"\]\)\s+\.stats-panel/);
assert.match(styles, /body\[data-active-tab="overview"\]\s+\.stats-panel\s*\{[^}]*display:\s*flex[^}]*flex-direction:\s*column/s);
assert.match(styles, /body\[data-active-tab="overview"\]\s+\.hero\s*\{[^}]*min-height:\s*188px/s);
assert.match(styles, /body\[data-active-tab="overview"\]\s+\.hero canvas\s*\{[^}]*height:\s*188px/s);
assert.match(styles, /\.mobile-cultivation-hud\s*\{[^}]*display:\s*none/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.mobile-cultivation-hud\s*\{[^}]*display:\s*grid/s);
assert.match(html, /<details class="cultivation-drawer mobile-fold-card" open>/);
assert.match(styles, /\.cultivation-drawer\s*>\s*summary\s*\{\s*display:\s*none/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.cultivation-drawer\s*>\s*summary\s*\{[^}]*display:\s*flex/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.vital-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.resource-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
assert.match(source, /class="chapter-track-compact"/);
assert.match(source, /class="chapter-dots"/);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.chapter-track-compact\s*>\s*summary\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) auto auto/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.chapter-track-list\s*\{[^}]*display:\s*none[^}]*grid-template-columns:\s*1fr/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.chapter-track-compact\[open\]\s+\.chapter-track-list\s*\{[^}]*display:\s*grid/s);
assert.match(html, /<details class="attribute-card mobile-fold-card"/);
assert.match(source, /attributeCard\.open = openOverviewDetails/);
assert.match(styles, /\.stats-panel\s*>\s*\.attribute-card\s*\{\s*order:\s*1/s);
assert.match(styles, /\.stats-panel\s*>\s*header\s*\{\s*order:\s*2/s);
assert.match(styles, /\.stats-panel\s*>\s*\.cultivation-drawer\s*\{\s*order:\s*3/s);
assert.match(styles, /\.stats-panel\s*>\s*\.action-row\s*\{\s*order:\s*4/s);
assert.match(styles, /\.stats-panel\s*>\s*\.progress-plan\s*\{\s*order:\s*5/s);
assert.match(styles, /\.stats-panel\s*>\s*\.state-drawer\s*\{\s*order:\s*6/s);
assert.match(styles, /\.stats-panel\s*>\s*\.resource-drawer:not\(\.state-drawer\)\s*\{\s*order:\s*7/s);
assert.match(styles, /\.stats-panel\s*>\s*\.dao-heart-card\s*\{\s*order:\s*8/s);
assert.match(styles, /\.stats-panel\s*>\s*\.tribulation-card\s*\{\s*order:\s*9/s);
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
assert.doesNotMatch(html, />器魂</);
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
assert.match(source, /beast-locked-group/);
assert.match(source, /visibleItems/);
assert.match(source, /compact-system-row/);
assert.match(source, /action:\s*'claimChapter'/);
assert.match(source, /function claimGoalById/);
assert.match(source, /function claimChapterById/);
assert.match(source, /guidanceAction === 'claimChapter'/);
assert.match(source, /activeGearSection/);
assert.match(source, /function renderGearSections/);
assert.match(source, /gearAffixSets/);
assert.match(source, /function getGearSetStatus/);
assert.doesNotMatch(source, /renderGearSoulPanel/);
assert.doesNotMatch(source, /data-upgrade-gear-soul/);
assert.match(source, /function rerollGearAffix/);
assert.match(source, /data-reroll-gear/);
assert.match(source, /function formatAffixRerollImpact/);
assert.match(source, /function getGearAffixRerollPreview/);
assert.match(source, /洗练风险/);
assert.match(source, /套装影响/);
assert.match(source, /器象同调/);
assert.match(source, /missingAffixes/);
assert.match(source, /gear-set-tier-track/);
assert.match(source, /missionResidualDangerRatio/);
assert.match(styles, /\.gear-set-tier-track\s*\{/);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.progress-plan-grid\s*\{[^}]*grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/);
assert.match(styles, /@media \(min-width: 761px\)[\s\S]*body\[data-active-tab="overview"\]\s+\.dashboard\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/);
assert.match(styles, /@media \(min-width: 761px\)[\s\S]*body\[data-active-tab="overview"\]\s+\.stats-panel\s*\{[^}]*position:\s*static[^}]*grid-auto-flow:\s*dense[^}]*max-height:\s*none[^}]*overflow:\s*visible/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.section-tabs\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/);
assert.match(source, /洗练词条/);
assert.match(styles, /\.sub-tabs/);
assert.match(styles, /\.vital-grid/);
assert.match(styles, /\.gear-subtabs/);
assert.match(styles, /\.gear-set-panel/);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.dashboard\s*\{[^}]*padding-bottom:\s*0/s);
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
assert.match(source, /class="beast-icon beast-icon-\$\{item\.id\}"/);
assert.match(source, /autoDeployed/);
assert.match(source, /collectionEffects/);
assert.match(source, /battleEffects/);
assert.match(source, /spiritBeastQualities/);
assert.match(source, /血统：/);
assert.match(source, /蛟影幼龙/);
assert.match(source, /growthMultiplier/);
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
assert.match(source, /defenseMitigation/);
assert.match(source, /formatMitigationText/);
assert.match(source, /flameEdge/);
assert.match(source, /shadowPierce/);
assert.match(source, /fivePhaseTemper/);
assert.match(source, /eclipseMirror/);
assert.match(source, /getSpiritBeastUnlockStatus/);
assert.match(source, /未现踪/);
assert.match(styles, /\.mission-report/);
assert.match(styles, /\.mission-report-history/);
assert.match(styles, /\.battle-report/);
assert.match(styles, /\.battle-diagnosis/);
assert.match(styles, /\.battle-playback/);
assert.match(styles, /\.combatant-card/);
assert.match(styles, /\.battle-flow/);
assert.match(styles, /\.beast-row\.active/);
assert.match(styles, /assets\/spirit-beasts\/fox\.svg/);
assert.match(styles, /\.beast-icon/);
assert.match(styles, /\.beast-row\.locked/);
assert.match(styles, /\.beast-locked-group/);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.beast-row\s*,\s*\.bloodline-row\s*,\s*\.compact-system-row\s*\{[^}]*min-height:\s*64px/s);
assert.match(styles, /@media \(max-width: 560px\)[\s\S]*\.compact-system-row\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) auto/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\[data-gear-list\]\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.mission-card-details\s*\{[^}]*display:\s*none/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.cave-summary-grid\s*,\s*\.building-effect-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/s);
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
assert.match(source, /class="building-icon building-icon-\$\{building\.id\}"/);
assert.match(source, /function upgradeBuilding/);
assert.match(source, /return \{ ok: true, level: nextLevel \}/);
assert.match(html, /data-cave-list/);
assert.match(styles, /\.cave-panel/);
assert.match(styles, /\.cave-summary-grid/);
assert.match(styles, /\.building-card/);
assert.match(styles, /\.building-card-head/);
assert.match(styles, /\.building-icon/);
assert.match(styles, /assets\/cave-icons\/alchemy-furnace\.svg/);
assert.match(styles, /\.mission-map-layout/);
assert.match(styles, /\.mission-map-selector/);
assert.match(styles, /\.mission-map-detail/);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*body\s*\{[^}]*padding-bottom:\s*0/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.mission-map-selector\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)[^}]*overflow:\s*visible/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.approach-selector\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)[^}]*overflow:\s*visible/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.map-select-button\s*\{[^}]*grid-template-columns:\s*30px minmax\(0, 1fr\)[^}]*min-height:\s*48px/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\[data-mission-list\][\s\S]*max-width:\s*100%/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.mission-map-selector,\s*[\s\S]*\.approach-selector\s*\{[^}]*width:\s*100%/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*body\[data-battle-playback-active="true"\]\s+\[data-mission-list\]/);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.approach-selector span\s*\{[^}]*-webkit-line-clamp:\s*2/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.approach-selector button small \+ small\s*\{[^}]*display:\s*none/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.mission-card\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\) 52px/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.building-grid\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)[^}]*overflow:\s*visible/s);
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
assert.match(html, /data-progress-plan/);
assert.match(source, /function renderProgressPlan/);
assert.match(source, /function getProgressPlan/);
assert.match(html, /data-loot-rarity-toggle="common"/);
assert.match(html, /data-loot-keep-strategy="bestPerSlot"/);
assert.match(source, /activeLootKeepStrategy/);
assert.match(html, /data-reset-dismantle-defaults/);
assert.match(html, /data-gear-detail-dialog/);
assert.match(html, /data-mobile-panel-dialog/);
assert.match(html, /data-mobile-panel-tabs/);
assert.match(html, /data-mobile-detail-dialog/);
assert.match(html, /data-mobile-detail-body/);
assert.match(source, /function openGearDetailDialog/);
assert.match(source, /function openMobilePanelDialog/);
assert.match(source, /function restoreMobilePanel/);
assert.match(source, /function openMobileDetailDialog/);
assert.match(source, /function shouldOpenMobileDetailDialog/);
assert.match(source, /activeLootDismantleRarities/);
assert.match(source, /function getSelectedLootDismantleRarities/);
assert.match(source, /function handleOrganizeLootClick/);
assert.match(source, /organizeLootEquipment\(state, Date\.now\(\), \{[\s\S]*rarityIds: getSelectedLootDismantleRarities\(\),[\s\S]*keepStrategy: activeLootKeepStrategy/);
assert.match(source, /document\.querySelector\('\.loot-toolbar'\)\?\.addEventListener\('click'/);
assert.match(source, /getOrganizableLootCount/);
assert.match(source, /请选择品质/);
assert.match(source, /button\.disabled = false/);
assert.match(styles, /\.mobile-panel-dialog/);
assert.match(styles, /\.mobile-detail-dialog/);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.mobile-panel-dialog\[open\]\s*\{[^}]*height:\s*100dvh/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*body\[data-mobile-panel-open\]\s*\{[^}]*overflow:\s*hidden/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.shell\s*\{[^}]*min-height:\s*100dvh[^}]*overflow:\s*hidden[^}]*padding-bottom:\s*0/s);
assert.match(source, /bodyTemperPill/);
assert.match(source, /spiritRootPill/);
assert.match(source, /const attributePillCaps/);
assert.match(source, /function getAlchemySlots/);
assert.match(source, /jobs\.length >= slots/);
assert.match(source, /药性沉淀/);
assert.match(source, /聚气丹:[\s\S]*20 分钟|提升灵息 20 分钟/);
assert.match(source, /护脉丹:[\s\S]*30 分钟|破境天机 30 分钟/);
assert.match(source, /consumedAttributePills/);
assert.match(source, /comparison\.score \|\| 0/);
assert.match(source, /\$\{item\.equippedLoot\.name\} · \$\{item\.equippedLoot\.rarity\?\.name \|\| '凡品'\} · 战力/);
assert.match(renderGearRowSource, /gear-card-brief/);
assert.match(renderGearRowSource, /gear-card-icon/);
assert.match(renderGearRowSource, /gear-card-slot/);
assert.match(renderGearRowSource, /gear-card-name/);
assert.match(renderGearRowSource, /gear-card-stage/);
assert.doesNotMatch(renderGearRowSource, /gear-quick-line/);
assert.match(renderGearRowSource, /data-toggle-gear-detail/);
assert.doesNotMatch(renderGearRowSource, /rarity-badge/);
assert.match(styles, /\.gear-card-brief\s*\{/);
assert.match(styles, /assets\/equipment\/weapon\.png/);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\[data-gear-list\] \.gear-card-brief\s*\{[^}]*grid-template-columns:\s*50px minmax\(0, 1fr\)/s);
assert.match(styles, /\.gear-main-actions\s*\{/);
assert.match(source, /herbBundle:[\s\S]*limit:\s*99/);
assert.match(source, /arrayManual:[\s\S]*limit:\s*30/);
assert.match(source, /treasureOre:[\s\S]*limit:\s*10/);
assert.match(source, /function getMarketShelfSize/);
assert.match(source, /getMarketShelfSize\(state, pool\.length\)/);
assert.match(source, /function sweepMapDepth/);
assert.match(source, /function sweepMapBoss/);
assert.match(source, /data-sweep-depth/);
assert.match(source, /data-sweep-boss/);
assert.match(source, /dailyDepthSweeps/);
assert.match(source, /dailyBossClaims/);
assert.match(html, /class="loot-toolbar-actions"/);
assert.match(html, /data-loot-rules class="loot-rules-panel"/);
assert.match(html, /data-organize-loot type="button"/);
assert.match(styles, /\.loot-toolbar-actions/);
assert.match(styles, /grid-template-areas:\s*"filters actions"\s*"rules actions"/);
assert.match(styles, /\.loot-rules-panel\s*\{[\s\S]*grid-area:\s*rules/);
assert.match(styles, /\.gear-subtabs\s*\{[\s\S]*?flex-wrap: nowrap/);
assert.match(styles, /\.progress-plan/);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.progress-plan-grid\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.progress-plan-actions\s*\{[^}]*display:\s*none/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.progress-plan-grid small,\s*[\s\S]*\.progress-plan-actions span\s*\{[^}]*display:\s*none/s);
assert.match(styles, /\.loot-keep-options/);
assert.match(source, /buildSchools/);
assert.match(source, /loot-build-tags/);
assert.match(source, /data-toggle-loot-lock/);
assert.match(source, /data-loot-filter/);
assert.match(source, /function renderLootComparison/);
assert.match(source, /function getLootPowerComparisonText/);
assert.match(source, /loot-card-brief/);
assert.match(source, /lootVariantAffixes/);
assert.match(source, /function createLootVariant/);
assert.match(source, /器纹：/);
assert.match(source, /太微星盘/);
assert.match(source, /蛟骨战戟/);
assert.match(source, /器胚：/);
assert.match(source, /realmBand/);
assert.match(source, /repeatReward/);
assert.match(source, /function getResolvedOpportunityChoiceCount/);
assert.match(styles, /\.loot-toolbar/);
assert.match(styles, /\.loot-filters\s*\{[^}]*grid-area:\s*filters/s);
assert.match(html, />批量分解品质</);
assert.match(html, />恢复默认</);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.gear-subtabs\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*repeat\(5, minmax\(0, 1fr\)\)[^}]*overflow:\s*visible/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.mobile-panel-body\s+\.gear-subtabs\s*\{[^}]*position:\s*static[^}]*top:\s*auto[^}]*z-index:\s*auto/s);
assert.match(styles, /@media \(max-width: 760px\)[\s\S]*\.loot-filters\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)[^}]*overflow:\s*visible/s);
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

function element(overrides = {}) {
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
    ...overrides,
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
    ['[data-gear-detail-dialog]', element({ showModal() {}, close() {} })],
    ['[data-gear-detail-title]', element()],
    ['[data-gear-detail-body]', element()],
  ]);

  return {
    body: element(),
    addEventListener() {},
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
