const REALM_GROUPS = [
  { prefix: '炼气', suffixes: ['一层', '二层', '三层', '四层', '五层', '六层', '七层', '八层', '九层'], startQi: 25, endQi: 4_500, startRate: 1.5, endRate: 7, startStone: 2, endStone: 9 },
  { prefix: '筑基', suffixes: ['一层', '二层', '三层', '四层', '五层', '六层', '七层', '八层', '九层'], startQi: 8_000, endQi: 85_000, startRate: 8.67, endRate: 24.17, startStone: 11, endStone: 26 },
  { prefix: '金丹', suffixes: ['一转', '二转', '三转', '四转', '五转', '六转', '七转', '八转', '九转'], startQi: 130_000, endQi: 1_100_000, startRate: 29.17, endRate: 73.33, startStone: 32, endStone: 75 },
  { prefix: '元婴', suffixes: ['一变', '二变', '三变', '四变', '五变', '六变', '七变', '八变', '九变'], startQi: 1_800_000, endQi: 8_000_000, startRate: 90, endRate: 208.33, startStone: 90, endStone: 180 },
];

const LEGACY_REALM_INDEX_MAP = [0, 1, 2, 9, 13, 18, 26, 27];

export const REALMS = createRealmTrack();

export const CURRENT_BALANCE_VERSION = 4;

function createRealmTrack() {
  return REALM_GROUPS.flatMap((group) => group.suffixes.map((suffix, index) => {
    const progress = group.suffixes.length === 1 ? 0 : index / (group.suffixes.length - 1);
    const qiProgress = Math.pow(progress, 1.24);
    return {
      name: `${group.prefix}${suffix}`,
      requiredQi: Math.round(interpolate(group.startQi, group.endQi, qiProgress)),
      qiRate: round(interpolate(group.startRate, group.endRate, progress)),
      stoneRate: round(interpolate(group.startStone, group.endStone, progress)),
    };
  }));
}

function interpolate(start, end, progress) {
  return start + (end - start) * progress;
}

export const UPGRADE_TIERS = [
  { name: '凡阶', minLevel: 1, maxLevel: 3, realmIndex: 0, effectMultiplier: 1, costBase: 1, costStep: 1, essenceBase: 1, essenceStep: 1, lootBonusPerLevel: 0.22, percentBonusPerLevel: 0.01 },
  { name: '灵阶', minLevel: 4, maxLevel: 6, realmIndex: 9, effectMultiplier: 1.35, costBase: 4.2, costStep: 1.35, essenceBase: 5, essenceStep: 2, lootBonusPerLevel: 0.32, percentBonusPerLevel: 0.014 },
  { name: '玄阶', minLevel: 7, maxLevel: 9, realmIndex: 18, effectMultiplier: 1.85, costBase: 9.5, costStep: 2.1, essenceBase: 12, essenceStep: 4, lootBonusPerLevel: 0.46, percentBonusPerLevel: 0.02 },
  { name: '地阶', minLevel: 10, maxLevel: 12, realmIndex: 27, effectMultiplier: 2.5, costBase: 18, costStep: 3.2, essenceBase: 24, essenceStep: 7, lootBonusPerLevel: 0.65, percentBonusPerLevel: 0.028 },
];

export const MISSIONS = {
  herbGathering: {
    id: 'herbGathering',
    name: '采集灵草',
    mapId: 'qinglanMountain',
    map: '青岚山',
    unlockRealmIndex: 0,
    duration: 30,
    reward: { herbs: 5, spiritStones: 6 },
    events: ['hiddenHerbPatch', 'spiritSpring'],
  },
  cavePatrol: {
    id: 'cavePatrol',
    name: '巡守洞府',
    mapId: 'qinglanMountain',
    map: '青岚山',
    unlockRealmIndex: 0,
    duration: 55,
    reward: { spiritStones: 18, qi: 35 },
    events: ['spiritSpring', 'cloudRobeCache'],
  },
  marketTrade: {
    id: 'marketTrade',
    name: '坊市交易',
    mapId: 'qinglanMountain',
    map: '青岚山',
    unlockRealmIndex: 0,
    duration: 90,
    reward: { spiritStones: 48 },
    events: ['wanderingTrader', 'hiddenHerbPatch'],
  },
  mistyValley: {
    id: 'mistyValley',
    name: '雾隐秘境',
    mapId: 'mistyValley',
    map: '雾隐秘境',
    unlockRealmIndex: 7,
    duration: 120,
    danger: 180,
    reward: { spiritStones: 35, qi: 90, beastCores: 1, artifacts: 1 },
    rareEvery: 4,
    rareReward: { meridianPill: 1 },
    failurePenalty: { qi: -45, heartDemon: 1 },
    events: ['spiritSpring', 'cloudRobeCache'],
  },
  herbValley: {
    id: 'herbValley',
    name: '灵草谷',
    mapId: 'herbValley',
    map: '灵草谷',
    unlockRealmIndex: 4,
    duration: 70,
    danger: 120,
    reward: { herbs: 14, spiritStones: 14, qi: 45 },
    rareEvery: 3,
    rareReward: { clearHeartPill: 1 },
    failurePenalty: { qi: -20 },
    events: ['hiddenHerbPatch', 'xuanmuAmuletCache'],
  },
  ancientSwordTomb: {
    id: 'ancientSwordTomb',
    name: '古剑冢',
    mapId: 'swordTomb',
    map: '古剑冢',
    unlockRealmIndex: 9,
    duration: 140,
    danger: 330,
    reward: { artifacts: 2, spiritStones: 50, beastCores: 1 },
    rareEvery: 3,
    rareReward: { beastCores: 2, arrayFlags: 1 },
    failurePenalty: { qi: -60, heartDemon: 1 },
    events: ['swordRemnant', 'beastAmbush'],
  },
  demonRift: {
    id: 'demonRift',
    name: '魔气裂隙',
    mapId: 'demonRift',
    map: '魔气裂隙',
    unlockRealmIndex: 14,
    duration: 180,
    danger: 520,
    reward: { beastCores: 3, spiritStones: 90, qi: 120, heartDemon: 1 },
    rareEvery: 4,
    rareReward: { meridianPill: 1, arrayFlags: 1 },
    failurePenalty: { qi: -90, heartDemon: 2 },
    events: ['beastAmbush', 'cloudRobeCache'],
  },
  ancientRuins: {
    id: 'ancientRuins',
    name: '上古遗迹',
    mapId: 'ancientRuins',
    map: '上古遗迹',
    unlockRealmIndex: 18,
    duration: 240,
    danger: 820,
    reward: { spiritStones: 150, beastCores: 4, arrayFlags: 2, qi: 180 },
    rareEvery: 5,
    rareReward: { artifacts: 3, meridianPill: 1 },
    failurePenalty: { qi: -130, heartDemon: 2 },
    events: ['ancientCache', 'swordRemnant', 'xuanmuAmuletCache'],
  },
};

export const MISSION_MAPS = {
  qinglanMountain: {
    id: 'qinglanMountain',
    name: '青岚山',
    icon: '山',
    description: '洞府外山脉，根基由此打牢。',
    unlockRealmIndex: 0,
    explorationTarget: 5,
    reputationPerMission: 6,
    masteryBonus: { qiRate: 0.03 },
    boss: {
      name: '青岚山魈',
      title: '山门首领',
      power: 180,
      reward: { spiritStones: 120, powerBonus: 24, forgingEssence: 2 },
      reputation: 25,
      failurePenalty: { qi: -35, heartDemon: 1 },
    },
  },
  herbValley: {
    id: 'herbValley',
    name: '灵草谷',
    icon: '草',
    description: '灵草丰茂，丹修和宗门补给的根基。',
    unlockRealmIndex: 4,
    explorationTarget: 6,
    reputationPerMission: 7,
    masteryBonus: { qiRate: 0.02 },
    boss: {
      name: '百年药灵',
      title: '谷中灵魄',
      power: 300,
      reward: { herbs: 36, qiRateBonus: 0.02, forgingEssence: 3 },
      reputation: 30,
      failurePenalty: { qi: -45 },
    },
  },
  mistyValley: {
    id: 'mistyValley',
    name: '雾隐秘境',
    icon: '雾',
    description: '雾气遮蔽感知，产出早期妖核和法器。',
    unlockRealmIndex: 7,
    explorationTarget: 5,
    reputationPerMission: 8,
    masteryBonus: { dangerReduction: 6 },
    boss: {
      name: '雾隐妖',
      title: '秘境守影',
      power: 420,
      reward: { beastCores: 3, artifacts: 1, powerBonus: 32, forgingEssence: 4 },
      reputation: 35,
      failurePenalty: { qi: -65, heartDemon: 1 },
    },
  },
  swordTomb: {
    id: 'swordTomb',
    name: '古剑冢',
    icon: '剑',
    description: '残剑埋骨之地，剑修可借此淬炼道威。',
    unlockRealmIndex: 9,
    explorationTarget: 6,
    reputationPerMission: 9,
    masteryBonus: { power: 14 },
    boss: {
      name: '无名剑魂',
      title: '剑冢残念',
      power: 650,
      reward: { artifacts: 3, beastCores: 2, powerBonus: 48, forgingEssence: 5 },
      reputation: 40,
      failurePenalty: { qi: -90, heartDemon: 1 },
    },
  },
  demonRift: {
    id: 'demonRift',
    name: '魔气裂隙',
    icon: '魔',
    description: '魔气翻涌，收益更高也更考验稳定。',
    unlockRealmIndex: 14,
    explorationTarget: 7,
    reputationPerMission: 10,
    masteryBonus: { power: 18, dangerReduction: 4 },
    boss: {
      name: '裂隙魔影',
      title: '魔气化身',
      power: 950,
      reward: { beastCores: 5, arrayFlags: 2, powerBonus: 64, forgingEssence: 6 },
      reputation: 45,
      failurePenalty: { qi: -120, heartDemon: 2 },
    },
  },
  ancientRuins: {
    id: 'ancientRuins',
    name: '上古遗迹',
    icon: '遗',
    description: '旧时代残阵，通向更长线的宗门经营。',
    unlockRealmIndex: 18,
    explorationTarget: 8,
    reputationPerMission: 12,
    masteryBonus: { qiRate: 0.015, power: 16 },
    boss: {
      name: '残阵守灵',
      title: '遗迹阵枢',
      power: 1300,
      reward: { spiritStones: 320, arrayFlags: 4, qiRateBonus: 0.03, forgingEssence: 8 },
      reputation: 55,
      failurePenalty: { qi: -160, heartDemon: 2 },
    },
  },
};

export const MAP_MASTERY_TIERS = [
  { level: 0, name: '初探', reputation: 0 },
  { level: 1, name: '熟路', reputation: 10 },
  { level: 2, name: '知势', reputation: 35 },
  { level: 3, name: '名扬', reputation: 75 },
  { level: 4, name: '镇域', reputation: 140 },
];

export const SECT_COMMISSIONS = {
  herbGarden: {
    id: 'herbGarden',
    name: '采药委托',
    detail: '弟子巡山采药，稳定补充灵草。',
    rates: { herbs: 0.05, reputation: 0.01 },
  },
  mine: {
    id: 'mine',
    name: '采矿委托',
    detail: '弟子整理灵脉碎矿，缓慢产出灵石。',
    rates: { spiritStones: 0.08, reputation: 0.008 },
  },
  patrol: {
    id: 'patrol',
    name: '护山委托',
    detail: '弟子巡守山门，偶得妖核并提升宗门名望。',
    rates: { beastCores: 0.01, reputation: 0.01 },
  },
};

export const SECT_LEVELS = [
  { level: 1, name: '外门草创', reputation: 0, capacityBonus: 0, commissionBonus: 0 },
  { level: 2, name: '山门初立', reputation: 30, capacityBonus: 1, commissionBonus: 0.06 },
  { level: 3, name: '内门成形', reputation: 90, capacityBonus: 2, commissionBonus: 0.12 },
  { level: 4, name: '一方名门', reputation: 180, capacityBonus: 3, commissionBonus: 0.2 },
  { level: 5, name: '洞天雏形', reputation: 320, capacityBonus: 5, commissionBonus: 0.3 },
];

export const OPPORTUNITIES = {
  swordEcho: {
    id: 'swordEcho',
    name: '剑冢回响',
    detail: '剑冢残念回应你的神识，可以趁势淬炼本命剑意。',
    choices: [
      {
        id: 'temperSword',
        title: '以法器淬锋',
        detail: '消耗一件法器，换取稳定的道威底蕴和炼器精魄。',
        cost: { artifacts: 1 },
        reward: { powerBonus: 18, forgingEssence: 2 },
        successChance: 1,
      },
      {
        id: 'listenDao',
        title: '静听剑鸣',
        detail: '不消耗材料，获得悟道灵感和一段灵气。',
        cost: {},
        reward: { insight: 1, qi: 120 },
        successChance: 1,
      },
    ],
  },
  spiritSpringChoice: {
    id: 'spiritSpringChoice',
    name: '灵泉分流',
    detail: '山脉灵泉短暂涌动，可引入洞府或当场吐纳。',
    choices: [
      {
        id: 'leadToCave',
        title: '引泉入府',
        detail: '布下简易阵纹，永久提升少量灵息效率。',
        cost: { arrayFlags: 1 },
        reward: { qiRateBonus: 0.015 },
        successChance: 1,
      },
      {
        id: 'cultivateNow',
        title: '当场吐纳',
        detail: '不消耗材料，立刻获得一段灵气。',
        cost: {},
        reward: { qi: 160 },
        successChance: 1,
      },
    ],
  },
  riftDemonThought: {
    id: 'riftDemonThought',
    name: '魔念低语',
    detail: '裂隙中浮出魔念，镇压后可换来更高收益。',
    choices: [
      {
        id: 'suppressDemon',
        title: '镇压魔念',
        detail: '直面心魔反噬，换取妖核和阵旗。',
        cost: {},
        reward: { beastCores: 2, arrayFlags: 1 },
        failurePenalty: { heartDemon: 1, qi: -90 },
        successChance: 0.78,
      },
      {
        id: 'sealRift',
        title: '稳妥封印',
        detail: '消耗阵旗压住裂隙，降低心魔压力。',
        cost: { arrayFlags: 1 },
        reward: { clearHeartPill: 1, forgingEssence: 1 },
        successChance: 1,
      },
    ],
  },
};

export const TREASURES = {
  lifeBoundSeal: {
    id: 'lifeBoundSeal',
    name: '本命青印',
    detail: '护持经脉和神识，牵引破境天机，并提供少量道威。',
    maxLevel: 8,
    cost: (level) => ({ spiritStones: scaleCost(120, level), artifacts: level, forgingEssence: level * 2 }),
    bonuses: { breakthrough: 0.025, power: 10 },
  },
  swordGourd: {
    id: 'swordGourd',
    name: '养剑葫',
    detail: '温养剑气，凝练历练道威并平息行游劫象。',
    maxLevel: 8,
    cost: (level) => ({ spiritStones: scaleCost(140, level), beastCores: level, forgingEssence: level * 2 }),
    bonuses: { power: 24, dangerReduction: 4 },
  },
  spiritLamp: {
    id: 'spiritLamp',
    name: '聚灵灯',
    detail: '牵引洞府灵机，提升长期灵息效率。',
    maxLevel: 8,
    cost: (level) => ({ spiritStones: scaleCost(110, level), arrayFlags: level, herbs: scaleCost(10, level) }),
    bonuses: { qiRate: 0.025 },
  },
};

export const SPIRIT_BEASTS = {
  cloudFox: {
    id: 'cloudFox',
    name: '云纹灵狐',
    detail: '亲近灵气，辅助周天灵息和灵田照料。',
    maxLevel: 8,
    cost: (level) => ({ spiritStones: scaleCost(90, level), herbs: scaleCost(18, level), beastCores: level }),
    bonuses: { qiRate: 0.04, herbRate: 0.015 },
  },
  thunderTiger: {
    id: 'thunderTiger',
    name: '雷纹幼虎',
    detail: '守山善战，凝练道威并护持外出行游。',
    maxLevel: 8,
    cost: (level) => ({ spiritStones: scaleCost(130, level), beastCores: level * 2 }),
    bonuses: { power: 22, dangerReduction: 5 },
  },
};

const MISSION_OPPORTUNITIES = {
  cavePatrol: 'spiritSpringChoice',
  ancientSwordTomb: 'swordEcho',
  demonRift: 'riftDemonThought',
};

export const MISSION_EVENTS = {
  hiddenHerbPatch: {
    id: 'hiddenHerbPatch',
    name: '隐蔽药圃',
    detail: '在山隙中发现一片野生灵草。',
    reward: { herbs: 3 },
  },
  spiritSpring: {
    id: 'spiritSpring',
    name: '灵泉暗涌',
    detail: '灵泉涌动，顺势吐纳一轮。',
    reward: { qi: 18 },
  },
  wanderingTrader: {
    id: 'wanderingTrader',
    name: '游商问价',
    detail: '遇见路过散修，以低价换得一笔灵石。',
    reward: { spiritStones: 18 },
  },
  beastAmbush: {
    id: 'beastAmbush',
    name: '妖兽伏击',
    detail: '斩退伏击妖兽，剖得一枚妖核。',
    reward: { beastCores: 1 },
  },
  swordRemnant: {
    id: 'swordRemnant',
    name: '残剑鸣匣',
    detail: '剑匣自鸣，遗落青锋可入武器栏。',
    reward: { artifacts: 1 },
    equipment: 'qingfengSword',
  },
  cloudRobeCache: {
    id: 'cloudRobeCache',
    name: '云纹残匣',
    detail: '旧匣中藏有一件轻灵法袍。',
    reward: { spiritStones: 24 },
    equipment: 'cloudthreadRobe',
  },
  xuanmuAmuletCache: {
    id: 'xuanmuAmuletCache',
    name: '玄木符匣',
    detail: '符匣内温润生机，可护持突破。',
    reward: { herbs: 5 },
    equipment: 'xuanmuAmulet',
  },
  ancientCache: {
    id: 'ancientCache',
    name: '上古秘藏',
    detail: '残阵中留有灵石和阵旗。',
    reward: { spiritStones: 80, arrayFlags: 1 },
  },
};

export const LOOT_EQUIPMENT = {
  qingfengSword: {
    id: 'qingfengSword',
    name: '青锋剑',
    slot: 'weapon',
    quality: 1,
    bonuses: { power: 36 },
  },
  cloudthreadRobe: {
    id: 'cloudthreadRobe',
    name: '云纹法袍',
    slot: 'robe',
    quality: 1,
    bonuses: { dangerReduction: 16 },
  },
  xuanmuAmulet: {
    id: 'xuanmuAmulet',
    name: '玄木护符',
    slot: 'amulet',
    quality: 1,
    bonuses: { breakthrough: 0.04, qiRate: 0.03 },
  },
};

export const BUILDINGS = {
  alchemyFurnace: {
    id: 'alchemyFurnace',
    name: '炼丹炉',
    maxLevel: 12,
    cost: (level) => ({ spiritStones: scaleCost(55, level), herbs: scaleCost(8, level) }),
    speedBonusPerLevel: 0.2,
  },
  meditationSeat: {
    id: 'meditationSeat',
    name: '蒲团',
    maxLevel: 12,
    cost: (level) => ({ spiritStones: scaleCost(20, level), herbs: Math.max(0, scaleCost(4, level - 1)) }),
    qiBonusPerLevel: 0.2,
  },
  spiritField: {
    id: 'spiritField',
    name: '灵田',
    maxLevel: 12,
    cost: (level) => ({ spiritStones: scaleCost(30, level) }),
    herbRatePerLevel: 0.02,
  },
  swordArray: {
    id: 'swordArray',
    name: '剑阵',
    maxLevel: 12,
    cost: (level) => ({ spiritStones: scaleCost(45, level), beastCores: Math.max(0, scaleCost(1, level - 1)) }),
    powerPerLevel: 28,
  },
};

export const PILL_RECIPES = {
  gatherQiPill: {
    id: 'gatherQiPill',
    name: '聚气丹',
    duration: 45,
    unlockLevel: 0,
    cost: { herbs: 8, spiritStones: 12 },
  },
  clearHeartPill: {
    id: 'clearHeartPill',
    name: '清心丹',
    duration: 45,
    unlockLevel: 1,
    cost: { herbs: 10, spiritStones: 18 },
  },
  meridianPill: {
    id: 'meridianPill',
    name: '护脉丹',
    duration: 60,
    unlockLevel: 2,
    cost: { herbs: 14, spiritStones: 28, beastCores: 1 },
  },
};

export const GEAR = {
  weapon: {
    id: 'weapon',
    name: '武器',
    maxLevel: 12,
    cost: (level) => ({ spiritStones: tieredLinearCost(80, level), beastCores: tieredMaterialCost(1, level) }),
    powerPerLevel: 35,
  },
  amulet: {
    id: 'amulet',
    name: '护符',
    maxLevel: 12,
    cost: (level) => ({ spiritStones: tieredLinearCost(70, level), beastCores: tieredMaterialCost(1, level) }),
    breakthroughPerLevel: 0.03,
  },
  robe: {
    id: 'robe',
    name: '法袍',
    maxLevel: 12,
    cost: (level) => ({ spiritStones: tieredLinearCost(60, level), beastCores: tieredMaterialCost(1, level) }),
    dangerReductionPerLevel: 10,
  },
};

export const GEAR_INTENTS = {
  weapon: {
    id: 'suppressEvil',
    name: '镇煞',
    detail: '剑气锋锐，可压住山门首领与秘境凶煞。',
  },
  amulet: {
    id: 'knockGate',
    name: '叩关',
    detail: '符脉护持道基，破境前更容易稳住气机。',
  },
  robe: {
    id: 'wanderGuard',
    name: '行游',
    detail: '云纹护身，外出历练时更能避开劫象。',
  },
};

export const GEAR_QUALITIES = [
  { name: '凡品', powerBonus: 0, refineChance: 0.82 },
  { name: '下品', powerBonus: 18, refineChance: 0.66 },
  { name: '中品', powerBonus: 40, refineChance: 0.5 },
  { name: '上品', powerBonus: 70, refineChance: 0.36 },
  { name: '极品', powerBonus: 110, refineChance: 0 },
];

export const GEAR_AFFIXES = {
  swordIntent: {
    id: 'swordIntent',
    name: '剑意',
    slot: 'weapon',
    powerBonus: 25,
  },
  breakerEdge: {
    id: 'breakerEdge',
    name: '破阵',
    slot: 'weapon',
    powerBonus: 16,
    dangerReduction: 8,
  },
  spiritVein: {
    id: 'spiritVein',
    name: '灵脉',
    slot: 'amulet',
    qiBonus: 0.08,
  },
  calmMind: {
    id: 'calmMind',
    name: '凝神',
    slot: 'amulet',
    breakthrough: 0.04,
  },
  cloudStep: {
    id: 'cloudStep',
    name: '云步',
    slot: 'robe',
    dangerReduction: 18,
  },
  guardedBody: {
    id: 'guardedBody',
    name: '护体',
    slot: 'robe',
    dangerReduction: 10,
    breakthrough: 0.02,
  },
};

export const GEAR_AFFIX_POOLS = {
  weapon: ['swordIntent', 'breakerEdge'],
  amulet: ['spiritVein', 'calmMind'],
  robe: ['cloudStep', 'guardedBody'],
};

export const CULTIVATION_PATHS = {
  sword: {
    id: 'sword',
    name: '剑修',
    maxLevel: 12,
    cost: (level) => ({ spiritStones: scaleCost(65, level), beastCores: scaleCost(1, level) }),
    powerPerLevel: 28,
    dangerReductionPerLevel: 4,
  },
  alchemy: {
    id: 'alchemy',
    name: '丹修',
    maxLevel: 12,
    cost: (level) => ({ spiritStones: scaleCost(55, level), herbs: scaleCost(8, level), gatherQiPill: Math.ceil(level / 3) }),
    alchemySpeedPerLevel: 0.04,
    pillQiBonusPerLevel: 0.04,
  },
  formation: {
    id: 'formation',
    name: '阵修',
    maxLevel: 12,
    cost: (level) => ({ spiritStones: scaleCost(60, level), arrayFlags: scaleCost(1, level) }),
    qiBonusPerLevel: 0.05,
    offlineBonusPerLevel: 0.03,
  },
};

export const FORMATIONS = {
  spiritGathering: {
    id: 'spiritGathering',
    name: '聚灵阵',
    maxLevel: 12,
    cost: (level) => ({ spiritStones: scaleCost(70, level), arrayFlags: scaleCost(1, level) }),
    qiBonusPerLevel: 0.1,
  },
  mountainGuard: {
    id: 'mountainGuard',
    name: '护山阵',
    maxLevel: 12,
    cost: (level) => ({ spiritStones: scaleCost(75, level), arrayFlags: scaleCost(1, level) }),
    stabilityPerLevel: 0.03,
  },
  swordArray: {
    id: 'swordArray',
    name: '剑阵',
    maxLevel: 12,
    cost: (level) => ({ spiritStones: scaleCost(80, level), beastCores: scaleCost(1, level), arrayFlags: scaleCost(1, level) }),
    powerPerLevel: 26,
  },
};

export const DAILY_TASKS = {
  dailyCultivation: {
    id: 'dailyCultivation',
    title: '今日吐纳',
    detail: '累计修炼即可领取基础补给',
    progressKey: 'cultivationSeconds',
    target: 300,
    reward: { spiritStones: 35, qi: 80 },
  },
  dailyMission: {
    id: 'dailyMission',
    title: '今日历练',
    detail: '完成任意历练后领取额外材料',
    progressKey: 'missions',
    target: 3,
    reward: { herbs: 8, spiritStones: 25 },
  },
  dailyMarket: {
    id: 'dailyMarket',
    title: '坊市问价',
    detail: '每日补贴一笔交易本金',
    progressKey: 'marketBuys',
    target: 1,
    reward: { spiritStones: 45 },
  },
};

export const MARKET_ITEMS = {
  herbBundle: {
    id: 'herbBundle',
    name: '灵草包',
    type: '材料',
    cost: { spiritStones: 40 },
    reward: { herbs: 12 },
  },
  beastCoreShard: {
    id: 'beastCoreShard',
    name: '妖核碎片',
    type: '材料',
    cost: { spiritStones: 75 },
    reward: { beastCores: 1 },
  },
  spiritSword: {
    id: 'spiritSword',
    name: '下品灵剑',
    type: '装备',
    cost: { spiritStones: 80 },
    reward: { artifacts: 1 },
  },
  arrayManual: {
    id: 'arrayManual',
    name: '小周天阵旗',
    type: '阵法',
    cost: { spiritStones: 90, beastCores: 1 },
    reward: { arrayFlags: 1 },
  },
};

export const MAINLINE_CHAPTERS = [
  {
    id: 'qinglanStart',
    title: '青岚初启',
    subtitle: '立洞府、通吐纳、备丹药，完成最初的修行根基。',
    reward: { spiritStones: 120, qiRateBonus: 0.03 },
    objectives: [
      {
        id: 'realmThree',
        title: '突破至炼气三层',
        detail: '提高吐纳效率，开启更稳定的秘境收益',
        completed: (state) => state.realmIndex >= 2,
        reward: { spiritStones: 80, pills: 1 },
      },
      {
        id: 'spiritField',
        title: '建成一阶灵田',
        detail: '让洞府开始自动生长灵草',
        completed: (state) => (state.buildings?.spiritField ?? 0) >= 1,
        reward: { herbs: 10, spiritStones: 30 },
      },
      {
        id: 'mistyValley',
        title: '完成一次雾隐秘境',
        detail: '获得妖核或法器，准备强化剑阵',
        completed: (state) => (state.completedMissions?.mistyValley ?? 0) >= 1,
        reward: { beastCores: 1, spiritStones: 60 },
      },
      {
        id: 'firstPill',
        title: '炼成一枚聚气丹',
        detail: '突破前用丹药快速补足灵气',
        completed: (state) => (state.craftedPills ?? 0) >= 1,
        reward: { qi: 120, spiritStones: 25 },
      },
    ],
  },
  {
    id: 'foundationPath',
    title: '筑基问道',
    subtitle: '选择主修方向，强化第一套护身手段，开始挑战更深秘境。',
    reward: { spiritStones: 200, powerBonus: 40 },
    objectives: [
      {
        id: 'foundationRealm',
        title: '踏入筑基一层',
        detail: '境界达到筑基一层，开启灵阶养成上限',
        completed: (state) => state.realmIndex >= 9,
        reward: { spiritStones: 120, herbs: 18 },
      },
      {
        id: 'firstPath',
        title: '参悟一门功法',
        detail: '剑修、丹修、阵修任一达到 1 级',
        completed: (state) => Object.values(state.cultivationPaths ?? {}).some((level) => level >= 1),
        reward: { spiritStones: 90, arrayFlags: 1 },
      },
      {
        id: 'firstArmament',
        title: '整备护身法器',
        detail: '任意装备或阵法升至 1 级',
        completed: (state) => [...Object.values(state.gear ?? {}), ...Object.values(state.formations ?? {})].some((level) => level >= 1),
        reward: { beastCores: 1, artifacts: 1 },
      },
      {
        id: 'swordTombTrial',
        title: '踏入古剑冢',
        detail: '完成一次古剑冢历练',
        completed: (state) => (state.completedMissions?.ancientSwordTomb ?? 0) >= 1,
        reward: { spiritStones: 160, artifacts: 2 },
      },
    ],
  },
  {
    id: 'goldenCoreTrial',
    title: '金丹试炼',
    subtitle: '淬炼法器、压制魔气裂隙，为更长线的金丹成长铺路。',
    reward: { spiritStones: 320, qiRateBonus: 0.05, powerBonus: 60 },
    objectives: [
      {
        id: 'goldenCoreRealm',
        title: '凝成金丹',
        detail: '境界达到金丹一转',
        completed: (state) => state.realmIndex >= 18,
        reward: { spiritStones: 220, meridianPill: 1 },
      },
      {
        id: 'refinedGear',
        title: '完成一次法器淬炼',
        detail: '任意装备品质提升至下品或以上',
        completed: (state) => Object.values(state.gearQuality ?? {}).some((quality) => quality >= 1),
        reward: { artifacts: 2, spiritStones: 180 },
      },
      {
        id: 'pathThree',
        title: '主修小成',
        detail: '任一功法达到 3 级',
        completed: (state) => Object.values(state.cultivationPaths ?? {}).some((level) => level >= 3),
        reward: { clearHeartPill: 1, spiritStones: 160 },
      },
      {
        id: 'demonRiftTrial',
        title: '镇压魔气裂隙',
        detail: '完成两次魔气裂隙历练',
        completed: (state) => (state.completedMissions?.demonRift ?? 0) >= 2,
        reward: { beastCores: 3, arrayFlags: 2 },
      },
    ],
  },
  {
    id: 'riftSuppression',
    title: '裂隙镇守',
    subtitle: '金丹之后不再只看境界，需要首领、宗门和战利品共同支撑。',
    reward: { spiritStones: 520, powerBonus: 90, forgingEssence: 4 },
    objectives: [
      {
        id: 'goldenCoreCompletion',
        title: '金丹九转',
        detail: '境界达到金丹九转，打开元婴前的长期成长目标',
        completed: (state) => state.realmIndex >= 26,
        reward: { spiritStones: 260, meridianPill: 1 },
      },
      {
        id: 'demonBoss',
        title: '镇压裂隙魔影',
        detail: '完成魔气裂隙探索并击败地图首领',
        completed: (state) => Boolean(state.defeatedBosses?.demonRift),
        reward: { beastCores: 4, arrayFlags: 2 },
      },
      {
        id: 'empoweredLoot',
        title: '强化一件战利品',
        detail: '任意具名战利品强化至 2 级',
        completed: (state) => (state.lootEquipment ?? []).some((item) => (item.level ?? 0) >= 2),
        reward: { forgingEssence: 3, spiritStones: 220 },
      },
      {
        id: 'sectReputation',
        title: '宗门初具名望',
        detail: '宗门声望达到 20',
        completed: (state) => (state.sectReputation ?? 0) >= 20,
        reward: { herbs: 40, spiritStones: 240 },
      },
    ],
  },
  {
    id: 'nascentSoulSect',
    title: '元婴开宗',
    subtitle: '镇守遗迹、扩张宗门，把个人修为转化为长期洞天底蕴。',
    reward: { spiritStones: 900, qiRateBonus: 0.08, powerBonus: 140 },
    objectives: [
      {
        id: 'nascentSoulRealm',
        title: '踏入元婴',
        detail: '境界达到元婴一变',
        completed: (state) => state.realmIndex >= 27,
        reward: { spiritStones: 520, meridianPill: 2 },
      },
      {
        id: 'ancientRuinsBoss',
        title: '镇压残阵守灵',
        detail: '完成上古遗迹探索并击败地图首领',
        completed: (state) => Boolean(state.defeatedBosses?.ancientRuins),
        reward: { arrayFlags: 4, forgingEssence: 4 },
      },
      {
        id: 'sectSixDisciples',
        title: '宗门六徒',
        detail: '招募 6 名弟子，形成稳定委托循环',
        completed: (state) => (state.sectDisciples ?? 0) >= 6,
        reward: { spiritStones: 360, herbs: 60 },
      },
      {
        id: 'earthTierFormation',
        title: '地阶阵法',
        detail: '任意阵法达到 7 级',
        completed: (state) => Object.values(state.formations ?? {}).some((level) => level >= 7),
        reward: { powerBonus: 60, qiRateBonus: 0.03 },
      },
    ],
  },
];

export function createGameState(now = Date.now()) {
  return {
    balanceVersion: CURRENT_BALANCE_VERSION,
    qi: 0,
    spiritStones: 0,
    herbs: 0,
    pills: 0,
    beastCores: 0,
    artifacts: 0,
    arrayFlags: 0,
    forgingEssence: 0,
    realmIndex: 0,
    heartDemon: 0,
    insight: 0,
    injuryUntil: 0,
    pillBoostUntil: 0,
    breakthroughBoostUntil: 0,
    foundationStability: 0,
    activeAlchemy: null,
    inventoryPills: {
      gatherQiPill: 0,
      clearHeartPill: 0,
      meridianPill: 0,
    },
    craftedPills: 0,
    completedMissions: {},
    mapReputation: {},
    defeatedBosses: {},
    claimedGoals: {},
    claimedChapterRewards: {},
    permanentBonuses: {
      qiRate: 0,
      power: 0,
    },
    autoMissionId: null,
    dailyClaims: {},
    dailyProgress: {},
    marketPurchases: {},
    gear: {
      weapon: 0,
      amulet: 0,
      robe: 0,
    },
    gearQuality: {
      weapon: 0,
      amulet: 0,
      robe: 0,
    },
    gearAffixes: {
      weapon: null,
      amulet: null,
      robe: null,
    },
    lootEquipment: [],
    equippedLoot: {
      weapon: null,
      amulet: null,
      robe: null,
    },
    lockedLoot: {},
    treasures: Object.fromEntries(Object.keys(TREASURES).map((id) => [id, 0])),
    spiritBeasts: Object.fromEntries(Object.keys(SPIRIT_BEASTS).map((id) => [id, 0])),
    activeOpportunity: null,
    resolvedOpportunities: {},
    lastMissionEvent: null,
    lastMissionReport: null,
    cultivationPaths: {
      sword: 0,
      alchemy: 0,
      formation: 0,
    },
    formations: {
      spiritGathering: 0,
      mountainGuard: 0,
      swordArray: 0,
    },
    sectDisciples: 0,
    sectRoster: [],
    sectReputation: 0,
    sectAssignments: {
      herbGarden: 0,
      mine: 0,
      patrol: 0,
    },
    sectCarry: {
      spiritStones: 0,
      herbs: 0,
      beastCores: 0,
      reputation: 0,
    },
    buildings: {
      alchemyFurnace: 0,
      meditationSeat: 1,
      spiritField: 0,
      swordArray: 0,
    },
    activeMission: null,
    totalCultivationSeconds: 0,
    breakthroughCount: 0,
    stoneCarry: 0,
    herbCarry: 0,
    lastUpdatedAt: now,
    log: [
      { time: now, text: '你在青岚山开辟洞府，开始吐纳灵气。' },
    ],
  };
}

export function reviveGameState(saved, now = Date.now()) {
  const state = { ...createGameState(now), ...saved };
  const savedBalanceVersion = Number(saved?.balanceVersion) || 0;
  state.realmIndex = clampInteger(state.realmIndex, 0, REALMS.length - 1);
  if (savedBalanceVersion < 3) {
    state.realmIndex = migrateLegacyRealmIndex(state.realmIndex);
  }
  state.qi = Math.max(0, Number(state.qi) || 0);
  if (savedBalanceVersion < CURRENT_BALANCE_VERSION) {
    state.qi = Math.min(state.qi, round(getCurrentRealm(state).requiredQi * 1.15));
  }
  state.balanceVersion = CURRENT_BALANCE_VERSION;
  state.heartDemon = Math.max(0, Number(state.heartDemon) || 0);
  state.insight = Math.max(0, Number(state.insight) || 0);
  state.pillBoostUntil = Math.max(0, Number(state.pillBoostUntil) || 0);
  state.breakthroughBoostUntil = Math.max(0, Number(state.breakthroughBoostUntil) || 0);
  state.foundationStability = Math.max(0, Number(state.foundationStability) || 0);
  state.activeAlchemy = normalizeAlchemy(state.activeAlchemy);
  state.inventoryPills = normalizeInventoryPills(state.inventoryPills, state.pills);
  state.buildings = normalizeBuildings(state.buildings);
  state.gear = normalizeLevels(state.gear, GEAR);
  state.gearQuality = normalizeGearQuality(state.gearQuality);
  state.gearAffixes = normalizeGearAffixes(state.gearAffixes);
  state.lootEquipment = normalizeLootEquipment(state.lootEquipment);
  state.equippedLoot = normalizeEquippedLoot(state.equippedLoot, state.lootEquipment);
  state.lockedLoot = normalizeLockedLoot(state.lockedLoot, state.lootEquipment);
  state.treasures = normalizeLevels(state.treasures, TREASURES);
  state.spiritBeasts = normalizeLevels(state.spiritBeasts, SPIRIT_BEASTS);
  state.activeOpportunity = normalizeOpportunity(state.activeOpportunity);
  state.resolvedOpportunities = normalizeResolvedOpportunities(state.resolvedOpportunities);
  state.lastMissionEvent = normalizeMissionEvent(state.lastMissionEvent);
  state.lastMissionReport = normalizeMissionReport(state.lastMissionReport);
  state.cultivationPaths = normalizeLevels(state.cultivationPaths, CULTIVATION_PATHS);
  state.formations = normalizeLevels(state.formations, FORMATIONS);
  state.completedMissions = normalizeCompletedMissions(state.completedMissions);
  state.mapReputation = normalizeMapValues(state.mapReputation);
  state.defeatedBosses = normalizeDefeatedBosses(state.defeatedBosses);
  state.claimedGoals = normalizeClaimedGoals(state.claimedGoals);
  state.claimedChapterRewards = normalizeClaimedGoals(state.claimedChapterRewards);
  state.permanentBonuses = normalizePermanentBonuses(state.permanentBonuses);
  state.autoMissionId = MISSIONS[state.autoMissionId] ? state.autoMissionId : null;
  state.craftedPills = Math.max(0, Number(state.craftedPills) || 0);
  state.arrayFlags = Math.max(0, Number(state.arrayFlags) || 0);
  state.forgingEssence = Math.max(0, Number(state.forgingEssence) || 0);
  state.sectDisciples = clampInteger(state.sectDisciples, 0, getSectCapacity(state));
  state.sectReputation = Math.max(0, Number(state.sectReputation) || 0);
  state.sectRoster = normalizeSectRoster(state.sectRoster, state.sectDisciples);
  state.sectAssignments = normalizeSectAssignments(state.sectAssignments, state.sectDisciples);
  syncSectRosterJobs(state);
  state.sectCarry = normalizeSectCarry(state.sectCarry);
  state.dailyClaims = normalizeNestedClaims(state.dailyClaims);
  state.dailyProgress = normalizeDailyProgress(state.dailyProgress);
  state.marketPurchases = normalizeNestedClaims(state.marketPurchases);
  state.pills = state.inventoryPills.gatherQiPill;
  state.log = Array.isArray(state.log) ? state.log.slice(0, 20) : [];
  state.activeMission = normalizeMission(state.activeMission);
  state.lastUpdatedAt = Number.isFinite(state.lastUpdatedAt) ? state.lastUpdatedAt : now;
  return state;
}

export function getCurrentRealm(state) {
  return REALMS[state.realmIndex] ?? REALMS[0];
}

export function getRealmProgress(state) {
  const realm = getCurrentRealm(state);
  return Math.max(0, Math.min(1, state.qi / realm.requiredQi));
}

export function getUpgradeTier(level) {
  return UPGRADE_TIERS.find((tier) => level >= tier.minLevel && level <= tier.maxLevel) ?? UPGRADE_TIERS[UPGRADE_TIERS.length - 1];
}

export function getRealmUpgradeLimit(state) {
  const realmIndex = state.realmIndex ?? 0;
  return UPGRADE_TIERS.reduce((limit, tier) => (realmIndex >= tier.realmIndex ? tier.maxLevel : limit), UPGRADE_TIERS[0].maxLevel);
}

function getGearIntent(slot) {
  return GEAR_INTENTS[slot] ?? { id: 'balanced', name: '守中', detail: '气机均衡，可稳步修行。' };
}

function getTieredLevelValue(level, perLevel) {
  const safeLevel = clampInteger(level, 0, UPGRADE_TIERS[UPGRADE_TIERS.length - 1].maxLevel);
  if (safeLevel <= 0 || !perLevel) {
    return 0;
  }
  const value = UPGRADE_TIERS.reduce((total, tier) => {
    const counted = Math.max(0, Math.min(safeLevel, tier.maxLevel) - tier.minLevel + 1);
    return total + counted * perLevel * tier.effectMultiplier;
  }, 0);
  return perLevel < 1 ? round(value) : Math.round(value);
}

function getTieredLootBonus(level) {
  const safeLevel = clampInteger(level, 0, UPGRADE_TIERS[UPGRADE_TIERS.length - 1].maxLevel);
  return round(UPGRADE_TIERS.reduce((total, tier) => {
    const counted = Math.max(0, Math.min(safeLevel, tier.maxLevel) - tier.minLevel + 1);
    return total + counted * tier.lootBonusPerLevel;
  }, 0));
}

function getTieredPercentBonus(level) {
  const safeLevel = clampInteger(level, 0, UPGRADE_TIERS[UPGRADE_TIERS.length - 1].maxLevel);
  return round(UPGRADE_TIERS.reduce((total, tier) => {
    const counted = Math.max(0, Math.min(safeLevel, tier.maxLevel) - tier.minLevel + 1);
    return total + counted * tier.percentBonusPerLevel;
  }, 0));
}

function tieredLinearCost(base, level) {
  const tier = getUpgradeTier(level);
  const tierLevel = Math.max(0, level - tier.minLevel);
  return Math.ceil(base * (tier.costBase + tier.costStep * tierLevel));
}

function tieredMaterialCost(base, level) {
  const tier = getUpgradeTier(level);
  const tierLevel = Math.max(0, level - tier.minLevel);
  return Math.ceil(base * (tier.essenceBase + tier.essenceStep * tierLevel));
}

export function getMissionStatus(state, missionId) {
  const mission = MISSIONS[missionId];
  if (!mission) {
    return { exists: false, unlocked: false };
  }
  const completed = state.completedMissions?.[missionId] ?? 0;
  const rareEvery = mission.rareEvery ?? 0;
  const rareStep = rareEvery && completed > 0 && completed % rareEvery === 0 ? rareEvery : completed % rareEvery;
  return {
    exists: true,
    id: mission.id,
    name: mission.name,
    map: mission.map ?? '青岚山',
    unlocked: (state.realmIndex ?? 0) >= (mission.unlockRealmIndex ?? 0),
    unlockRealmIndex: mission.unlockRealmIndex ?? 0,
    recommendedPower: getMissionDanger(state, mission),
    omen: getMissionOmen(state, mission),
    completed,
    rareProgress: rareEvery ? `${rareStep} / ${rareEvery}` : '',
    rareReward: mission.rareReward ?? null,
  };
}

export function getMapStatuses(state) {
  return Object.values(MISSION_MAPS).map((map) => {
    const routes = Object.values(MISSIONS).filter((mission) => getMissionMapId(mission) === map.id);
    const completed = routes.reduce((total, mission) => total + (state.completedMissions?.[mission.id] ?? 0), 0);
    const target = map.explorationTarget;
    const unlocked = (state.realmIndex ?? 0) >= map.unlockRealmIndex;
    const defeated = Boolean(state.defeatedBosses?.[map.id]);
    const ready = unlocked && completed >= target && !defeated;
    const mastery = getMapMastery(state, map.id);
    return {
      id: map.id,
      name: map.name,
      icon: map.icon,
      description: map.description,
      unlocked,
      unlockRealmIndex: map.unlockRealmIndex,
      routes: routes.map((mission) => mission.id),
      exploration: {
        completed,
        target,
        percent: target ? Math.min(1, completed / target) : 1,
      },
      reputation: state.mapReputation?.[map.id] ?? 0,
      mastery,
      boss: {
        ...map.boss,
        status: defeated ? 'defeated' : ready ? 'ready' : unlocked ? 'hidden' : 'locked',
        defeated,
        omen: getBossOmen(state, map),
      },
    };
  });
}

function getMissionOmen(state, mission) {
  const pressure = getMissionDanger(state, mission);
  const power = calculatePower(state);
  return buildOmen({
    power,
    pressure,
    demon: mission.failurePenalty?.heartDemon ?? 0,
    mapMastery: getMapMastery(state, getMissionMapId(mission)).level,
    unlocked: (state.realmIndex ?? 0) >= (mission.unlockRealmIndex ?? 0),
  });
}

function getBossOmen(state, map) {
  return buildOmen({
    power: calculatePower(state),
    pressure: map.boss.power,
    demon: map.boss.failurePenalty?.heartDemon ?? 0,
    mapMastery: getMapMastery(state, map.id).level,
    unlocked: (state.realmIndex ?? 0) >= map.unlockRealmIndex,
  });
}

function buildOmen({ power, pressure, demon = 0, mapMastery = 0, unlocked = true }) {
  if (!unlocked) {
    return {
      label: '卦象',
      name: '缘浅',
      detail: '劫象未显，境界尚未引动此地气机。',
      counsel: '宜备：先稳固境界，再循图而行。',
    };
  }
  if (pressure <= 0) {
    return {
      label: '卦象',
      name: '大吉',
      detail: '劫象已平，气机顺遂。',
      counsel: '宜备：可安心行游。',
    };
  }
  const ratio = power / pressure;
  const name = ratio >= 1.3 ? '小吉' : ratio >= 0.95 ? '平' : ratio >= 0.72 ? '有险' : '大凶';
  const signs = [];
  if (demon > 0) {
    signs.push('魔息偏盛');
  }
  if (ratio < 1) {
    signs.push('妖氛未散');
  }
  if (mapMastery <= 1) {
    signs.push('地势未熟');
  }
  if (ratio < 1.15) {
    signs.push('护持尚浅');
  }
  const detail = signs.length ? `劫象：${[...new Set(signs)].join('，')}` : '劫象：气机相合';
  const counsel = ratio < 1
    ? '宜备：先凝练道威，或温养法袍护身。'
    : mapMastery <= 1
      ? '宜备：多行游此地，熟悉地脉。'
      : '宜备：气机已稳，可择机前往。';
  return { label: '卦象', name, detail, counsel };
}

export function challengeMapBoss(state, mapId, now = Date.now()) {
  const map = MISSION_MAPS[mapId];
  if (!map) {
    return { ok: false, reason: 'unknownMap' };
  }
  const status = getMapStatuses(state).find((candidate) => candidate.id === mapId);
  if (!status.unlocked) {
    addLog(state, now, `${map.name}尚未解锁，无法挑战${map.boss.name}。`);
    return { ok: false, reason: 'realmLocked' };
  }
  if (status.boss.defeated) {
    return { ok: false, reason: 'alreadyDefeated' };
  }
  if (status.exploration.completed < status.exploration.target) {
    addLog(state, now, `${map.name}探索不足，尚未找到${map.boss.name}。`);
    return { ok: false, reason: 'notReady' };
  }
  if (calculatePower(state) < map.boss.power) {
    applyResources(state, map.boss.failurePenalty ?? {});
    state.injuryUntil = now + 120 * 1000;
    addLog(state, now, `挑战${map.boss.name}失利，需继续提升道行。`);
    return { ok: false, reason: 'powerLow', requiredPower: map.boss.power };
  }

  applyResources(state, map.boss.reward);
  addMapReputation(state, map.id, map.boss.reputation ?? 0);
  state.defeatedBosses[map.id] = true;
  addLog(state, now, `镇压${map.boss.name}，${map.name}声望大涨，获得${formatReward(map.boss.reward)}。`);
  return { ok: true, reward: map.boss.reward, boss: map.boss };
}

export function calculateQiRate(state, now = Date.now()) {
  const realm = getCurrentRealm(state);
  const buildingBonus = 1 + ((state.buildings?.meditationSeat ?? 1) - 1) * BUILDINGS.meditationSeat.qiBonusPerLevel;
  const formationBonus = 1 + (state.formations?.spiritGathering ?? 0) * FORMATIONS.spiritGathering.qiBonusPerLevel;
  const affixBonus = 1 + getGearAffixBonus(state, 'qiBonus');
  const pathBonus = 1 + (state.cultivationPaths?.formation ?? 0) * CULTIVATION_PATHS.formation.qiBonusPerLevel;
  const permanentBonus = 1 + (state.permanentBonuses?.qiRate ?? 0);
  const lootBonus = 1 + getEquippedLootBonus(state, 'qiRate');
  const masteryBonus = 1 + getMapMasteryBonus(state, 'qiRate');
  const treasureBonus = 1 + getTreasureBonus(state, 'qiRate');
  const beastBonus = 1 + getSpiritBeastBonus(state, 'qiRate');
  const pillBoost = state.pillBoostUntil && state.pillBoostUntil > now ? 1.4 : 1;
  const injuryPenalty = state.injuryUntil && state.injuryUntil > now ? 0.75 : 1;
  return round(realm.qiRate * buildingBonus * formationBonus * affixBonus * pathBonus * permanentBonus * lootBonus * masteryBonus * treasureBonus * beastBonus * pillBoost * injuryPenalty);
}

export function calculateBreakthroughChance(state, now = Date.now()) {
  const realm = getCurrentRealm(state);
  const overfill = Math.max(0, state.qi - realm.requiredQi);
  const preparation = Math.min(0.2, overfill / realm.requiredQi / 2);
  const insightBonus = Math.min(0.15, (state.insight ?? 0) * 0.03);
  const gearBonus = Math.min(0.18, getTieredLevelValue(state.gear?.amulet ?? 0, GEAR.amulet.breakthroughPerLevel));
  const affixBonus = Math.min(0.08, getGearAffixBonus(state, 'breakthrough'));
  const lootBonus = Math.min(0.1, getEquippedLootBonus(state, 'breakthrough'));
  const formationBonus = Math.min(0.12, (state.formations?.mountainGuard ?? 0) * FORMATIONS.mountainGuard.stabilityPerLevel);
  const treasureBonus = Math.min(0.12, getTreasureBonus(state, 'breakthrough'));
  const beastBonus = Math.min(0.08, getSpiritBeastBonus(state, 'breakthrough'));
  const pillBonus = state.breakthroughBoostUntil && state.breakthroughBoostUntil > now ? 0.12 : 0;
  const foundationBonus = Math.min(0.15, (state.foundationStability ?? 0) * 0.05);
  const heartDemonPenalty = Math.min(0.35, (state.heartDemon ?? 0) * 0.15);
  return round(Math.max(0.25, Math.min(0.95, 0.75 + preparation + insightBonus + gearBonus + affixBonus + lootBonus + formationBonus + treasureBonus + beastBonus + pillBonus + foundationBonus - heartDemonPenalty)));
}

export function calculatePower(state) {
  const realmPower = getRealmPower(state);
  const pathPower = (state.cultivationPaths?.sword ?? 0) * CULTIVATION_PATHS.sword.powerPerLevel;
  const swordPower = (state.buildings?.swordArray ?? 0) * BUILDINGS.swordArray.powerPerLevel;
  const gearPower = getTieredLevelValue(state.gear?.weapon ?? 0, GEAR.weapon.powerPerLevel);
  const gearQualityPower = Object.values(state.gearQuality ?? {}).reduce((total, qualityIndex) => total + (GEAR_QUALITIES[qualityIndex]?.powerBonus ?? 0), 0);
  const affixPower = getGearAffixBonus(state, 'powerBonus');
  const formationPower = (state.formations?.swordArray ?? 0) * FORMATIONS.swordArray.powerPerLevel;
  const permanentPower = state.permanentBonuses?.power ?? 0;
  const lootPower = getEquippedLootBonus(state, 'power');
  const masteryPower = getMapMasteryBonus(state, 'power');
  const treasurePower = getTreasureBonus(state, 'power');
  const beastPower = getSpiritBeastBonus(state, 'power');
  const sectPower = Math.floor((state.sectReputation ?? 0) / 20) * 4;
  const qiPower = Math.min(90, Math.floor((state.qi ?? 0) * 0.5));
  const demonPenalty = (state.heartDemon ?? 0) * 8;
  return Math.max(10, Math.floor(realmPower + pathPower + swordPower + gearPower + gearQualityPower + affixPower + formationPower + permanentPower + lootPower + masteryPower + treasurePower + beastPower + sectPower + qiPower - demonPenalty));
}

function getRealmPower(state) {
  return Math.round(((state.realmIndex ?? 0) + 1) * 22);
}

export function getCharacterProfile(state, now = Date.now()) {
  const realm = getCurrentRealm(state);
  const attackSources = compactSources([
    { label: '境界威压', value: getRealmPower(state) },
    { label: '剑诀火候', value: (state.cultivationPaths?.sword ?? 0) * CULTIVATION_PATHS.sword.powerPerLevel },
    { label: '洞府剑阵', value: (state.buildings?.swordArray ?? 0) * BUILDINGS.swordArray.powerPerLevel },
    { label: '兵刃品阶', value: getTieredLevelValue(state.gear?.weapon ?? 0, GEAR.weapon.powerPerLevel) },
    { label: '炼器品相', value: Object.values(state.gearQuality ?? {}).reduce((total, qualityIndex) => total + (GEAR_QUALITIES[qualityIndex]?.powerBonus ?? 0), 0) },
    { label: '灵纹词条', value: getGearAffixBonus(state, 'powerBonus') },
    { label: '剑阵杀意', value: (state.formations?.swordArray ?? 0) * FORMATIONS.swordArray.powerPerLevel },
    { label: '奇珍加持', value: getEquippedLootBonus(state, 'power') },
    { label: '地脉熟稔', value: getMapMasteryBonus(state, 'power') },
    { label: '法宝灵蕴', value: getTreasureBonus(state, 'power') },
    { label: '灵兽护持', value: getSpiritBeastBonus(state, 'power') },
    { label: '洞天底蕴', value: state.permanentBonuses?.power ?? 0 },
    { label: '山门威望', value: Math.floor((state.sectReputation ?? 0) / 20) * 4 },
  ]);
  const cultivationSources = compactSources([
    { label: '境界周天', value: realm.qiRate, mode: 'base' },
    { label: '静室蒲团', value: ((state.buildings?.meditationSeat ?? 1) - 1) * BUILDINGS.meditationSeat.qiBonusPerLevel, mode: 'percent' },
    { label: '聚灵阵纹', value: (state.formations?.spiritGathering ?? 0) * FORMATIONS.spiritGathering.qiBonusPerLevel, mode: 'percent' },
    { label: '护符灵纹', value: getGearAffixBonus(state, 'qiBonus'), mode: 'percent' },
    { label: '阵道感悟', value: (state.cultivationPaths?.formation ?? 0) * CULTIVATION_PATHS.formation.qiBonusPerLevel, mode: 'percent' },
    { label: '奇珍加持', value: getEquippedLootBonus(state, 'qiRate'), mode: 'percent' },
    { label: '地脉熟稔', value: getMapMasteryBonus(state, 'qiRate'), mode: 'percent' },
    { label: '法宝灵蕴', value: getTreasureBonus(state, 'qiRate'), mode: 'percent' },
    { label: '灵兽护持', value: getSpiritBeastBonus(state, 'qiRate'), mode: 'percent' },
    { label: '洞天底蕴', value: state.permanentBonuses?.qiRate ?? 0, mode: 'percent' },
    { label: '丹力催行', value: state.pillBoostUntil && state.pillBoostUntil > now ? 0.4 : 0, mode: 'percent' },
  ]);
  const breakthroughSources = compactSources([
    { label: '本命道基', value: 0.75, mode: 'percent' },
    { label: '护符护脉', value: Math.min(0.18, getTieredLevelValue(state.gear?.amulet ?? 0, GEAR.amulet.breakthroughPerLevel)), mode: 'percent' },
    { label: '灵纹词条', value: Math.min(0.08, getGearAffixBonus(state, 'breakthrough')), mode: 'percent' },
    { label: '护山阵势', value: Math.min(0.12, (state.formations?.mountainGuard ?? 0) * FORMATIONS.mountainGuard.stabilityPerLevel), mode: 'percent' },
    { label: '奇珍加持', value: Math.min(0.1, getEquippedLootBonus(state, 'breakthrough')), mode: 'percent' },
    { label: '法宝灵蕴', value: Math.min(0.12, getTreasureBonus(state, 'breakthrough')), mode: 'percent' },
    { label: '悟道灵光', value: Math.min(0.15, (state.insight ?? 0) * 0.03), mode: 'percent' },
    { label: '根基沉淀', value: Math.min(0.15, (state.foundationStability ?? 0) * 0.05), mode: 'percent' },
    { label: '心魔侵扰', value: -Math.min(0.35, (state.heartDemon ?? 0) * 0.15), mode: 'percent' },
  ], true);
  const explorationSafety = getTieredLevelValue(state.gear?.robe ?? 0, GEAR.robe.dangerReductionPerLevel)
    + getGearAffixBonus(state, 'dangerReduction')
    + getEquippedLootBonus(state, 'dangerReduction')
    + getMapMasteryBonus(state, 'dangerReduction')
    + getTreasureBonus(state, 'dangerReduction')
    + getSpiritBeastBonus(state, 'dangerReduction')
    + (state.cultivationPaths?.sword ?? 0) * CULTIVATION_PATHS.sword.dangerReductionPerLevel;

  return {
    realmName: realm.name,
    combatPower: {
      label: '道行总纲',
      value: calculatePower(state),
      sources: attackSources,
    },
    attributes: [
      { id: 'attack', label: '道威', value: attackSources.reduce((total, source) => total + source.value, 0), sources: attackSources },
      { id: 'cultivationSpeed', label: '灵息', value: calculateQiRate(state, now), unit: '/分钟', sources: cultivationSources },
      { id: 'breakthrough', label: '破境天机', value: calculateBreakthroughChance(state, now), unit: '%', sources: breakthroughSources },
      { id: 'explorationSafety', label: '护体玄光', value: explorationSafety, sources: compactSources([
        { label: '法袍护身', value: getTieredLevelValue(state.gear?.robe ?? 0, GEAR.robe.dangerReductionPerLevel) },
        { label: '灵纹词条', value: getGearAffixBonus(state, 'dangerReduction') },
        { label: '奇珍加持', value: getEquippedLootBonus(state, 'dangerReduction') },
        { label: '地脉熟稔', value: getMapMasteryBonus(state, 'dangerReduction') },
        { label: '法宝灵蕴', value: getTreasureBonus(state, 'dangerReduction') },
        { label: '灵兽护持', value: getSpiritBeastBonus(state, 'dangerReduction') },
      ]) },
      { id: 'sectInfluence', label: '山门气运', value: Math.floor(state.sectReputation ?? 0), sources: [{ label: getSectLevel(state).name, value: Math.floor(state.sectReputation ?? 0) }] },
    ],
  };
}

export function getGearQuality(state, gearId) {
  const qualityIndex = state.gearQuality?.[gearId] ?? 0;
  const affixId = state.gearAffixes?.[gearId] ?? null;
  const affix = affixId ? GEAR_AFFIXES[affixId] : null;
  return {
    qualityIndex,
    qualityName: GEAR_QUALITIES[qualityIndex]?.name ?? GEAR_QUALITIES[0].name,
    affixId,
    affixName: affix?.name ?? '无词条',
  };
}

export function getEquipmentDetails(state) {
  return {
    gear: Object.values(GEAR).map((item) => {
      const level = state.gear?.[item.id] ?? 0;
      const quality = getGearQuality(state, item.id);
      const affix = quality.affixId ? GEAR_AFFIXES[quality.affixId] : null;
      const maxed = level >= item.maxLevel;
      const nextLevel = level + 1;
      const realmLocked = nextLevel > getRealmUpgradeLimit(state);
      const qualityMaxed = quality.qualityIndex >= GEAR_QUALITIES.length - 1;
      const nextQuality = quality.qualityIndex + 1;
      return {
        id: item.id,
        name: item.name,
        level,
        maxLevel: item.maxLevel,
        tier: getUpgradeTier(Math.max(1, maxed ? level : nextLevel)),
        intent: getGearIntent(item.id),
        qualityIndex: quality.qualityIndex,
        qualityName: quality.qualityName,
        affix: affix ? { id: affix.id, name: affix.name, effects: effectsFromBonusObject(affix) } : { id: null, name: '无词条', effects: [] },
        effects: getGearEffects(item.id, level, quality.qualityIndex, affix),
        nextEffects: maxed ? [] : getGearEffects(item.id, nextLevel, quality.qualityIndex, affix),
        upgrade: {
          maxed,
          realmLocked,
          nextLevel,
          cost: maxed || realmLocked ? null : item.cost(nextLevel),
        },
        refinement: {
          maxed: qualityMaxed,
          nextQualityName: qualityMaxed ? null : GEAR_QUALITIES[nextQuality]?.name,
          chance: qualityMaxed || level <= 0 ? 0 : GEAR_QUALITIES[quality.qualityIndex]?.refineChance ?? 0,
          cost: qualityMaxed || level <= 0 ? null : getRefineCost(nextQuality),
        },
      };
    }),
    loot: (state.lootEquipment ?? []).map((item) => ({
      uid: item.uid,
      name: item.name,
      slot: item.slot,
      level: item.level ?? 0,
      maxLevel: getLootMaxLevel(item),
      tier: getUpgradeTier(Math.max(1, item.level ?? 1)),
      intent: getGearIntent(item.slot),
      equipped: state.equippedLoot?.[item.slot] === item.uid,
      locked: Boolean(state.lockedLoot?.[item.uid]),
      effects: effectsFromBonusObject(item.bonuses ?? {}),
      comparison: compareLootEquipment(state, item),
      nextEffects: (item.level ?? 0) >= getLootMaxLevel(item) ? [] : effectsFromBonusObject(createLootBonuses(item.templateId, (item.level ?? 0) + 1)),
      empower: {
        maxed: (item.level ?? 0) >= getLootMaxLevel(item),
        nextLevel: (item.level ?? 0) + 1,
        cost: (item.level ?? 0) >= getLootMaxLevel(item) ? null : getLootEmpowerCost((item.level ?? 0) + 1),
      },
    })),
    treasures: Object.values(TREASURES).map((treasure) => {
      const level = state.treasures?.[treasure.id] ?? 0;
      return {
        id: treasure.id,
        name: treasure.name,
        detail: treasure.detail,
        level,
        maxLevel: treasure.maxLevel,
        effects: effectsFromBonusObject(scaleBonusObject(treasure.bonuses, level)),
        nextEffects: level < treasure.maxLevel ? effectsFromBonusObject(scaleBonusObject(treasure.bonuses, level + 1)) : [],
      };
    }),
    spiritBeasts: Object.values(SPIRIT_BEASTS).map((beast) => {
      const level = state.spiritBeasts?.[beast.id] ?? 0;
      return {
        id: beast.id,
        name: beast.name,
        detail: beast.detail,
        level,
        maxLevel: beast.maxLevel,
        effects: effectsFromBonusObject(scaleBonusObject(beast.bonuses, level)),
        nextEffects: level < beast.maxLevel ? effectsFromBonusObject(scaleBonusObject(beast.bonuses, level + 1)) : [],
      };
    }),
  };
}

export function getEquippedLoot(state, slot) {
  const uid = state.equippedLoot?.[slot] ?? null;
  return state.lootEquipment?.find((item) => item.uid === uid) ?? null;
}

export function equipLootEquipment(state, uid, now = Date.now()) {
  const item = state.lootEquipment?.find((candidate) => candidate.uid === uid);
  if (!item) {
    return { ok: false, reason: 'unknownLoot' };
  }
  state.equippedLoot[item.slot] = item.uid;
  addLog(state, now, `换上${item.name}，${GEAR[item.slot]?.name ?? '装备'}气象一新。`);
  return { ok: true, item };
}

export function toggleLootLock(state, uid, now = Date.now()) {
  const item = state.lootEquipment?.find((candidate) => candidate.uid === uid);
  if (!item) {
    return { ok: false, reason: 'unknownLoot' };
  }
  state.lockedLoot ??= {};
  const locked = !state.lockedLoot[uid];
  if (locked) {
    state.lockedLoot[uid] = true;
  } else {
    delete state.lockedLoot[uid];
  }
  addLog(state, now, locked ? `已锁定${item.name}，整理时会保留。` : `已解除${item.name}锁定。`);
  return { ok: true, item, locked };
}

export function disassembleLootEquipment(state, uid, now = Date.now()) {
  const itemIndex = state.lootEquipment?.findIndex((candidate) => candidate.uid === uid) ?? -1;
  if (itemIndex < 0) {
    return { ok: false, reason: 'unknownLoot' };
  }
  const item = state.lootEquipment[itemIndex];
  if (state.equippedLoot?.[item.slot] === item.uid) {
    return { ok: false, reason: 'equipped' };
  }
  if (state.lockedLoot?.[item.uid]) {
    return { ok: false, reason: 'locked' };
  }

  state.lootEquipment.splice(itemIndex, 1);
  if (state.lockedLoot) {
    delete state.lockedLoot[item.uid];
  }
  const reward = {
    forgingEssence: 2 + (item.level ?? 0),
    artifacts: 1,
  };
  applyResources(state, reward);
  addLog(state, now, `分解${item.name}，获得${formatReward(reward)}。`);
  return { ok: true, reward, item };
}

export function organizeLootEquipment(state, now = Date.now()) {
  const items = state.lootEquipment ?? [];
  if (!items.length) {
    return { ok: true, removed: 0, reward: {}, items: [] };
  }

  const keepUids = new Set(Object.values(state.equippedLoot ?? {}).filter(Boolean));
  Object.entries(state.lockedLoot ?? {}).forEach(([uid, locked]) => {
    if (locked) keepUids.add(uid);
  });

  Object.values(GEAR).forEach((gearItem) => {
    const candidate = items
      .filter((item) => item.slot === gearItem.id && !keepUids.has(item.uid))
      .sort((a, b) => getLootScore(b) - getLootScore(a))[0];
    if (candidate) {
      keepUids.add(candidate.uid);
    }
  });

  const removedItems = items.filter((item) => !keepUids.has(item.uid));
  if (!removedItems.length) {
    addLog(state, now, '整理战利品，没有可分解的闲置装备。');
    return { ok: true, removed: 0, reward: {}, items: [] };
  }

  const reward = removedItems.reduce((total, item) => ({
    forgingEssence: total.forgingEssence + 2 + (item.level ?? 0),
    artifacts: total.artifacts + 1,
  }), { forgingEssence: 0, artifacts: 0 });
  state.lootEquipment = items.filter((item) => keepUids.has(item.uid));
  if (state.lockedLoot) {
    Object.keys(state.lockedLoot).forEach((uid) => {
      if (!state.lootEquipment.some((item) => item.uid === uid)) {
        delete state.lockedLoot[uid];
      }
    });
  }
  applyResources(state, reward);
  addLog(state, now, `整理战利品，分解 ${removedItems.length} 件闲置装备，获得${formatReward(reward)}。`);
  return { ok: true, removed: removedItems.length, reward, items: removedItems };
}

export function empowerLootEquipment(state, uid, now = Date.now()) {
  const item = state.lootEquipment?.find((candidate) => candidate.uid === uid);
  if (!item) {
    return { ok: false, reason: 'unknownLoot' };
  }
  const level = item.level ?? 0;
  const maxLevel = getLootMaxLevel(item);
  if (level >= maxLevel) {
    return { ok: false, reason: 'maxLevel' };
  }
  const cost = getLootEmpowerCost(level + 1);
  if (!canAfford(state, cost)) {
    addLog(state, now, `强化${item.name}需要${formatReward(cost)}。`);
    return { ok: false, reason: 'notEnoughResources' };
  }

  payResources(state, cost);
  item.level = level + 1;
  item.bonuses = createLootBonuses(item.templateId, item.level);
  addLog(state, now, `${item.name}强化至 ${item.level} 级。`);
  return { ok: true, item, level: item.level };
}

export function getLootEmpowerCost(nextLevel) {
  const cost = {
    spiritStones: tieredLinearCost(90, nextLevel),
    forgingEssence: tieredMaterialCost(2, nextLevel),
  };
  if (nextLevel >= 4) {
    cost.artifacts = Math.ceil((nextLevel - 3) / 2);
  }
  if (nextLevel >= 7) {
    cost.beastCores = Math.ceil((nextLevel - 6) / 2);
  }
  if (nextLevel >= 10) {
    cost.arrayFlags = Math.ceil((nextLevel - 9) / 2);
  }
  return cost;
}

export function getDominantPath(state) {
  const entries = Object.entries(state.cultivationPaths ?? {});
  const [pathId, level] = entries.reduce((best, current) => (current[1] > best[1] ? current : best), ['none', 0]);
  if (!level || !CULTIVATION_PATHS[pathId]) {
    return { id: 'none', name: '未定', level: 0 };
  }
  return { id: pathId, name: CULTIVATION_PATHS[pathId].name, level };
}

export function getMainlineChapters(state) {
  return MAINLINE_CHAPTERS.map((chapter, index) => {
    const locked = !isMainlineChapterUnlocked(state, index);
    const objectives = chapter.objectives.map((objective) => hydrateMainlineObjective(state, objective));
    const completedCount = objectives.filter((objective) => objective.completed).length;
    const completed = completedCount === objectives.length;
    const allObjectivesClaimed = objectives.every((objective) => objective.claimed);
    const rewardClaimed = Boolean(state.claimedChapterRewards?.[chapter.id]);

    return {
      id: chapter.id,
      title: chapter.title,
      subtitle: chapter.subtitle,
      reward: chapter.reward,
      locked,
      completed,
      completedCount,
      allObjectivesClaimed,
      rewardClaimed,
      objectives,
    };
  });
}

export function getGoals(state) {
  return MAINLINE_CHAPTERS[0].objectives.map((objective) => hydrateMainlineObjective(state, objective));
}

export function getNextGuidance(state) {
  const activeMission = state.activeMission ? MISSIONS[state.activeMission.id] : null;
  if (activeMission) {
    return {
      title: `正在历练：${activeMission.name}`,
      detail: '等待历练完成，或先处理丹房、装备和宗门委托。',
      tab: 'missions',
    };
  }
  if (state.activeAlchemy) {
    const recipe = PILL_RECIPES[state.activeAlchemy.recipeId] ?? PILL_RECIPES.gatherQiPill;
    return {
      title: `正在炼制${recipe.name}`,
      detail: '丹成后服用或继续排下一炉，能明显提高突破准备效率。',
      tab: 'alchemy',
    };
  }

  const realm = getCurrentRealm(state);
  if ((state.qi ?? 0) >= realm.requiredQi && state.realmIndex < REALMS.length - 1) {
    return {
      title: '可以破境',
      detail: `灵气已满，当前破境天机 ${Math.round(calculateBreakthroughChance(state) * 100)}%。`,
      tab: 'goals',
    };
  }
  if ((state.realmIndex ?? 0) <= 1) {
    return {
      title: '积攒灵气',
      detail: `距离下一次突破还差 ${Math.ceil(Math.max(0, realm.requiredQi - (state.qi ?? 0)))} 灵气。`,
      tab: 'goals',
    };
  }

  const readyBoss = getMapStatuses(state).find((map) => map.boss.status === 'ready' && calculatePower(state) >= map.boss.power);
  if (readyBoss) {
    return {
      title: `挑战${readyBoss.boss.name}`,
      detail: `${readyBoss.name}探索已足，镇压首领可获得永久成长和炼器精魄。`,
      tab: 'missions',
    };
  }

  const chapter = getMainlineChapters(state).find((candidate) => !candidate.locked && !candidate.rewardClaimed);
  const claimableObjective = chapter?.objectives.find((objective) => objective.completed && !objective.claimed);
  if (claimableObjective) {
    return {
      title: `领取${claimableObjective.title}`,
      detail: `目标已完成，可领取 ${formatReward(claimableObjective.reward)}。`,
      tab: 'goals',
    };
  }
  const nextObjective = chapter?.objectives.find((objective) => !objective.completed);
  if (nextObjective) {
    return {
      title: nextObjective.title,
      detail: nextObjective.detail,
      tab: getGuidanceTabForObjective(nextObjective.id),
    };
  }

  const sect = getSectStatus(state);
  if (sect.unlocked && sect.idle > 0) {
    return {
      title: '分配宗门弟子',
      detail: '空闲弟子不会产出，把弟子派去采药、采矿或护山。',
      tab: 'sect',
    };
  }
  return {
    title: '继续积累底蕴',
    detail: '刷地图声望、强化战利品、提升洞府和阵法，准备下一轮突破。',
    tab: 'missions',
  };
}

export function isDailyUnlocked(state) {
  return getGoals(state).filter((goal) => goal.completed).length >= 3;
}

export function getDailyTasks(state, dateKey = getDateKey()) {
  const unlocked = isDailyUnlocked(state);
  const claims = state.dailyClaims?.[dateKey] ?? {};
  const progress = getDailyProgress(state, dateKey);
  return Object.values(DAILY_TASKS).map((task) => ({
    ...task,
    unlocked,
    progress: Math.min(task.target, Math.floor(progress[task.progressKey] ?? 0)),
    completed: (progress[task.progressKey] ?? 0) >= task.target,
    claimed: Boolean(claims[task.id]),
  }));
}

export function claimDailyTask(state, taskId, dateKey = getDateKey(), now = Date.now()) {
  const task = DAILY_TASKS[taskId];
  if (!task) {
    return { ok: false, reason: 'unknownTask' };
  }
  if (!isDailyUnlocked(state)) {
    return { ok: false, reason: 'locked' };
  }
  const progress = getDailyProgress(state, dateKey);
  if ((progress[task.progressKey] ?? 0) < task.target) {
    return { ok: false, reason: 'notComplete' };
  }

  state.dailyClaims[dateKey] ??= {};
  if (state.dailyClaims[dateKey][taskId]) {
    return { ok: false, reason: 'alreadyClaimed' };
  }

  applyResources(state, task.reward);
  state.dailyClaims[dateKey][taskId] = true;
  addLog(state, now, `完成日常「${task.title}」，获得${formatReward(task.reward)}。`);
  return { ok: true, reward: task.reward };
}

export function buyMarketItem(state, itemId, now = Date.now()) {
  const item = MARKET_ITEMS[itemId];
  if (!item) {
    return { ok: false, reason: 'unknownItem' };
  }
  if (!canAfford(state, item.cost)) {
    addLog(state, now, `购买${item.name}需要${formatReward(item.cost)}。`);
    return { ok: false, reason: 'notEnoughResources' };
  }

  payResources(state, item.cost);
  applyResources(state, item.reward);
  addDailyProgress(state, 'marketBuys', 1, now);
  const dateKey = getDateKey(now);
  state.marketPurchases[dateKey] ??= {};
  state.marketPurchases[dateKey][itemId] = (state.marketPurchases[dateKey][itemId] ?? 0) + 1;
  addLog(state, now, `坊市购得${item.name}，获得${formatReward(item.reward)}。`);
  return { ok: true, reward: item.reward };
}

export function getSectStatus(state) {
  const unlocked = isSectUnlocked(state);
  const disciples = state.sectDisciples ?? 0;
  const capacity = getSectCapacity(state);
  const assignments = normalizeSectAssignments(state.sectAssignments, disciples);
  const assigned = Object.values(assignments).reduce((total, count) => total + count, 0);
  const sectLevel = getSectLevel(state);
  const roster = normalizeSectRoster(state.sectRoster, disciples);
  return {
    unlocked,
    level: sectLevel.level,
    levelName: sectLevel.name,
    nextReputation: getNextSectReputation(state),
    disciples,
    capacity,
    assigned,
    idle: Math.max(0, disciples - assigned),
    reputation: Math.floor(state.sectReputation ?? 0),
    commissionBonus: sectLevel.commissionBonus,
    roster: roster.map((disciple) => hydrateDisciple(disciple)),
    recruitCost: disciples >= capacity ? null : getRecruitCost(disciples + 1),
    commissions: Object.values(SECT_COMMISSIONS).map((commission) => ({
      ...commission,
      assigned: assignments[commission.id] ?? 0,
      outputMultiplier: round(getCommissionMultiplier(state, commission.id)),
    })),
  };
}

export function recruitDisciple(state, now = Date.now()) {
  if (!isSectUnlocked(state)) {
    return { ok: false, reason: 'locked' };
  }
  const capacity = getSectCapacity(state);
  const current = state.sectDisciples ?? 0;
  if (current >= capacity) {
    return { ok: false, reason: 'full' };
  }
  const cost = getRecruitCost(current + 1);
  if (!canAfford(state, cost)) {
    addLog(state, now, `招募弟子需要${formatReward(cost)}。`);
    return { ok: false, reason: 'notEnoughResources' };
  }

  payResources(state, cost);
  state.sectDisciples = current + 1;
  state.sectRoster = normalizeSectRoster(state.sectRoster, current);
  const disciple = createDisciple(state.sectRoster.length, now);
  state.sectRoster.push(disciple);
  syncSectRosterJobs(state);
  addLog(state, now, `${disciple.name}拜入山门，宗门弟子增至 ${state.sectDisciples} 人。`);
  return { ok: true, disciples: state.sectDisciples, disciple: hydrateDisciple(disciple) };
}

export function assignSectDisciple(state, commissionId, delta = 1, now = Date.now()) {
  if (!isSectUnlocked(state)) {
    return { ok: false, reason: 'locked' };
  }
  const commission = SECT_COMMISSIONS[commissionId];
  if (!commission) {
    return { ok: false, reason: 'unknownCommission' };
  }
  state.sectAssignments = normalizeSectAssignments(state.sectAssignments, state.sectDisciples ?? 0);
  const current = state.sectAssignments[commissionId] ?? 0;
  const assigned = Object.values(state.sectAssignments).reduce((total, count) => total + count, 0);
  const safeDelta = Math.trunc(Number(delta) || 0);
  if (safeDelta > 0 && assigned >= (state.sectDisciples ?? 0)) {
    return { ok: false, reason: 'noIdleDisciple' };
  }
  if (safeDelta < 0 && current <= 0) {
    return { ok: false, reason: 'noneAssigned' };
  }
  const next = Math.max(0, current + safeDelta);
  state.sectAssignments[commissionId] = next;
  state.sectRoster = normalizeSectRoster(state.sectRoster, state.sectDisciples ?? 0);
  syncSectRosterJobs(state);
  addLog(state, now, `${commission.name}现有 ${next} 名弟子。`);
  return { ok: true, assigned: next };
}

export function resolveOpportunity(state, choiceId, now = Date.now(), random = Math.random) {
  const active = normalizeOpportunity(state.activeOpportunity);
  if (!active) {
    return { ok: false, reason: 'noOpportunity' };
  }
  const opportunity = OPPORTUNITIES[active.id];
  const choice = opportunity?.choices.find((candidate) => candidate.id === choiceId);
  if (!opportunity || !choice) {
    return { ok: false, reason: 'unknownChoice' };
  }
  if (!canAfford(state, choice.cost ?? {})) {
    addLog(state, now, `处理${opportunity.name}需要${formatReward(choice.cost)}。`);
    return { ok: false, reason: 'notEnoughResources', opportunity, choice, cost: choice.cost ?? {} };
  }

  payResources(state, choice.cost ?? {});
  const chance = choice.successChance ?? 1;
  if (random() > chance) {
    applyResources(state, choice.failurePenalty ?? {});
    state.activeOpportunity = null;
    addResolvedOpportunity(state, opportunity.id, choice.id);
    addLog(state, now, `机缘「${opportunity.name}」处理失手，承受${formatReward(choice.failurePenalty ?? {}) || '些许反噬'}。`);
    return { ok: false, reason: 'failed', chance, opportunity, choice };
  }

  applyResources(state, choice.reward ?? {});
  state.activeOpportunity = null;
  addResolvedOpportunity(state, opportunity.id, choice.id);
  addLog(state, now, `机缘「${opportunity.name}」选择「${choice.title}」，获得${formatReward(choice.reward ?? {})}。`);
  return { ok: true, reward: choice.reward ?? {}, opportunity, choice };
}

export function upgradeTreasure(state, treasureId, now = Date.now()) {
  const treasure = TREASURES[treasureId];
  if (!treasure) {
    return { ok: false, reason: 'unknownTreasure' };
  }
  state.treasures = normalizeLevels(state.treasures, TREASURES);
  const currentLevel = state.treasures[treasureId] ?? 0;
  if (currentLevel >= treasure.maxLevel) {
    return { ok: false, reason: 'maxLevel' };
  }
  const nextLevel = currentLevel + 1;
  const cost = treasure.cost(nextLevel);
  if (!canAfford(state, cost)) {
    addLog(state, now, `温养${treasure.name}需要${formatReward(cost)}。`);
    return { ok: false, reason: 'notEnoughResources' };
  }

  payResources(state, cost);
  state.treasures[treasureId] = nextLevel;
  addLog(state, now, `${treasure.name}温养至 ${nextLevel} 级。`);
  return { ok: true, level: nextLevel };
}

export function trainSpiritBeast(state, beastId, now = Date.now()) {
  const beast = SPIRIT_BEASTS[beastId];
  if (!beast) {
    return { ok: false, reason: 'unknownSpiritBeast' };
  }
  state.spiritBeasts = normalizeLevels(state.spiritBeasts, SPIRIT_BEASTS);
  const currentLevel = state.spiritBeasts[beastId] ?? 0;
  if (currentLevel >= beast.maxLevel) {
    return { ok: false, reason: 'maxLevel' };
  }
  const nextLevel = currentLevel + 1;
  const cost = beast.cost(nextLevel);
  if (!canAfford(state, cost)) {
    addLog(state, now, `培养${beast.name}需要${formatReward(cost)}。`);
    return { ok: false, reason: 'notEnoughResources' };
  }

  payResources(state, cost);
  state.spiritBeasts[beastId] = nextLevel;
  addLog(state, now, `${beast.name}培养至 ${nextLevel} 级。`);
  return { ok: true, level: nextLevel };
}

export function claimGoalReward(state, goalId, now = Date.now()) {
  const lookup = findMainlineObjective(state, goalId);
  if (!lookup) {
    return { ok: false, reason: 'unknownGoal' };
  }
  if (lookup.chapter.locked) {
    return { ok: false, reason: 'locked' };
  }
  const goal = lookup.objective;
  if (!goal.completed) {
    return { ok: false, reason: 'notCompleted' };
  }
  if (state.claimedGoals?.[goalId]) {
    return { ok: false, reason: 'alreadyClaimed' };
  }

  applyResources(state, goal.reward);
  state.claimedGoals[goalId] = true;
  addLog(state, now, `领取「${goal.title}」奖励：${formatReward(goal.reward)}。`);
  return { ok: true, reward: goal.reward };
}

export function claimChapterReward(state, chapterId, now = Date.now()) {
  const chapter = getMainlineChapters(state).find((candidate) => candidate.id === chapterId);
  if (!chapter) {
    return { ok: false, reason: 'unknownChapter' };
  }
  if (chapter.locked) {
    return { ok: false, reason: 'locked' };
  }
  if (chapter.rewardClaimed) {
    return { ok: false, reason: 'alreadyClaimed' };
  }
  if (!chapter.completed) {
    return { ok: false, reason: 'notCompleted' };
  }
  if (!chapter.allObjectivesClaimed) {
    return { ok: false, reason: 'objectivesUnclaimed' };
  }

  applyResources(state, chapter.reward);
  state.claimedChapterRewards[chapter.id] = true;
  addLog(state, now, `完成主线「${chapter.title}」，获得${formatReward(chapter.reward)}。`);
  return { ok: true, reward: chapter.reward };
}

export function toggleAutoMission(state, missionId, now = Date.now()) {
  if (!MISSIONS[missionId]) {
    return { ok: false, reason: 'unknownMission' };
  }

  state.autoMissionId = state.autoMissionId === missionId ? null : missionId;
  addLog(state, now, state.autoMissionId ? `已设为自动历练：${MISSIONS[missionId].name}。` : '已停止自动历练。');
  return { ok: true, active: state.autoMissionId };
}

export function applyOfflineProgress(state, seconds, now = Date.now()) {
  const before = snapshotResources(state);
  const previousLogCount = state.log.length;
  updateGame(state, seconds, now);
  const after = snapshotResources(state);

  return {
    seconds: Math.max(0, Math.min(seconds, 60 * 60 * 12)),
    qi: round(after.qi - before.qi),
    spiritStones: Math.max(0, round(after.spiritStones - before.spiritStones)),
    herbs: Math.max(0, round(after.herbs - before.herbs)),
    beastCores: Math.max(0, round(after.beastCores - before.beastCores)),
    artifacts: Math.max(0, round(after.artifacts - before.artifacts)),
    arrayFlags: Math.max(0, round(after.arrayFlags - before.arrayFlags)),
    logEntries: state.log.slice(0, Math.max(0, state.log.length - previousLogCount)),
  };
}

export function updateGame(state, deltaSeconds, now = Date.now()) {
  const seconds = Math.max(0, Math.min(deltaSeconds, 60 * 60 * 12));

  const realm = getCurrentRealm(state);
  state.qi = round(state.qi + (calculateQiRate(state, now) / 60) * seconds);
  state.stoneCarry += (realm.stoneRate / 60) * seconds;
  state.herbCarry += ((state.buildings?.spiritField ?? 0) * BUILDINGS.spiritField.herbRatePerLevel + getSpiritBeastBonus(state, 'herbRate')) * seconds;

  const stonesGained = Math.floor(state.stoneCarry);
  if (stonesGained > 0) {
    state.spiritStones += stonesGained;
    state.stoneCarry = round(state.stoneCarry - stonesGained);
  }

  const herbsGained = Math.floor(state.herbCarry);
  if (herbsGained > 0) {
    state.herbs += herbsGained;
    state.herbCarry = round(state.herbCarry - herbsGained);
  }

  state.totalCultivationSeconds += seconds;
  addDailyProgress(state, 'cultivationSeconds', seconds, now);
  completeAlchemyIfReady(state, now);
  completeMissionIfReady(state, now);
  updateSectCommissions(state, seconds);
  state.lastUpdatedAt = now;
  return state;
}

export function performBreakthrough(state, now = Date.now(), random = Math.random) {
  const realm = getCurrentRealm(state);
  if (state.realmIndex >= REALMS.length - 1) {
    addLog(state, now, '此界修行已至尽头，静待新的机缘。');
    return { ok: false, reason: 'maxRealm' };
  }

  if (state.qi < realm.requiredQi) {
    addLog(state, now, '灵气尚未圆满，突破会伤及根基。');
    return { ok: false, reason: 'notEnoughQi' };
  }

  const chance = calculateBreakthroughChance(state, now);
  if (random() > chance) {
    state.qi = round(state.qi * 0.5);
    if ((state.foundationStability ?? 0) > 0) {
      state.foundationStability = Math.max(0, state.foundationStability - 1);
    } else {
      state.heartDemon = (state.heartDemon ?? 0) + 1;
    }
    addLog(state, now, '突破时心魔骤起，灵气逆行，修为折损。');
    return { ok: false, reason: 'failed', chance };
  }

  const carriedQi = calculateBreakthroughCarryQi(state, realm);
  state.realmIndex += 1;
  state.qi = Math.min(carriedQi, round(getCurrentRealm(state).requiredQi * 0.4));
  state.heartDemon = Math.max(0, (state.heartDemon ?? 0) - 1);
  state.insight = (state.insight ?? 0) + 1;
  state.foundationStability = 0;
  state.breakthroughBoostUntil = 0;
  state.breakthroughCount += 1;
  addLog(state, now, `灵气贯通周天，突破至${getCurrentRealm(state).name}。`);
  return { ok: true, chance };
}

export function calculateBreakthroughCarryQi(state, realm = getCurrentRealm(state)) {
  const overflowQi = Math.max(0, (state.qi ?? 0) - realm.requiredQi);
  return round(overflowQi * 0.5);
}

export function startMission(state, missionId, now = Date.now()) {
  if (state.activeMission) {
    return { ok: false, reason: 'busy' };
  }

  const mission = MISSIONS[missionId];
  if (!mission) {
    return { ok: false, reason: 'unknownMission' };
  }
  if (!getMissionStatus(state, missionId).unlocked) {
    addLog(state, now, `境界不足，暂不能进入「${mission.map ?? mission.name}」。`);
    return { ok: false, reason: 'realmLocked' };
  }

  state.activeMission = {
    id: mission.id,
    startedAt: now,
    endsAt: now + mission.duration * 1000,
  };
  addLog(state, now, `外出执行「${mission.name}」。`);
  return { ok: true };
}

export function craftPill(state, recipeId = 'gatherQiPill', now = Date.now()) {
  if (typeof recipeId === 'number') {
    now = recipeId;
    recipeId = 'gatherQiPill';
  }
  const recipe = PILL_RECIPES[recipeId];
  if (!recipe) {
    return { ok: false, reason: 'unknownRecipe' };
  }
  const furnaceLevel = state.buildings?.alchemyFurnace ?? 0;
  if (furnaceLevel < recipe.unlockLevel) {
    addLog(state, now, `${recipe.name}需要 ${recipe.unlockLevel} 级炼丹炉解锁。`);
    return { ok: false, reason: 'locked' };
  }
  if (state.activeAlchemy) {
    return { ok: false, reason: 'busy' };
  }
  if (!canAfford(state, recipe.cost)) {
    addLog(state, now, `炼制${recipe.name}需要${formatReward(recipe.cost)}。`);
    return { ok: false, reason: 'notEnoughResources' };
  }

  payResources(state, recipe.cost);
  state.activeAlchemy = {
    recipeId: recipe.id,
    startedAt: now,
    endsAt: now + getAlchemyDuration(state, recipe) * 1000,
  };
  addLog(state, now, `丹炉起火，开始炼制${recipe.name}。`);
  return { ok: true };
}

export function upgradeBuilding(state, buildingId, now = Date.now()) {
  const building = BUILDINGS[buildingId];
  if (!building) {
    return { ok: false, reason: 'unknownBuilding' };
  }

  const currentLevel = state.buildings?.[buildingId] ?? 0;
  if (currentLevel >= building.maxLevel) {
    addLog(state, now, `${building.name}已升至当前上限。`);
    return { ok: false, reason: 'maxLevel' };
  }

  const nextLevel = currentLevel + 1;
  if (nextLevel > getRealmUpgradeLimit(state)) {
    addLog(state, now, `${getUpgradeTier(nextLevel).name}升级需要更高境界。`);
    return { ok: false, reason: 'realmLocked' };
  }
  const cost = building.cost(nextLevel);
  if (!canAfford(state, cost)) {
    addLog(state, now, `升级${building.name}需要${formatReward(cost)}。`);
    return { ok: false, reason: 'notEnoughResources' };
  }

  payResources(state, cost);
  state.buildings[buildingId] = nextLevel;
  addLog(state, now, `${building.name}升至 ${nextLevel} 级。`);
  return { ok: true, level: nextLevel };
}

export function upgradeGear(state, gearId, now = Date.now()) {
  const gear = GEAR[gearId];
  if (!gear) {
    return { ok: false, reason: 'unknownGear' };
  }
  const currentLevel = state.gear?.[gearId] ?? 0;
  if (currentLevel >= gear.maxLevel) {
    return { ok: false, reason: 'maxLevel' };
  }
  if (currentLevel + 1 > getRealmUpgradeLimit(state)) {
    addLog(state, now, `${getUpgradeTier(currentLevel + 1).name}装备需要更高境界。`);
    return { ok: false, reason: 'realmLocked' };
  }
  const cost = gear.cost(currentLevel + 1);
  if (!canAfford(state, cost)) {
    addLog(state, now, `升级${gear.name}需要${formatReward(cost)}。`);
    return { ok: false, reason: 'notEnoughResources' };
  }
  payResources(state, cost);
  state.gear[gearId] = currentLevel + 1;
  addLog(state, now, `${gear.name}升至 ${currentLevel + 1} 级。`);
  return { ok: true, level: currentLevel + 1 };
}

export function upgradeCultivationPath(state, pathId, now = Date.now()) {
  const path = CULTIVATION_PATHS[pathId];
  if (!path) {
    return { ok: false, reason: 'unknownPath' };
  }
  const currentLevel = state.cultivationPaths?.[pathId] ?? 0;
  if (currentLevel >= path.maxLevel) {
    return { ok: false, reason: 'maxLevel' };
  }
  if (currentLevel + 1 > getRealmUpgradeLimit(state)) {
    addLog(state, now, `${getUpgradeTier(currentLevel + 1).name}${path.name}需要更高境界。`);
    return { ok: false, reason: 'realmLocked' };
  }
  const cost = path.cost(currentLevel + 1);
  if (!canAfford(state, cost)) {
    addLog(state, now, `提升${path.name}需要${formatReward(cost)}。`);
    return { ok: false, reason: 'notEnoughResources' };
  }
  payResources(state, cost);
  state.cultivationPaths[pathId] = currentLevel + 1;
  addLog(state, now, `${path.name}功法升至 ${currentLevel + 1} 级。`);
  return { ok: true, level: currentLevel + 1 };
}

export function upgradeFormation(state, formationId, now = Date.now()) {
  const formation = FORMATIONS[formationId];
  if (!formation) {
    return { ok: false, reason: 'unknownFormation' };
  }
  const currentLevel = state.formations?.[formationId] ?? 0;
  if (currentLevel >= formation.maxLevel) {
    return { ok: false, reason: 'maxLevel' };
  }
  if (currentLevel + 1 > getRealmUpgradeLimit(state)) {
    addLog(state, now, `${getUpgradeTier(currentLevel + 1).name}阵法需要更高境界。`);
    return { ok: false, reason: 'realmLocked' };
  }
  const cost = formation.cost(currentLevel + 1);
  if (!canAfford(state, cost)) {
    addLog(state, now, `升级${formation.name}需要${formatReward(cost)}。`);
    return { ok: false, reason: 'notEnoughResources' };
  }
  payResources(state, cost);
  state.formations[formationId] = currentLevel + 1;
  addLog(state, now, `${formation.name}升至 ${currentLevel + 1} 级。`);
  return { ok: true, level: currentLevel + 1 };
}

export function refineGear(state, gearId, now = Date.now(), random = Math.random) {
  const gear = GEAR[gearId];
  if (!gear) {
    return { ok: false, reason: 'unknownGear' };
  }
  if ((state.gear?.[gearId] ?? 0) <= 0) {
    return { ok: false, reason: 'notEquipped' };
  }
  const currentQuality = state.gearQuality?.[gearId] ?? 0;
  if (currentQuality >= GEAR_QUALITIES.length - 1) {
    return { ok: false, reason: 'maxQuality' };
  }
  const cost = getRefineCost(currentQuality + 1);
  if (!canAfford(state, cost)) {
    addLog(state, now, `淬炼${gear.name}需要${formatReward(cost)}。`);
    return { ok: false, reason: 'notEnoughResources' };
  }
  payResources(state, cost);
  const chance = GEAR_QUALITIES[currentQuality].refineChance;
  if (random() > chance) {
    addLog(state, now, `淬炼${gear.name}火候不足，品质未提升。`);
    return { ok: false, reason: 'failed', chance };
  }
  state.gearQuality[gearId] = currentQuality + 1;
  state.gearAffixes[gearId] ||= rollAffixForGear(gearId, random);
  const quality = GEAR_QUALITIES[state.gearQuality[gearId]];
  addLog(state, now, `${gear.name}淬炼至${quality.name}，获得词条「${GEAR_AFFIXES[state.gearAffixes[gearId]].name}」。`);
  return { ok: true, quality: state.gearQuality[gearId], affix: state.gearAffixes[gearId] };
}

export function stabilizeFoundation(state, now = Date.now()) {
  const cost = { spiritStones: 35, herbs: 8 };
  if (!canAfford(state, cost)) {
    addLog(state, now, `稳固根基需要${formatReward(cost)}。`);
    return { ok: false, reason: 'notEnoughResources' };
  }
  payResources(state, cost);
  state.foundationStability = Math.min(3, (state.foundationStability ?? 0) + 1);
  state.heartDemon = Math.max(0, (state.heartDemon ?? 0) - 1);
  addLog(state, now, '运转周天稳固根基，本次突破更有把握。');
  return { ok: true, level: state.foundationStability };
}

export function consumePill(state, recipeId = 'gatherQiPill', now = Date.now()) {
  if (typeof recipeId === 'number') {
    now = recipeId;
    recipeId = 'gatherQiPill';
  }
  const recipe = PILL_RECIPES[recipeId];
  if (!recipe) {
    return { ok: false, reason: 'unknownRecipe' };
  }
  if ((state.inventoryPills?.[recipeId] ?? 0) <= 0) {
    addLog(state, now, '丹瓶已空。');
    return { ok: false };
  }

  state.inventoryPills[recipeId] -= 1;
  if (recipeId === 'gatherQiPill') {
    const alchemyBonus = 1 + (state.cultivationPaths?.alchemy ?? 0) * CULTIVATION_PATHS.alchemy.pillQiBonusPerLevel;
    state.qi = round(state.qi + (65 + state.realmIndex * 30) * alchemyBonus);
    state.pillBoostUntil = Math.max(state.pillBoostUntil ?? 0, now) + 120 * 1000;
    state.pills = state.inventoryPills.gatherQiPill;
    addLog(state, now, '服下一枚聚气丹，灵息周天暂时加快。');
  } else if (recipeId === 'clearHeartPill') {
    state.heartDemon = Math.max(0, (state.heartDemon ?? 0) - 1);
    addLog(state, now, '服下一枚清心丹，心魔压力减轻。');
  } else if (recipeId === 'meridianPill') {
    state.breakthroughBoostUntil = Math.max(state.breakthroughBoostUntil ?? 0, now) + 180 * 1000;
    addLog(state, now, '服下一枚护脉丹，破境天机暂时明朗。');
  }
  return { ok: true };
}

export function formatDuration(seconds) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const rest = safeSeconds % 60;
  return `${minutes}:${String(rest).padStart(2, '0')}`;
}

function completeMissionIfReady(state, now) {
  const active = state.activeMission;
  if (!active || now < active.endsAt) {
    return;
  }

  const mission = MISSIONS[active.id];
  state.activeMission = null;
  if (!mission) {
    return;
  }

  const danger = getMissionDanger(state, mission);
  if (danger && calculatePower(state) < danger) {
    applyResources(state, mission.failurePenalty);
    state.injuryUntil = now + 90 * 1000;
    state.lastMissionReport = createMissionReport(state, mission, {
      outcome: 'failure',
      reward: mission.failurePenalty ?? {},
      reputationGained: 0,
      eventResult: null,
      rareReward: null,
      now,
    });
    addLog(state, now, `挑战「${mission.name}」失利，负伤退回洞府。`);
    restartAutoMission(state, mission.id, now);
    return;
  }

  applyResources(state, mission.reward);
  state.completedMissions[mission.id] = (state.completedMissions[mission.id] ?? 0) + 1;
  const mapId = getMissionMapId(mission);
  const reputationGained = MISSION_MAPS[mapId]?.reputationPerMission ?? 0;
  addMapReputation(state, mapId, reputationGained);
  const event = resolveMissionEvent(mission, state.completedMissions[mission.id]);
  let eventResult = null;
  if (event) {
    eventResult = applyMissionEvent(state, mission, event, now);
  }
  let rareReward = null;
  if (mission.rareEvery && state.completedMissions[mission.id] % mission.rareEvery === 0) {
    applyResources(state, mission.rareReward);
    rareReward = mission.rareReward;
    addLog(state, now, `深入「${mission.map ?? mission.name}」有所感悟，额外获得${formatReward(mission.rareReward)}。`);
  }
  maybeCreateOpportunity(state, mission, now);
  addDailyProgress(state, 'missions', 1, now);
  state.lastMissionReport = createMissionReport(state, mission, {
    outcome: 'success',
    reward: mission.reward,
    reputationGained,
    eventResult,
    rareReward,
    now,
  });
  addLog(state, now, `完成「${mission.name}」，收获${formatReward(mission.reward)}。`);
  restartAutoMission(state, mission.id, now);
}

function completeAlchemyIfReady(state, now) {
  if (!state.activeAlchemy || now < state.activeAlchemy.endsAt) {
    return;
  }

  const recipe = PILL_RECIPES[state.activeAlchemy.recipeId] ?? PILL_RECIPES.gatherQiPill;
  state.activeAlchemy = null;
  state.inventoryPills[recipe.id] = (state.inventoryPills[recipe.id] ?? 0) + 1;
  state.pills = state.inventoryPills.gatherQiPill;
  state.craftedPills = (state.craftedPills ?? 0) + 1;
  addLog(state, now, `丹炉火候正好，炼成一枚${recipe.name}。`);
}

function createMissionReport(state, mission, { outcome, reward, reputationGained = 0, eventResult = null, rareReward = null, now = Date.now() }) {
  const mapId = getMissionMapId(mission);
  const map = MISSION_MAPS[mapId];
  const rewardText = formatReward(reward);
  const rareRewardText = rareReward ? formatReward(rareReward) : '';
  const event = eventResult?.event ? {
    id: eventResult.event.id,
    name: eventResult.event.name,
    reward: eventResult.event.reward ?? {},
    rewardText: formatReward(eventResult.event.reward ?? {}),
    equipmentName: eventResult.item?.name ?? null,
  } : null;
  const summary = outcome === 'success'
    ? `完成「${mission.name}」，收获${rewardText || '少许历练'}${event?.equipmentName ? `，并得${event.equipmentName}` : ''}。`
    : `「${mission.name}」失利，劫象反噬${rewardText ? `：${rewardText}` : '。'}`;

  return {
    id: `${mission.id}-${now}`,
    missionId: mission.id,
    missionName: mission.name,
    mapId,
    mapName: map?.name ?? mission.map ?? mission.name,
    outcome,
    reward: reward ?? {},
    rewardText,
    rareReward: rareReward ?? null,
    rareRewardText,
    reputationGained,
    completedCount: state.completedMissions?.[mission.id] ?? 0,
    event,
    summary,
    time: now,
  };
}

function getMissionDanger(state, mission) {
  const pressure = getMissionPressure(state, mission);
  return Math.max(0, pressure - getTieredLevelValue(state.gear?.robe ?? 0, GEAR.robe.dangerReductionPerLevel) - getGearAffixBonus(state, 'dangerReduction') - getEquippedLootBonus(state, 'dangerReduction') - getMapMasteryBonus(state, 'dangerReduction') - getTreasureBonus(state, 'dangerReduction') - getSpiritBeastBonus(state, 'dangerReduction') - (state.cultivationPaths?.sword ?? 0) * CULTIVATION_PATHS.sword.dangerReductionPerLevel);
}

function getMissionPressure(state, mission) {
  const baseDanger = mission.danger ?? 0;
  if (baseDanger <= 0) {
    return 0;
  }
  const unlockStage = Math.max(0, mission.unlockRealmIndex ?? 0);
  if (unlockStage < 3) {
    return baseDanger;
  }
  const stageMultiplier = 1.52 + Math.max(0, unlockStage - 3) * 0.22;
  const rareEvery = Math.max(2, mission.rareEvery ?? 4);
  const completed = state.completedMissions?.[mission.id] ?? 0;
  const deepeningMultiplier = Math.min(0.18, Math.floor(completed / rareEvery) * 0.03);
  return round(baseDanger * (stageMultiplier + deepeningMultiplier));
}

function addLog(state, time, text) {
  state.log.unshift({ time, text });
  state.log = state.log.slice(0, 20);
}

function normalizeMission(mission) {
  if (!mission || !MISSIONS[mission.id]) {
    return null;
  }
  return {
    id: mission.id,
    startedAt: Number(mission.startedAt) || Date.now(),
    endsAt: Number(mission.endsAt) || Date.now(),
  };
}

function migrateLegacyRealmIndex(realmIndex) {
  const legacyIndex = clampInteger(realmIndex, 0, LEGACY_REALM_INDEX_MAP.length - 1);
  return LEGACY_REALM_INDEX_MAP[legacyIndex] ?? 0;
}

function normalizeAlchemy(alchemy) {
  if (!alchemy) {
    return null;
  }
  return {
    recipeId: PILL_RECIPES[alchemy.recipeId] ? alchemy.recipeId : 'gatherQiPill',
    startedAt: Number(alchemy.startedAt) || Date.now(),
    endsAt: Number(alchemy.endsAt) || Date.now(),
  };
}

function normalizeBuildings(buildings) {
  const normalized = createGameState().buildings;
  Object.keys(BUILDINGS).forEach((id) => {
    normalized[id] = clampInteger(buildings?.[id] ?? normalized[id] ?? 0, 0, BUILDINGS[id].maxLevel);
  });
  return normalized;
}

function normalizeLevels(savedLevels, definitions) {
  const normalized = {};
  Object.keys(definitions).forEach((id) => {
    normalized[id] = clampInteger(savedLevels?.[id] ?? 0, 0, definitions[id].maxLevel);
  });
  return normalized;
}

function normalizeGearQuality(savedQuality) {
  const normalized = {};
  Object.keys(GEAR).forEach((id) => {
    normalized[id] = clampInteger(savedQuality?.[id] ?? 0, 0, GEAR_QUALITIES.length - 1);
  });
  return normalized;
}

function normalizeGearAffixes(savedAffixes) {
  const normalized = {};
  Object.keys(GEAR).forEach((id) => {
    const affixId = savedAffixes?.[id] ?? null;
    normalized[id] = affixId && GEAR_AFFIXES[affixId]?.slot === id ? affixId : null;
  });
  return normalized;
}

function normalizeInventoryPills(inventoryPills, legacyPills = 0) {
  const normalized = {};
  Object.keys(PILL_RECIPES).forEach((id) => {
    normalized[id] = Math.max(0, Math.floor(Number(inventoryPills?.[id]) || 0));
  });
  if (!inventoryPills && legacyPills > 0) {
    normalized.gatherQiPill = Math.max(0, Math.floor(Number(legacyPills) || 0));
  }
  return normalized;
}

function normalizeCompletedMissions(completedMissions) {
  if (!completedMissions || typeof completedMissions !== 'object') {
    return {};
  }

  return Object.fromEntries(
    Object.keys(MISSIONS).map((id) => [id, Math.max(0, Number(completedMissions[id]) || 0)]),
  );
}

function normalizeMapValues(values) {
  if (!values || typeof values !== 'object') {
    return {};
  }
  return Object.fromEntries(
    Object.keys(MISSION_MAPS).map((id) => [id, Math.max(0, Number(values[id]) || 0)]),
  );
}

function normalizeDefeatedBosses(defeatedBosses) {
  if (!defeatedBosses || typeof defeatedBosses !== 'object') {
    return {};
  }
  return Object.fromEntries(
    Object.entries(defeatedBosses).filter(([id, defeated]) => MISSION_MAPS[id] && Boolean(defeated)),
  );
}

function normalizeClaimedGoals(claimedGoals) {
  if (!claimedGoals || typeof claimedGoals !== 'object') {
    return {};
  }

  return Object.fromEntries(
    Object.entries(claimedGoals).filter(([, claimed]) => Boolean(claimed)),
  );
}

function normalizeLootEquipment(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items
    .map((item, index) => {
      const template = LOOT_EQUIPMENT[item?.templateId] ?? LOOT_EQUIPMENT[item?.id];
      if (!template) {
        return null;
      }
      return createLootItem(template.id, item.uid || `${template.id}-${index + 1}`, clampInteger(item.level ?? 0, 0, getLootMaxLevel(template)));
    })
    .filter(Boolean)
    .slice(0, 40);
}

function normalizeSectAssignments(assignments, disciples = 0) {
  const normalized = {};
  let assigned = 0;
  Object.keys(SECT_COMMISSIONS).forEach((id) => {
    const count = Math.max(0, Math.floor(Number(assignments?.[id]) || 0));
    const allowed = Math.max(0, Math.min(count, disciples - assigned));
    normalized[id] = allowed;
    assigned += allowed;
  });
  return normalized;
}

function normalizeSectCarry(carry) {
  return {
    spiritStones: Math.max(0, Number(carry?.spiritStones) || 0),
    herbs: Math.max(0, Number(carry?.herbs) || 0),
    beastCores: Math.max(0, Number(carry?.beastCores) || 0),
    artifacts: Math.max(0, Number(carry?.artifacts) || 0),
    reputation: Math.max(0, Number(carry?.reputation) || 0),
  };
}

function normalizeEquippedLoot(equippedLoot, lootEquipment) {
  const slots = { weapon: null, amulet: null, robe: null };
  Object.keys(slots).forEach((slot) => {
    const uid = equippedLoot?.[slot] ?? null;
    const item = lootEquipment.find((candidate) => candidate.uid === uid && candidate.slot === slot);
    slots[slot] = item ? item.uid : null;
  });
  return slots;
}

function normalizeLockedLoot(lockedLoot, lootEquipment) {
  if (!lockedLoot || typeof lockedLoot !== 'object') {
    return {};
  }
  const validUids = new Set((lootEquipment ?? []).map((item) => item.uid));
  return Object.fromEntries(
    Object.entries(lockedLoot).filter(([uid, locked]) => validUids.has(uid) && Boolean(locked)),
  );
}

function normalizeMissionEvent(event) {
  if (!event || !MISSION_EVENTS[event.id]) {
    return null;
  }
  return {
    id: event.id,
    name: MISSION_EVENTS[event.id].name,
    missionId: MISSIONS[event.missionId] ? event.missionId : null,
    reward: event.reward && typeof event.reward === 'object' ? { ...event.reward } : {},
    equipmentName: event.equipmentName ?? null,
    time: Number(event.time) || Date.now(),
  };
}

function normalizeMissionReport(report) {
  if (!report || typeof report !== 'object' || !MISSIONS[report.missionId]) {
    return null;
  }
  const mission = MISSIONS[report.missionId];
  const mapId = MISSION_MAPS[report.mapId] ? report.mapId : getMissionMapId(mission);
  const outcome = report.outcome === 'failure' ? 'failure' : 'success';
  const reward = report.reward && typeof report.reward === 'object' ? { ...report.reward } : {};
  const rareReward = report.rareReward && typeof report.rareReward === 'object' ? { ...report.rareReward } : null;
  const event = report.event && MISSION_EVENTS[report.event.id] ? {
    id: report.event.id,
    name: MISSION_EVENTS[report.event.id].name,
    reward: report.event.reward && typeof report.event.reward === 'object' ? { ...report.event.reward } : {},
    rewardText: formatReward(report.event.reward ?? {}),
    equipmentName: report.event.equipmentName ?? null,
  } : null;

  return {
    id: String(report.id ?? `${mission.id}-${Number(report.time) || Date.now()}`),
    missionId: mission.id,
    missionName: mission.name,
    mapId,
    mapName: MISSION_MAPS[mapId]?.name ?? mission.map ?? mission.name,
    outcome,
    reward,
    rewardText: formatReward(reward),
    rareReward,
    rareRewardText: rareReward ? formatReward(rareReward) : '',
    reputationGained: Math.max(0, Number(report.reputationGained) || 0),
    completedCount: Math.max(0, Number(report.completedCount) || 0),
    event,
    summary: typeof report.summary === 'string' && report.summary ? report.summary : `${mission.name}结算已记录。`,
    time: Number(report.time) || Date.now(),
  };
}

function normalizePermanentBonuses(bonuses) {
  return {
    qiRate: Math.max(0, Number(bonuses?.qiRate) || 0),
    power: Math.max(0, Number(bonuses?.power) || 0),
  };
}

function normalizeOpportunity(opportunity) {
  if (!opportunity || !OPPORTUNITIES[opportunity.id]) {
    return null;
  }
  return {
    id: opportunity.id,
    missionId: MISSIONS[opportunity.missionId] ? opportunity.missionId : null,
    createdAt: Number(opportunity.createdAt) || Date.now(),
  };
}

function normalizeResolvedOpportunities(resolved) {
  if (!resolved || typeof resolved !== 'object') {
    return {};
  }
  return Object.fromEntries(
    Object.entries(resolved)
      .filter(([id]) => OPPORTUNITIES[id])
      .map(([id, value]) => [id, Math.max(0, Number(value) || 0)]),
  );
}

function normalizeSectRoster(roster, disciples = 0) {
  const normalized = Array.isArray(roster)
    ? roster
      .map((disciple, index) => normalizeDisciple(disciple, index))
      .filter(Boolean)
      .slice(0, disciples)
    : [];

  while (normalized.length < disciples) {
    normalized.push(createDisciple(normalized.length));
  }
  return normalized;
}

function normalizeDisciple(disciple, index) {
  if (!disciple || typeof disciple !== 'object') {
    return createDisciple(index);
  }
  const fallback = createDisciple(index);
  const job = disciple.job && (disciple.job === 'idle' || SECT_COMMISSIONS[disciple.job]) ? disciple.job : 'idle';
  return {
    id: String(disciple.id || fallback.id),
    name: String(disciple.name || fallback.name),
    element: String(disciple.element || fallback.element),
    aptitude: clampInteger(disciple.aptitude ?? fallback.aptitude, 1, 5),
    root: clampInteger(disciple.root ?? fallback.root, 1, 5),
    comprehension: clampInteger(disciple.comprehension ?? fallback.comprehension, 1, 5),
    level: clampInteger(disciple.level ?? fallback.level, 1, 30),
    experience: Math.max(0, Number(disciple.experience) || 0),
    job,
    injuryUntil: Math.max(0, Number(disciple.injuryUntil) || 0),
  };
}

function createDisciple(index = 0, now = 0) {
  const surnames = ['林', '沈', '陆', '秦', '许', '顾', '闻', '叶'];
  const givenNames = ['青禾', '知微', '玄石', '云岫', '守拙', '映雪', '怀真', '临风'];
  const elements = ['木', '水', '金', '火', '土', '风'];
  const seed = index + 1;
  return {
    id: `disciple-${now || 'seed'}-${seed}`,
    name: `${surnames[index % surnames.length]}${givenNames[(index * 3) % givenNames.length]}`,
    element: elements[(index * 2) % elements.length],
    aptitude: 3 + (seed % 3 === 0 ? 2 : seed % 2),
    root: 2 + ((seed * 2) % 4),
    comprehension: 2 + ((seed * 3) % 4),
    level: 1,
    experience: 0,
    job: 'idle',
    injuryUntil: 0,
  };
}

function hydrateDisciple(disciple) {
  return {
    ...disciple,
    jobName: disciple.job === 'idle' ? '空闲' : SECT_COMMISSIONS[disciple.job]?.name ?? '空闲',
    nextExperience: getDiscipleNextExperience(disciple.level),
    grade: getDiscipleGrade(disciple),
  };
}

function hydrateMainlineObjective(state, objective) {
  return {
    id: objective.id,
    title: objective.title,
    detail: objective.detail,
    completed: Boolean(objective.completed(state)),
    claimed: Boolean(state.claimedGoals?.[objective.id]),
    reward: objective.reward,
  };
}

function isMainlineChapterUnlocked(state, index) {
  if (index <= 0) {
    return true;
  }
  return MAINLINE_CHAPTERS.slice(0, index).every((chapter) => Boolean(state.claimedChapterRewards?.[chapter.id]));
}

function findMainlineObjective(state, objectiveId) {
  for (const chapter of getMainlineChapters(state)) {
    const objective = chapter.objectives.find((candidate) => candidate.id === objectiveId);
    if (objective) {
      return { chapter, objective };
    }
  }
  return null;
}

function getGuidanceTabForObjective(objectiveId) {
  if (/Mission|Trial|Boss|demon|Ruins|Tomb|Valley|Rift|realm|Realm/i.test(objectiveId)) {
    return objectiveId.toLowerCase().includes('realm') ? 'goals' : 'missions';
  }
  if (/Pill|alchemy/i.test(objectiveId)) {
    return 'alchemy';
  }
  if (/Gear|Armament|Loot|Formation/i.test(objectiveId)) {
    return 'gear';
  }
  if (/sect|Disciple/i.test(objectiveId)) {
    return 'sect';
  }
  if (/Field|building/i.test(objectiveId)) {
    return 'cave';
  }
  return 'goals';
}

function restartAutoMission(state, completedMissionId, now) {
  const missionId = state.autoMissionId;
  if (!missionId || missionId !== completedMissionId || !MISSIONS[missionId]) {
    return;
  }

  const mission = MISSIONS[missionId];
  state.activeMission = {
    id: mission.id,
    startedAt: now,
    endsAt: now + mission.duration * 1000,
  };
  addLog(state, now, `自动继续「${mission.name}」。`);
}

function snapshotResources(state) {
  return {
    qi: state.qi ?? 0,
    spiritStones: state.spiritStones ?? 0,
    herbs: state.herbs ?? 0,
    beastCores: state.beastCores ?? 0,
    artifacts: state.artifacts ?? 0,
    arrayFlags: state.arrayFlags ?? 0,
  };
}

function normalizeNestedClaims(claims) {
  if (!claims || typeof claims !== 'object') {
    return {};
  }
  return Object.fromEntries(
    Object.entries(claims)
      .filter(([, value]) => value && typeof value === 'object')
      .map(([key, value]) => [key, { ...value }]),
  );
}

function normalizeDailyProgress(progress) {
  if (!progress || typeof progress !== 'object') {
    return {};
  }
  return Object.fromEntries(
    Object.entries(progress)
      .filter(([, value]) => value && typeof value === 'object')
      .map(([dateKey, value]) => [dateKey, {
        cultivationSeconds: Math.max(0, Number(value.cultivationSeconds) || 0),
        missions: Math.max(0, Number(value.missions) || 0),
        marketBuys: Math.max(0, Number(value.marketBuys) || 0),
      }]),
  );
}

function getDailyProgress(state, dateKey) {
  state.dailyProgress[dateKey] ??= { cultivationSeconds: 0, missions: 0, marketBuys: 0 };
  return state.dailyProgress[dateKey];
}

function addDailyProgress(state, key, amount, now = Date.now()) {
  const progress = getDailyProgress(state, getDateKey(now));
  progress[key] = (progress[key] ?? 0) + amount;
}

function getAlchemyDuration(state, recipe) {
  const furnaceLevel = state.buildings?.alchemyFurnace ?? 0;
  const pathLevel = state.cultivationPaths?.alchemy ?? 0;
  const speedMultiplier = Math.max(0.35, 1 - furnaceLevel * BUILDINGS.alchemyFurnace.speedBonusPerLevel - pathLevel * CULTIVATION_PATHS.alchemy.alchemySpeedPerLevel);
  return Math.max(10, Math.round(recipe.duration * speedMultiplier));
}

function canAfford(state, cost) {
  return Object.entries(cost).every(([resource, amount]) => getResourceAmount(state, resource) >= amount);
}

function getRefineCost(nextQuality) {
  return {
    spiritStones: scaleCost(50, nextQuality),
    artifacts: nextQuality,
  };
}

function getDefaultAffixForGear(gearId) {
  const defaults = {
    weapon: 'swordIntent',
    amulet: 'spiritVein',
    robe: 'cloudStep',
  };
  return defaults[gearId] ?? null;
}

function rollAffixForGear(gearId, random = Math.random) {
  const pool = GEAR_AFFIX_POOLS[gearId] ?? [getDefaultAffixForGear(gearId)].filter(Boolean);
  if (!pool.length) {
    return null;
  }
  const index = Math.min(pool.length - 1, Math.floor(random() * pool.length));
  return pool[index] ?? getDefaultAffixForGear(gearId);
}

function getGearAffixBonus(state, key) {
  return Object.values(state.gearAffixes ?? {}).reduce((total, affixId) => total + (GEAR_AFFIXES[affixId]?.[key] ?? 0), 0);
}

function getEquippedLootBonus(state, key) {
  return Object.values(state.equippedLoot ?? {}).reduce((total, uid) => {
    const item = state.lootEquipment?.find((candidate) => candidate.uid === uid);
    return total + (item?.bonuses?.[key] ?? 0);
  }, 0);
}

function compareLootEquipment(state, item) {
  const equipped = getEquippedLoot(state, item.slot);
  const baseline = equipped && equipped.uid !== item.uid ? equipped : null;
  const keys = new Set([
    ...Object.keys(item.bonuses ?? {}),
    ...Object.keys(baseline?.bonuses ?? {}),
  ]);
  const deltaBonuses = {};
  keys.forEach((key) => {
    const value = round((item.bonuses?.[key] ?? 0) - (baseline?.bonuses?.[key] ?? 0));
    if (value !== 0) {
      deltaBonuses[key] = value;
    }
  });
  const deltas = effectsFromBonusObject(deltaBonuses);
  return {
    againstUid: baseline?.uid ?? null,
    againstName: baseline?.name ?? (equipped?.uid === item.uid ? item.name : '空位'),
    deltas,
    scoreDelta: round(getLootScore(item) - (baseline ? getLootScore(baseline) : 0)),
    summary: deltas.length ? deltas.map(formatEffectDelta).join('、') : (equipped?.uid === item.uid ? '已穿戴' : '无明显变化'),
  };
}

function getLootScore(item) {
  return Object.entries(item?.bonuses ?? {}).reduce((total, [key, value]) => {
    const weight = key === 'qiRate' || key === 'breakthrough' || key === 'herbRate' ? 1000 : 1;
    return total + value * weight;
  }, 0) + (item?.level ?? 0) * 2 + (item?.quality ?? 0) * 4;
}

function formatEffectDelta(effect) {
  const sign = effect.value > 0 ? '+' : '';
  if (effect.mode === 'percent') {
    return `${effect.label} ${sign}${Math.round(effect.value * 100)}%`;
  }
  return `${effect.label} ${sign}${effect.value}`;
}

function getTreasureBonus(state, key) {
  return Object.entries(state.treasures ?? {}).reduce((total, [treasureId, level]) => {
    const treasure = TREASURES[treasureId];
    return total + (treasure?.bonuses?.[key] ?? 0) * (level ?? 0);
  }, 0);
}

function getSpiritBeastBonus(state, key) {
  return Object.entries(state.spiritBeasts ?? {}).reduce((total, [beastId, level]) => {
    const beast = SPIRIT_BEASTS[beastId];
    return total + (beast?.bonuses?.[key] ?? 0) * (level ?? 0);
  }, 0);
}

function getGearEffects(gearId, level, qualityIndex, affix) {
  const item = GEAR[gearId];
  const effects = [];
  if (item.powerPerLevel) {
    effects.push({ id: 'power', label: '道威', value: getTieredLevelValue(level, item.powerPerLevel), mode: 'flat' });
  }
  if (item.breakthroughPerLevel) {
    effects.push({ id: 'breakthrough', label: '破境天机', value: getTieredLevelValue(level, item.breakthroughPerLevel), mode: 'percent' });
  }
  if (item.dangerReductionPerLevel) {
    effects.push({ id: 'dangerReduction', label: '劫象消解', value: getTieredLevelValue(level, item.dangerReductionPerLevel), mode: 'reduction' });
  }
  const qualityPower = GEAR_QUALITIES[qualityIndex]?.powerBonus ?? 0;
  if (qualityPower) {
    effects.push({ id: 'qualityPower', label: '炼器道威', value: qualityPower, mode: 'flat' });
  }
  if (affix) {
    effects.push(...effectsFromBonusObject(affix, '词条'));
  }
  return effects.filter((effect) => effect.value !== 0);
}

function effectsFromBonusObject(bonuses, prefix = '') {
  const labels = {
    power: '道威',
    powerBonus: '道威',
    qiRate: '灵息',
    qiBonus: '灵息',
    breakthrough: '破境天机',
    dangerReduction: '劫象消解',
    herbRate: '灵草生长',
  };
  return Object.entries(bonuses)
    .filter(([key, value]) => typeof value === 'number' && labels[key] && value !== 0)
    .map(([key, value]) => ({
      id: key,
      label: `${prefix}${labels[key]}`,
      value,
      mode: key === 'qiRate' || key === 'qiBonus' || key === 'breakthrough' || key === 'herbRate' ? 'percent' : key === 'dangerReduction' ? 'reduction' : 'flat',
    }));
}

function scaleBonusObject(bonuses, level) {
  return Object.fromEntries(
    Object.entries(bonuses ?? {}).map(([key, value]) => [key, round(value * level)]),
  );
}

function compactSources(sources, keepNegative = false) {
  return sources
    .filter((source) => keepNegative ? source.value !== 0 : source.value > 0)
    .map((source) => ({
      label: source.label,
      value: round(source.value),
      mode: source.mode ?? 'flat',
    }));
}

function getMissionMapId(mission) {
  if (mission.mapId && MISSION_MAPS[mission.mapId]) {
    return mission.mapId;
  }
  const found = Object.values(MISSION_MAPS).find((map) => map.name === mission.map);
  return found?.id ?? 'qinglanMountain';
}

function addMapReputation(state, mapId, amount) {
  if (!MISSION_MAPS[mapId] || amount <= 0) {
    return;
  }
  state.mapReputation ??= {};
  state.mapReputation[mapId] = round((state.mapReputation[mapId] ?? 0) + amount);
}

function getMapMastery(state, mapId) {
  const reputation = state.mapReputation?.[mapId] ?? 0;
  const tier = MAP_MASTERY_TIERS.reduce((best, current) => (reputation >= current.reputation ? current : best), MAP_MASTERY_TIERS[0]);
  const next = MAP_MASTERY_TIERS.find((candidate) => candidate.level === tier.level + 1) ?? null;
  return {
    level: tier.level,
    name: tier.name,
    reputation,
    nextReputation: next?.reputation ?? null,
  };
}

function getMapMasteryBonus(state, key) {
  return Object.values(MISSION_MAPS).reduce((total, map) => {
    const level = getMapMastery(state, map.id).level;
    return total + (map.masteryBonus?.[key] ?? 0) * level;
  }, 0);
}

function isSectUnlocked(state) {
  return (state.realmIndex ?? 0) >= 2 || Boolean(state.defeatedBosses?.qinglanMountain);
}

function getSectCapacity(state) {
  if (!isSectUnlocked(state)) {
    return 0;
  }
  const bossBonus = Object.values(state.defeatedBosses ?? {}).filter(Boolean).length;
  return 3 + Math.floor((state.realmIndex ?? 0) / 2) + bossBonus + getSectLevel(state).capacityBonus;
}

function getSectLevel(state) {
  const reputation = Math.floor(Number(state.sectReputation) || 0);
  return SECT_LEVELS.reduce((best, level) => (reputation >= level.reputation ? level : best), SECT_LEVELS[0]);
}

function getNextSectReputation(state) {
  const current = getSectLevel(state);
  const next = SECT_LEVELS.find((level) => level.level === current.level + 1);
  return next?.reputation ?? null;
}

function getRecruitCost(nextDisciple) {
  return {
    spiritStones: 60 + nextDisciple * 60,
    herbs: 5 + nextDisciple * 5,
  };
}

function updateSectCommissions(state, seconds) {
  if (!isSectUnlocked(state) || seconds <= 0) {
    return;
  }
  state.sectAssignments = normalizeSectAssignments(state.sectAssignments, state.sectDisciples ?? 0);
  state.sectCarry = normalizeSectCarry(state.sectCarry);
  state.sectRoster = normalizeSectRoster(state.sectRoster, state.sectDisciples ?? 0);
  syncSectRosterJobs(state);

  Object.entries(state.sectAssignments).forEach(([commissionId, count]) => {
    const commission = SECT_COMMISSIONS[commissionId];
    if (!commission || count <= 0) {
      return;
    }
    const multiplier = getCommissionMultiplier(state, commissionId);
    Object.entries(commission.rates).forEach(([resource, rate]) => {
      const key = resource === 'reputation' ? 'reputation' : resource;
      state.sectCarry[key] = (state.sectCarry[key] ?? 0) + rate * count * multiplier * seconds;
    });
    trainAssignedDisciples(state, commissionId, seconds);
  });

  ['spiritStones', 'herbs', 'beastCores', 'artifacts'].forEach((resource) => {
    const gained = Math.floor(state.sectCarry[resource] ?? 0);
    if (gained > 0) {
      state[resource] = (state[resource] ?? 0) + gained;
      state.sectCarry[resource] = round(state.sectCarry[resource] - gained);
    }
  });
  const reputationGained = Math.floor(state.sectCarry.reputation ?? 0);
  if (reputationGained > 0) {
    state.sectReputation = (state.sectReputation ?? 0) + reputationGained;
    state.sectCarry.reputation = round(state.sectCarry.reputation - reputationGained);
  }
}

function syncSectRosterJobs(state) {
  const roster = normalizeSectRoster(state.sectRoster, state.sectDisciples ?? 0);
  roster.forEach((disciple) => {
    disciple.job = 'idle';
  });
  Object.keys(SECT_COMMISSIONS).forEach((commissionId) => {
    const count = state.sectAssignments?.[commissionId] ?? 0;
    for (let assigned = 0; assigned < count; assigned += 1) {
      const idle = roster.find((disciple) => disciple.job === 'idle');
      if (idle) {
        idle.job = commissionId;
      }
    }
  });
  state.sectRoster = roster;
}

function getCommissionMultiplier(state, commissionId) {
  const roster = normalizeSectRoster(state.sectRoster, state.sectDisciples ?? 0);
  const assigned = roster.filter((disciple) => disciple.job === commissionId);
  if (!assigned.length) {
    return 1 + getSectLevel(state).commissionBonus;
  }
  const discipleBonus = assigned.reduce((total, disciple) => total + getDiscipleJobMultiplier(disciple), 0) / assigned.length;
  return 1 + getSectLevel(state).commissionBonus + discipleBonus;
}

function getDiscipleJobMultiplier(disciple) {
  return Math.max(0, (disciple.aptitude - 3) * 0.03 + (disciple.level - 1) * 0.04);
}

function trainAssignedDisciples(state, commissionId, seconds) {
  state.sectRoster.forEach((disciple) => {
    if (disciple.job !== commissionId) {
      return;
    }
    disciple.experience += round(seconds * (0.05 + disciple.comprehension * 0.01));
    while (disciple.experience >= getDiscipleNextExperience(disciple.level) && disciple.level < 30) {
      disciple.experience = round(disciple.experience - getDiscipleNextExperience(disciple.level));
      disciple.level += 1;
    }
  });
}

function getDiscipleNextExperience(level) {
  return 80 + level * 40;
}

function getDiscipleGrade(disciple) {
  const total = disciple.aptitude + disciple.root + disciple.comprehension;
  if (total >= 13) {
    return '上佳';
  }
  if (total >= 10) {
    return '中正';
  }
  return '平平';
}

function resolveMissionEvent(mission, completedCount) {
  const eventIds = mission.events ?? [];
  if (!eventIds.length || completedCount <= 0) {
    return null;
  }
  return MISSION_EVENTS[eventIds[(completedCount - 1) % eventIds.length]] ?? null;
}

function maybeCreateOpportunity(state, mission, now) {
  if (state.activeOpportunity) {
    return;
  }
  const opportunityId = MISSION_OPPORTUNITIES[mission.id];
  if (!opportunityId || !OPPORTUNITIES[opportunityId]) {
    return;
  }
  const completed = state.completedMissions?.[mission.id] ?? 0;
  if (completed <= 0 || completed % 2 === 0) {
    return;
  }
  state.activeOpportunity = {
    id: opportunityId,
    missionId: mission.id,
    createdAt: now,
  };
  addLog(state, now, `发现机缘「${OPPORTUNITIES[opportunityId].name}」，可在历练中抉择。`);
}

function addResolvedOpportunity(state, opportunityId) {
  state.resolvedOpportunities ??= {};
  state.resolvedOpportunities[opportunityId] = (state.resolvedOpportunities[opportunityId] ?? 0) + 1;
}

function applyMissionEvent(state, mission, event, now) {
  applyResources(state, event.reward ?? {});
  const item = event.equipment ? addLootEquipment(state, event.equipment) : null;
  state.lastMissionEvent = {
    id: event.id,
    name: event.name,
    missionId: mission.id,
    reward: event.reward ?? {},
    equipmentName: item?.name ?? null,
    time: now,
  };

  const rewardText = formatReward(event.reward ?? {});
  const equipmentText = item ? `，并获得${item.name}` : '';
  addLog(state, now, `奇遇「${event.name}」：${event.detail}${rewardText ? ` 获得${rewardText}` : ''}${equipmentText}。`);
  return { event, item };
}

function addLootEquipment(state, templateId) {
  const template = LOOT_EQUIPMENT[templateId];
  if (!template) {
    return null;
  }
  state.lootEquipment ??= [];
  const uid = `${template.id}-${state.lootEquipment.length + 1}`;
  const item = createLootItem(template.id, uid);
  state.lootEquipment.unshift(item);
  state.lootEquipment = state.lootEquipment.slice(0, 40);
  return item;
}

function createLootItem(templateId, uid, level = 0) {
  const template = LOOT_EQUIPMENT[templateId];
  const safeLevel = clampInteger(level, 0, getLootMaxLevel(template));
  return {
    uid,
    templateId,
    name: template.name,
    slot: template.slot,
    quality: template.quality,
    level: safeLevel,
    bonuses: createLootBonuses(templateId, safeLevel),
  };
}

function createLootBonuses(templateId, level = 0) {
  const template = LOOT_EQUIPMENT[templateId];
  const multiplier = 1 + getTieredLootBonus(level);
  const percentBonus = getTieredPercentBonus(level);
  return Object.fromEntries(
    Object.entries(template.bonuses).map(([key, value]) => [key, key === 'breakthrough' || key === 'qiRate' ? round(value + percentBonus) : Math.round(value * multiplier)]),
  );
}

function getLootMaxLevel(itemOrTemplate) {
  return Math.min(12, Math.max(3, 3 + (itemOrTemplate?.quality ?? 0) * 3));
}

function getResourceAmount(state, resource) {
  if (resource === 'pills') {
    return state.inventoryPills?.gatherQiPill ?? state.pills ?? 0;
  }
  if (PILL_RECIPES[resource]) {
    return state.inventoryPills?.[resource] ?? 0;
  }
  return state[resource] ?? 0;
}

function payResources(state, cost) {
  Object.entries(cost).forEach(([resource, amount]) => {
    if (resource === 'pills') {
      state.inventoryPills.gatherQiPill = round((state.inventoryPills.gatherQiPill ?? 0) - amount);
      state.pills = state.inventoryPills.gatherQiPill;
      return;
    }
    if (PILL_RECIPES[resource]) {
      state.inventoryPills[resource] = round((state.inventoryPills[resource] ?? 0) - amount);
      state.pills = state.inventoryPills.gatherQiPill;
      return;
    }
    state[resource] = round((state[resource] ?? 0) - amount);
  });
}

function applyResources(state, reward) {
  Object.entries(reward).forEach(([resource, amount]) => {
    if (resource === 'qiRateBonus') {
      state.permanentBonuses ??= { qiRate: 0, power: 0 };
      state.permanentBonuses.qiRate = round((state.permanentBonuses.qiRate ?? 0) + amount);
      return;
    }
    if (resource === 'powerBonus') {
      state.permanentBonuses ??= { qiRate: 0, power: 0 };
      state.permanentBonuses.power = round((state.permanentBonuses.power ?? 0) + amount);
      return;
    }
    if (resource === 'pills') {
      state.inventoryPills.gatherQiPill = Math.max(0, round((state.inventoryPills.gatherQiPill ?? 0) + amount));
      state.pills = state.inventoryPills.gatherQiPill;
      return;
    }
    if (PILL_RECIPES[resource]) {
      state.inventoryPills[resource] = Math.max(0, round((state.inventoryPills[resource] ?? 0) + amount));
      state.pills = state.inventoryPills.gatherQiPill;
      return;
    }
    state[resource] = Math.max(0, round((state[resource] ?? 0) + amount));
  });
}

function formatReward(reward) {
  if (!reward || !Object.keys(reward).length) {
    return '';
  }
  return Object.entries(reward)
    .map(([key, amount]) => formatRewardEntry(key, amount))
    .join('、');
}

function formatRewardEntry(key, amount) {
  if (key === 'qiRateBonus') {
    return `灵息永久 +${Math.round(amount * 100)}%`;
  }
  if (key === 'powerBonus') {
    return `道威永久 +${amount}`;
  }

  const names = {
    qi: '灵气',
    herbs: '灵草',
    spiritStones: '灵石',
    pills: '丹药',
    gatherQiPill: '聚气丹',
    clearHeartPill: '清心丹',
    meridianPill: '护脉丹',
    beastCores: '妖核',
    artifacts: '法器',
    arrayFlags: '阵旗',
    forgingEssence: '炼器精魄',
    heartDemon: '心魔',
    insight: '悟道',
  };
  return `${amount} ${names[key] ?? key}`;
}

function clampInteger(value, min, max) {
  const integer = Number.isFinite(value) ? Math.floor(value) : min;
  return Math.min(max, Math.max(min, integer));
}

function scaleCost(base, level) {
  if (level <= 0) {
    return 0;
  }
  if (level <= 3) {
    return Math.ceil(base * level);
  }
  const tierMultiplier = 1 + Math.floor((level - 1) / 3) * 2.4;
  const lateMultiplier = Math.pow(1.13, level - 3);
  return Math.ceil(base * level * tierMultiplier * lateMultiplier);
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function getDateKey(now = Date.now()) {
  return new Date(now).toISOString().slice(0, 10);
}
