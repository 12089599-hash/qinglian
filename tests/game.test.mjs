import assert from 'node:assert/strict';
import {
  BUILDINGS,
  CAVE_STAGES,
  CULTIVATION_PATHS,
  DAO_HEARTS,
  FORMATIONS,
  GEAR,
  GEAR_AFFIX_SETS,
  GEAR_QUALITIES,
  LOOT_EQUIPMENT,
  MAINLINE_CHAPTERS,
  MAP_SPECIAL_DROPS,
  MISSION_MAPS,
  MISSION_APPROACHES,
  MISSION_EVENTS,
  OPPORTUNITIES,
  REALMS,
  SECT_COMMISSIONS,
  SECT_LEVELS,
  SPIRIT_BEASTS,
  TREASURES,
  assignSectDisciple,
  applyOfflineProgress,
  calculateBreakthroughChance,
  calculatePower,
  calculateQiRate,
  challengeMapBoss,
  claimGoalReward,
  claimChapterReward,
  claimDailyTask,
  createGameState,
  buyMarketItem,
  disassembleLootEquipment,
  equipLootEquipment,
  empowerLootEquipment,
  organizeLootEquipment,
  getGoals,
  getNextGuidance,
  getResourceGuidance,
  getMainlineChapters,
  getDailyTasks,
  getMarketStock,
  getCaveStage,
  getCaveStatus,
  getCaveUpgradeLimit,
  getCharacterProfile,
  getBreakthroughPreparation,
  getDaoHeartChoices,
  getEquipmentDetails,
  getLootEmpowerCost,
  getMapDepthStatus,
  getMapStatuses,
  getMissionStatus,
  getGearQuality,
  getGearSetStatus,
  getGearAffixRerollCost,
  getSectStatus,
  getDominantPath,
  getRealmUpgradeLimit,
  getRealmProgress,
  getUpgradeTier,
  chooseDaoHeart,
  performBreakthrough,
  craftPill,
  consumePill,
  refineGear,
  rerollGearAffix,
  recruitDisciple,
  refreshMarketStock,
  reviveGameState,
  resolveOpportunity,
  stabilizeFoundation,
  startMapDepthTrial,
  startMission,
  setMissionApproach,
  trainSpiritBeast,
  toggleLootLock,
  toggleAutoMission,
  updateGame,
  upgradeBuilding,
  upgradeCultivationPath,
  upgradeFormation,
  upgradeGear,
  upgradeTreasure,
} from '../src/gameCore.mjs';

function test(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

const realmIndexByName = (name) => REALMS.findIndex((realm) => realm.name === name);

test('cultivation accumulates resources over time', () => {
  const state = createGameState(1000);

  updateGame(state, 10, 11_000);

  assert.equal(state.qi, 0.25);
  assert.equal(state.spiritStones, 0);
  assert.equal(Math.round(state.stoneCarry * 100) / 100, 0.33);
  assert.equal(state.totalCultivationSeconds, 10);
});

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
  assert.equal(REALMS[0].requiredQi, 25);
  assert.equal(REALMS[0].qiRate, 1.5);
  assert.equal(REALMS[17].requiredQi, 220_000);
  assert.equal(REALMS[26].requiredQi, 2_800_000);
  assert.equal(REALMS[27].requiredQi, 4_200_000);
  assert.equal(REALMS[27].qiRate, 55);
});

test('passive cultivation is paced per minute instead of per second', () => {
  const state = createGameState(1000);

  updateGame(state, 60, 61_000);

  assert.equal(state.qi, REALMS[0].qiRate);
  assert.equal(calculateQiRate(state, 61_000), REALMS[0].qiRate);
});

test('realm pacing prevents rushing to nascent soul in a short session', () => {
  const state = createGameState(1000);
  state.buildings.meditationSeat = 6;
  state.formations.spiritGathering = 4;
  state.cultivationPaths.formation = 3;
  state.permanentBonuses.qiRate = 0.12;
  state.inventoryPills.gatherQiPill = 12;
  state.pills = 12;

  for (let minute = 1; minute <= 120; minute += 1) {
    updateGame(state, 60, 1000 + minute * 60_000);
    if (minute % 12 === 0 && state.inventoryPills.gatherQiPill > 0) {
      consumePill(state, 'gatherQiPill', 1000 + minute * 60_000);
    }
    if (state.qi >= REALMS[state.realmIndex].requiredQi) {
      performBreakthrough(state, 1000 + minute * 60_000, () => 0);
    }
  }

  assert.equal(REALMS[realmIndexByName('元婴一变')].requiredQi >= 1_800_000, true);
  assert.equal(state.realmIndex < realmIndexByName('金丹一转'), true);
});

test('seven day boosted pacing remains before nascent soul', () => {
  const state = createGameState(1000);
  state.buildings.meditationSeat = 15;
  state.formations.spiritGathering = 12;
  state.cultivationPaths.formation = 12;
  state.permanentBonuses.qiRate = 0.35;
  state.treasures.spiritLamp = 8;
  state.spiritBeasts.cloudFox = 8;
  state.inventoryPills.gatherQiPill = 200;
  state.pills = 200;

  for (let minute = 1; minute <= 7 * 24 * 60; minute += 1) {
    updateGame(state, 60, 1000 + minute * 60_000);
    if (minute % 120 === 0 && state.inventoryPills.gatherQiPill > 0) {
      consumePill(state, 'gatherQiPill', 1000 + minute * 60_000);
    }
    while (state.qi >= REALMS[state.realmIndex].requiredQi && state.realmIndex < REALMS.length - 1) {
      performBreakthrough(state, 1000 + minute * 60_000, () => 0);
    }
  }

  assert.equal(state.realmIndex < realmIndexByName('元婴一变'), true);
});

test('fourteen day boosted pacing does not consume the nascent soul ladder', () => {
  const state = createGameState(1000);
  state.buildings.meditationSeat = 18;
  state.formations.spiritGathering = 12;
  state.cultivationPaths.formation = 12;
  state.permanentBonuses.qiRate = 0.45;
  state.treasures.spiritLamp = 8;
  state.spiritBeasts.cloudFox = 8;
  state.inventoryPills.gatherQiPill = 400;
  state.pills = 400;

  for (let minute = 1; minute <= 14 * 24 * 60; minute += 1) {
    updateGame(state, 60, 1000 + minute * 60_000);
    if (minute % 90 === 0 && state.inventoryPills.gatherQiPill > 0) {
      consumePill(state, 'gatherQiPill', 1000 + minute * 60_000);
    }
    while (state.qi >= REALMS[state.realmIndex].requiredQi && state.realmIndex < REALMS.length - 1) {
      performBreakthrough(state, 1000 + minute * 60_000, () => 0);
    }
  }

  assert.equal(state.realmIndex < realmIndexByName('元婴三变'), true);
});

test('thirty day high end pacing still leaves nascent soul progression unfinished', () => {
  const state = createGameState(1000);
  state.buildings.meditationSeat = 20;
  state.formations.spiritGathering = 14;
  state.cultivationPaths.formation = 14;
  state.permanentBonuses.qiRate = 0.55;
  state.treasures.spiritLamp = 10;
  state.spiritBeasts.cloudFox = 10;
  state.inventoryPills.gatherQiPill = 900;
  state.pills = 900;

  for (let minute = 1; minute <= 30 * 24 * 60; minute += 1) {
    updateGame(state, 60, 1000 + minute * 60_000);
    if (minute % 60 === 0 && state.inventoryPills.gatherQiPill > 0) {
      consumePill(state, 'gatherQiPill', 1000 + minute * 60_000);
    }
    while (state.qi >= REALMS[state.realmIndex].requiredQi && state.realmIndex < REALMS.length - 1) {
      performBreakthrough(state, 1000 + minute * 60_000, () => 0);
    }
  }

  assert.equal(state.realmIndex >= realmIndexByName('元婴一变'), true);
  assert.equal(state.realmIndex < realmIndexByName('元婴九变'), true);
});

test('legacy realm saves migrate into the expanded realm track', () => {
  const state = reviveGameState({
    balanceVersion: 2,
    qi: 9_999_999,
    realmIndex: 6,
    spiritStones: 1234,
  }, 1000);

  assert.equal(state.realmIndex, realmIndexByName('金丹九转'));
  assert.equal(state.spiritStones, 1234);
  assert.equal(state.qi <= Math.ceil(REALMS[state.realmIndex].requiredQi * 1.15), true);
});

test('legacy saves are rebalanced without wiping progress', () => {
  const state = reviveGameState({
    qi: 999_999,
    realmIndex: 1,
    spiritStones: 1234,
    completedMissions: { herbGathering: 5 },
  }, 1000);

  assert.equal(state.realmIndex, 1);
  assert.equal(state.spiritStones, 1234);
  assert.equal(state.completedMissions.herbGathering, 5);
  assert.equal(state.qi <= Math.ceil(REALMS[1].requiredQi * 1.15), true);
  assert.equal(state.balanceVersion, 6);
});

test('breakthrough advances realm and consumes qi on a successful attempt', () => {
  const state = createGameState(1000);
  state.qi = REALMS[0].requiredQi + 20;

  const result = performBreakthrough(state, 1000, () => 0.1);

  assert.equal(result.ok, true);
  assert.equal(state.realmIndex, 1);
  assert.equal(state.qi, 10);
  assert.equal(getRealmProgress(state), 10 / REALMS[1].requiredQi);
});

test('failed breakthrough creates heart demon pressure', () => {
  const state = createGameState(1000);
  state.qi = REALMS[0].requiredQi;

  const result = performBreakthrough(state, 1000, () => 0.99);

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'failed');
  assert.equal(state.realmIndex, 0);
  assert.equal(state.heartDemon, 1);
  assert.equal(state.qi, 12.5);
  assert.equal(calculateBreakthroughChance(state), 0.6);
});

test('major breakthrough opens dao heart fate choices and selected fate changes growth', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('炼气九层');
  state.qi = REALMS[state.realmIndex].requiredQi;

  const result = performBreakthrough(state, 2000, () => 0);
  const choices = getDaoHeartChoices(state);
  const beforePower = calculatePower(state);

  assert.equal(result.ok, true);
  assert.equal(state.realmIndex, realmIndexByName('筑基一层'));
  assert.equal(choices.length, 3);
  assert.equal(choices.some((choice) => choice.id === 'greenLotusSwordBone'), true);
  assert.equal(DAO_HEARTS.greenLotusSwordBone.name, '青莲剑骨');

  const picked = chooseDaoHeart(state, 'greenLotusSwordBone', 3000);

  assert.equal(picked.ok, true);
  assert.equal(state.daoHearts.greenLotusSwordBone, 1);
  assert.equal(getDaoHeartChoices(state).length, 0);
  assert.equal(calculatePower(state) > beforePower, true);
});

test('tribulation preparation previews readiness and softens failed breakthrough backlash', () => {
  const weak = createGameState(1000);
  weak.qi = REALMS[0].requiredQi;
  const weakPrep = getBreakthroughPreparation(weak, 1000);

  const prepared = createGameState(1000);
  prepared.qi = REALMS[0].requiredQi;
  prepared.spiritStones = 120;
  prepared.herbs = 40;
  prepared.inventoryPills.meridianPill = 1;
  prepared.gear.amulet = 3;
  prepared.formations.mountainGuard = 2;
  prepared.buildings.scriptureLibrary = 2;
  stabilizeFoundation(prepared, 1000);
  stabilizeFoundation(prepared, 2000);
  stabilizeFoundation(prepared, 3000);
  consumePill(prepared, 'meridianPill', 4000);

  const preparedPrep = getBreakthroughPreparation(prepared, 5000);
  const failed = performBreakthrough(prepared, 5000, () => 0.99);

  assert.equal(preparedPrep.readyScore > weakPrep.readyScore, true);
  assert.equal(preparedPrep.items.some((item) => item.id === 'meridian' && item.ready), true);
  assert.equal(failed.ok, false);
  assert.equal(failed.preparation.readyScore, preparedPrep.readyScore);
  assert.equal(prepared.qi > REALMS[0].requiredQi * 0.5, true);
  assert.equal(prepared.heartDemon, 0);
});

test('cave upgrades improve passive cultivation', () => {
  const state = createGameState(1000);
  state.spiritStones = 80;
  state.herbs = 8;

  const result = upgradeBuilding(state, 'meditationSeat', 1000);
  updateGame(state, 10, 11_000);

  assert.equal(result.ok, true);
  assert.equal(state.buildings.meditationSeat, 2);
  assert.equal(state.qi, 0.27);
});

test('spirit field upgrades grow herbs over time', () => {
  const state = createGameState(1000);
  state.spiritStones = 35;

  upgradeBuilding(state, 'spiritField', 1000);
  updateGame(state, 100, 101_000);

  assert.equal(state.herbs, 2);
});

test('alchemy takes time before producing a pill', () => {
  const state = createGameState(1000);
  state.herbs = 8;
  state.spiritStones = 12;

  const started = craftPill(state, 1000);
  updateGame(state, 44, 45_000);
  assert.equal(started.ok, true);
  assert.equal(state.pills, 0);
  assert.equal(state.activeAlchemy.endsAt, 46_000);

  updateGame(state, 1, 46_000);
  assert.equal(state.pills, 1);
  assert.equal(state.activeAlchemy, null);
});

test('alchemy furnace unlocks recipes and shortens crafting time', () => {
  const state = createGameState(1000);
  state.herbs = 40;
  state.spiritStones = 140;

  const locked = craftPill(state, 'clearHeartPill', 1000);
  assert.equal(locked.ok, false);
  assert.equal(locked.reason, 'locked');

  upgradeBuilding(state, 'alchemyFurnace', 1000);
  const started = craftPill(state, 'clearHeartPill', 2000);

  assert.equal(started.ok, true);
  assert.equal(state.activeAlchemy.recipeId, 'clearHeartPill');
  assert.equal(state.activeAlchemy.endsAt, 45_000);

  updateGame(state, 43, 45_000);
  assert.equal(state.inventoryPills.clearHeartPill, 1);
});

test('consumed pills grant a temporary cultivation speed boost', () => {
  const state = createGameState(1000);
  state.inventoryPills.gatherQiPill = 1;

  const consumed = consumePill(state, 'gatherQiPill', 1000);

  assert.equal(consumed.ok, true);
  assert.equal(state.pills, 0);
  assert.equal(state.pillBoostUntil, 121_000);
  assert.equal(calculateQiRate(state, 2_000), 2.1);
});

test('clear heart and meridian pills affect breakthrough preparation', () => {
  const state = createGameState(1000);
  state.heartDemon = 2;
  state.inventoryPills.clearHeartPill = 1;
  state.inventoryPills.meridianPill = 1;

  const clear = consumePill(state, 'clearHeartPill', 1000);
  const meridian = consumePill(state, 'meridianPill', 1000);

  assert.equal(clear.ok, true);
  assert.equal(meridian.ok, true);
  assert.equal(state.heartDemon, 1);
  assert.equal(state.breakthroughBoostUntil, 181_000);
  assert.equal(calculateBreakthroughChance({ ...state, qi: REALMS[0].requiredQi }, 2_000), 0.72);
});

test('gear and formations upgrade real cultivation stats', () => {
  const state = createGameState(1000);
  state.spiritStones = 400;
  state.beastCores = 6;
  state.arrayFlags = 4;

  const weapon = upgradeGear(state, 'weapon', 1000);
  const robe = upgradeGear(state, 'robe', 1000);
  const gathering = upgradeFormation(state, 'spiritGathering', 1000);
  const sword = upgradeFormation(state, 'swordArray', 1000);

  assert.equal(weapon.ok, true);
  assert.equal(robe.ok, true);
  assert.equal(gathering.ok, true);
  assert.equal(sword.ok, true);
  assert.equal(calculatePower(state), 83);
  assert.equal(calculateQiRate(state, 2000), 1.65);
});

test('gear refinement adds quality and slot affix bonuses', () => {
  const state = createGameState(1000);
  state.spiritStones = 120;
  state.artifacts = 1;
  state.gear.weapon = 1;

  const refined = refineGear(state, 'weapon', 1000, () => 0);

  assert.equal(refined.ok, true);
  assert.equal(GEAR_QUALITIES[state.gearQuality.weapon].name, '下品');
  assert.equal(getGearQuality(state, 'weapon').affixName, '剑意');
  assert.equal(state.artifacts, 0);
  assert.equal(calculatePower(state), 100);
});

test('gear affixes support cultivation and exploration roles', () => {
  const state = createGameState(1000);
  state.spiritStones = 240;
  state.artifacts = 2;
  state.gear.amulet = 1;
  state.gear.robe = 1;
  state.realmIndex = realmIndexByName('炼气八层');

  refineGear(state, 'amulet', 1000, () => 0);
  refineGear(state, 'robe', 1000, () => 0);

  assert.equal(calculateQiRate(state, 2000) > REALMS[state.realmIndex].qiRate, true);
  assert.equal(getMissionStatus(state, 'mistyValley').unlocked, true);
});

test('matching gear affixes activate set resonance bonuses', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('炼气八层');
  state.gear.weapon = 1;
  state.gear.amulet = 1;
  state.gear.robe = 1;
  state.gearQuality.weapon = 1;
  state.gearQuality.amulet = 1;
  state.gearQuality.robe = 1;
  state.gearAffixes.weapon = 'swordIntent';
  state.gearAffixes.amulet = 'spiritVein';
  state.gearAffixes.robe = 'cloudStep';

  const sets = getGearSetStatus(state);
  const active = sets.find((set) => set.id === 'greenLotusFlow');
  const weapon = getEquipmentDetails(state).gear.find((item) => item.id === 'weapon');

  assert.equal(GEAR_AFFIX_SETS.greenLotusFlow.name, '青莲流影');
  assert.equal(active.active, true);
  assert.equal(active.matched, 3);
  assert.equal(calculatePower(state), 350);
  assert.equal(calculateQiRate(state, 2000), 5.72);
  assert.equal(getMissionStatus(state, 'mistyValley').recommendedPower, 428);
  assert.equal(weapon.reroll.preview.warnings[0], '可能使青莲流影失效');
});

test('gear affix reroll reports attribute and set impact', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('炼气八层');
  state.spiritStones = 260;
  state.artifacts = 3;
  state.forgingEssence = 4;
  state.gear.weapon = 1;
  state.gear.amulet = 1;
  state.gear.robe = 1;
  state.gearQuality.weapon = 1;
  state.gearQuality.amulet = 1;
  state.gearQuality.robe = 1;
  state.gearAffixes.weapon = 'swordIntent';
  state.gearAffixes.amulet = 'spiritVein';
  state.gearAffixes.robe = 'cloudStep';

  const rerolled = rerollGearAffix(state, 'weapon', 2000, () => 0);

  assert.equal(rerolled.ok, true);
  assert.equal(rerolled.affix, 'breakerEdge');
  assert.equal(rerolled.impact.powerDelta, -69);
  assert.equal(rerolled.impact.setChanges[0].name, '青莲流影');
  assert.equal(rerolled.impact.setChanges[0].beforeMatched, 3);
  assert.equal(rerolled.impact.setChanges[0].afterMatched, 2);
  assert.equal(rerolled.impact.setChanges[0].status, 'lost');
});

test('gear affix reroll consumes materials and changes the slot affix', () => {
  const state = createGameState(1000);
  state.spiritStones = 260;
  state.artifacts = 3;
  state.forgingEssence = 4;
  state.gear.weapon = 1;
  state.gearQuality.weapon = 1;
  state.gearAffixes.weapon = 'swordIntent';

  const cost = getGearAffixRerollCost(state, 'weapon');
  const rerolled = rerollGearAffix(state, 'weapon', 2000, () => 0);

  assert.deepEqual(cost, { spiritStones: 170, artifacts: 1, forgingEssence: 3 });
  assert.equal(rerolled.ok, true);
  assert.equal(rerolled.previousAffix, 'swordIntent');
  assert.equal(rerolled.affix, 'breakerEdge');
  assert.equal(state.spiritStones, 90);
  assert.equal(state.artifacts, 2);
  assert.equal(state.forgingEssence, 1);
});

test('cultivation paths are gated by realm stage and choose a dominant path', () => {
  const state = createGameState(1000);
  state.spiritStones = 10_000;
  state.beastCores = 100;

  assert.equal(CULTIVATION_PATHS.sword.maxLevel, 12);
  assert.equal(getDominantPath(state).name, '未定');

  upgradeCultivationPath(state, 'sword', 1000);
  upgradeCultivationPath(state, 'sword', 1000);
  upgradeCultivationPath(state, 'sword', 1000);
  const locked = upgradeCultivationPath(state, 'sword', 1000);

  assert.equal(state.cultivationPaths.sword, 3);
  assert.equal(locked.ok, false);
  assert.equal(locked.reason, 'realmLocked');
  assert.equal(getDominantPath(state).name, '剑修');
});

test('cultivation paths alter combat alchemy and passive cultivation', () => {
  const state = createGameState(1000);
  state.spiritStones = 20_000;
  state.beastCores = 100;
  state.herbs = 20_000;
  state.arrayFlags = 100;
  state.inventoryPills.gatherQiPill = 20;
  state.pills = 20;

  upgradeCultivationPath(state, 'sword', 1000);
  upgradeCultivationPath(state, 'alchemy', 1000);
  upgradeCultivationPath(state, 'formation', 1000);
  craftPill(state, 'gatherQiPill', 2000);

  assert.equal(calculatePower(state), 50);
  assert.equal(calculateQiRate(state, 2000), 1.58);
  assert.equal(state.activeAlchemy.endsAt, 45_000);
  state.qi = 0;
  consumePill(state, 'gatherQiPill', 3000);
  assert.equal(state.qi, 67.6);
});

test('upgrade tiers extend growth and are gated by realm stage', () => {
  const state = createGameState(1000);
  state.spiritStones = 100_000;
  state.herbs = 100_000;
  state.arrayFlags = 1_000;

  assert.equal(BUILDINGS.meditationSeat.maxLevel, 20);
  assert.equal(BUILDINGS.forgingHall.maxLevel, 20);
  assert.equal(BUILDINGS.scriptureLibrary.maxLevel, 20);
  assert.equal(CAVE_STAGES[19].name, '青岚洞天');
  assert.equal(getUpgradeTier(1).name, '凡阶');
  assert.equal(getUpgradeTier(4).name, '灵阶');
  assert.equal(getRealmUpgradeLimit(state), 3);
  assert.equal(getCaveUpgradeLimit(state), 5);

  upgradeBuilding(state, 'meditationSeat', 1000);
  upgradeBuilding(state, 'meditationSeat', 1000);
  upgradeBuilding(state, 'meditationSeat', 1000);
  upgradeBuilding(state, 'meditationSeat', 1000);
  const locked = upgradeBuilding(state, 'meditationSeat', 1000);

  assert.equal(state.buildings.meditationSeat, 5);
  assert.equal(locked.ok, false);
  assert.equal(locked.reason, 'realmLocked');

  state.realmIndex = realmIndexByName('筑基一层');
  const nextStage = upgradeBuilding(state, 'meditationSeat', 1000);

  assert.equal(nextStage.ok, true);
  assert.equal(state.buildings.meditationSeat, 6);
  assert.equal(getRealmUpgradeLimit(state), 6);

  state.realmIndex = realmIndexByName('金丹一转');
  state.buildings.meditationSeat = 15;
  assert.equal(upgradeBuilding(state, 'meditationSeat', 1000).reason, 'realmLocked');

  state.realmIndex = realmIndexByName('元婴一变');
  assert.equal(upgradeBuilding(state, 'meditationSeat', 1000).ok, true);
});

test('late upgrade costs scale by system resource role', () => {
  assert.equal(BUILDINGS.meditationSeat.cost(16).spiritStones > BUILDINGS.meditationSeat.cost(10).spiritStones * 2, true);
  assert.deepEqual(Object.keys(BUILDINGS.forgingHall.cost(11)).sort(), ['artifacts', 'forgingEssence', 'spiritStones']);
  assert.deepEqual(Object.keys(BUILDINGS.scriptureLibrary.cost(16)).sort(), ['arrayFlags', 'insight', 'spiritStones']);
  assert.deepEqual(Object.keys(GEAR.weapon.cost(6)).sort(), ['beastCores', 'spiritStones']);
  assert.deepEqual(Object.keys(FORMATIONS.spiritGathering.cost(6)).sort(), ['arrayFlags', 'spiritStones']);
});

test('cave status exposes stage names and building details', () => {
  const state = createGameState(1000);
  Object.keys(BUILDINGS).forEach((id) => {
    state.buildings[id] = 20;
  });

  const stage = getCaveStage(state);
  const cave = getCaveStatus(state);

  assert.equal(stage.level, 20);
  assert.equal(stage.name, '青岚洞天');
  assert.equal(cave.buildings.length, 6);
  assert.equal(cave.buildings.some((building) => building.id === 'forgingHall' && building.nextEffects.length === 0), true);
  assert.equal(cave.buildings.some((building) => building.id === 'scriptureLibrary' && building.effects.length > 0), true);
});

test('daily tasks require progress before claiming', () => {
  const state = createGameState(1000);
  state.realmIndex = 1;
  state.buildings.spiritField = 1;
  state.completedMissions.cavePatrol = 1;
  state.spiritStones = 200;

  const early = claimDailyTask(state, 'dailyCultivation', '1970-01-01', 1000);
  assert.equal(early.ok, false);
  assert.equal(early.reason, 'notComplete');

  updateGame(state, 300, 301_000);
  startMission(state, 'herbGathering', 302_000);
  updateGame(state, 30, 332_000);
  startMission(state, 'herbGathering', 333_000);
  updateGame(state, 30, 363_000);
  startMission(state, 'herbGathering', 364_000);
  updateGame(state, 30, 394_000);
  buyMarketItem(state, 'herbBundle', 395_000);

  const tasks = getDailyTasks(state, '1970-01-01');
  assert.deepEqual(tasks.map((task) => task.progress), [300, 3, 1, 0]);
  assert.deepEqual(tasks.map((task) => task.completed), [true, true, true, false]);
  assert.equal(claimDailyTask(state, 'dailyCultivation', '1970-01-01', 396_000).ok, true);
});

test('stabilizing foundation raises chance and softens breakthrough failure', () => {
  const state = createGameState(1000);
  state.qi = REALMS[0].requiredQi + 5;
  state.spiritStones = 40;
  state.herbs = 10;

  const prepared = stabilizeFoundation(state, 1000);
  const chance = calculateBreakthroughChance(state);
  const failed = performBreakthrough(state, 2000, () => 0.99);

  assert.equal(prepared.ok, true);
  assert.equal(chance, 0.9);
  assert.equal(failed.ok, false);
  assert.equal(state.heartDemon, 0);
});

test('combat missions compare power against danger', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('炼气八层');
  state.qi = 140;
  state.spiritStones = 30;
  state.gear.weapon = 8;
  state.gear.robe = 6;
  state.cultivationPaths.sword = 4;
  state.formations.swordArray = 4;
  state.permanentBonuses.power = 160;

  startMission(state, 'mistyValley', 1000);
  updateGame(state, 120, 121_000);

  assert.equal(state.activeMission, null);
  assert.equal(state.beastCores, 1);
  assert.equal(state.artifacts, 1);
  assert.equal(calculatePower(state) > 0, true);
});

test('new exploration routes grant distinct rewards', () => {
  const state = createGameState(1000);
  state.realmIndex = 4;
  state.qi = 600;
  state.gear.weapon = 6;

  startMission(state, 'herbValley', 1000);
  updateGame(state, 70, 71_000);
  assert.equal(state.herbs, 17);

  state.realmIndex = realmIndexByName('筑基一层');
  state.gear.weapon = 12;
  state.gear.robe = 9;
  state.cultivationPaths.sword = 6;
  state.formations.swordArray = 6;
  state.permanentBonuses.power = 900;
  startMission(state, 'ancientSwordTomb', 72_000);
  updateGame(state, 140, 212_000);
  assert.equal(state.artifacts, 3);

  state.realmIndex = realmIndexByName('筑基六层');
  state.gear.weapon = 8;
  state.gear.robe = 6;
  state.cultivationPaths.sword = 5;
  state.formations.swordArray = 4;
  state.permanentBonuses.power = 1_700;
  state.completedMissions.mistyValley = 5;

  startMission(state, 'demonRift', 213_000);
  updateGame(state, 180, 393_000);
  assert.equal(state.beastCores, 5);
});

test('mission maps unlock by realm stage', () => {
  const state = createGameState(1000);

  const locked = startMission(state, 'ancientSwordTomb', 1000);
  assert.equal(locked.ok, false);
  assert.equal(locked.reason, 'realmLocked');
  assert.equal(getMissionStatus(state, 'ancientSwordTomb').unlocked, false);

  state.realmIndex = realmIndexByName('筑基一层');
  const unlocked = startMission(state, 'ancientSwordTomb', 2000);

  assert.equal(unlocked.ok, true);
  assert.equal(getMissionStatus(state, 'ancientSwordTomb').map, '古剑冢');
});

test('mission mastery grants deterministic rare rewards', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('炼气五层');
  state.gear.weapon = 6;
  state.gear.robe = 4;
  state.cultivationPaths.sword = 3;
  state.formations.swordArray = 3;
  state.permanentBonuses.power = 160;

  startMission(state, 'herbValley', 1000);
  updateGame(state, 70, 71_000);
  startMission(state, 'herbValley', 72_000);
  updateGame(state, 70, 142_000);
  startMission(state, 'herbValley', 143_000);
  updateGame(state, 70, 213_000);

  assert.equal(state.completedMissions.herbValley, 3);
  assert.equal(state.inventoryPills.clearHeartPill, 1);
  assert.equal(getMissionStatus(state, 'herbValley').rareProgress, '3 / 3');
});

test('auto mission restarts the same mission after completion', () => {
  const state = createGameState(1000);

  const toggled = toggleAutoMission(state, 'herbGathering', 1000);
  startMission(state, 'herbGathering', 1000);
  updateGame(state, 30, 31_000);

  assert.equal(toggled.ok, true);
  assert.equal(state.completedMissions.herbGathering, 1);
  assert.equal(state.activeMission.id, 'herbGathering');
  assert.equal(state.activeMission.endsAt, 61_000);
});

test('missions finish after their duration and grant rewards', () => {
  const state = createGameState(1000);

  const started = startMission(state, 'herbGathering', 1000);
  updateGame(state, 30, 31_000);

  assert.equal(started.ok, true);
  assert.equal(state.activeMission, null);
  assert.equal(state.herbs, 8);
  assert.equal(state.spiritStones, 7);
});

test('mission events grant deterministic extra rewards', () => {
  const state = createGameState(1000);

  startMission(state, 'herbGathering', 1000);
  updateGame(state, 30, 31_000);
  startMission(state, 'herbGathering', 32_000);
  updateGame(state, 30, 62_000);

  assert.equal(MISSION_EVENTS.hiddenHerbPatch.name, '隐蔽药圃');
  assert.equal(state.completedMissions.herbGathering, 2);
  assert.equal(state.herbs, 13);
  assert.equal(state.qi, 9.5);
  assert.equal(state.lastMissionEvent.id, 'spiritSpring');
});

test('mission events can drop named equipment and equip it', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.gear.weapon = 12;
  state.gear.robe = 9;
  state.cultivationPaths.sword = 6;
  state.formations.swordArray = 6;
  state.permanentBonuses.power = 900;

  startMission(state, 'ancientSwordTomb', 1000);
  updateGame(state, 140, 141_000);

  assert.equal(LOOT_EQUIPMENT.qingfengSword.name, '青锋剑');
  assert.equal(state.lootEquipment.length, 1);
  assert.equal(state.lootEquipment[0].name, '青锋剑');
  assert.equal(state.equippedLoot.weapon, null);

  const before = calculatePower(state);
  const equipped = equipLootEquipment(state, state.lootEquipment[0].uid, 142_000);

  assert.equal(equipped.ok, true);
  assert.equal(state.equippedLoot.weapon, state.lootEquipment[0].uid);
  assert.equal(calculatePower(state) - before, 36);
});

test('mission completion records a readable settlement report', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.gear.weapon = 12;
  state.gear.robe = 9;
  state.cultivationPaths.sword = 6;
  state.formations.swordArray = 6;
  state.permanentBonuses.power = 900;

  startMission(state, 'ancientSwordTomb', 1000);
  updateGame(state, 140, 141_000);

  const report = state.lastMissionReport;
  assert.equal(report.outcome, 'success');
  assert.equal(report.missionName, '古剑冢');
  assert.equal(report.mapName, '古剑冢');
  assert.equal(report.rewardText.includes('法器'), true);
  assert.equal(report.reputationGained, MISSION_MAPS.swordTomb.reputationPerMission);
  assert.equal(report.event.name, '残剑鸣匣');
  assert.equal(report.event.equipmentName, '青锋剑');
  assert.equal(report.summary.includes('收获'), true);
  assert.equal(state.missionReportHistory.length, 1);
  assert.equal(state.missionReportHistory[0].id, report.id);
});

test('recent mission reports keep the latest settlement history', () => {
  const state = createGameState(1000);

  startMission(state, 'herbGathering', 1000);
  updateGame(state, 31, 32_000);
  startMission(state, 'cavePatrol', 33_000);
  updateGame(state, 56, 89_000);

  assert.equal(state.lastMissionReport.missionName, '巡守洞府');
  assert.equal(state.missionReportHistory.length, 2);
  assert.deepEqual(state.missionReportHistory.map((report) => report.missionName), ['巡守洞府', '采集灵草']);
});

test('mission approaches alter rewards and settlement reports', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.gear.weapon = 12;
  state.gear.robe = 9;
  state.cultivationPaths.sword = 6;
  state.formations.swordArray = 6;
  state.permanentBonuses.power = 900;

  const selected = setMissionApproach(state, 'swordTomb', 'relicSearch', 1000);
  const started = startMission(state, 'ancientSwordTomb', 2000);
  updateGame(state, 154, 156_000);

  assert.equal(selected.ok, true);
  assert.equal(started.ok, true);
  assert.equal(MISSION_APPROACHES.relicSearch.name, '探遗');
  assert.equal(state.missionApproaches.swordTomb, 'relicSearch');
  assert.equal(state.lastMissionReport.approach.name, '探遗');
  assert.equal(state.lastMissionReport.approachRewardText.includes('法器'), true);
  assert.match(state.lastMissionReport.mapProgress.label, /探索/);
  assert.equal(state.artifacts > 3, true);

  const status = getMissionStatus(state, 'ancientSwordTomb');
  const monsterHunt = status.approaches.find((approach) => approach.id === 'monsterHunt');
  const relicSearch = status.approaches.find((approach) => approach.id === 'relicSearch');
  assert.equal(status.failurePreview.penaltyText.includes('灵气'), true);
  assert.equal(monsterHunt.comparison.dangerDeltaPct > 0, true);
  assert.equal(relicSearch.dropProgress.nextIn, 1);
});

test('map special drop pools reward route specific exploration', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.gear.weapon = 12;
  state.gear.robe = 9;
  state.cultivationPaths.sword = 6;
  state.formations.swordArray = 6;
  state.permanentBonuses.power = 900;
  setMissionApproach(state, 'swordTomb', 'relicSearch', 1000);

  startMission(state, 'ancientSwordTomb', 1000);
  updateGame(state, 154, 155_000);
  startMission(state, 'ancientSwordTomb', 156_000);
  updateGame(state, 154, 310_000);

  assert.equal(MAP_SPECIAL_DROPS.swordTomb.relicSearch.name, '剑冢残片');
  assert.equal(state.mapSpecialDrops.swordTomb.relicSearch, 1);
  assert.equal(state.lastMissionReport.specialDrop.name, '剑冢残片');
  assert.equal(state.lastMissionReport.specialDropText.includes('炼器精魄'), true);
  assert.equal(state.forgingEssence >= 2, true);
});

test('map special drops count completions per route instead of per map', () => {
  const state = createGameState(1000);

  startMission(state, 'herbGathering', 1000);
  updateGame(state, 31, 32_000);
  setMissionApproach(state, 'qinglanMountain', 'herbSeeking', 33_000);
  startMission(state, 'herbGathering', 34_000);
  updateGame(state, 33, 67_000);

  assert.equal(state.completedMissions.herbGathering, 2);
  assert.equal(state.mapApproachCompletions.qinglanMountain.herbSeeking, 1);
  assert.equal(state.mapSpecialDrops.qinglanMountain?.herbSeeking ?? 0, 0);
  assert.equal(state.lastMissionReport.specialDrop, null);

  startMission(state, 'herbGathering', 68_000);
  updateGame(state, 33, 101_000);

  assert.equal(state.mapApproachCompletions.qinglanMountain.herbSeeking, 2);
  assert.equal(state.mapSpecialDrops.qinglanMountain.herbSeeking, 1);
  assert.equal(state.lastMissionReport.specialDrop.name, '山阴灵苗');
});

test('auto mission stops after a failed combat mission', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  toggleAutoMission(state, 'ancientSwordTomb', 1000);
  startMission(state, 'ancientSwordTomb', 2000);
  updateGame(state, 141, 143_000);

  assert.equal(state.lastMissionReport.outcome, 'failure');
  assert.equal(state.autoMissionId, null);
  assert.equal(state.activeMission, null);
  assert.match(state.log[0].text, /自动历练已停/);
});

test('map bosses unlock from exploration and grant one-time permanent rewards', () => {
  const state = createGameState(1000);
  state.completedMissions.herbGathering = 2;
  state.completedMissions.cavePatrol = 1;
  state.spiritStones = 500;
  state.gear.weapon = 2;
  state.qi = 200;

  const early = challengeMapBoss(state, 'qinglanMountain', 1000);
  assert.equal(early.ok, false);
  assert.equal(early.reason, 'notReady');

  state.completedMissions.marketTrade = 2;
  const readyStatus = getMapStatuses(state).find((map) => map.id === 'qinglanMountain');
  assert.equal(MISSION_MAPS.qinglanMountain.boss.name, '青岚山魈');
  assert.equal(readyStatus.exploration.completed, 5);
  assert.equal(readyStatus.boss.status, 'ready');

  const defeated = challengeMapBoss(state, 'qinglanMountain', 2000);
  const repeated = challengeMapBoss(state, 'qinglanMountain', 3000);

  assert.equal(defeated.ok, true);
  assert.equal(state.defeatedBosses.qinglanMountain, true);
  assert.equal(state.permanentBonuses.power, 24);
  assert.equal(state.forgingEssence, 2);
  assert.equal(repeated.ok, false);
  assert.equal(repeated.reason, 'alreadyDefeated');
});

test('next guidance points players toward the clearest progression step', () => {
  const state = createGameState(1000);

  assert.equal(getNextGuidance(state).title, '先巡守洞府');
  assert.equal(getNextGuidance(state).tab, 'missions');

  state.completedMissions.cavePatrol = 1;
  assert.equal(getNextGuidance(state).title, '领取巡守一次洞府');
  assert.equal(getNextGuidance(state).action, 'claimGoal');
  assert.equal(getNextGuidance(state).targetId, 'firstPatrol');

  claimGoalReward(state, 'firstPatrol', 1000);
  state.qi = REALMS[0].requiredQi;
  assert.equal(getNextGuidance(state).title, '可以破境');
  assert.equal(getNextGuidance(state).action, 'breakthrough');

  state.qi = 220;
  state.realmIndex = 2;
  state.completedMissions.herbGathering = 2;
  state.completedMissions.cavePatrol = 1;
  state.completedMissions.marketTrade = 2;
  state.gear.weapon = 2;
  state.claimedGoals.realmTwo = true;

  assert.equal(getNextGuidance(state).title, '挑战青岚山魈');
});

test('next guidance routes early mainline objectives to their exact panels', () => {
  const state = createGameState(1000);
  state.completedMissions.cavePatrol = 1;
  state.realmIndex = 1;
  state.claimedGoals.firstPatrol = true;
  state.claimedGoals.realmTwo = true;

  const fieldGuidance = getNextGuidance(state);
  assert.equal(fieldGuidance.title, '建成一阶灵田');
  assert.equal(fieldGuidance.tab, 'cave');
  assert.equal(fieldGuidance.targetId, 'spiritField');

  state.buildings.spiritField = 1;
  state.claimedGoals.spiritField = true;
  const pillGuidance = getNextGuidance(state);
  assert.equal(pillGuidance.title, '炼成一枚聚气丹');
  assert.equal(pillGuidance.tab, 'alchemy');
  assert.equal(pillGuidance.targetId, 'gatherQiPill');
});

test('resource guidance points forging shortages to relic routes and forge commissions', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.spiritStones = 2000;
  state.herbs = 200;
  state.beastCores = 40;
  state.arrayFlags = 40;
  state.artifacts = 0;
  state.forgingEssence = 0;
  state.sectDisciples = 2;
  state.lootEquipment = [{
    uid: 'loot-test-sword',
    templateId: 'qingfengSword',
    name: '青锋剑',
    slot: 'weapon',
    quality: 1,
    level: 3,
    bonuses: { power: 72 },
  }];

  const guidance = getResourceGuidance(state);

  assert.equal(guidance.stable, false);
  assert.equal(guidance.items.some((item) => item.resource === 'forgingEssence'), true);
  assert.equal(guidance.items.some((item) => item.resource === 'artifacts'), true);
  assert.equal(guidance.primary.route.mapId, 'swordTomb');
  assert.equal(guidance.primary.route.approachId, 'relicSearch');
  assert.equal(guidance.primary.commission.id, 'forge');
});

test('resource guidance points beast core shortages to hunter routes and patrol commissions', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('炼气八层');
  state.spiritStones = 1600;
  state.herbs = 200;
  state.beastCores = 0;
  state.artifacts = 30;
  state.arrayFlags = 30;
  state.forgingEssence = 30;
  state.sectDisciples = 1;

  const guidance = getResourceGuidance(state);

  assert.equal(guidance.primary.resource, 'beastCores');
  assert.equal(guidance.primary.route.approachId, 'monsterHunt');
  assert.equal(guidance.primary.commission.id, 'patrol');
});

test('loot dismantling creates strengthening material and empowerment improves bonuses', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.gear.weapon = 12;
  state.gear.robe = 9;
  state.cultivationPaths.sword = 6;
  state.formations.swordArray = 6;
  state.permanentBonuses.power = 900;

  startMission(state, 'ancientSwordTomb', 1000);
  updateGame(state, 140, 141_000);
  startMission(state, 'ancientSwordTomb', 142_000);
  updateGame(state, 140, 282_000);
  startMission(state, 'ancientSwordTomb', 283_000);
  updateGame(state, 140, 423_000);

  assert.equal(state.lootEquipment.length, 2);
  const dismantled = disassembleLootEquipment(state, state.lootEquipment[1].uid, 424_000);

  assert.equal(dismantled.ok, true);
  assert.equal(state.lootEquipment.length, 1);
  assert.equal(state.forgingEssence, 5);
  assert.equal(state.artifacts, 9);

  state.spiritStones = 200;
  const before = calculatePower(state);
  const item = state.lootEquipment[0];
  equipLootEquipment(state, item.uid, 425_000);
  const empowered = empowerLootEquipment(state, item.uid, 426_000);

  assert.equal(empowered.ok, true);
  assert.equal(state.lootEquipment[0].level, 1);
  assert.equal(state.lootEquipment[0].bonuses.power, 44);
  assert.equal(calculatePower(state) - before, 44);
});

test('loot details compare against equipped items and organize weak unlocked loot', () => {
  const state = createGameState(1000);
  state.lootEquipment = [
    { uid: 'equipped-sword', templateId: 'qingfengSword', name: '旧青锋剑', slot: 'weapon', quality: 1, level: 0, bonuses: { power: 36 } },
    { uid: 'better-sword', templateId: 'qingfengSword', name: '新青锋剑', slot: 'weapon', quality: 1, level: 2, bonuses: { power: 56 } },
    { uid: 'weak-sword', templateId: 'qingfengSword', name: '残青锋剑', slot: 'weapon', quality: 1, level: 0, bonuses: { power: 24 } },
    { uid: 'locked-robe', templateId: 'cloudthreadRobe', name: '留存法袍', slot: 'robe', quality: 1, level: 0, bonuses: { dangerReduction: 16 } },
  ];
  state.equippedLoot.weapon = 'equipped-sword';

  const locked = toggleLootLock(state, 'locked-robe', 1000);
  const details = getEquipmentDetails(state);
  const better = details.loot.find((item) => item.uid === 'better-sword');

  assert.equal(locked.ok, true);
  assert.equal(better.comparison.againstName, '旧青锋剑');
  assert.equal(better.comparison.deltas.find((delta) => delta.id === 'power').value, 20);
  assert.equal(better.comparison.summary.includes('+20'), true);

  const organized = organizeLootEquipment(state, 2000);

  assert.equal(organized.ok, true);
  assert.equal(organized.removed, 1);
  assert.equal(state.lootEquipment.some((item) => item.uid === 'weak-sword'), false);
  assert.equal(state.lootEquipment.some((item) => item.uid === 'equipped-sword'), true);
  assert.equal(state.lootEquipment.some((item) => item.uid === 'better-sword'), true);
  assert.equal(state.lootEquipment.some((item) => item.uid === 'locked-robe'), true);
  assert.equal(state.forgingEssence, 2);
  assert.equal(state.artifacts, 1);
});

test('equipment details expose cultivation intent and tiered growth preview', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.gear.weapon = 4;
  state.gear.amulet = 1;
  state.gear.robe = 1;

  const details = getEquipmentDetails(state);
  const weapon = details.gear.find((item) => item.id === 'weapon');
  const amulet = details.gear.find((item) => item.id === 'amulet');

  assert.equal(weapon.intent.name, '镇煞');
  assert.equal(amulet.intent.name, '叩关');
  assert.equal(weapon.tier.name, '灵阶');
  assert.equal(weapon.effects.find((effect) => effect.id === 'power').value, 152);
  assert.equal(weapon.nextEffects.find((effect) => effect.id === 'power').value > weapon.effects.find((effect) => effect.id === 'power').value, true);
  assert.equal(weapon.refinement.nextQualityName, '下品');
  assert.equal(weapon.refinement.chance, 0.82);
});

test('loot empowerment uses tiered materials and stronger cross-tier bonuses', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.gear.weapon = 12;
  state.gear.robe = 9;
  state.cultivationPaths.sword = 6;
  state.formations.swordArray = 6;
  state.permanentBonuses.power = 900;

  startMission(state, 'ancientSwordTomb', 1000);
  updateGame(state, 140, 141_000);

  const item = state.lootEquipment[0];
  state.spiritStones = 10_000;
  state.forgingEssence = 100;
  state.artifacts = 10;

  empowerLootEquipment(state, item.uid, 142_000);
  empowerLootEquipment(state, item.uid, 143_000);
  empowerLootEquipment(state, item.uid, 144_000);
  const beforeTierCross = item.bonuses.power;
  const crossed = empowerLootEquipment(state, item.uid, 145_000);

  assert.equal(crossed.ok, true);
  assert.equal(item.level, 4);
  assert.equal(getLootEmpowerCost(4).artifacts, 1);
  assert.equal(item.bonuses.power > beforeTierCross, true);
  assert.equal(item.bonuses.power, 71);
});

test('map reputation and mastery grow from exploration', () => {
  const state = createGameState(1000);

  startMission(state, 'herbGathering', 1000);
  updateGame(state, 30, 31_000);
  startMission(state, 'cavePatrol', 32_000);
  updateGame(state, 55, 87_000);

  const status = getMapStatuses(state).find((map) => map.id === 'qinglanMountain');

  assert.equal(state.mapReputation.qinglanMountain, 12);
  assert.equal(status.mastery.level, 1);
  assert.equal(status.mastery.name, '熟路');
  assert.equal(status.exploration.label, '探索 2 / 5');

  state.completedMissions.marketTrade = 8;
  const capped = getMapStatuses(state).find((map) => map.id === 'qinglanMountain');
  assert.equal(capped.exploration.label, '探索 5 / 5 · 累计 10');
  assert.equal(calculateQiRate(state, 88_000), 1.55);
});

test('mission and boss previews use omen language instead of raw risk wording', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('炼气八层');

  const missionStatus = getMissionStatus(state, 'mistyValley');
  assert.equal(['大凶', '有险', '平', '小吉'].includes(missionStatus.omen.name), true);
  assert.equal(missionStatus.omen.label, '卦象');
  assert.equal(missionStatus.omen.detail.includes('劫象'), true);
  assert.equal(missionStatus.omen.detail.includes('风险'), false);

  state.completedMissions.herbGathering = 2;
  state.completedMissions.cavePatrol = 1;
  state.completedMissions.marketTrade = 2;
  const bossStatus = getMapStatuses(state).find((map) => map.id === 'qinglanMountain');

  assert.equal(bossStatus.boss.omen.label, '卦象');
  assert.equal(['小吉', '平', '有险', '大凶'].includes(bossStatus.boss.omen.name), true);
  assert.equal(bossStatus.boss.omen.counsel.startsWith('宜备：'), true);
});

test('midgame mission pressure requires preparation beyond realm unlock', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');

  const unlocked = getMissionStatus(state, 'ancientSwordTomb');
  assert.equal(unlocked.unlocked, true);
  assert.equal(unlocked.recommendedPower >= 500, true);
  assert.equal(unlocked.omen.name, '大凶');

  state.gear.weapon = 12;
  state.gear.robe = 9;
  state.cultivationPaths.sword = 6;
  state.formations.swordArray = 6;
  state.permanentBonuses.power = 900;
  state.completedMissions.herbValley = 6;
  state.completedMissions.mistyValley = 5;

  const prepared = getMissionStatus(state, 'ancientSwordTomb');
  assert.equal(['有险', '平', '小吉'].includes(prepared.omen.name), true);
  assert.equal(prepared.recommendedPower < unlocked.recommendedPower, true);
});

test('ancient ruins unlocks at mid golden core instead of the first turn', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('金丹一转');

  assert.equal(getMissionStatus(state, 'ancientRuins').unlocked, false);
  assert.equal(getMapStatuses(state).find((map) => map.id === 'ancientRuins').unlocked, false);

  state.realmIndex = realmIndexByName('金丹四转');

  assert.equal(getMissionStatus(state, 'ancientRuins').unlocked, true);
  assert.equal(getMapStatuses(state).find((map) => map.id === 'ancientRuins').unlocked, true);
});

test('map readiness separates realm unlock from stable travel', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.gear.weapon = 8;
  state.gear.robe = 6;
  state.cultivationPaths.sword = 4;
  state.formations.swordArray = 4;

  const unstable = getMapStatuses(state).find((map) => map.id === 'swordTomb');
  assert.equal(unstable.unlocked, true);
  assert.equal(unstable.readiness.label, '地势');
  assert.equal(unstable.readiness.name, '未稳');
  assert.equal(unstable.readiness.detail.includes('劫象'), true);

  state.permanentBonuses.power = 500;
  const stable = getMapStatuses(state).find((map) => map.id === 'swordTomb');
  assert.equal(stable.readiness.name, '地熟');
  assert.equal(stable.readiness.ratio > unstable.readiness.ratio, true);
});

test('near-threshold mission failures still leave map scouting progress', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.gear.weapon = 8;
  state.gear.robe = 6;
  state.cultivationPaths.sword = 4;
  state.formations.swordArray = 4;

  const started = startMission(state, 'ancientSwordTomb', 1000);
  updateGame(state, 141, 143_000);

  assert.equal(started.ok, true);
  assert.equal(state.lastMissionReport.outcome, 'failure');
  assert.equal(state.lastMissionReport.reputationGained, 3);
  assert.equal(state.mapReputation.swordTomb, 3);
  assert.match(state.lastMissionReport.challenge.label, /差/);
  assert.match(state.lastMissionReport.summary, /摸清/);
});

test('sect disciples turn assignments into long-term idle rewards', () => {
  const state = createGameState(1000);
  state.realmIndex = 2;
  state.spiritStones = 500;
  state.herbs = 80;

  const first = recruitDisciple(state, 1000);
  const second = recruitDisciple(state, 1000);
  const assignedHerbs = assignSectDisciple(state, 'herbGarden', 1, 1000);
  const assignedPatrol = assignSectDisciple(state, 'patrol', 1, 1000);
  updateGame(state, 120, 121_000);

  const sect = getSectStatus(state);

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(assignedHerbs.ok, true);
  assert.equal(assignedPatrol.ok, true);
  assert.equal(sect.disciples, 2);
  assert.equal(sect.assigned, 2);
  assert.equal(state.herbs > 0, true);
  assert.equal(state.sectReputation, 2);
  assert.equal(state.beastCores, 1);
});

test('sect reputation unlocks levels and named disciples gain commission experience', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.spiritStones = 1_000;
  state.herbs = 300;

  recruitDisciple(state, 1000);
  recruitDisciple(state, 2000);
  const earlySect = getSectStatus(state);

  assert.equal(SECT_LEVELS[0].name, '外门草创');
  assert.equal(earlySect.levelName, '外门草创');
  assert.equal(earlySect.roster.length, 2);
  assert.equal(typeof earlySect.roster[0].aptitude, 'number');
  assert.equal(earlySect.roster[0].job, 'idle');

  assignSectDisciple(state, 'herbGarden', 1, 3000);
  updateGame(state, 300, 303_000);
  const trainedSect = getSectStatus(state);

  assert.equal(trainedSect.roster[0].job, 'herbGarden');
  assert.equal(trainedSect.roster[0].experience > 0, true);

  state.sectReputation = 95;
  const grownSect = getSectStatus(state);
  assert.equal(grownSect.levelName, '内门成形');
  assert.equal(grownSect.capacity > earlySect.capacity, true);
});

test('sect forging commission stabilizes late strengthening materials', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.spiritStones = 1_000;
  state.herbs = 300;

  recruitDisciple(state, 1000);
  const assigned = assignSectDisciple(state, 'forge', 1, 2000);
  updateGame(state, 1000, 1_002_000);

  assert.equal(SECT_COMMISSIONS.forge.name, '炼器委托');
  assert.equal(assigned.ok, true);
  assert.equal(state.forgingEssence > 0, true);
  assert.equal(state.artifacts > 0, true);
});

test('mission opportunities offer choices and resolve rewards or costs', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.gear.weapon = 12;
  state.gear.robe = 9;
  state.cultivationPaths.sword = 6;
  state.formations.swordArray = 6;
  state.qi = 600;
  state.spiritStones = 500;
  state.permanentBonuses.power = 900;

  startMission(state, 'ancientSwordTomb', 1000);
  updateGame(state, 140, 141_000);

  assert.equal(OPPORTUNITIES.swordEcho.name, '剑冢回响');
  assert.equal(state.activeOpportunity.id, 'swordEcho');

  const powerBonusBefore = state.permanentBonuses.power;
  const resolved = resolveOpportunity(state, 'temperSword', 142_000, () => 0);

  assert.equal(resolved.ok, true);
  assert.equal(state.activeOpportunity, null);
  assert.equal(state.permanentBonuses.power - powerBonusBefore, 18);
  assert.equal(state.forgingEssence, 3);
});

test('mission opportunity choices return material requirements when unaffordable', () => {
  const state = createGameState(1000);
  state.activeOpportunity = { id: 'swordEcho', missionId: 'ancientSwordTomb', createdAt: 1000 };
  state.artifacts = 0;

  const result = resolveOpportunity(state, 'temperSword', 2000, () => 0);

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'notEnoughResources');
  assert.equal(result.opportunity.name, '剑冢回响');
  assert.equal(result.choice.title, '以法器淬锋');
  assert.deepEqual(result.cost, { artifacts: 1 });
  assert.equal(state.activeOpportunity.id, 'swordEcho');
});

test('magic treasures and spirit beasts add long term stat bonuses', () => {
  const state = createGameState(1000);
  state.spiritStones = 1_000;
  state.herbs = 300;
  state.artifacts = 10;
  state.forgingEssence = 10;
  state.beastCores = 10;

  const treasure = upgradeTreasure(state, 'lifeBoundSeal', 1000);
  const beast = trainSpiritBeast(state, 'cloudFox', 2000);

  assert.equal(TREASURES.lifeBoundSeal.name, '本命青印');
  assert.equal(SPIRIT_BEASTS.cloudFox.name, '云纹灵狐');
  assert.equal(treasure.ok, true);
  assert.equal(beast.ok, true);
  assert.equal(state.treasures.lifeBoundSeal, 1);
  assert.equal(state.spiritBeasts.cloudFox, 1);
  assert.equal(calculateBreakthroughChance({ ...state, qi: 160 }, 3000) > 0.75, true);
  assert.equal(calculateQiRate(state, 3000) > REALMS[0].qiRate, true);
});

test('character profile and equipment details expose concrete attribute sources', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.qi = 120;
  state.spiritStones = 500;
  state.artifacts = 5;
  state.gear.weapon = 2;
  state.gear.amulet = 1;
  state.gear.robe = 1;

  refineGear(state, 'weapon', 1000, () => 0);
  const profile = getCharacterProfile(state, 2000);
  const equipment = getEquipmentDetails(state);
  const weapon = equipment.gear.find((item) => item.id === 'weapon');

  assert.equal(profile.combatPower.value, calculatePower(state));
  assert.equal(profile.attributes.some((attribute) => attribute.id === 'attack' && attribute.value > 0), true);
  assert.equal(profile.attributes.some((attribute) => attribute.id === 'cultivationSpeed' && attribute.sources.length > 0), true);
  assert.equal(weapon.qualityName, '下品');
  assert.equal(weapon.affix.name, '剑意');
  assert.equal(weapon.effects.some((effect) => effect.label === '道威' && effect.value > 0), true);
});

test('character profile uses xianxia themed attribute names', () => {
  const state = createGameState(1000);
  state.gear.weapon = 1;
  state.gear.amulet = 1;
  state.gear.robe = 1;

  const profile = getCharacterProfile(state, 2000);
  const equipment = getEquipmentDetails(state);
  const weapon = equipment.gear.find((item) => item.id === 'weapon');

  assert.equal(profile.combatPower.label, '道行总纲');
  assert.deepEqual(profile.attributes.map((attribute) => attribute.label), ['道威', '灵息', '破境天机', '护体玄光', '山门气运']);
  assert.equal(weapon.effects.some((effect) => effect.label === '道威'), true);
});

test('goals describe early cultivation progress', () => {
  const state = createGameState(1000);
  state.realmIndex = 1;
  state.buildings.spiritField = 1;
  state.completedMissions.cavePatrol = 1;
  state.craftedPills = 1;

  const goals = getGoals(state);

  assert.deepEqual(goals.map((goal) => goal.completed), [true, true, true, true]);
  assert.deepEqual(goals.slice(0, 3).map((goal) => goal.id), ['firstPatrol', 'realmTwo', 'spiritField']);
});

test('goal rewards can be claimed once', () => {
  const state = createGameState(1000);
  state.realmIndex = 1;

  const first = claimGoalReward(state, 'realmTwo', 1000);
  const second = claimGoalReward(state, 'realmTwo', 1000);

  assert.equal(first.ok, true);
  assert.equal(state.spiritStones, 70);
  assert.equal(state.pills, 1);
  assert.equal(second.ok, false);
  assert.equal(second.reason, 'alreadyClaimed');
});

test('mainline chapters require claimed objectives before chapter rewards', () => {
  const state = createGameState(1000);
  state.realmIndex = 1;
  state.buildings.spiritField = 1;
  state.completedMissions.cavePatrol = 1;
  state.craftedPills = 1;

  const chapters = getMainlineChapters(state);
  assert.equal(MAINLINE_CHAPTERS.length >= 5, true);
  assert.equal(chapters[0].completed, true);
  assert.equal(chapters[0].allObjectivesClaimed, false);

  const early = claimChapterReward(state, 'qinglanStart', 1000);
  assert.equal(early.ok, false);
  assert.equal(early.reason, 'objectivesUnclaimed');

  for (const goal of chapters[0].objectives) {
    claimGoalReward(state, goal.id, 1000);
  }
  const claimed = claimChapterReward(state, 'qinglanStart', 1000);

  assert.equal(claimed.ok, true);
  assert.equal(state.claimedChapterRewards.qinglanStart, true);
  assert.equal(getMainlineChapters(state)[1].locked, false);
});

test('mainline chapter rewards provide permanent growth bonuses', () => {
  const state = createGameState(1000);
  state.realmIndex = 1;
  state.buildings.spiritField = 1;
  state.completedMissions.cavePatrol = 1;
  state.craftedPills = 1;

  for (const goal of getMainlineChapters(state)[0].objectives) {
    claimGoalReward(state, goal.id, 1000);
  }
  claimChapterReward(state, 'qinglanStart', 1000);

  assert.equal(state.permanentBonuses.qiRate, 0.03);
  assert.equal(calculateQiRate(state, 2000), 2.06);
});

test('daily tasks unlock after three novice goals are complete', () => {
  const state = createGameState(1000);
  state.realmIndex = 1;
  state.buildings.spiritField = 1;
  state.completedMissions.cavePatrol = 1;
  updateGame(state, 300, 301_000);

  const tasks = getDailyTasks(state, '2026-05-07');
  const claimed = claimDailyTask(state, 'dailyCultivation', '1970-01-01', 302_000);

  assert.equal(tasks.filter((task) => (task.unlockRealmIndex ?? 0) === 0).every((task) => task.unlocked), true);
  assert.equal(tasks.find((task) => task.id === 'dailyDepth').unlocked, false);
  assert.equal(claimed.ok, true);
  assert.equal(state.spiritStones, 48);
  assert.equal(state.dailyClaims['1970-01-01'].dailyCultivation, true);
});

test('daily tasks stay locked before enough novice goals are complete', () => {
  const state = createGameState(1000);

  const tasks = getDailyTasks(state, '2026-05-07');
  const claimed = claimDailyTask(state, 'dailyCultivation', '2026-05-07', 1000);

  assert.equal(tasks.every((task) => task.unlocked), false);
  assert.equal(claimed.ok, false);
  assert.equal(claimed.reason, 'locked');
});

test('midgame daily depth task rewards pushing a secret realm layer', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('炼气五层');
  state.buildings.spiritField = 1;
  state.completedMissions.cavePatrol = 1;
  state.permanentBonuses.power = 500;
  const dateKey = '1970-01-01';

  const before = getDailyTasks(state, dateKey).find((task) => task.id === 'dailyDepth');
  const depth = getMapDepthStatus(state, 'qinglanMountain');
  startMapDepthTrial(state, 'qinglanMountain', 1000);
  updateGame(state, depth.duration + 1, 1000 + (depth.duration + 1) * 1000);
  const after = getDailyTasks(state, dateKey).find((task) => task.id === 'dailyDepth');
  const claimed = claimDailyTask(state, 'dailyDepth', dateKey, 200_000);

  assert.equal(before.unlocked, true);
  assert.equal(after.completed, true);
  assert.equal(claimed.ok, true);
  assert.equal(state.forgingEssence >= 1, true);
  assert.equal(state.arrayFlags >= 1, true);
});

test('market sells materials equipment and formations', () => {
  const state = createGameState(1000);
  state.spiritStones = 260;
  state.beastCores = 1;

  const herbs = buyMarketItem(state, 'herbBundle', 1000);
  const sword = buyMarketItem(state, 'spiritSword', 1000);
  const formation = buyMarketItem(state, 'arrayManual', 1000);

  assert.equal(herbs.ok, true);
  assert.equal(sword.ok, true);
  assert.equal(formation.ok, true);
  assert.equal(state.herbs, 12);
  assert.equal(state.artifacts, 1);
  assert.equal(state.arrayFlags, 1);
  assert.equal(state.spiritStones, 50);
  assert.equal(calculatePower(state), 22);
});

test('map depth trials scale difficulty and grant first-clear rewards', () => {
  const state = createGameState(1000);
  state.permanentBonuses.power = 500;
  const firstDepth = getMapDepthStatus(state, 'qinglanMountain');

  const started = startMapDepthTrial(state, 'qinglanMountain', 1000);
  updateGame(state, firstDepth.duration + 1, 1000 + (firstDepth.duration + 1) * 1000);
  const secondDepth = getMapDepthStatus(state, 'qinglanMountain');

  assert.equal(firstDepth.nextLayer, 1);
  assert.equal(firstDepth.maxLayer, 30);
  assert.equal(started.ok, true);
  assert.equal(state.mapDepths.qinglanMountain, 1);
  assert.equal(secondDepth.nextLayer, 2);
  assert.equal(secondDepth.pressure > firstDepth.pressure, true);
  assert.equal(state.lastMissionReport.mapName, '青岚山');
  assert.match(state.lastMissionReport.summary, /秘境/);
  assert.equal(state.spiritStones > 0, true);
});

test('market stock refreshes by day and enforces item limits', () => {
  const state = createGameState(1000);
  state.spiritStones = 1_000;
  state.realmIndex = realmIndexByName('筑基一层');

  const firstStock = getMarketStock(state, '2026-05-08');
  const bought = buyMarketItem(state, firstStock.items[0].id, '2026-05-08', 1000);
  const repeated = buyMarketItem(state, firstStock.items[0].id, '2026-05-08', 1000);
  const refreshed = refreshMarketStock(state, '2026-05-08', 2000);
  const secondStock = getMarketStock(state, '2026-05-08');

  assert.equal(firstStock.items.length >= 4, true);
  assert.equal(bought.ok, true);
  assert.equal(repeated.ok, false);
  assert.equal(repeated.reason, 'soldOut');
  assert.equal(refreshed.ok, true);
  assert.notDeepEqual(secondStock.items.map((item) => item.id), firstStock.items.map((item) => item.id));
  assert.equal(secondStock.refreshCost.spiritStones > firstStock.refreshCost.spiritStones, true);
});

test('offline progress returns a resource summary', () => {
  const state = createGameState(1000);
  state.buildings.spiritField = 1;

  const summary = applyOfflineProgress(state, 100, 101_000);

  assert.equal(summary.seconds, 100);
  assert.equal(summary.qi, 2.5);
  assert.equal(summary.spiritStones, 3);
  assert.equal(summary.herbs, 2);
});
