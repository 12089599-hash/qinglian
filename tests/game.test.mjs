import assert from 'node:assert/strict';
import {
  BUILDINGS,
  CAVE_STAGES,
  CULTIVATION_PATHS,
  DAO_HEARTS,
  DEPTH_TRIBULATIONS,
  FORMATIONS,
  GEAR,
  GEAR_AFFIXES,
  GEAR_AFFIX_POOLS,
  GEAR_AFFIX_SETS,
  GEAR_QUALITIES,
  BLOODLINES,
  LOOT_EQUIPMENT,
  MAINLINE_CHAPTERS,
  MAP_SPECIAL_DROPS,
  MARKET_ITEMS,
  MISSIONS,
  MISSION_MAPS,
  MISSION_APPROACHES,
  MISSION_EVENTS,
  OPPORTUNITIES,
  PILL_RECIPES,
  REALMS,
  RARITY_TIERS,
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
  deploySpiritBeast,
  equipLootEquipment,
  empowerLootEquipment,
  organizeLootEquipment,
  getGoals,
  getNextGuidance,
  getProgressPlan,
  getResourceGuidance,
  getMainlineChapters,
  getDailyTasks,
  getMarketStock,
  getCaveStage,
  getCaveStatus,
  getCaveUpgradeLimit,
  getCharacterProfile,
  getCombatProfile,
  getBreakthroughPreparation,
  getDaoHeartChoices,
  getEquipmentDetails,
  getLootEmpowerCost,
  getLootResonanceStatus,
  getMapDepthStatus,
  getMapDepthSweepStatus,
  getMapStatuses,
  getMapBossSweepStatus,
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
  lockRareLootEquipment,
  performBreakthrough,
  craftPill,
  consumePill,
  refineGear,
  rerollGearAffix,
  recruitDisciple,
  awakenBloodline,
  upgradeSectSkill,
  refreshMarketStock,
  reviveGameState,
  resolveOpportunity,
  stabilizeFoundation,
  startMapDepthTrial,
  sweepMapBoss,
  sweepMapDepth,
  startMission,
  simulateBossBattle,
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

  assert.equal(state.qi, 0.53);
  assert.equal(state.spiritStones, 0);
  assert.equal(Math.round(state.stoneCarry * 100) / 100, 0.67);
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
  assert.equal(REALMS[0].requiredQi, 18);
  assert.equal(REALMS[0].qiRate, 3.2);
  assert.equal(REALMS[1].requiredQi, 248);
  assert.equal(REALMS[2].requiredQi, 650);
  assert.equal(REALMS[8].requiredQi, 4800);
  assert.equal(REALMS[8].qiRate, 7.2);
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

test('mature cultivation multipliers are cooler after the early base boost', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('金丹一转');
  state.buildings.meditationSeat = 15;
  state.formations.spiritGathering = 12;
  state.gear.jade = 12;
  state.cultivationPaths.formation = 12;
  state.permanentBonuses.qiRate = 0.45;
  state.treasures.spiritLamp = 8;
  state.spiritBeasts.cloudFox = 8;

  assert.equal(calculateQiRate(state, 2000) < 300, true);
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

test('expanded realm saves without a version do not jump through legacy migration', () => {
  const expandedIndex = realmIndexByName('筑基一层');
  const state = reviveGameState({
    qi: 999_999,
    realmIndex: expandedIndex,
    spiritStones: 4321,
  }, 1000);

  assert.equal(state.realmIndex, expandedIndex);
  assert.equal(state.spiritStones, 4321);
  assert.equal(state.balanceVersion, 6);
});

test('revived foundation stability is capped to the visible preparation limit', () => {
  const state = reviveGameState({
    balanceVersion: 6,
    foundationStability: 99,
  }, 1000);

  assert.equal(state.foundationStability, 3);
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

test('successful breakthrough consumes one settled foundation layer', () => {
  const state = createGameState(1000);
  state.qi = REALMS[0].requiredQi + 20;
  state.foundationStability = 3;

  const result = performBreakthrough(state, 1000, () => 0.1);

  assert.equal(result.ok, true);
  assert.equal(state.foundationStability, 2);
});

test('failed breakthrough creates heart demon pressure', () => {
  const state = createGameState(1000);
  state.qi = REALMS[0].requiredQi;

  const result = performBreakthrough(state, 1000, () => 0.99);

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'failed');
  assert.equal(state.realmIndex, 0);
  assert.equal(state.heartDemon, 1);
  assert.equal(state.qi, 9);
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
  assert.equal(state.qi, 0.56);
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
  assert.equal(state.activeAlchemy.length, 1);
  assert.equal(state.activeAlchemy[0].endsAt, 46_000);

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
  assert.equal(state.activeAlchemy[0].recipeId, 'clearHeartPill');
  assert.equal(state.activeAlchemy[0].endsAt, 45_000);

  updateGame(state, 43, 45_000);
  assert.equal(state.inventoryPills.clearHeartPill, 1);
});

test('alchemy furnace levels add simultaneous crafting slots', () => {
  const state = createGameState(1000);
  state.buildings.alchemyFurnace = 5;
  state.herbs = 100;
  state.spiritStones = 200;
  state.beastCores = 5;

  const first = craftPill(state, 'gatherQiPill', 1000);
  const second = craftPill(state, 'clearHeartPill', 2000);
  const third = craftPill(state, 'meridianPill', 3000);

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(third.ok, false);
  assert.equal(third.reason, 'busy');
  assert.equal(state.activeAlchemy.length, 2);

  updateGame(state, 45, 47_000);
  assert.equal(state.inventoryPills.gatherQiPill, 1);
  assert.equal(state.inventoryPills.clearHeartPill, 1);
  assert.equal(state.activeAlchemy, null);
});

test('attribute pills grant permanent cultivation attributes', () => {
  const state = createGameState(1000);
  state.inventoryPills.bodyTemperPill = 1;
  state.inventoryPills.spiritRootPill = 1;
  const powerBefore = calculatePower(state);
  const rateBefore = calculateQiRate(state);

  const body = consumePill(state, 'bodyTemperPill', 1000);
  const root = consumePill(state, 'spiritRootPill', 2000);

  assert.equal(PILL_RECIPES.bodyTemperPill.name, '淬体丹');
  assert.equal(body.ok, true);
  assert.equal(root.ok, true);
  assert.equal(state.permanentBonuses.power, 12);
  assert.equal(state.permanentBonuses.qiRate, 0.01);
  assert.equal(calculatePower(state) > powerBefore, true);
  assert.equal(calculateQiRate(state) > rateBefore, true);
});

test('attribute pills stop at their consumption caps', () => {
  const state = createGameState(1000);
  state.inventoryPills.bodyTemperPill = 31;
  state.inventoryPills.spiritRootPill = 21;

  for (let index = 0; index < 30; index += 1) {
    assert.equal(consumePill(state, 'bodyTemperPill', 1000 + index).ok, true);
  }
  for (let index = 0; index < 20; index += 1) {
    assert.equal(consumePill(state, 'spiritRootPill', 2000 + index).ok, true);
  }

  const bodyBlocked = consumePill(state, 'bodyTemperPill', 5000);
  const rootBlocked = consumePill(state, 'spiritRootPill', 6000);

  assert.equal(bodyBlocked.ok, false);
  assert.equal(bodyBlocked.reason, 'capReached');
  assert.equal(rootBlocked.ok, false);
  assert.equal(rootBlocked.reason, 'capReached');
  assert.equal(state.inventoryPills.bodyTemperPill, 1);
  assert.equal(state.inventoryPills.spiritRootPill, 1);
  assert.equal(state.consumedAttributePills.bodyTemperPill, 30);
  assert.equal(state.consumedAttributePills.spiritRootPill, 20);
});

test('consumed pills grant a temporary cultivation speed boost', () => {
  const state = createGameState(1000);
  state.inventoryPills.gatherQiPill = 1;

  const consumed = consumePill(state, 'gatherQiPill', 1000);

  assert.equal(consumed.ok, true);
  assert.equal(state.pills, 0);
  assert.equal(state.pillBoostUntil, 1_201_000);
  assert.equal(calculateQiRate(state, 2_000), 4.64);
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
  assert.equal(state.breakthroughBoostUntil, 1_801_000);
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
  assert.equal(calculateQiRate(state, 2000), 3.42);
});

test('gear refinement adds quality and slot affix bonuses', () => {
  const state = createGameState(1000);
  state.spiritStones = 120;
  state.artifacts = 1;
  state.gear.weapon = 1;

  const refined = refineGear(state, 'weapon', 1000, () => 0);

  assert.equal(refined.ok, true);
  assert.equal(GEAR_QUALITIES[state.gearQuality.weapon].name, '初火');
  assert.equal(getGearQuality(state, 'weapon').affixName, '剑意');
  assert.equal(state.artifacts, 0);
  assert.equal(calculatePower(state), 100);
});

test('early mainline rewards are generous with ordinary resources only', () => {
  const start = MAINLINE_CHAPTERS[0];
  const rewards = Object.fromEntries(start.objectives.map((goal) => [goal.id, goal.reward]));

  assert.deepEqual(start.reward, { spiritStones: 260, herbs: 20, qiRateBonus: 0.03 });
  assert.deepEqual(rewards.firstPatrol, { spiritStones: 80, herbs: 8, qi: 140 });
  assert.deepEqual(rewards.realmTwo, { spiritStones: 120, pills: 2, qi: 120 });
  assert.deepEqual(rewards.spiritField, { herbs: 25, spiritStones: 80 });
  assert.deepEqual(rewards.firstPill, { qi: 360, spiritStones: 90, herbs: 12 });
  assert.equal(Object.keys(rewards.firstPatrol).includes('bloodEssence'), false);
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

test('equipment combat profile exposes elemental offense and defense', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.gear.weapon = 4;
  state.gear.amulet = 3;
  state.gear.robe = 3;
  state.gearQuality.weapon = 2;
  state.gearQuality.amulet = 1;
  state.gearQuality.robe = 1;
  state.gearAffixes.weapon = 'flameEdge';
  state.gearAffixes.amulet = 'sunSigil';
  state.gearAffixes.robe = 'earthWard';

  const combat = getCombatProfile(state);
  const equipment = getEquipmentDetails(state);
  const weapon = equipment.gear.find((item) => item.id === 'weapon');

  assert.equal(combat.element.id, 'fire');
  assert.equal(combat.attack.value > combat.defense.value, true);
  assert.equal(combat.vitality.value > 0, true);
  assert.equal(combat.critChance.value > 0.05, true);
  assert.equal(combat.elementPower.sources.some((source) => source.label.includes('离火')), true);
  assert.equal(weapon.affix.name, '离火');
  assert.equal(weapon.affix.effects.some((effect) => effect.id === 'critChance'), true);
});

test('gear affix pools provide multiple elemental build choices', () => {
  assert.deepEqual(Object.keys(GEAR), ['weapon', 'offhand', 'amulet', 'robe', 'jade', 'boots']);
  Object.keys(GEAR).forEach((slot) => {
    assert.equal(GEAR_AFFIX_POOLS[slot].length >= 4, true);
  });
  assert.equal(Object.values(GEAR_AFFIXES).some((affix) => affix.element === 'dark'), true);
  assert.equal(Object.values(GEAR_AFFIXES).some((affix) => affix.element === 'light'), true);
});

test('loot pool covers six equipment slots and new saves normalize each slot', () => {
  const state = createGameState(1000);
  const lootSlots = new Set(Object.values(LOOT_EQUIPMENT).map((item) => item.slot));

  assert.deepEqual(Object.keys(state.equippedLoot), ['weapon', 'offhand', 'amulet', 'robe', 'jade', 'boots']);
  Object.keys(GEAR).forEach((slot) => {
    assert.equal(lootSlots.has(slot), true);
    assert.equal(Object.values(LOOT_EQUIPMENT).filter((item) => item.slot === slot).length >= 6, true);
  });
});

test('loot templates carry realm bands for long term equipment chase', () => {
  const templates = Object.values(LOOT_EQUIPMENT);
  const realmBands = new Set(templates.map((item) => item.realmBand));
  const lateTemplates = templates.filter((item) => item.minRealmIndex >= realmIndexByName('金丹一转'));

  assert.equal(templates.length >= 36, true);
  assert.equal(realmBands.has('炼气'), true);
  assert.equal(realmBands.has('筑基'), true);
  assert.equal(realmBands.has('金丹'), true);
  assert.equal(realmBands.has('元婴'), true);
  assert.equal(lateTemplates.length >= 12, true);
  assert.equal(templates.some((item) => item.name === '太微星盘'), true);
  assert.equal(templates.some((item) => item.name === '蛟骨战戟'), true);
});

test('early maps can roll the full equipment pool with very rare top rarity', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.permanentBonuses.power = 900;

  const seenSlots = new Set();
  const seenTemplates = new Set();
  let daoDrops = 0;

  for (let index = 0; index < 1_500; index += 1) {
    const beforeSerial = state.lootDropSerial;
    startMission(state, 'herbGathering', 1000 + index * 31_000);
    updateGame(state, 30, 31_000 + index * 31_000);
    const item = state.lootDropSerial > beforeSerial ? state.lootEquipment[0] : null;
    if (item) {
      seenSlots.add(item.slot);
      seenTemplates.add(item.templateId);
      if (item.variant?.rarityId === 'dao') {
        daoDrops += 1;
      }
    }
  }

  assert.deepEqual([...seenSlots].sort(), ['amulet', 'boots', 'jade', 'offhand', 'robe', 'weapon']);
  assert.equal(seenTemplates.size >= 12, true);
  assert.equal(daoDrops > 0, true);
  assert.equal(daoDrops <= 6, true);
});

test('rare loot lock protects high grade drops during batch cleanup', () => {
  const state = createGameState(1000);
  state.lootEquipment = [
    { uid: 'equipped-weapon', templateId: 'qingfengSword', name: '青锋剑', slot: 'weapon', quality: 0, variant: { rarityId: 'common' }, bonuses: { attack: 8 } },
    { uid: 'rare-weapon', templateId: 'bloodCopperBlade', name: '赤铜刃', slot: 'weapon', quality: 2, variant: { rarityId: 'mystic' }, bonuses: { attack: 18 } },
    { uid: 'spare-weapon-a', templateId: 'coldMoonSpear', name: '寒月枪', slot: 'weapon', quality: 0, variant: { rarityId: 'common' }, bonuses: { attack: 6 } },
    { uid: 'spare-weapon-b', templateId: 'qingfengSword', name: '旧青锋剑', slot: 'weapon', quality: 0, variant: { rarityId: 'common' }, bonuses: { attack: 5 } },
  ];
  state.equippedLoot.weapon = 'equipped-weapon';

  const locked = lockRareLootEquipment(state, 'mystic', 2000);
  const organized = organizeLootEquipment(state, 3000);

  assert.equal(locked.locked, 1);
  assert.equal(state.lockedLoot['rare-weapon'], true);
  assert.equal(organized.removed, 1);
  assert.equal(state.lootEquipment.some((item) => item.uid === 'rare-weapon'), true);
  assert.equal(state.lootEquipment.some((item) => item.uid === 'spare-weapon-b'), false);
});

test('batch dismantle can be limited by selected rarity tiers', () => {
  const state = createGameState(1000);
  state.lootEquipment = [
    { uid: 'equipped-weapon', templateId: 'qingfengSword', name: '青锋剑', slot: 'weapon', quality: 0, variant: { rarityId: 'common' }, bonuses: { attack: 8 } },
    { uid: 'best-mystic', templateId: 'bloodCopperBlade', name: '赤铜刃', slot: 'weapon', quality: 2, variant: { rarityId: 'mystic' }, bonuses: { attack: 30 } },
    { uid: 'spare-mystic', templateId: 'coldMoonSpear', name: '寒月枪', slot: 'weapon', quality: 2, variant: { rarityId: 'mystic' }, bonuses: { attack: 16 } },
    { uid: 'spare-spirit', templateId: 'greenJadePendant', name: '青玉佩', slot: 'jade', quality: 1, variant: { rarityId: 'spirit' }, bonuses: { vitality: 12 } },
    { uid: 'spare-common', templateId: 'windtraceBoots', name: '追风履', slot: 'boots', quality: 0, variant: { rarityId: 'common' }, bonuses: { speed: 3 } },
  ];
  state.equippedLoot.weapon = 'equipped-weapon';

  const lowOnly = organizeLootEquipment(state, 2000, { rarityIds: ['common', 'spirit'] });
  const mystic = organizeLootEquipment(state, 3000, { rarityIds: ['mystic'] });

  assert.equal(lowOnly.removed, 2);
  assert.equal(state.lootEquipment.some((item) => item.uid === 'spare-common'), false);
  assert.equal(state.lootEquipment.some((item) => item.uid === 'spare-spirit'), false);
  assert.equal(mystic.removed, 2);
  assert.equal(mystic.reward.bloodEssence >= 2, true);
  assert.equal(state.lootEquipment.some((item) => item.uid === 'best-mystic'), false);
  assert.equal(state.lootEquipment.some((item) => item.uid === 'spare-mystic'), false);
});

test('two matching gear affixes activate set resonance bonuses', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('炼气八层');
  const loadout = {
    weapon: 'swordIntent',
    offhand: 'spiritBell',
  };
  Object.entries(loadout).forEach(([slot, affix]) => {
    state.gear[slot] = 1;
    state.gearQuality[slot] = 1;
    state.gearAffixes[slot] = affix;
  });

  const sets = getGearSetStatus(state);
  const active = sets.find((set) => set.id === 'greenLotusFlow');
  const weapon = getEquipmentDetails(state).gear.find((item) => item.id === 'weapon');

  assert.equal(GEAR_AFFIX_SETS.greenLotusFlow.name, '青莲流影');
  assert.equal(active.active, true);
  assert.equal(active.matched, 2);
  assert.equal(active.total, 6);
  assert.equal(active.activeTier.pieces, 2);
  assert.equal(active.nextTier.pieces, 4);
  assert.equal(active.tiers.find((tier) => tier.pieces === 2).active, true);
  assert.equal(active.tiers.find((tier) => tier.pieces === 4).active, false);
  assert.equal(active.missingAffixes.some((affix) => affix.slot === 'amulet'), true);
  assert.equal(calculatePower(state) > 170, true);
  assert.equal(calculateQiRate(state, 2000) > calculateQiRate(createGameState(1000), 2000), true);
  assert.equal(getMissionStatus(state, 'mistyValley').recommendedPower < 240, true);
  assert.equal(weapon.reroll.preview.warnings[0], '可能使青莲流影失效');
});

test('gear set resonance strengthens at later matching thresholds', () => {
  const twoPiece = createGameState(1000);
  twoPiece.realmIndex = realmIndexByName('炼气八层');
  twoPiece.gear.weapon = 1;
  twoPiece.gear.offhand = 1;
  twoPiece.gearQuality.weapon = 1;
  twoPiece.gearQuality.offhand = 1;
  twoPiece.gearAffixes.weapon = 'swordIntent';
  twoPiece.gearAffixes.offhand = 'spiritBell';

  const sixPiece = createGameState(1000);
  sixPiece.realmIndex = realmIndexByName('炼气八层');
  const loadout = {
    weapon: 'swordIntent',
    offhand: 'spiritBell',
    amulet: 'spiritVein',
    robe: 'cloudStep',
    jade: 'clearJade',
    boots: 'cloudTrace',
  };
  Object.entries(loadout).forEach(([slot, affix]) => {
    sixPiece.gear[slot] = 1;
    sixPiece.gearQuality[slot] = 1;
    sixPiece.gearAffixes[slot] = affix;
  });

  const twoSet = getGearSetStatus(twoPiece).find((set) => set.id === 'greenLotusFlow');
  const sixSet = getGearSetStatus(sixPiece).find((set) => set.id === 'greenLotusFlow');

  assert.equal(twoSet.activeTier.pieces, 2);
  assert.equal(sixSet.activeTier.pieces, 6);
  assert.equal(sixSet.effects.length > twoSet.effects.length, true);
  assert.equal(calculatePower(sixPiece) > calculatePower(twoPiece), true);
  assert.equal(calculateQiRate(sixPiece, 2000) > calculateQiRate(twoPiece, 2000), true);
});

test('gear affix sets align one matching affix with every equipment slot', () => {
  const slots = Object.keys(GEAR).sort();
  const usedAffixes = new Set();

  Object.values(GEAR_AFFIX_SETS).forEach((set) => {
    const setSlots = set.affixes.map((affixId) => GEAR_AFFIXES[affixId]?.slot).sort();
    assert.deepEqual(setSlots, slots, `${set.name} should cover each equipment slot once`);
    set.affixes.forEach((affixId) => {
      assert.equal(Boolean(GEAR_AFFIXES[affixId]), true, `${set.name} contains unknown affix ${affixId}`);
      usedAffixes.add(affixId);
    });
  });
  Object.keys(GEAR_AFFIXES).forEach((affixId) => {
    assert.equal(usedAffixes.has(affixId), true, `${GEAR_AFFIXES[affixId].name} should belong to a set`);
  });
});

test('gear affix reroll reports attribute and set impact', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('炼气八层');
  state.spiritStones = 260;
  state.artifacts = 3;
  state.forgingEssence = 4;
  const loadout = {
    weapon: 'swordIntent',
    offhand: 'spiritBell',
  };
  Object.entries(loadout).forEach(([slot, affix]) => {
    state.gear[slot] = 1;
    state.gearQuality[slot] = 1;
    state.gearAffixes[slot] = affix;
  });

  const rerolled = rerollGearAffix(state, 'weapon', 2000, () => 0);

  assert.equal(rerolled.ok, true);
  assert.equal(rerolled.affix, 'breakerEdge');
  assert.equal(rerolled.impact.powerDelta < 0, true);
  assert.equal(rerolled.impact.setChanges[0].name, '青莲流影');
  assert.equal(rerolled.impact.setChanges[0].beforeMatched, 2);
  assert.equal(rerolled.impact.setChanges[0].afterMatched, 1);
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
  assert.equal(calculateQiRate(state, 2000), 3.31);
  assert.equal(state.activeAlchemy[0].endsAt, 45_000);
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
  assert.equal(chance, 0.94);
  assert.equal(failed.ok, false);
  assert.equal(state.heartDemon, 0);
});

test('stabilizing foundation stops at max without wasting resources', () => {
  const state = createGameState(1000);
  state.spiritStones = 200;
  state.herbs = 50;
  state.foundationStability = 3;

  const result = stabilizeFoundation(state, 1000);

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'maxFoundation');
  assert.equal(state.spiritStones, 200);
  assert.equal(state.herbs, 50);
  assert.equal(state.foundationStability, 3);
});

test('combat missions compare power against danger', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('炼气八层');
  state.qi = 140;
  state.spiritStones = 30;
  state.gear.weapon = 2;
  state.gear.robe = 1;
  state.cultivationPaths.sword = 1;
  state.formations.swordArray = 1;
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
  assert.equal(state.herbs, 23);

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
  assert.equal(state.herbs, 11);
  assert.equal(state.spiritStones, 14);
});

test('mission events grant deterministic extra rewards', () => {
  const state = createGameState(1000);

  startMission(state, 'herbGathering', 1000);
  updateGame(state, 30, 31_000);
  startMission(state, 'herbGathering', 32_000);
  updateGame(state, 30, 62_000);

  assert.equal(MISSION_EVENTS.hiddenHerbPatch.name, '隐蔽药圃');
  assert.equal(state.completedMissions.herbGathering, 2);
  assert.equal(state.herbs, 19);
  assert.equal(state.qi, 11.2);
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

test('dropped loot carries deterministic variant stats beyond the template', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.permanentBonuses.power = 900;
  state.completedMissions.cavePatrol = 1;

  startMission(state, 'cavePatrol', 1000);
  updateGame(state, 55, 56_000);

  const item = state.lootEquipment[0];

  assert.equal(item.templateId, 'cloudthreadRobe');
  assert.ok(item.variant);
  assert.ok(item.variant.name);
  assert.equal(['metal', 'wood', 'earth', 'water', 'fire', 'dark', 'light'].includes(item.element), true);
  assert.equal(Object.keys(item.variant.bonuses).length > 0, true);
  assert.equal(Object.keys(item.bonuses).some((key) => item.bonuses[key] !== LOOT_EQUIPMENT.cloudthreadRobe.bonuses[key]), true);
});

test('loot rarity tiers deepen affix pools without binding strengthening to items', () => {
  const state = reviveGameState({
    lootEquipment: [
      {
        uid: 'common-sword',
        templateId: 'qingfengSword',
        level: 0,
        variant: { rarityId: 'common', affixIds: ['edge'], element: 'metal' },
      },
      {
        uid: 'dao-sword',
        templateId: 'qingfengSword',
        level: 0,
        variant: { rarityId: 'dao', affixIds: ['edge', 'pierce', 'spark'], element: 'fire' },
      },
    ],
  }, 1000);

  const details = getEquipmentDetails(state).loot;
  const common = details.find((item) => item.uid === 'common-sword');
  const dao = details.find((item) => item.uid === 'dao-sword');

  assert.equal(RARITY_TIERS.find((tier) => tier.id === 'dao').name, '道器');
  assert.equal(common.rarity.name, '凡品');
  assert.equal(dao.rarity.name, '道器');
  assert.equal(common.variant.affixes.length, 1);
  assert.equal(dao.variant.affixes.length, 3);
  assert.equal(dao.slotLevel, common.slotLevel);
  assert.equal(dao.maxLevel, common.maxLevel);
  assert.equal(dao.effects.find((effect) => effect.id === 'attack').value > common.effects.find((effect) => effect.id === 'attack').value, true);
});

test('repeated loot drops advance the rarity pool instead of repeating one variant', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.gear.weapon = 12;
  state.gear.robe = 9;
  state.cultivationPaths.sword = 6;
  state.formations.swordArray = 6;
  state.permanentBonuses.power = 900;

  for (let index = 0; index < 36; index += 1) {
    const startAt = 1000 + index * 150_000;
    startMission(state, 'ancientSwordTomb', startAt, 'relicSearch');
    updateGame(state, 140, startAt + 141_000);
  }

  const uids = new Set(state.lootEquipment.map((item) => item.uid));
  const rarityIds = new Set(state.lootEquipment.map((item) => item.variant.rarityId));

  assert.equal(uids.size, state.lootEquipment.length);
  assert.equal(rarityIds.size > 1, true);
  assert.equal([...rarityIds].some((id) => id !== 'common'), true);
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
  state.mapDepths.qinglanMountain = 2;
  const readyStatus = getMapStatuses(state).find((map) => map.id === 'qinglanMountain');
  assert.equal(MISSION_MAPS.qinglanMountain.boss.name, '青岚山魈');
  assert.equal(readyStatus.exploration.completed, 5);
  assert.equal(readyStatus.boss.status, 'ready');

  const defeated = challengeMapBoss(state, 'qinglanMountain', 2000);
  const repeated = challengeMapBoss(state, 'qinglanMountain', 3000);

  assert.equal(defeated.ok, true);
  assert.equal(defeated.battle.outcome, 'victory');
  assert.equal(defeated.battle.rounds.length > 0, true);
  assert.equal(defeated.battle.rounds.some((round) => round.damage > 0), true);
  assert.equal(state.defeatedBosses.qinglanMountain, true);
  assert.equal(state.permanentBonuses.power, 24);
  assert.equal(state.forgingEssence, 2);
  assert.equal(repeated.ok, false);
  assert.equal(repeated.reason, 'alreadyDefeated');
});

test('boss battle simulation reacts to elemental gear and records rounds', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.gear.weapon = 4;
  state.gear.amulet = 2;
  state.gear.robe = 2;
  state.gearQuality.weapon = 2;
  state.gearAffixes.weapon = 'flameEdge';
  state.gearAffixes.amulet = 'spiritVein';
  state.gearAffixes.robe = 'earthWard';

  const battle = simulateBossBattle(state, 'swordTomb', 2000);

  assert.equal(battle.player.element.id, 'fire');
  assert.equal(battle.enemy.element.id, 'metal');
  assert.equal(['victory', 'defeat'].includes(battle.outcome), true);
  assert.equal(battle.rounds.length > 0, true);
  assert.equal(battle.rounds[0].actor, 'player');
  assert.equal(typeof battle.rounds[0].damage, 'number');
  assert.equal(battle.summary.includes('回合'), true);
});

test('map bosses scale into multi-round checks after depth progress', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基六层');
  state.gear.weapon = 8;
  state.gear.amulet = 5;
  state.gear.robe = 6;
  state.cultivationPaths.sword = 5;
  state.formations.swordArray = 4;
  state.permanentBonuses.power = 1200;

  const first = simulateBossBattle(state, 'swordTomb', 2000, () => 0.5);
  state.mapDepths.swordTomb = 6;
  state.mapReputation.swordTomb = 72;
  const deepened = simulateBossBattle(state, 'swordTomb', 3000, () => 0.5);

  assert.equal(deepened.enemy.maxHp > first.enemy.maxHp, true);
  assert.equal(deepened.rounds.some((round) => round.actor === 'enemy'), true);
});

test('turn battles convert defense into nonlinear mitigation instead of flat subtraction', () => {
  const exposed = createGameState(1000);
  exposed.realmIndex = realmIndexByName('筑基一层');

  const guarded = createGameState(1000);
  guarded.realmIndex = realmIndexByName('筑基一层');
  guarded.gear.robe = 8;
  guarded.gear.amulet = 6;
  guarded.gearQuality.robe = 2;
  guarded.gearAffixes.robe = 'guardedBody';
  guarded.lootEquipment = [
    { uid: 'guard-robe', templateId: 'cloudthreadRobe', name: '玄守法袍', slot: 'robe', quality: 2, level: 3, element: 'earth', bonuses: { defense: 180, vitality: 80 } },
  ];
  guarded.equippedLoot.robe = 'guard-robe';

  const exposedBattle = simulateBossBattle(exposed, 'swordTomb', 2000, () => 0.5);
  const guardedBattle = simulateBossBattle(guarded, 'swordTomb', 2000, () => 0.5);
  const exposedHit = exposedBattle.rounds.find((round) => round.actor === 'enemy');
  const guardedHit = guardedBattle.rounds.find((round) => round.actor === 'enemy');

  assert.equal(Boolean(exposedHit), true);
  assert.equal(Boolean(guardedHit), true);
  assert.equal(guardedHit.damage < exposedHit.damage, true);
  assert.equal(guardedHit.defenseMitigation > exposedHit.defenseMitigation, true);
  assert.equal(guardedHit.mitigated > 0, true);
  assert.equal(guardedHit.damage > 1, true);
});

test('combat profile makes blood essence a real endurance pool', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.permanentBonuses.power = 1000;

  const profile = getCombatProfile(state);

  assert.equal(profile.vitality.value > profile.attack.value * 2, true);
  assert.equal(profile.vitality.sources.some((source) => source.label === '道行养命'), true);
});

test('speed changes initiative and softens incoming hits', () => {
  const slow = createGameState(1000);
  slow.realmIndex = realmIndexByName('炼气一层');
  slow.permanentBonuses.power = 1500;

  const fast = createGameState(1000);
  fast.realmIndex = realmIndexByName('炼气一层');
  fast.permanentBonuses.power = 1500;
  fast.gear.boots = 12;

  const slowBattle = simulateBossBattle(slow, 'ancientRuins', 2000, () => 0.5);
  const fastBattle = simulateBossBattle(fast, 'ancientRuins', 2000, () => 0.5);
  const slowEnemyHit = slowBattle.rounds.find((round) => round.actor === 'enemy');
  const fastEnemyHit = fastBattle.rounds.find((round) => round.actor === 'enemy');

  assert.equal(slowBattle.rounds[0].actor, 'enemy');
  assert.equal(fastBattle.rounds[0].actor, 'player');
  assert.equal(fastEnemyHit.speedMitigation > slowEnemyHit.speedMitigation, true);
  assert.equal(fastEnemyHit.damage < slowEnemyHit.damage, true);
});

test('guarded body dampens critical spikes', () => {
  const exposed = createGameState(1000);
  exposed.realmIndex = realmIndexByName('筑基一层');

  const guarded = createGameState(1000);
  guarded.realmIndex = realmIndexByName('筑基一层');
  guarded.gear.robe = 10;
  guarded.gear.amulet = 6;
  guarded.lootEquipment = [
    { uid: 'ward-robe', templateId: 'cloudthreadRobe', name: '镇岳法袍', slot: 'robe', quality: 3, level: 4, element: 'earth', bonuses: { defense: 260, vitality: 120 } },
  ];
  guarded.equippedLoot.robe = 'ward-robe';

  const exposedBattle = simulateBossBattle(exposed, 'swordTomb', 2000, () => 0);
  const guardedBattle = simulateBossBattle(guarded, 'swordTomb', 2000, () => 0);
  const exposedHit = exposedBattle.rounds.find((round) => round.actor === 'enemy');
  const guardedHit = guardedBattle.rounds.find((round) => round.actor === 'enemy');

  assert.equal(exposedHit.critical, true);
  assert.equal(guardedHit.critical, true);
  assert.equal(guardedHit.critMultiplier < exposedHit.critMultiplier, true);
  assert.equal(guardedHit.damage < exposedHit.damage, true);
});

test('rare percent combat bonuses use a soft cap', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('金丹一转');
  state.lootEquipment = [
    { uid: 'rare-blade', templateId: 'qingfengSword', name: '道器青锋', slot: 'weapon', quality: 5, level: 0, element: 'metal', bonuses: { attack: 120, attackPct: 1.2, elementPower: 80 } },
    { uid: 'rare-robe', templateId: 'cloudthreadRobe', name: '道器法袍', slot: 'robe', quality: 5, level: 0, element: 'earth', bonuses: { defense: 100, defensePct: 0.9, vitality: 180, vitalityPct: 1.1 } },
  ];
  state.equippedLoot.weapon = 'rare-blade';
  state.equippedLoot.robe = 'rare-robe';

  const profile = getCombatProfile(state);

  assert.equal(profile.attack.percentBonus > 0.2, true);
  assert.equal(profile.attack.percentBonus <= 0.56, true);
  assert.equal(profile.vitality.percentBonus <= 0.56, true);
  assert.equal(profile.attack.value < profile.attack.baseValue * 1.7, true);
});

test('winning boss battles settle without failure diagnosis', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.permanentBonuses.power = 5000;

  const battle = simulateBossBattle(state, 'qinglanMountain', 2000);

  assert.equal(battle.outcome, 'victory');
  assert.equal(battle.diagnosis, null);
});

test('failed boss battles explain the most useful preparation lever', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.gear.weapon = 1;
  state.gear.amulet = 1;
  state.gear.robe = 1;

  const battle = simulateBossBattle(state, 'demonRift', 2000);

  assert.equal(battle.outcome, 'defeat');
  assert.equal(battle.diagnosis.outcome, 'defeat');
  assert.equal(['锋芒不足', '护体不足', '血元不足', '灵根受制'].includes(battle.diagnosis.title), true);
  assert.equal(battle.diagnosis.advice.length > 0, true);
  assert.match(battle.diagnosis.advice, /随行|丹息|阵势/);
  assert.doesNotMatch(battle.diagnosis.advice, /清心丹|护脉丹|培养出战灵兽|剑阵与护山阵/);
  assert.equal(typeof battle.diagnosis.playerDamage, 'number');
  assert.equal(typeof battle.diagnosis.enemyRemainingHp, 'number');
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
  state.mapDepths.qinglanMountain = 2;
  state.gear.weapon = 2;
  state.claimedGoals.realmTwo = true;
  state.sectDisciples = 1;

  assert.equal(getNextGuidance(state).title, '挑战青岚山魈');
});

test('next guidance explains sect and major breakthrough preparation', () => {
  const sectState = createGameState(1000);
  sectState.realmIndex = 2;
  sectState.completedMissions.cavePatrol = 1;
  sectState.claimedGoals.firstPatrol = true;
  sectState.claimedGoals.realmTwo = true;

  const sectGuidance = getNextGuidance(sectState);
  assert.equal(sectGuidance.title, '先备山门供给');
  assert.equal(sectGuidance.targetId, 'herbGathering');

  const gateState = createGameState(1000);
  gateState.realmIndex = realmIndexByName('炼气九层');
  gateState.qi = REALMS[gateState.realmIndex].requiredQi;
  gateState.spiritStones = 35;
  gateState.herbs = 8;
  gateState.claimedGoals.firstPatrol = true;
  gateState.claimedGoals.realmTwo = true;
  gateState.claimedGoals.spiritField = true;
  gateState.claimedGoals.firstPill = true;
  gateState.claimedChapterRewards.qinglanStart = true;

  const gateGuidance = getNextGuidance(gateState);
  assert.equal(gateGuidance.title, '叩关前先稳根基');
  assert.equal(gateGuidance.action, 'stabilize');
});

test('next guidance pulls spirit beasts into the preparation loop', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.spiritStones = 400;
  state.herbs = 60;
  state.beastCores = 4;
  state.sectDisciples = 1;
  state.claimedChapterRewards.qinglanStart = true;
  state.claimedGoals.foundationRealm = true;
  state.claimedGoals.firstPath = true;
  state.claimedGoals.firstArmament = true;

  const guidance = getNextGuidance(state);

  assert.match(guidance.title, /灵兽/);
  assert.equal(guidance.tab, 'gear');
  assert.equal(guidance.targetId, 'beasts');
});

test('next guidance does not send newly founded players into a doomed map', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.claimedChapterRewards.qinglanStart = true;
  state.claimedGoals.foundationRealm = true;
  state.claimedGoals.firstPath = true;
  state.claimedGoals.firstArmament = true;
  state.cultivationPaths.sword = 1;
  state.gear.weapon = 1;
  state.gear.robe = 1;
  state.sectDisciples = 1;

  const guidance = getNextGuidance(state);

  assert.equal(guidance.targetId, 'mistyValley');
  assert.equal(guidance.tab, 'missions');
  assert.match(guidance.title, /筑基初稳/);
  assert.match(guidance.detail, /古剑冢/);
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

test('next guidance prioritizes claimable chapter rewards after objectives are claimed', () => {
  const state = createGameState(1000);
  state.realmIndex = 1;
  state.buildings.spiritField = 1;
  state.completedMissions.cavePatrol = 1;
  state.craftedPills = 1;

  for (const goal of getMainlineChapters(state)[0].objectives) {
    claimGoalReward(state, goal.id, 1000);
  }

  const guidance = getNextGuidance(state);

  assert.equal(guidance.action, 'claimChapter');
  assert.equal(guidance.tab, 'goals');
  assert.equal(guidance.targetId, 'qinglanStart');
  assert.match(guidance.title, /领取青岚初启/);
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

test('resource guidance does not point array flag shortages to qinglan relic search', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('炼气五层');
  state.spiritStones = 2_000;
  state.herbs = 2_000;
  state.beastCores = 40;
  state.arrayFlags = 0;
  state.artifacts = 40;
  state.forgingEssence = 40;
  state.formations.spiritGathering = 1;
  state.formations.mountainGuard = 1;

  const guidance = getResourceGuidance(state);

  assert.equal(guidance.primary.resource, 'arrayFlags');
  assert.notEqual(guidance.primary.route.mapId, 'qinglanMountain');
  assert.equal(guidance.primary.market.id, 'arrayManual');
});

test('midgame spirit stone guidance stays on progression maps', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.spiritStones = 0;
  state.herbs = 300;
  state.beastCores = 60;
  state.artifacts = 60;
  state.arrayFlags = 60;
  state.forgingEssence = 60;
  state.sectDisciples = 2;

  const guidance = getResourceGuidance(state);

  assert.equal(guidance.primary.resource, 'spiritStones');
  assert.equal(guidance.primary.route.mapId, 'swordTomb');
  assert.equal(guidance.primary.route.approachId, 'balanced');
  assert.equal(guidance.primary.route.stable, false);
  assert.equal(['mistyValley', 'herbValley'].includes(guidance.primary.route.fallback.mapId), true);
  assert.equal(guidance.primary.commission.id, 'mine');
});

test('loot dismantling creates strengthening material and empowerment improves the slot', () => {
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
  assert.equal(state.forgingEssence >= 6, true);
  assert.equal(state.artifacts, 8);

  state.spiritStones = 200;
  const item = state.lootEquipment[0];
  const beforeBonuses = { ...item.bonuses };
  state.gear[item.slot] = 0;
  equipLootEquipment(state, item.uid, 425_000);
  const before = calculatePower(state);
  const empowered = empowerLootEquipment(state, item.uid, 426_000);

  assert.equal(empowered.ok, true);
  assert.equal(empowered.slot, item.slot);
  assert.equal(state.gear[item.slot], 1);
  assert.equal(state.lootEquipment[0].level, 0);
  assert.deepEqual(state.lootEquipment[0].bonuses, beforeBonuses);
  assert.equal(calculatePower(state) - before, GEAR[item.slot].powerPerLevel);
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
  const weapon = details.gear.find((item) => item.id === 'weapon');
  const equipped = details.loot.find((item) => item.uid === 'equipped-sword');
  const better = details.loot.find((item) => item.uid === 'better-sword');
  const weak = details.loot.find((item) => item.uid === 'weak-sword');

  assert.equal(locked.ok, true);
  assert.equal(weapon.equippedLoot.name, '旧青锋剑');
  assert.equal(equipped.comparison.score, 40);
  assert.equal(equipped.comparison.scoreDelta, 0);
  assert.equal(better.comparison.againstName, '旧青锋剑');
  assert.equal(better.comparison.score, 60);
  assert.equal(weak.comparison.score, 28);
  assert.equal(weak.comparison.scoreDelta, -12);
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

test('loot organize strategy can preserve best item per slot while cleaning selected tiers', () => {
  const state = createGameState(1000);
  state.lootEquipment = [
    { uid: 'equipped-sword', templateId: 'qingfengSword', name: '旧青锋剑', slot: 'weapon', quality: 1, variant: { rarityId: 'spirit' }, bonuses: { power: 36 } },
    { uid: 'better-sword', templateId: 'qingfengSword', name: '新青锋剑', slot: 'weapon', quality: 1, variant: { rarityId: 'spirit' }, bonuses: { power: 60 } },
    { uid: 'weak-sword', templateId: 'bloodCopperBlade', name: '残赤铜刀', slot: 'weapon', quality: 0, variant: { rarityId: 'common' }, bonuses: { power: 20 } },
    { uid: 'only-boots', templateId: 'windtraceBoots', name: '追风履', slot: 'boots', quality: 0, variant: { rarityId: 'common' }, bonuses: { speed: 3 } },
  ];
  state.equippedLoot.weapon = 'equipped-sword';

  const organized = organizeLootEquipment(state, 2000, {
    rarityIds: ['common', 'spirit'],
    keepStrategy: 'bestPerSlot',
  });

  assert.equal(organized.removed, 1);
  assert.equal(state.lootEquipment.some((item) => item.uid === 'better-sword'), true);
  assert.equal(state.lootEquipment.some((item) => item.uid === 'only-boots'), true);
  assert.equal(state.lootEquipment.some((item) => item.uid === 'weak-sword'), false);
});

test('loot batch dismantle remains repeatable after new eligible drops', () => {
  const state = createGameState(1000);
  state.lootEquipment = [
    { uid: 'equipped-sword', templateId: 'qingfengSword', name: '旧青锋剑', slot: 'weapon', quality: 1, variant: { rarityId: 'spirit' }, bonuses: { power: 36 } },
    { uid: 'weak-sword', templateId: 'bloodCopperBlade', name: '残赤铜刀', slot: 'weapon', quality: 0, variant: { rarityId: 'common' }, bonuses: { power: 20 } },
  ];
  state.equippedLoot.weapon = 'equipped-sword';

  const first = organizeLootEquipment(state, 2000, { rarityIds: ['common'], keepStrategy: 'equippedOnly' });
  state.lootEquipment.push({ uid: 'weak-boots', templateId: 'windtraceBoots', name: '残云履', slot: 'boots', quality: 0, variant: { rarityId: 'common' }, bonuses: { speed: 2 } });
  const second = organizeLootEquipment(state, 3000, { rarityIds: ['common'], keepStrategy: 'equippedOnly' });

  assert.equal(first.removed, 1);
  assert.equal(second.removed, 1);
  assert.equal(state.lootEquipment.some((item) => item.uid === 'weak-boots'), false);
});

test('equipment details expose build school tags for loot decisions', () => {
  const state = reviveGameState({
    lootEquipment: [
      { uid: 'blade', templateId: 'bloodCopperBlade', variant: { rarityId: 'earthFiend', affixIds: ['edge', 'spark'], element: 'fire' } },
      { uid: 'robe', templateId: 'mountainPatternRobe', variant: { rarityId: 'spirit', affixIds: ['steadyBreath'], element: 'earth' } },
    ],
  }, 1000);

  const details = getEquipmentDetails(state);
  const blade = details.loot.find((item) => item.uid === 'blade');
  const robe = details.loot.find((item) => item.uid === 'robe');

  assert.equal(blade.buildTags.some((tag) => tag.id === 'swordRuin'), true);
  assert.equal(blade.primaryBuild.name, '剑煞');
  assert.equal(robe.buildTags.some((tag) => tag.id === 'earthGuard'), true);
});

test('progress plan explains the next cultivation loop without exposing raw internals', () => {
  const state = createGameState(1000);
  state.completedMissions.herbGathering = 5;
  state.mapDepths.qinglanMountain = 1;
  state.permanentBonuses.power = 40;

  const plan = getProgressPlan(state, 1000);

  assert.equal(plan.realm.name, REALMS[state.realmIndex].name);
  assert.equal(plan.cards.length >= 4, true);
  assert.equal(plan.cards.some((card) => card.id === 'realm'), true);
  assert.equal(plan.cards.some((card) => card.id === 'depth'), true);
  assert.equal(plan.cards.some((card) => card.id === 'boss'), true);
  assert.equal(plan.actions.some((action) => action.tab === 'missions'), true);
});

test('map bosses ask for a small depth foothold before challenge readiness', () => {
  const state = createGameState(1000);
  state.permanentBonuses.power = 1000;
  state.completedMissions.herbGathering = MISSION_MAPS.qinglanMountain.explorationTarget;

  const before = getMapStatuses(state).find((map) => map.id === 'qinglanMountain');
  const denied = challengeMapBoss(state, 'qinglanMountain', 2000);
  state.mapDepths.qinglanMountain = before.boss.depthGate.required;
  const after = getMapStatuses(state).find((map) => map.id === 'qinglanMountain');

  assert.equal(before.boss.status, 'depthLocked');
  assert.equal(before.boss.depthGate.ready, false);
  assert.equal(denied.reason, 'depthLocked');
  assert.equal(after.boss.status, 'ready');
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
  assert.equal(weapon.refinement.nextQualityName, '初火');
  assert.equal(weapon.refinement.chance, 0.82);
});

test('formations treasures and spirit beasts expose rarity milestones', () => {
  const state = createGameState(1000);
  state.formations.swordArray = 7;
  state.treasures.lifeBoundSeal = 4;
  state.spiritBeasts.thunderTiger = 1;

  const details = getEquipmentDetails(state);
  const swordArray = details.formations.find((item) => item.id === 'swordArray');
  const seal = details.treasures.find((item) => item.id === 'lifeBoundSeal');
  const tiger = details.spiritBeasts.find((item) => item.id === 'thunderTiger');

  assert.equal(swordArray.rarity.name, '地煞');
  assert.equal(seal.rarity.name, '玄纹');
  assert.equal(seal.nextRarity.name, '地煞');
  assert.equal(tiger.rarity.name, '玄纹');
});

test('loot empowerment uses slot tiered materials and inherits across replacements', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.gear.weapon = 0;
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
  const crossed = empowerLootEquipment(state, item.uid, 145_000);
  const second = reviveGameState({
    gear: state.gear,
    lootEquipment: [
      { uid: 'fresh-sword', templateId: 'qingfengSword', variant: { rarityId: 'common', affixIds: ['edge'], element: 'metal' } },
    ],
  }, 146_000);
  const fresh = getEquipmentDetails(second).loot[0];

  assert.equal(crossed.ok, true);
  assert.equal(item.level, 0);
  assert.equal(state.gear.weapon, 4);
  assert.equal(getLootEmpowerCost(4).artifacts, 1);
  assert.equal(fresh.slotLevel, 4);
  assert.equal(fresh.effects.find((effect) => effect.id === 'power').value, item.bonuses.power);
});

test('equipped elemental trophies awaken loot resonance', () => {
  const state = createGameState(1000);
  state.lootEquipment = [
    { uid: 'fire-sword', templateId: 'qingfengSword', name: '离火青锋剑', slot: 'weapon', quality: 1, level: 1, element: 'fire', bonuses: { power: 40, attack: 28, elementPower: 18 } },
    { uid: 'fire-wheel', templateId: 'xuanmingWheel', name: '离火玄鸣轮', slot: 'offhand', quality: 1, level: 1, element: 'fire', bonuses: { power: 24, attack: 12, elementPower: 12 } },
    { uid: 'fire-robe', templateId: 'cloudthreadRobe', name: '离火云纹袍', slot: 'robe', quality: 1, level: 1, element: 'fire', bonuses: { defense: 24, dangerReduction: 18, elementPower: 16 } },
    { uid: 'fire-amulet', templateId: 'xuanmuAmulet', name: '离火玄木符', slot: 'amulet', quality: 1, level: 1, element: 'fire', bonuses: { vitality: 42, qiRate: 0.03, elementPower: 14 } },
  ];
  state.equippedLoot = { weapon: 'fire-sword', offhand: 'fire-wheel', robe: 'fire-robe', amulet: 'fire-amulet', jade: null, boots: null };

  const resonance = getLootResonanceStatus(state);
  const combat = getCombatProfile(state);
  const details = getEquipmentDetails(state);

  assert.equal(resonance.active, true);
  assert.equal(resonance.element.id, 'fire');
  assert.equal(resonance.matched, 4);
  assert.equal(resonance.total, 6);
  assert.equal(resonance.effects.some((effect) => effect.id === 'attack'), true);
  assert.equal(combat.attack.sources.some((source) => source.label === '战利共鸣'), true);
  assert.equal(combat.elementPower.sources.some((source) => source.label.includes('战利共鸣')), true);
  assert.equal(details.lootResonance.active, true);
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
  assert.equal(calculateQiRate(state, 88_000), 3.3);
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
  assert.equal(unlocked.recommendedPower >= 400, true);
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

test('prepared mission routes keep a residual omen after heavy safety stacking', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('金丹四转');
  state.gear.weapon = 12;
  state.gear.offhand = 12;
  state.gear.amulet = 12;
  state.gear.robe = 12;
  state.gear.jade = 12;
  state.gear.boots = 12;
  state.gearAffixes.weapon = 'swordIntent';
  state.gearAffixes.offhand = 'spiritBell';
  state.gearAffixes.amulet = 'spiritVein';
  state.gearAffixes.robe = 'cloudStep';
  state.gearAffixes.jade = 'clearJade';
  state.gearAffixes.boots = 'cloudTrace';
  state.gearQuality.weapon = 3;
  state.gearQuality.offhand = 3;
  state.gearQuality.amulet = 3;
  state.gearQuality.robe = 3;
  state.gearQuality.jade = 3;
  state.gearQuality.boots = 3;
  state.cultivationPaths.sword = 12;
  state.formations.swordArray = 12;
  state.buildings.swordArray = 12;
  state.completedMissions.ancientRuins = 30;
  state.mapReputation.ancientRuins = 160;
  state.permanentBonuses.power = 3000;
  state.lootEquipment = [
    { uid: 'warded-relic', templateId: 'cloudthreadRobe', name: '避劫旧袍', slot: 'robe', quality: 3, bonuses: { dangerReduction: 5000 } },
  ];
  state.equippedLoot.robe = 'warded-relic';

  const route = getMissionStatus(state, 'ancientRuins');

  assert.equal(route.unlocked, true);
  assert.equal(route.recommendedPower >= Math.round(MISSIONS.ancientRuins.danger * 0.24), true);
  assert.equal(['平', '小吉'].includes(route.omen.name), true);
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

test('late map route pressure stays below same map boss wall', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('金丹四转');
  state.gear.weapon = 9;
  state.gear.robe = 9;
  state.gear.amulet = 9;
  state.cultivationPaths.sword = 9;
  state.formations.swordArray = 9;

  const route = getMissionStatus(state, 'ancientRuins');
  const boss = getMapStatuses(state).find((map) => map.id === 'ancientRuins').boss;

  assert.equal(route.recommendedPower < boss.power * 1.5, true);
});

test('map readiness separates realm unlock from stable travel', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.gear.weapon = 2;
  state.gear.robe = 1;
  state.cultivationPaths.sword = 1;
  state.formations.swordArray = 1;

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
  state.gear.weapon = 3;
  state.gear.robe = 1;
  state.cultivationPaths.sword = 1;
  state.formations.swordArray = 1;

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
  updateGame(state, 900, 901_000);

  const sect = getSectStatus(state);

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(assignedHerbs.ok, true);
  assert.equal(assignedPatrol.ok, true);
  assert.equal(sect.disciples, 2);
  assert.equal(sect.assigned, 2);
  assert.equal(state.herbs > 0, true);
  assert.equal(state.sectReputation, 10);
  assert.equal(state.beastCores, 2);
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

test('sect mining remains supplemental rather than replacing travel income', () => {
  function preparedSect() {
    const state = createGameState(1000);
    state.realmIndex = realmIndexByName('筑基一层');
    state.spiritStones = 2_000;
    state.herbs = 600;
    recruitDisciple(state, 1000);
    recruitDisciple(state, 2000);
    recruitDisciple(state, 3000);
    return state;
  }

  const baseline = preparedSect();
  const state = preparedSect();
  assignSectDisciple(state, 'mine', 1, 4000);
  assignSectDisciple(state, 'mine', 1, 5000);
  assignSectDisciple(state, 'mine', 1, 6000);
  const before = state.spiritStones;
  const baselineBefore = baseline.spiritStones;
  updateGame(baseline, 3600, 3_607_000);
  updateGame(state, 3600, 3_607_000);

  const miningGain = (state.spiritStones - before) - (baseline.spiritStones - baselineBefore);

  assert.equal(miningGain <= 420, true);
  assert.equal(state.sectReputation <= 54, true);
});

test('bloodlines and sect skills create long term growth layers', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.spiritStones = 4_000;
  state.herbs = 900;
  state.beastCores = 80;
  state.artifacts = 80;
  state.forgingEssence = 80;
  state.bloodEssence = 12;
  state.sectReputation = 160;

  const baseQiRate = calculateQiRate(state, 1000);
  const basePower = calculatePower(state);
  const blood = awakenBloodline(state, 'whiteTigerBlood', 2000);
  const skill = upgradeSectSkill(state, 'forgingEdict', 3000);
  const details = getEquipmentDetails(state);
  const profile = getCharacterProfile(state, 4000);

  assert.equal(BLOODLINES.whiteTigerBlood.name, '白虎血');
  assert.equal(blood.ok, true);
  assert.equal(skill.ok, true);
  assert.equal(state.bloodlines.whiteTigerBlood, 1);
  assert.equal(state.sectSkills.forgingEdict, 1);
  assert.equal(calculatePower(state) > basePower, true);
  assert.equal(calculateQiRate(state, 4000) >= baseQiRate, true);
  assert.equal(details.bloodlines.some((item) => item.id === 'whiteTigerBlood' && item.level === 1), true);
  assert.equal(profile.attributes.some((attribute) => attribute.id === 'bloodline'), true);
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

test('repeated permanent opportunities fall back to material rewards', () => {
  const state = createGameState(1000);
  state.activeOpportunity = { id: 'swordEcho', missionId: 'ancientSwordTomb', createdAt: 1000 };
  state.artifacts = 2;

  const firstPower = state.permanentBonuses.power;
  const first = resolveOpportunity(state, 'temperSword', 2000, () => 0);
  state.activeOpportunity = { id: 'swordEcho', missionId: 'ancientSwordTomb', createdAt: 3000 };
  const secondPower = state.permanentBonuses.power;
  const second = resolveOpportunity(state, 'temperSword', 4000, () => 0);

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(state.permanentBonuses.power - firstPower, 18);
  assert.equal(state.permanentBonuses.power - secondPower, 0);
  assert.equal(second.repeat, true);
  assert.equal(second.reward.powerBonus ?? 0, 0);
  assert.equal(second.reward.forgingEssence > 0, true);
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

test('spirit beasts separate collection effects from deployed battle effects', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('炼气八层');
  state.mapDepths.mistyValley = 2;
  state.spiritStones = 2_000;
  state.herbs = 800;
  state.beastCores = 80;

  trainSpiritBeast(state, 'cloudFox', 1000);
  trainSpiritBeast(state, 'thunderTiger', 2000);
  const deployed = deploySpiritBeast(state, 'thunderTiger', 3000);
  const details = getEquipmentDetails(state).spiritBeasts;
  const fox = details.find((beast) => beast.id === 'cloudFox');
  const tiger = details.find((beast) => beast.id === 'thunderTiger');
  const combat = getCombatProfile(state);

  assert.equal(deployed.ok, true);
  assert.equal(tiger.deployed, true);
  assert.equal(fox.deployed, false);
  assert.equal(fox.collectionEffects.some((effect) => effect.id === 'qiRate'), true);
  assert.equal(tiger.battleEffects.some((effect) => effect.id === 'attack'), true);
  assert.equal(combat.attack.sources.some((source) => source.label === '出战灵兽'), true);
});

test('rare spirit beasts are visible but locked behind realm and exploration clues', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.spiritStones = 20_000;
  state.herbs = 20_000;
  state.beastCores = 500;
  state.bloodEssence = 200;
  state.forgingEssence = 200;
  state.insight = 80;

  const details = getEquipmentDetails(state).spiritBeasts;
  const dragon = details.find((beast) => beast.id === 'floodDragon');
  const locked = trainSpiritBeast(state, 'floodDragon', 2000);

  assert.equal(Boolean(dragon), true);
  assert.equal(dragon.unlock.unlocked, false);
  assert.equal(dragon.unlock.requirements.length > 0, true);
  assert.equal(locked.ok, false);
  assert.equal(locked.reason, 'locked');

  state.realmIndex = realmIndexByName('元婴一变');
  state.mapDepths.ancientRuins = 6;
  state.defeatedBosses.ancientRuins = true;
  const unlocked = getEquipmentDetails(state).spiritBeasts.find((beast) => beast.id === 'floodDragon');
  const trained = trainSpiritBeast(state, 'floodDragon', 3000);

  assert.equal(unlocked.unlock.unlocked, true);
  assert.equal(trained.ok, true);
  assert.equal(state.spiritBeasts.floodDragon, 1);
});

test('spirit beasts expose bloodline quality and differentiated growth', () => {
  const state = createGameState(1000);
  const beasts = Object.values(SPIRIT_BEASTS);
  const qualities = new Set(beasts.map((beast) => beast.qualityId));
  const details = getEquipmentDetails(state).spiritBeasts;
  const fox = details.find((beast) => beast.id === 'cloudFox');
  const dragon = details.find((beast) => beast.id === 'floodDragon');

  assert.equal(beasts.length >= 12, true);
  ['wild', 'spirit', 'mystic', 'earth', 'heaven', 'ancient'].forEach((qualityId) => {
    assert.equal(qualities.has(qualityId), true);
  });
  assert.equal(dragon.quality.name, '古血');
  assert.equal(dragon.growthMultiplier > fox.growthMultiplier, true);
  assert.equal(dragon.maxLevel > fox.maxLevel, true);
});

test('training the first spirit beast reports automatic deployment', () => {
  const state = createGameState(1000);
  state.spiritStones = 500;
  state.herbs = 100;
  state.beastCores = 8;

  const result = trainSpiritBeast(state, 'cloudFox', 2000);

  assert.equal(result.ok, true);
  assert.equal(result.autoDeployed, true);
  assert.equal(state.activeSpiritBeast, 'cloudFox');
});

test('deployed spirit beasts join turn battles as their own actor', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.gear.weapon = 3;
  state.gear.amulet = 2;
  state.gear.robe = 2;
  state.spiritBeasts.thunderTiger = 3;
  deploySpiritBeast(state, 'thunderTiger', 1000);

  const battle = simulateBossBattle(state, 'swordTomb', 2000);

  assert.equal(battle.pet.name, '雷纹幼虎');
  assert.equal(battle.rounds.some((round) => round.actor === 'beast'), true);
  assert.equal(battle.rounds.some((round) => round.actorName === '雷纹幼虎' && round.damage > 0), true);
});

test('deployed spirit beasts trigger named battle techniques', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('筑基一层');
  state.gear.weapon = 2;
  state.gear.amulet = 4;
  state.gear.robe = 4;
  state.spiritBeasts.thunderTiger = 4;
  deploySpiritBeast(state, 'thunderTiger', 1000);

  const battle = simulateBossBattle(state, 'demonRift', 2000, () => 0.5);
  const skillRound = battle.rounds.find((round) => round.actor === 'beast' && round.skillName);

  assert.equal(battle.pet.skillName, SPIRIT_BEASTS.thunderTiger.skill.name);
  assert.equal(skillRound.skillName, SPIRIT_BEASTS.thunderTiger.skill.name);
  assert.equal(skillRound.damage > 0, true);
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
  assert.equal(profile.attributes.some((attribute) => attribute.id === 'combatAttack' && attribute.value > 0), true);
  assert.equal(profile.attributes.some((attribute) => attribute.id === 'elementPower'), true);
  assert.equal(profile.attributes.some((attribute) => attribute.id === 'cultivationSpeed' && attribute.sources.length > 0), true);
  assert.equal(weapon.qualityName, '初火');
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
  assert.deepEqual(profile.attributes.map((attribute) => attribute.label), ['锋芒', '护体', '血元', '会心', '灵根偏向', '灵息', '破境天机', '护体玄光', '山门气运']);
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
  assert.equal(state.spiritStones, 120);
  assert.equal(state.pills, 2);
  assert.equal(state.qi, 120);
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
  assert.equal(calculateQiRate(state, 2000), 3.81);
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
  assert.equal(state.spiritStones, 105);
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
  startMapDepthTrial(state, 'qinglanMountain', 1000);
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

test('market shelf is wider and ordinary materials use tiered daily limits', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('金丹一转');
  const stock = getMarketStock(state, '2026-05-10');
  const revived = reviveGameState(JSON.parse(JSON.stringify(state)), 1000);
  const revivedStock = getMarketStock(revived, '2026-05-10');
  const legacy = reviveGameState({
    ...JSON.parse(JSON.stringify(state)),
    marketStock: {
      ...stock,
      items: stock.items.slice(0, 6),
    },
  }, 1000);
  const legacyStock = getMarketStock(legacy, '2026-05-10');

  assert.equal(MARKET_ITEMS.herbBundle.limit, 99);
  assert.equal(MARKET_ITEMS.arrayManual.limit, 30);
  assert.equal(MARKET_ITEMS.treasureOre.limit, 10);
  assert.equal(stock.items.length >= 8, true);
  assert.equal(revivedStock.items.length >= 8, true);
  assert.equal(legacyStock.items.length >= 8, true);
});

test('map depth trials scale difficulty and grant first-clear rewards', () => {
  const state = createGameState(1000);
  state.permanentBonuses.power = 500;
  const firstDepth = getMapDepthStatus(state, 'qinglanMountain');

  const started = startMapDepthTrial(state, 'qinglanMountain', 1000);
  const secondDepth = getMapDepthStatus(state, 'qinglanMountain');

  assert.equal(firstDepth.nextLayer, 1);
  assert.equal(firstDepth.maxLayer, 30);
  assert.equal(started.ok, true);
  assert.equal(state.mapDepths.qinglanMountain, 1);
  assert.equal(secondDepth.nextLayer, 2);
  assert.equal(secondDepth.pressure > firstDepth.pressure, true);
  assert.equal(state.lastMissionReport.mapName, '青岚山');
  assert.match(state.lastMissionReport.summary, /秘境/);
  assert.equal(state.lastMissionReport.battle.rounds.length > 0, true);
  assert.equal(state.lastMissionReport.battle.outcome, 'victory');
  assert.equal(state.spiritStones > 0, true);
});

test('map depth trials rotate tribulations into combat', () => {
  const state = createGameState(1000);
  state.permanentBonuses.power = 800;
  state.mapDepths.qinglanMountain = 2;

  const status = getMapDepthStatus(state, 'qinglanMountain');
  const started = startMapDepthTrial(state, 'qinglanMountain', 1000);

  assert.equal(DEPTH_TRIBULATIONS.some((tribulation) => tribulation.id === status.tribulation.id), true);
  assert.equal(started.ok, true);
  assert.equal(started.battle.enemy.tribulation.id, status.tribulation.id);
  assert.match(started.battle.enemy.name, new RegExp(status.tribulation.name));
  assert.equal(started.report.battle.enemy.tribulation.id, status.tribulation.id);
});

test('map depth trials settle immediately after creating battle data', () => {
  const state = createGameState(1000);
  state.permanentBonuses.power = 500;

  const started = startMapDepthTrial(state, 'qinglanMountain', 1000);
  const revived = reviveGameState(JSON.parse(JSON.stringify(state)), 1500);

  assert.equal(started.ok, true);
  assert.equal(started.battle?.rounds.length > 0, true);
  assert.equal(state.activeMission, null);
  assert.equal(revived.activeMission, null);
  assert.equal(state.mapDepths.qinglanMountain, 1);
  assert.deepEqual(state.lastMissionReport.battle.rounds, started.battle.rounds);
});

test('legacy active map depth saves settle on revive without waiting', () => {
  const state = createGameState(1000);
  state.permanentBonuses.power = 500;
  state.activeMission = {
    type: 'mapDepth',
    id: 'depth:qinglanMountain:1',
    mapId: 'qinglanMountain',
    layer: 1,
    startedAt: 1000,
    endsAt: 121_000,
  };

  const revived = reviveGameState(JSON.parse(JSON.stringify(state)), 1500);

  assert.equal(revived.activeMission, null);
  assert.equal(revived.mapDepths.qinglanMountain, 1);
  assert.equal(revived.lastMissionReport.battle.rounds.length > 0, true);
});

test('map depth trials remain threatening compared with same-map routes', () => {
  const state = createGameState(1000);
  state.realmIndex = realmIndexByName('金丹一转');
  state.mapDepths.demonRift = 2;

  const route = getMissionStatus(state, 'demonRift');
  const depth = getMapDepthStatus(state, 'demonRift');

  assert.equal(route.unlocked, true);
  assert.equal(depth.nextLayer, 3);
  assert.equal(depth.danger >= Math.round(route.recommendedPower * 0.8), true);
});

test('map depth sweep refreshes daily and never repeats first clear permanence', () => {
  const state = createGameState(1000);
  state.mapDepths.qinglanMountain = 10;
  state.permanentBonuses.power = 30;
  const dateOne = Date.parse('2026-05-10T00:00:00.000Z');
  const dateTwo = Date.parse('2026-05-11T00:00:00.000Z');

  const before = getMapDepthSweepStatus(state, 'qinglanMountain', dateOne);
  const first = sweepMapDepth(state, 'qinglanMountain', dateOne);
  const repeated = sweepMapDepth(state, 'qinglanMountain', dateOne + 1000);
  const nextDay = sweepMapDepth(state, 'qinglanMountain', dateTwo);

  assert.equal(before.canSweep, true);
  assert.equal(before.targetLayer, 10);
  assert.equal(first.ok, true);
  assert.equal(first.fromLayer, 1);
  assert.equal(first.toLayer, 10);
  assert.equal(state.mapDepths.qinglanMountain, 10);
  assert.equal(state.dailyDepthSweeps['2026-05-10'].qinglanMountain, 10);
  assert.equal(state.permanentBonuses.power, 30);
  assert.equal(first.reward.spiritStones > 0, true);
  assert.equal(first.reward.powerBonus, undefined);
  assert.equal(repeated.ok, false);
  assert.equal(repeated.reason, 'alreadySwept');
  assert.equal(nextDay.ok, true);
  assert.equal(nextDay.fromLayer, 1);
});

test('defeated bosses refresh as daily sweep rewards without repeating first kill rewards', () => {
  const state = createGameState(1000);
  state.defeatedBosses.qinglanMountain = true;
  state.permanentBonuses.power = 24;
  const dateOne = Date.parse('2026-05-10T00:00:00.000Z');
  const dateTwo = Date.parse('2026-05-11T00:00:00.000Z');

  const status = getMapBossSweepStatus(state, 'qinglanMountain', dateOne);
  const first = sweepMapBoss(state, 'qinglanMountain', dateOne);
  const repeated = sweepMapBoss(state, 'qinglanMountain', dateOne + 1000);
  const nextDay = sweepMapBoss(state, 'qinglanMountain', dateTwo);

  assert.equal(status.canSweep, true);
  assert.equal(first.ok, true);
  assert.equal(first.reward.powerBonus, undefined);
  assert.equal(state.permanentBonuses.power, 24);
  assert.equal(state.dailyBossClaims['2026-05-10'].qinglanMountain, true);
  assert.equal(repeated.ok, false);
  assert.equal(repeated.reason, 'alreadySwept');
  assert.equal(nextDay.ok, true);
});

test('market stock refreshes by day and enforces item limits', () => {
  const state = createGameState(1000);
  state.spiritStones = 100_000;
  state.beastCores = 100;
  state.marketStock = { dateKey: '2026-05-08', refreshIndex: 0, items: ['herbBundle', 'arrayManual', 'beastCoreShard'] };

  const firstStock = getMarketStock(state, '2026-05-08');
  const bought = buyMarketItem(state, 'herbBundle', '2026-05-08', 1000);
  const repeated = buyMarketItem(state, 'herbBundle', '2026-05-08', 1000);
  for (let index = 0; index < MARKET_ITEMS.herbBundle.limit - 2; index += 1) {
    buyMarketItem(state, 'herbBundle', '2026-05-08', 1100 + index);
  }
  const soldOut = buyMarketItem(state, 'herbBundle', '2026-05-08', 3000);
  const refreshed = refreshMarketStock(state, '2026-05-08', 2000);
  const secondStock = getMarketStock(state, '2026-05-08');

  assert.equal(firstStock.items.find((item) => item.id === 'herbBundle').remaining, MARKET_ITEMS.herbBundle.limit);
  assert.equal(bought.ok, true);
  assert.equal(repeated.ok, true);
  assert.equal(soldOut.reason, 'soldOut');
  assert.equal(refreshed.ok, true);
  assert.notDeepEqual(secondStock.items.map((item) => item.id), firstStock.items.map((item) => item.id));
  assert.equal(secondStock.refreshCost.spiritStones > firstStock.refreshCost.spiritStones, true);
});

test('offline progress returns a resource summary', () => {
  const state = createGameState(1000);
  state.buildings.spiritField = 1;

  const summary = applyOfflineProgress(state, 100, 101_000);

  assert.equal(summary.seconds, 100);
  assert.equal(summary.qi, 5.33);
  assert.equal(summary.spiritStones, 6);
  assert.equal(summary.herbs, 2);
});
