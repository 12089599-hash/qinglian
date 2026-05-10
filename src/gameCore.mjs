const REALM_GROUPS = [
  { prefix: '炼气', suffixes: ['一层', '二层', '三层', '四层', '五层', '六层', '七层', '八层', '九层'], startQi: 18, endQi: 4_800, startRate: 3.2, endRate: 7.2, startStone: 4, endStone: 12, qiCurve: 1.46 },
  { prefix: '筑基', suffixes: ['一层', '二层', '三层', '四层', '五层', '六层', '七层', '八层', '九层'], startQi: 16_000, endQi: 220_000, startRate: 6, endRate: 16, startStone: 10, endStone: 24 },
  { prefix: '金丹', suffixes: ['一转', '二转', '三转', '四转', '五转', '六转', '七转', '八转', '九转'], startQi: 360_000, endQi: 2_800_000, startRate: 18, endRate: 45, startStone: 28, endStone: 68 },
  { prefix: '元婴', suffixes: ['一变', '二变', '三变', '四变', '五变', '六变', '七变', '八变', '九变'], startQi: 4_200_000, endQi: 20_000_000, startRate: 55, endRate: 115, startStone: 84, endStone: 170 },
];

const LEGACY_REALM_INDEX_MAP = [0, 1, 2, 9, 13, 18, 26, 27];

export const REALMS = createRealmTrack();

export const CURRENT_BALANCE_VERSION = 6;
export const MAP_DEPTH_MAX_LAYER = 30;
const MISSION_RESIDUAL_DANGER_RATIO = 0.24;
export const DEPTH_TRIBULATIONS = [
  { id: 'goldRain', name: '金刃雨', element: 'metal', detail: '细密剑雨压低回旋余地，劫影锋芒更盛。', pressureMultiplier: 1.06, attackMultiplier: 1.12, pierceBonus: 4 },
  { id: 'woodMiasma', name: '青瘴潮', element: 'wood', detail: '青瘴生息不绝，劫影血元更厚。', pressureMultiplier: 1.05, vitalityMultiplier: 1.16, defenseMultiplier: 1.04 },
  { id: 'waterMirror', name: '玄水镜', element: 'water', detail: '水镜扰乱神识，劫影身法更快。', pressureMultiplier: 1.04, speedBonus: 3, defenseMultiplier: 1.08 },
  { id: 'firePulse', name: '离火脉', element: 'fire', detail: '火脉暴烈，劫影会心更重。', pressureMultiplier: 1.07, attackMultiplier: 1.06, critBonus: 0.035 },
  { id: 'earthSeal', name: '厚土禁', element: 'earth', detail: '地脉封镇，劫影护体更稳。', pressureMultiplier: 1.05, defenseMultiplier: 1.18, vitalityMultiplier: 1.06 },
  { id: 'darkEclipse', name: '玄阴蚀', element: 'dark', detail: '阴影蚀神，劫影破势更深。', pressureMultiplier: 1.08, attackMultiplier: 1.06, pierceBonus: 8, critBonus: 0.015 },
  { id: 'lightJudgement', name: '曜阳照', element: 'light', detail: '曜光照形，劫影出手更准。', pressureMultiplier: 1.06, attackMultiplier: 1.08, speedBonus: 2 },
];

function createRealmTrack() {
  return REALM_GROUPS.flatMap((group) => group.suffixes.map((suffix, index) => {
    const progress = group.suffixes.length === 1 ? 0 : index / (group.suffixes.length - 1);
    const qiProgress = Math.pow(progress, group.qiCurve ?? 1.24);
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

export const CAVE_STAGES = [
  { level: 1, name: '荒岩初辟' },
  { level: 2, name: '引泉入室' },
  { level: 3, name: '青苔小筑' },
  { level: 4, name: '竹扉幽府' },
  { level: 5, name: '聚灵初庭' },
  { level: 6, name: '云灯丹室' },
  { level: 7, name: '听风别院' },
  { level: 8, name: '剑痕外坛' },
  { level: 9, name: '灵田成畦' },
  { level: 10, name: '青岚内府' },
  { level: 11, name: '玄炉温室' },
  { level: 12, name: '玉阶藏经' },
  { level: 13, name: '护山阵阙' },
  { level: 14, name: '云壑洞庭' },
  { level: 15, name: '星砂丹台' },
  { level: 16, name: '灵脉中枢' },
  { level: 17, name: '归元内景' },
  { level: 18, name: '青霄府界' },
  { level: 19, name: '半步洞天' },
  { level: 20, name: '青岚洞天' },
];

export const CAVE_UPGRADE_TIERS = [
  { name: '筑庐', minLevel: 1, maxLevel: 5, realmIndex: 0, costMultiplier: 1, materialMultiplier: 1 },
  { name: '灵府', minLevel: 6, maxLevel: 10, realmIndex: 9, costMultiplier: 2.8, materialMultiplier: 2.2 },
  { name: '玄庭', minLevel: 11, maxLevel: 15, realmIndex: 18, costMultiplier: 7.4, materialMultiplier: 4.4 },
  { name: '洞天', minLevel: 16, maxLevel: 20, realmIndex: 27, costMultiplier: 18, materialMultiplier: 8 },
];

export const MISSIONS = {
  herbGathering: {
    id: 'herbGathering',
    name: '采集灵草',
    mapId: 'qinglanMountain',
    map: '青岚山',
    unlockRealmIndex: 0,
    duration: 30,
    reward: { herbs: 8, spiritStones: 12 },
    events: ['hiddenHerbPatch', 'spiritSpring'],
  },
  cavePatrol: {
    id: 'cavePatrol',
    name: '巡守洞府',
    mapId: 'qinglanMountain',
    map: '青岚山',
    unlockRealmIndex: 0,
    duration: 55,
    reward: { spiritStones: 18, qi: 18 },
    events: ['spiritSpring', 'cloudRobeCache', 'greenJadeCache'],
  },
  marketTrade: {
    id: 'marketTrade',
    name: '坊市交易',
    mapId: 'qinglanMountain',
    map: '青岚山',
    unlockRealmIndex: 0,
    duration: 90,
    reward: { spiritStones: 55 },
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
    reward: { spiritStones: 55, qi: 125, beastCores: 1, artifacts: 1 },
    rareEvery: 4,
    rareReward: { meridianPill: 1 },
    failurePenalty: { qi: -45, heartDemon: 1 },
    events: ['spiritSpring', 'cloudRobeCache', 'cloudBootsCache'],
  },
  herbValley: {
    id: 'herbValley',
    name: '灵草谷',
    mapId: 'herbValley',
    map: '灵草谷',
    unlockRealmIndex: 4,
    duration: 70,
    danger: 120,
    reward: { herbs: 20, spiritStones: 24, qi: 70 },
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
    reward: { artifacts: 2, spiritStones: 50, beastCores: 1, forgingEssence: 1 },
    rareEvery: 3,
    rareReward: { beastCores: 2, arrayFlags: 1 },
    failurePenalty: { qi: -60, heartDemon: 1 },
    events: ['swordRemnant', 'moonWheelCache', 'beastAmbush'],
  },
  demonRift: {
    id: 'demonRift',
    name: '魔气裂隙',
    mapId: 'demonRift',
    map: '魔气裂隙',
    unlockRealmIndex: 14,
    duration: 180,
    danger: 520,
    reward: { beastCores: 3, spiritStones: 90, qi: 120 },
    rareEvery: 4,
    rareReward: { meridianPill: 1, arrayFlags: 1 },
    failurePenalty: { qi: -90, heartDemon: 2 },
    events: ['beastAmbush', 'moonWheelCache', 'cloudBootsCache'],
  },
  ancientRuins: {
    id: 'ancientRuins',
    name: '上古遗迹',
    mapId: 'ancientRuins',
    map: '上古遗迹',
    unlockRealmIndex: 21,
    duration: 240,
    danger: 820,
    reward: { spiritStones: 150, beastCores: 4, arrayFlags: 2, qi: 180 },
    rareEvery: 5,
    rareReward: { artifacts: 3, meridianPill: 1 },
    failurePenalty: { qi: -130, heartDemon: 2 },
    events: ['ancientCache', 'swordRemnant', 'xuanmuAmuletCache', 'moonWheelCache', 'greenJadeCache', 'cloudBootsCache'],
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
      element: 'earth',
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
      element: 'wood',
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
      element: 'water',
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
      element: 'metal',
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
      element: 'dark',
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
    unlockRealmIndex: 21,
    explorationTarget: 8,
    reputationPerMission: 12,
    masteryBonus: { qiRate: 0.015, power: 16 },
    boss: {
      name: '残阵守灵',
      title: '遗迹阵枢',
      element: 'light',
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

export const MISSION_APPROACHES = {
  balanced: {
    id: 'balanced',
    name: '循迹',
    detail: '按原路线稳步行游，收益和劫象保持均衡。',
    rewardBonus: {},
    durationMultiplier: 1,
    dangerMultiplier: 1,
    dropEvery: 0,
  },
  herbSeeking: {
    id: 'herbSeeking',
    name: '寻药',
    detail: '放慢脚步辨认草木灵机，偏向灵草和清心收获。',
    rewardBonus: { herbs: 0.45 },
    flatReward: { herbs: 3 },
    durationMultiplier: 1.05,
    dangerMultiplier: 0.96,
    dropEvery: 2,
  },
  monsterHunt: {
    id: 'monsterHunt',
    name: '猎妖',
    detail: '主动追索妖踪，妖核更多，但劫象会更重。',
    rewardBonus: { beastCores: 0.55, spiritStones: 0.12 },
    flatReward: { beastCores: 1 },
    durationMultiplier: 1,
    dangerMultiplier: 1.12,
    dropEvery: 2,
  },
  relicSearch: {
    id: 'relicSearch',
    name: '探遗',
    detail: '搜寻残器旧阵，偏向法器、阵旗和炼器精魄。',
    rewardBonus: { artifacts: 0.5, arrayFlags: 0.35, forgingEssence: 0.3 },
    flatReward: { forgingEssence: 1 },
    durationMultiplier: 1.1,
    dangerMultiplier: 1.05,
    dropEvery: 2,
  },
  daoInquiry: {
    id: 'daoInquiry',
    name: '问道',
    detail: '静观地脉与残念，偏向灵气、悟道和破境准备。',
    rewardBonus: { qi: 0.35, insight: 0.35 },
    flatReward: { insight: 1 },
    durationMultiplier: 1.12,
    dangerMultiplier: 1.02,
    dropEvery: 2,
  },
};

export const MAP_SPECIAL_DROPS = {
  qinglanMountain: {
    herbSeeking: { name: '山阴灵苗', reward: { herbs: 8 } },
    monsterHunt: { name: '山魈残爪', reward: { beastCores: 1 } },
    relicSearch: { name: '旧府残器', reward: { artifacts: 1 } },
    daoInquiry: { name: '青岚地脉', reward: { qi: 80, insight: 1 } },
  },
  herbValley: {
    herbSeeking: { name: '百草灵芽', reward: { herbs: 18, clearHeartPill: 1 } },
    monsterHunt: { name: '药谷妖胆', reward: { beastCores: 1, herbs: 6 } },
    relicSearch: { name: '药锄残器', reward: { artifacts: 1, forgingEssence: 1 } },
    daoInquiry: { name: '药性心悟', reward: { insight: 1, qi: 110 } },
  },
  mistyValley: {
    herbSeeking: { name: '雾隐灵芝', reward: { herbs: 14, meridianPill: 1 } },
    monsterHunt: { name: '雾妖晶核', reward: { beastCores: 2 } },
    relicSearch: { name: '雾纹残甲', reward: { artifacts: 1, forgingEssence: 1 } },
    daoInquiry: { name: '雾中观息', reward: { qi: 160, insight: 1 } },
  },
  swordTomb: {
    herbSeeking: { name: '剑苔灵草', reward: { herbs: 16, clearHeartPill: 1 } },
    monsterHunt: { name: '剑冢煞核', reward: { beastCores: 2 } },
    relicSearch: { name: '剑冢残片', reward: { artifacts: 1, forgingEssence: 2 } },
    daoInquiry: { name: '剑鸣残悟', reward: { insight: 1, qi: 180 } },
  },
  demonRift: {
    herbSeeking: { name: '魔隙幽草', reward: { herbs: 20, clearHeartPill: 1 } },
    monsterHunt: { name: '裂隙魔核', reward: { beastCores: 3, heartDemon: 1 } },
    relicSearch: { name: '镇魔阵旗', reward: { arrayFlags: 2, forgingEssence: 2 } },
    daoInquiry: { name: '镇煞心印', reward: { insight: 1, meridianPill: 1 } },
  },
  ancientRuins: {
    herbSeeking: { name: '遗迹灵根', reward: { herbs: 24, meridianPill: 1 } },
    monsterHunt: { name: '守灵妖核', reward: { beastCores: 4 } },
    relicSearch: { name: '上古残阵', reward: { artifacts: 2, arrayFlags: 2, forgingEssence: 3 } },
    daoInquiry: { name: '古修残悟', reward: { insight: 2, qi: 260 } },
  },
};

export const SECT_COMMISSIONS = {
  herbGarden: {
    id: 'herbGarden',
    name: '采药委托',
    detail: '弟子巡山采药，稳定补充灵草。',
    rates: { herbs: 0.035, reputation: 0.006 },
  },
  mine: {
    id: 'mine',
    name: '采矿委托',
    detail: '弟子整理灵脉碎矿，缓慢产出灵石。',
    rates: { spiritStones: 0.035, reputation: 0.004 },
  },
  patrol: {
    id: 'patrol',
    name: '护山委托',
    detail: '弟子巡守山门，偶得妖核并提升宗门名望。',
    rates: { beastCores: 0.0025, reputation: 0.006 },
  },
  forge: {
    id: 'forge',
    name: '炼器委托',
    detail: '弟子整理残器与炉火，缓慢沉淀法器和炼器精魄。',
    rates: { artifacts: 0.0022, forgingEssence: 0.0014, reputation: 0.005 },
  },
};

const RESOURCE_GUIDES = {
  spiritStones: {
    label: '灵石',
    priority: 0.9,
    mapIds: ['ancientRuins', 'demonRift', 'swordTomb', 'mistyValley', 'herbValley', 'qinglanMountain'],
    missionId: 'marketTrade',
    approachId: 'balanced',
    commissionId: 'mine',
    detail: '洞府、装备和坊市刷新都会消耗灵石。',
  },
  herbs: {
    label: '灵草',
    priority: 1,
    mapIds: ['herbValley', 'qinglanMountain'],
    missionId: 'herbValley',
    approachId: 'herbSeeking',
    commissionId: 'herbGarden',
    detail: '炼丹、灵田和丹修成长都需要稳定灵草。',
  },
  beastCores: {
    label: '妖核',
    priority: 1.25,
    mapIds: ['demonRift', 'mistyValley', 'qinglanMountain'],
    missionId: 'mistyValley',
    approachId: 'monsterHunt',
    commissionId: 'patrol',
    detail: '武器、护符、法袍、云履、剑阵和护脉丹容易被妖核卡住。',
  },
  artifacts: {
    label: '法器',
    priority: 1.2,
    mapIds: ['swordTomb', 'mistyValley', 'qinglanMountain'],
    missionId: 'ancientSwordTomb',
    approachId: 'relicSearch',
    commissionId: 'forge',
    detail: '法器可用于淬炼、分解和炼器阁营建。',
  },
  arrayFlags: {
    label: '阵旗',
    priority: 1.15,
    mapIds: ['ancientRuins', 'demonRift', 'swordTomb'],
    missionId: 'demonRift',
    approachId: 'relicSearch',
    commissionId: null,
    marketItemId: 'arrayManual',
    detail: '阵法、静室高阶和藏经阁会持续消耗阵旗。',
  },
  forgingEssence: {
    label: '炼器精魄',
    priority: 1.35,
    mapIds: ['swordTomb', 'mistyValley', 'qinglanMountain'],
    missionId: 'ancientSwordTomb',
    approachId: 'relicSearch',
    commissionId: 'forge',
    marketItemId: 'forgingAsh',
    detail: '器位强化、法宝和炼器阁中后期都需要炼器精魄。',
  },
  bloodEssence: {
    label: '血脉精魄',
    priority: 1.3,
    mapIds: ['demonRift', 'swordTomb', 'mistyValley', 'qinglanMountain'],
    missionId: 'ancientSwordTomb',
    approachId: 'relicSearch',
    commissionId: null,
    detail: '血脉精魄主要来自玄纹以上战利品分解，是血脉和御灵秘传的长期材料。',
  },
  insight: {
    label: '悟道',
    priority: 1.05,
    mapIds: ['ancientRuins', 'demonRift', 'swordTomb', 'qinglanMountain'],
    missionId: 'ancientRuins',
    approachId: 'daoInquiry',
    commissionId: null,
    marketItemId: 'insightScroll',
    detail: '悟道支撑藏经阁高阶和后续功法沉淀。',
  },
  qi: {
    label: '灵气',
    priority: 0.55,
    mapIds: ['ancientRuins', 'demonRift', 'swordTomb', 'herbValley', 'qinglanMountain'],
    missionId: 'ancientRuins',
    approachId: 'daoInquiry',
    commissionId: null,
    detail: '灵气不足时，问道路线、丹药和长期吐纳更重要。',
  },
};

export const SECT_LEVELS = [
  { level: 1, name: '外门草创', reputation: 0, capacityBonus: 0, commissionBonus: 0 },
  { level: 2, name: '山门初立', reputation: 30, capacityBonus: 1, commissionBonus: 0.06 },
  { level: 3, name: '内门成形', reputation: 90, capacityBonus: 2, commissionBonus: 0.12 },
  { level: 4, name: '一方名门', reputation: 180, capacityBonus: 3, commissionBonus: 0.2 },
  { level: 5, name: '洞天雏形', reputation: 320, capacityBonus: 5, commissionBonus: 0.3 },
];

export const SECT_SKILLS = {
  scriptureInheritance: {
    id: 'scriptureInheritance',
    name: '传功经阁',
    detail: '门中讲经传法，令周天运转更稳。',
    maxLevel: 8,
    requiredReputation: (level) => 45 + (level - 1) * 55,
    cost: (level) => ({ spiritStones: scaleCost(120, level), insight: Math.max(1, Math.ceil(level / 2)) }),
    bonuses: { qiRate: 0.018, breakthrough: 0.008 },
  },
  mountainWard: {
    id: 'mountainWard',
    name: '护山真令',
    detail: '令牌贯通山势，护持行游与叩关。',
    maxLevel: 8,
    requiredReputation: (level) => 35 + (level - 1) * 50,
    cost: (level) => ({ spiritStones: scaleCost(100, level), arrayFlags: Math.max(1, Math.ceil(level / 2)) }),
    bonuses: { dangerReduction: 5, defense: 8, vitality: 18 },
  },
  forgingEdict: {
    id: 'forgingEdict',
    name: '炼器敕令',
    detail: '山门火脉归一，分解和寻器更有章法。',
    maxLevel: 8,
    requiredReputation: (level) => 60 + (level - 1) * 60,
    cost: (level) => ({ spiritStones: scaleCost(140, level), artifacts: Math.max(1, Math.ceil(level / 2)), forgingEssence: level }),
    bonuses: { power: 18, attack: 12, dismantleBonus: 0.06, lootRarity: 0.04 },
  },
  beastTamingCanon: {
    id: 'beastTamingCanon',
    name: '御灵兽谱',
    detail: '宗门记载妖脉习性，灵兽和血脉培养更顺。',
    maxLevel: 8,
    requiredReputation: (level) => 75 + (level - 1) * 65,
    cost: (level) => ({ spiritStones: scaleCost(150, level), beastCores: Math.max(1, level), bloodEssence: Math.max(1, Math.ceil(level / 3)) }),
    bonuses: { power: 10, vitality: 24, bloodEssenceBonus: 0.12, beastTraining: 0.04 },
  },
};

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
        repeatReward: { forgingEssence: 4, spiritStones: 45 },
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
        repeatReward: { qi: 180, herbs: 4 },
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
    rarityId: 'mystic',
    maxLevel: 8,
    cost: (level) => ({ spiritStones: scaleCost(120, level), artifacts: level, forgingEssence: level * 2 }),
    bonuses: { breakthrough: 0.025, power: 10 },
  },
  swordGourd: {
    id: 'swordGourd',
    name: '养剑葫',
    detail: '温养剑气，凝练历练道威并平息行游劫象。',
    rarityId: 'spirit',
    maxLevel: 8,
    cost: (level) => ({ spiritStones: scaleCost(140, level), beastCores: level, forgingEssence: level * 2 }),
    bonuses: { power: 24, dangerReduction: 4 },
  },
  spiritLamp: {
    id: 'spiritLamp',
    name: '聚灵灯',
    detail: '牵引洞府灵机，提升长期灵息效率。',
    rarityId: 'spirit',
    maxLevel: 8,
    cost: (level) => ({ spiritStones: scaleCost(110, level), arrayFlags: level, herbs: scaleCost(10, level) }),
    bonuses: { qiRate: 0.025 },
  },
};

export const SPIRIT_BEAST_QUALITIES = {
  wild: { id: 'wild', name: '野灵', growthMultiplier: 0.86, costMultiplier: 0.7 },
  spirit: { id: 'spirit', name: '通灵', growthMultiplier: 1, costMultiplier: 1 },
  mystic: { id: 'mystic', name: '玄裔', growthMultiplier: 1.18, costMultiplier: 1.35 },
  earth: { id: 'earth', name: '地脉', growthMultiplier: 1.38, costMultiplier: 1.85 },
  heaven: { id: 'heaven', name: '天种', growthMultiplier: 1.65, costMultiplier: 2.55 },
  ancient: { id: 'ancient', name: '古血', growthMultiplier: 2.05, costMultiplier: 3.6 },
};

export const SPIRIT_BEASTS = {
  stoneMarten: {
    id: 'stoneMarten',
    name: '岩纹灵貂',
    detail: '山岩间常见的小兽，善寻矿脉，适合作为最早的御灵伙伴。',
    rarityId: 'common',
    qualityId: 'wild',
    unlock: { realmIndex: 0 },
    maxLevel: 6,
    cost: (level) => ({ spiritStones: scaleCost(48, level), beastCores: Math.max(1, Math.ceil(level / 2)) }),
    bonuses: { power: 9, defense: 5 },
    deployedBonuses: { defense: 8, vitality: 16 },
    combat: { element: 'earth', attack: 14, defense: 8, vitality: 48, speed: 11, critChance: 0.025, pierce: 2 },
    skill: { name: '裂石扑击', cadence: 4, multiplier: 1.18, critBonus: 0.02, detail: '每四回合借岩势扑击，造成厚土战技。' },
  },
  cloudFox: {
    id: 'cloudFox',
    name: '云纹灵狐',
    detail: '亲近灵气，辅助周天灵息和灵田照料。',
    rarityId: 'spirit',
    qualityId: 'spirit',
    unlock: { realmIndex: 0 },
    maxLevel: 8,
    cost: (level) => ({ spiritStones: scaleCost(90, level), herbs: scaleCost(18, level), beastCores: level }),
    bonuses: { qiRate: 0.04, herbRate: 0.015 },
    deployedBonuses: { vitality: 30, speed: 2, defense: 8 },
    combat: { element: 'wood', attack: 24, defense: 8, vitality: 64, speed: 15, critChance: 0.04, pierce: 3 },
    skill: { name: '云息缠灵', cadence: 3, multiplier: 1.32, critBonus: 0.03, detail: '每三回合牵引云息缠住劫影，造成一次青木战技。' },
  },
  greenFeatherCrane: {
    id: 'greenFeatherCrane',
    name: '青羽灵鹤',
    detail: '性情清正，能梳理气机，适合破境前长期培养。',
    rarityId: 'spirit',
    qualityId: 'spirit',
    unlock: { realmIndex: 2 },
    maxLevel: 8,
    cost: (level) => ({ spiritStones: scaleCost(95, level), herbs: scaleCost(22, level), beastCores: level }),
    bonuses: { breakthrough: 0.012, speed: 2 },
    deployedBonuses: { speed: 4, defense: 6, vitality: 20 },
    combat: { element: 'light', attack: 22, defense: 7, vitality: 58, speed: 17, critChance: 0.035, pierce: 3 },
    skill: { name: '青羽拂劫', cadence: 3, multiplier: 1.24, critBonus: 0.02, detail: '每三回合拂散劫影，造成曜阳战技。' },
  },
  thunderTiger: {
    id: 'thunderTiger',
    name: '雷纹幼虎',
    detail: '守山善战，凝练道威并护持外出行游。',
    rarityId: 'mystic',
    qualityId: 'mystic',
    unlock: { realmIndex: 7, mapId: 'mistyValley', depthLayer: 2 },
    maxLevel: 8,
    cost: (level) => ({ spiritStones: scaleCost(130, level), beastCores: level * 2 }),
    bonuses: { power: 22, dangerReduction: 5 },
    deployedBonuses: { attack: 22, pierce: 6, critChance: 0.012, vitality: 18 },
    combat: { element: 'light', attack: 38, defense: 6, vitality: 78, speed: 13, critChance: 0.08, pierce: 8 },
    skill: { name: '雷痕扑杀', cadence: 2, multiplier: 1.58, critBonus: 0.08, detail: '隔回合扑杀劫影，曜阳雷痕更容易压出会心。' },
  },
  flameMarten: {
    id: 'flameMarten',
    name: '赤焰灵貂',
    detail: '喜食火脉残晶，出战时能补足离火杀伤。',
    rarityId: 'mystic',
    qualityId: 'mystic',
    unlock: { realmIndex: 7, bossId: 'qinglanMountain' },
    maxLevel: 8,
    cost: (level) => ({ spiritStones: scaleCost(128, level), beastCores: level * 2, herbs: scaleCost(10, level) }),
    bonuses: { power: 18, alchemySpeed: 0.012 },
    deployedBonuses: { attack: 18, critChance: 0.012, speed: 2 },
    combat: { element: 'fire', attack: 36, defense: 5, vitality: 66, speed: 18, critChance: 0.085, pierce: 6 },
    skill: { name: '焰尾连环', cadence: 2, multiplier: 1.44, critBonus: 0.07, detail: '隔回合甩出焰尾，造成离火战技。' },
  },
  snowSpiritDeer: {
    id: 'snowSpiritDeer',
    name: '雪魄灵鹿',
    detail: '踏雪无声，能安定识海，适合心魔压力较高的阶段。',
    rarityId: 'mystic',
    qualityId: 'mystic',
    unlock: { realmIndex: 8, mapId: 'herbValley', depthLayer: 3 },
    maxLevel: 8,
    cost: (level) => ({ spiritStones: scaleCost(132, level), herbs: scaleCost(26, level), beastCores: level }),
    bonuses: { breakthrough: 0.014, dangerReduction: 4 },
    deployedBonuses: { defense: 12, vitality: 32, speed: 2 },
    combat: { element: 'water', attack: 26, defense: 12, vitality: 82, speed: 14, critChance: 0.035, pierce: 4 },
    skill: { name: '雪魄凝心', cadence: 4, multiplier: 1.2, critBonus: 0.02, detail: '每四回合凝出雪魄寒芒，造成玄水战技。' },
  },
  blackTurtle: {
    id: 'blackTurtle',
    name: '玄甲灵龟',
    detail: '背负玄甲地脉，能显著提升续战和守御。',
    rarityId: 'earthFiend',
    qualityId: 'earth',
    unlock: { realmIndex: 12, mapId: 'swordTomb', depthLayer: 2 },
    maxLevel: 10,
    cost: (level) => ({ spiritStones: scaleCost(180, level), beastCores: level * 3, bloodEssence: Math.max(1, Math.ceil(level / 2)) }),
    bonuses: { defense: 18, vitality: 58, dangerReduction: 4 },
    deployedBonuses: { defense: 22, vitality: 54 },
    combat: { element: 'earth', attack: 30, defense: 20, vitality: 120, speed: 7, critChance: 0.025, pierce: 5 },
    skill: { name: '玄甲镇岳', cadence: 3, multiplier: 1.3, critBonus: 0.02, detail: '每三回合以玄甲镇压劫影，造成厚土战技。' },
  },
  goldenEyeApe: {
    id: 'goldenEyeApe',
    name: '金瞳灵猿',
    detail: '金瞳善破虚妄，斗法时更容易打穿敌方护势。',
    rarityId: 'earthFiend',
    qualityId: 'earth',
    unlock: { realmIndex: 14, bossId: 'swordTomb' },
    maxLevel: 10,
    cost: (level) => ({ spiritStones: scaleCost(190, level), beastCores: level * 3, forgingEssence: Math.max(1, Math.ceil(level / 2)) }),
    bonuses: { power: 26, pierce: 5 },
    deployedBonuses: { attack: 24, pierce: 10, critChance: 0.012 },
    combat: { element: 'metal', attack: 46, defense: 12, vitality: 94, speed: 14, critChance: 0.09, pierce: 13 },
    skill: { name: '金瞳破妄', cadence: 2, multiplier: 1.56, critBonus: 0.06, detail: '隔回合以金瞳锁定破绽，造成庚金战技。' },
  },
  shadowMoonLeopard: {
    id: 'shadowMoonLeopard',
    name: '影月灵豹',
    detail: '潜行月影之间，适合高速斗法与玄阴流派。',
    rarityId: 'earthFiend',
    qualityId: 'earth',
    unlock: { realmIndex: 14, mapId: 'demonRift', depthLayer: 2 },
    maxLevel: 10,
    cost: (level) => ({ spiritStones: scaleCost(196, level), beastCores: level * 3, bloodEssence: Math.max(1, Math.ceil(level / 2)) }),
    bonuses: { speed: 4, dangerReduction: 5 },
    deployedBonuses: { attack: 18, speed: 7, critChance: 0.018, pierce: 5 },
    combat: { element: 'dark', attack: 42, defense: 8, vitality: 82, speed: 22, critChance: 0.1, pierce: 10 },
    skill: { name: '影月裂身', cadence: 2, multiplier: 1.5, critBonus: 0.08, detail: '隔回合穿入影月，造成玄阴战技。' },
  },
  starSandCarp: {
    id: 'starSandCarp',
    name: '星砂灵鲤',
    detail: '吞吐星砂灵机，能提升长线吐纳和资源沉淀。',
    rarityId: 'heavenWork',
    qualityId: 'heaven',
    unlock: { realmIndex: 18, mapId: 'swordTomb', depthLayer: 8, insight: 2 },
    maxLevel: 12,
    cost: (level) => ({ spiritStones: scaleCost(260, level), herbs: scaleCost(45, level), beastCores: level * 4, insight: Math.max(1, Math.ceil(level / 3)) }),
    bonuses: { qiRate: 0.052, herbRate: 0.02, bloodEssenceBonus: 0.018 },
    deployedBonuses: { vitality: 42, defense: 14, elementPower: 10 },
    combat: { element: 'water', attack: 34, defense: 16, vitality: 108, speed: 13, critChance: 0.045, pierce: 7 },
    skill: { name: '星砂回潮', cadence: 3, multiplier: 1.42, critBonus: 0.03, detail: '每三回合卷起星砂潮汐，造成玄水战技。' },
  },
  nineSunCrow: {
    id: 'nineSunCrow',
    name: '九曜灵鸦',
    detail: '翎羽含曜阳残火，斗法爆发极强。',
    rarityId: 'heavenWork',
    qualityId: 'heaven',
    unlock: { realmIndex: 20, mapId: 'demonRift', depthLayer: 6, forgingEssence: 12 },
    maxLevel: 12,
    cost: (level) => ({ spiritStones: scaleCost(280, level), beastCores: level * 4, forgingEssence: level, insight: Math.max(1, Math.ceil(level / 3)) }),
    bonuses: { power: 40, critChance: 0.01 },
    deployedBonuses: { attack: 32, critChance: 0.026, speed: 4, elementPower: 12 },
    combat: { element: 'light', attack: 58, defense: 9, vitality: 92, speed: 19, critChance: 0.13, pierce: 12 },
    skill: { name: '九曜坠火', cadence: 2, multiplier: 1.72, critBonus: 0.1, detail: '隔回合坠下曜阳火羽，造成高爆发战技。' },
  },
  qingqiuFox: {
    id: 'qingqiuFox',
    name: '青丘幼狐',
    detail: '古狐血脉未显锋芒，却能深度牵引周天与识海。',
    rarityId: 'dao',
    qualityId: 'ancient',
    unlock: { realmIndex: 24, mapId: 'ancientRuins', depthLayer: 4, bloodEssence: 8 },
    maxLevel: 14,
    cost: (level) => ({ spiritStones: scaleCost(420, level), herbs: scaleCost(70, level), beastCores: level * 5, bloodEssence: Math.max(2, Math.ceil(level / 2)), insight: Math.max(1, Math.ceil(level / 3)) }),
    bonuses: { qiRate: 0.07, breakthrough: 0.018, herbRate: 0.024 },
    deployedBonuses: { vitality: 56, defense: 20, speed: 5, elementPower: 14 },
    combat: { element: 'wood', attack: 46, defense: 18, vitality: 128, speed: 18, critChance: 0.07, pierce: 9 },
    skill: { name: '青丘幻息', cadence: 3, multiplier: 1.62, critBonus: 0.05, detail: '每三回合化出幻息灵尾，造成青木战技。' },
  },
  floodDragon: {
    id: 'floodDragon',
    name: '蛟影幼龙',
    detail: '蛟龙古血初醒，收集与出战成长都极高。',
    rarityId: 'dao',
    qualityId: 'ancient',
    unlock: { realmIndex: 24, mapId: 'ancientRuins', depthLayer: 6, bossId: 'ancientRuins', bloodEssence: 10 },
    maxLevel: 14,
    cost: (level) => ({ spiritStones: scaleCost(460, level), beastCores: level * 6, bloodEssence: Math.max(2, Math.ceil(level / 2)), forgingEssence: level, insight: Math.max(1, Math.ceil(level / 3)) }),
    bonuses: { power: 56, qiRate: 0.032, dangerReduction: 8, elementPower: 8 },
    deployedBonuses: { attack: 42, defense: 18, vitality: 62, pierce: 12, critChance: 0.018 },
    combat: { element: 'water', attack: 68, defense: 18, vitality: 142, speed: 16, critChance: 0.1, pierce: 16 },
    skill: { name: '蛟影翻江', cadence: 2, multiplier: 1.86, critBonus: 0.08, detail: '隔回合翻起蛟影江潮，造成古血玄水战技。' },
  },
};

export const BLOODLINES = {
  greenPhoenixBlood: {
    id: 'greenPhoenixBlood',
    name: '青鸾血',
    detail: '青鸾余息入脉，吐纳与身法更轻灵。',
    rarityId: 'spirit',
    maxLevel: 6,
    cost: (level) => ({ bloodEssence: level, herbs: scaleCost(26, level), spiritStones: scaleCost(90, level) }),
    bonuses: { qiRate: 0.028, speed: 2, herbRate: 0.01 },
  },
  blackTurtleBlood: {
    id: 'blackTurtleBlood',
    name: '玄武血',
    detail: '玄甲藏息，护住血元与叩关余地。',
    rarityId: 'mystic',
    maxLevel: 6,
    cost: (level) => ({ bloodEssence: level, beastCores: Math.max(1, level), spiritStones: scaleCost(110, level) }),
    bonuses: { defense: 14, vitality: 48, breakthrough: 0.014, dangerReduction: 4 },
  },
  whiteTigerBlood: {
    id: 'whiteTigerBlood',
    name: '白虎血',
    detail: '杀伐脉象渐醒，锋芒与破势随之抬升。',
    rarityId: 'mystic',
    maxLevel: 6,
    cost: (level) => ({ bloodEssence: level, beastCores: Math.max(1, level), forgingEssence: Math.max(1, Math.ceil(level / 2)), spiritStones: scaleCost(120, level) }),
    bonuses: { power: 34, attack: 22, pierce: 5, critChance: 0.008 },
  },
  candleDragonBlood: {
    id: 'candleDragonBlood',
    name: '烛阴血',
    detail: '阴阳烛照，五行斗法与神识底蕴更深。',
    rarityId: 'earthFiend',
    maxLevel: 6,
    cost: (level) => ({ bloodEssence: level + 1, insight: Math.max(1, Math.ceil(level / 2)), spiritStones: scaleCost(160, level) }),
    bonuses: { elementPower: 16, power: 18, qiRate: 0.012, critChance: 0.006 },
  },
};

export const DAO_HEARTS = {
  greenLotusSwordBone: {
    id: 'greenLotusSwordBone',
    name: '青莲剑骨',
    detail: '一念如锋，行游遇煞时更容易压住局面。',
    maxLevel: 3,
    bonuses: { power: 48, dangerReduction: 6 },
  },
  xuanFurnaceDanMind: {
    id: 'xuanFurnaceDanMind',
    name: '玄炉丹心',
    detail: '丹火入神，周天更绵长，炉火更听使唤。',
    maxLevel: 3,
    bonuses: { qiRate: 0.035, alchemySpeed: 0.03 },
  },
  ninePalaceArraySoul: {
    id: 'ninePalaceArraySoul',
    name: '九宫阵魂',
    detail: '心神合阵，叩关前能多留一线回旋。',
    maxLevel: 3,
    bonuses: { breakthrough: 0.025, dangerReduction: 4 },
  },
};

const DAO_HEART_CHOICES = Object.keys(DAO_HEARTS);
const DAO_HEART_REALM_INDICES = [9, 18, 27];

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
    reward: { qi: 8 },
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
  moonWheelCache: {
    id: 'moonWheelCache',
    name: '玄鸣轮匣',
    detail: '轮匣中月纹轻震，可入副器位。',
    reward: { forgingEssence: 1 },
    equipment: 'xuanmingWheel',
  },
  xuanmuAmuletCache: {
    id: 'xuanmuAmuletCache',
    name: '玄木符匣',
    detail: '符匣内温润生机，可护持突破。',
    reward: { herbs: 5 },
    equipment: 'xuanmuAmulet',
  },
  greenJadeCache: {
    id: 'greenJadeCache',
    name: '青玉残佩',
    detail: '残佩仍含温润地气，可入玉佩位。',
    reward: { spiritStones: 18 },
    equipment: 'greenJadePendant',
  },
  cloudBootsCache: {
    id: 'cloudBootsCache',
    name: '踏云履囊',
    detail: '旧履藏有轻灵步纹，可入云履位。',
    reward: { herbs: 4 },
    equipment: 'cloudstepBoots',
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
    realmBand: '炼气',
    minRealmIndex: 0,
    lootTier: 0,
    quality: 1,
    element: 'metal',
    bonuses: { power: 36, attack: 22, elementPower: 12 },
  },
  bloodCopperBlade: {
    id: 'bloodCopperBlade',
    name: '赤铜刀',
    slot: 'weapon',
    realmBand: '炼气',
    minRealmIndex: 0,
    lootTier: 0,
    quality: 0,
    element: 'fire',
    bonuses: { power: 30, attack: 26, critChance: 0.012, elementPower: 10 },
  },
  coldMoonSpear: {
    id: 'coldMoonSpear',
    name: '寒月枪',
    slot: 'weapon',
    realmBand: '筑基',
    minRealmIndex: 9,
    lootTier: 1,
    quality: 1,
    element: 'water',
    bonuses: { power: 34, attack: 18, pierce: 10, speed: 2, elementPower: 12 },
  },
  zhexiaSword: {
    id: 'zhexiaSword',
    name: '折霞剑',
    slot: 'weapon',
    realmBand: '筑基',
    minRealmIndex: 12,
    lootTier: 2,
    quality: 2,
    element: 'fire',
    bonuses: { power: 52, attack: 30, critChance: 0.018, elementPower: 18 },
  },
  floodBoneHalberd: {
    id: 'floodBoneHalberd',
    name: '蛟骨战戟',
    slot: 'weapon',
    realmBand: '金丹',
    minRealmIndex: 18,
    lootTier: 3,
    quality: 2,
    element: 'water',
    bonuses: { power: 68, attack: 34, pierce: 18, vitality: 36, elementPower: 20 },
  },
  taiyiFlyingSword: {
    id: 'taiyiFlyingSword',
    name: '太乙飞剑',
    slot: 'weapon',
    realmBand: '元婴',
    minRealmIndex: 27,
    lootTier: 4,
    quality: 3,
    element: 'light',
    bonuses: { power: 90, attack: 44, critChance: 0.026, speed: 5, elementPower: 28 },
  },
  xuanmingWheel: {
    id: 'xuanmingWheel',
    name: '玄鸣法轮',
    slot: 'offhand',
    realmBand: '筑基',
    minRealmIndex: 9,
    lootTier: 1,
    quality: 1,
    element: 'light',
    bonuses: { power: 24, attack: 14, pierce: 8, elementPower: 12 },
  },
  spiritEchoBell: {
    id: 'spiritEchoBell',
    name: '回灵铃',
    slot: 'offhand',
    realmBand: '炼气',
    minRealmIndex: 0,
    lootTier: 0,
    quality: 0,
    element: 'wood',
    bonuses: { qiRate: 0.024, defense: 10, vitality: 20, elementPower: 8 },
  },
  sevenStarMirror: {
    id: 'sevenStarMirror',
    name: '七星镜',
    slot: 'offhand',
    realmBand: '筑基',
    minRealmIndex: 9,
    lootTier: 1,
    quality: 1,
    element: 'light',
    bonuses: { power: 18, breakthrough: 0.028, defense: 14, elementPower: 14 },
  },
  zhaoyingBanner: {
    id: 'zhaoyingBanner',
    name: '照影幡',
    slot: 'offhand',
    realmBand: '金丹',
    minRealmIndex: 18,
    lootTier: 2,
    quality: 2,
    element: 'dark',
    bonuses: { power: 42, attack: 18, pierce: 14, critChance: 0.018, elementPower: 18 },
  },
  taiweiAstrolabe: {
    id: 'taiweiAstrolabe',
    name: '太微星盘',
    slot: 'offhand',
    realmBand: '金丹',
    minRealmIndex: 21,
    lootTier: 3,
    quality: 2,
    element: 'light',
    bonuses: { breakthrough: 0.038, defense: 24, qiRate: 0.026, elementPower: 22 },
  },
  netherBoneLamp: {
    id: 'netherBoneLamp',
    name: '冥骨灯',
    slot: 'offhand',
    realmBand: '元婴',
    minRealmIndex: 27,
    lootTier: 4,
    quality: 3,
    element: 'dark',
    bonuses: { power: 70, attack: 28, pierce: 22, dangerReduction: 16, elementPower: 28 },
  },
  cloudthreadRobe: {
    id: 'cloudthreadRobe',
    name: '云纹法袍',
    slot: 'robe',
    realmBand: '炼气',
    minRealmIndex: 0,
    lootTier: 0,
    quality: 1,
    element: 'water',
    bonuses: { dangerReduction: 16, defense: 20, speed: 5, elementPower: 8 },
  },
  mountainPatternRobe: {
    id: 'mountainPatternRobe',
    name: '山纹道衣',
    slot: 'robe',
    realmBand: '炼气',
    minRealmIndex: 0,
    lootTier: 0,
    quality: 0,
    element: 'earth',
    bonuses: { dangerReduction: 12, defense: 24, vitality: 36, elementPower: 8 },
  },
  nightSilkVest: {
    id: 'nightSilkVest',
    name: '玄绡法衣',
    slot: 'robe',
    realmBand: '筑基',
    minRealmIndex: 9,
    lootTier: 1,
    quality: 1,
    element: 'dark',
    bonuses: { dangerReduction: 14, defense: 16, speed: 6, critChance: 0.01, elementPower: 12 },
  },
  liuyunFeatherRobe: {
    id: 'liuyunFeatherRobe',
    name: '流云羽衣',
    slot: 'robe',
    realmBand: '筑基',
    minRealmIndex: 12,
    lootTier: 2,
    quality: 2,
    element: 'wood',
    bonuses: { dangerReduction: 20, defense: 24, speed: 9, qiRate: 0.018, elementPower: 16 },
  },
  starsandDaoistRobe: {
    id: 'starsandDaoistRobe',
    name: '星砂道袍',
    slot: 'robe',
    realmBand: '金丹',
    minRealmIndex: 18,
    lootTier: 3,
    quality: 2,
    element: 'earth',
    bonuses: { dangerReduction: 26, defense: 36, vitality: 70, breakthrough: 0.016, elementPower: 20 },
  },
  wushangRobe: {
    id: 'wushangRobe',
    name: '无相法袍',
    slot: 'robe',
    realmBand: '元婴',
    minRealmIndex: 27,
    lootTier: 4,
    quality: 3,
    element: 'light',
    bonuses: { dangerReduction: 34, defense: 46, speed: 12, qiRate: 0.028, elementPower: 26 },
  },
  xuanmuAmulet: {
    id: 'xuanmuAmulet',
    name: '玄木护符',
    slot: 'amulet',
    realmBand: '筑基',
    minRealmIndex: 9,
    lootTier: 1,
    quality: 1,
    element: 'wood',
    bonuses: { breakthrough: 0.04, qiRate: 0.03, vitality: 35, elementPower: 10 },
  },
  heartGuardTalisman: {
    id: 'heartGuardTalisman',
    name: '守心符',
    slot: 'amulet',
    realmBand: '炼气',
    minRealmIndex: 0,
    lootTier: 0,
    quality: 0,
    element: 'light',
    bonuses: { breakthrough: 0.026, defense: 12, vitality: 42, elementPower: 8 },
  },
  sunfireSeal: {
    id: 'sunfireSeal',
    name: '离火印',
    slot: 'amulet',
    realmBand: '筑基',
    minRealmIndex: 9,
    lootTier: 1,
    quality: 1,
    element: 'fire',
    bonuses: { power: 22, attack: 12, critChance: 0.014, elementPower: 16 },
  },
  zhenhunTalisman: {
    id: 'zhenhunTalisman',
    name: '镇魂符',
    slot: 'amulet',
    realmBand: '金丹',
    minRealmIndex: 18,
    lootTier: 2,
    quality: 2,
    element: 'dark',
    bonuses: { breakthrough: 0.044, defense: 24, vitality: 74, dangerReduction: 12, elementPower: 18 },
  },
  xuanhuangSeal: {
    id: 'xuanhuangSeal',
    name: '玄黄印',
    slot: 'amulet',
    realmBand: '金丹',
    minRealmIndex: 21,
    lootTier: 3,
    quality: 2,
    element: 'earth',
    bonuses: { power: 48, defense: 28, vitality: 62, breakthrough: 0.026, elementPower: 22 },
  },
  taixuHeartCharm: {
    id: 'taixuHeartCharm',
    name: '太虚心符',
    slot: 'amulet',
    realmBand: '元婴',
    minRealmIndex: 27,
    lootTier: 4,
    quality: 3,
    element: 'light',
    bonuses: { breakthrough: 0.06, qiRate: 0.032, vitality: 90, defense: 30, elementPower: 28 },
  },
  greenJadePendant: {
    id: 'greenJadePendant',
    name: '青玉佩',
    slot: 'jade',
    realmBand: '炼气',
    minRealmIndex: 0,
    lootTier: 0,
    quality: 1,
    element: 'earth',
    bonuses: { qiRate: 0.025, defense: 12, vitality: 24, elementPower: 10 },
  },
  spiritRootJade: {
    id: 'spiritRootJade',
    name: '灵根玉',
    slot: 'jade',
    realmBand: '炼气',
    minRealmIndex: 0,
    lootTier: 0,
    quality: 0,
    element: 'wood',
    bonuses: { qiRate: 0.032, breakthrough: 0.012, vitality: 18, elementPower: 8 },
  },
  moonwellJade: {
    id: 'moonwellJade',
    name: '月井璧',
    slot: 'jade',
    realmBand: '筑基',
    minRealmIndex: 9,
    lootTier: 1,
    quality: 1,
    element: 'water',
    bonuses: { qiRate: 0.02, defense: 18, speed: 3, elementPower: 14 },
  },
  starsandPendant: {
    id: 'starsandPendant',
    name: '星砂佩',
    slot: 'jade',
    realmBand: '筑基',
    minRealmIndex: 12,
    lootTier: 2,
    quality: 2,
    element: 'earth',
    bonuses: { qiRate: 0.034, defense: 24, vitality: 42, breakthrough: 0.018, elementPower: 18 },
  },
  dongxuanJade: {
    id: 'dongxuanJade',
    name: '洞玄玉',
    slot: 'jade',
    realmBand: '金丹',
    minRealmIndex: 18,
    lootTier: 3,
    quality: 2,
    element: 'dark',
    bonuses: { qiRate: 0.04, power: 36, pierce: 10, critChance: 0.014, elementPower: 22 },
  },
  hunyuanJade: {
    id: 'hunyuanJade',
    name: '混元璧',
    slot: 'jade',
    realmBand: '元婴',
    minRealmIndex: 27,
    lootTier: 4,
    quality: 3,
    element: 'light',
    bonuses: { qiRate: 0.052, breakthrough: 0.034, vitality: 72, defense: 28, elementPower: 26 },
  },
  cloudstepBoots: {
    id: 'cloudstepBoots',
    name: '踏云履',
    slot: 'boots',
    realmBand: '炼气',
    minRealmIndex: 0,
    lootTier: 0,
    quality: 1,
    element: 'water',
    bonuses: { dangerReduction: 10, speed: 8, defense: 10, elementPower: 8 },
  },
  windtraceBoots: {
    id: 'windtraceBoots',
    name: '追风履',
    slot: 'boots',
    realmBand: '炼气',
    minRealmIndex: 0,
    lootTier: 0,
    quality: 0,
    element: 'wood',
    bonuses: { dangerReduction: 8, speed: 10, attack: 6, elementPower: 8 },
  },
  stoneTreadBoots: {
    id: 'stoneTreadBoots',
    name: '踏岩靴',
    slot: 'boots',
    realmBand: '筑基',
    minRealmIndex: 9,
    lootTier: 1,
    quality: 1,
    element: 'earth',
    bonuses: { dangerReduction: 14, defense: 16, vitality: 22, elementPower: 10 },
  },
  zhenyueBoots: {
    id: 'zhenyueBoots',
    name: '镇岳靴',
    slot: 'boots',
    realmBand: '筑基',
    minRealmIndex: 12,
    lootTier: 2,
    quality: 2,
    element: 'earth',
    bonuses: { dangerReduction: 18, speed: 7, defense: 26, vitality: 42, elementPower: 16 },
  },
  zhuyueShoes: {
    id: 'zhuyueShoes',
    name: '逐月履',
    slot: 'boots',
    realmBand: '金丹',
    minRealmIndex: 18,
    lootTier: 3,
    quality: 2,
    element: 'water',
    bonuses: { dangerReduction: 22, speed: 14, critChance: 0.014, defense: 18, elementPower: 20 },
  },
  voidstepBoots: {
    id: 'voidstepBoots',
    name: '虚空履',
    slot: 'boots',
    realmBand: '元婴',
    minRealmIndex: 27,
    lootTier: 4,
    quality: 3,
    element: 'dark',
    bonuses: { dangerReduction: 30, speed: 18, attack: 18, pierce: 10, elementPower: 26 },
  },
};

export const RARITY_TIERS = [
  { id: 'common', name: '凡品', weight: 420, qualityBonus: 0, bonusMultiplier: 1, affixCount: 1, dismantleMultiplier: 1 },
  { id: 'spirit', name: '蕴灵', weight: 300, qualityBonus: 0, bonusMultiplier: 1.08, affixCount: 1, dismantleMultiplier: 1 },
  { id: 'mystic', name: '玄纹', weight: 180, qualityBonus: 1, bonusMultiplier: 1.18, affixCount: 2, dismantleMultiplier: 1.25 },
  { id: 'earthFiend', name: '地煞', weight: 70, qualityBonus: 2, bonusMultiplier: 1.32, affixCount: 2, dismantleMultiplier: 1.55 },
  { id: 'heavenWork', name: '天工', weight: 25, qualityBonus: 3, bonusMultiplier: 1.5, affixCount: 3, dismantleMultiplier: 1.9 },
  { id: 'dao', name: '道器', weight: 5, qualityBonus: 4, bonusMultiplier: 1.72, affixCount: 3, dismantleMultiplier: 2.4 },
];

const MAP_LOOT_PROFILES = {
  qinglanMountain: { tier: 0, dropEvery: 2, daoInterval: 500 },
  herbValley: { tier: 1, dropEvery: 2, daoInterval: 460 },
  mistyValley: { tier: 1, dropEvery: 2, daoInterval: 440 },
  swordTomb: { tier: 2, dropEvery: 4, daoInterval: 380 },
  demonRift: { tier: 3, dropEvery: 4, daoInterval: 320 },
  ancientRuins: { tier: 4, dropEvery: 4, daoInterval: 260 },
};

export const COMBAT_ELEMENTS = {
  metal: { id: 'metal', name: '庚金', restrains: 'wood' },
  wood: { id: 'wood', name: '青木', restrains: 'earth' },
  earth: { id: 'earth', name: '厚土', restrains: 'water' },
  water: { id: 'water', name: '玄水', restrains: 'fire' },
  fire: { id: 'fire', name: '离火', restrains: 'metal' },
  dark: { id: 'dark', name: '玄阴', restrains: 'light' },
  light: { id: 'light', name: '曜阳', restrains: 'dark' },
};

const LOOT_VARIANT_GRADES = [
  { id: 'steady', name: '稳息', qualityBonus: 0, bonusMultiplier: 1 },
  { id: 'bright', name: '明纹', qualityBonus: 0, bonusMultiplier: 1.18 },
  { id: 'hidden', name: '藏锋', qualityBonus: 1, bonusMultiplier: 0.92 },
];

const LOOT_VARIANT_AFFIXES = {
  weapon: [
    { id: 'edge', name: '锋芒', bonuses: { attack: 14 } },
    { id: 'pierce', name: '破势', bonuses: { pierce: 12 } },
    { id: 'spark', name: '会心', bonuses: { critChance: 0.02 } },
  ],
  offhand: [
    { id: 'wheel', name: '轮影', bonuses: { attack: 10, pierce: 6 } },
    { id: 'bell', name: '清音', bonuses: { qiRate: 0.014, defense: 8 } },
    { id: 'flare', name: '曜纹', bonuses: { critChance: 0.018, elementPower: 8 } },
  ],
  amulet: [
    { id: 'life', name: '养命', bonuses: { vitality: 28 } },
    { id: 'gate', name: '护关', bonuses: { breakthrough: 0.018 } },
    { id: 'breath', name: '纳息', bonuses: { qiRate: 0.018 } },
  ],
  robe: [
    { id: 'guard', name: '护体', bonuses: { defense: 16 } },
    { id: 'step', name: '轻身', bonuses: { speed: 5 } },
    { id: 'ward', name: '避劫', bonuses: { dangerReduction: 8 } },
  ],
  jade: [
    { id: 'root', name: '地脉', bonuses: { vitality: 22, defense: 8 } },
    { id: 'clear', name: '澄息', bonuses: { qiRate: 0.016 } },
    { id: 'pulse', name: '玉振', bonuses: { elementPower: 10, breakthrough: 0.012 } },
  ],
  boots: [
    { id: 'cloud', name: '云痕', bonuses: { speed: 6 } },
    { id: 'shadow', name: '掠影', bonuses: { dangerReduction: 6, critChance: 0.012 } },
    { id: 'tread', name: '踏水', bonuses: { defense: 8, elementPower: 8 } },
  ],
};

export const BUILDINGS = {
  alchemyFurnace: {
    id: 'alchemyFurnace',
    name: '丹房',
    detail: '温养丹炉火候，缩短炼丹时间并承接高阶丹方。',
    maxLevel: 20,
    cost: (level) => filterCost({
      spiritStones: caveStoneCost(58, level),
      herbs: caveMaterialCost(7, level),
      beastCores: level >= 11 ? caveMaterialCost(1, level - 10) : 0,
    }),
    speedBonusPerLevel: 0.045,
  },
  meditationSeat: {
    id: 'meditationSeat',
    name: '静室',
    detail: '安置蒲团与聚息石，提升长期吐纳灵息。',
    maxLevel: 20,
    cost: (level) => filterCost({
      spiritStones: caveStoneCost(24, level),
      herbs: level >= 2 ? caveMaterialCost(4, level - 1) : 0,
      arrayFlags: level >= 16 ? caveMaterialCost(1, level - 15) : 0,
    }),
    qiBonusPerLevel: 0.055,
  },
  spiritField: {
    id: 'spiritField',
    name: '灵田',
    detail: '开垦洞府药畦，离线和在线都会缓慢生长灵草。',
    maxLevel: 20,
    cost: (level) => filterCost({
      spiritStones: caveStoneCost(34, level),
      herbs: level >= 6 ? caveMaterialCost(5, level - 5) : 0,
    }),
    herbRatePerLevel: 0.02,
  },
  swordArray: {
    id: 'swordArray',
    name: '剑阵',
    detail: '布置护山剑痕，凝练道威并压住外出劫象。',
    maxLevel: 20,
    cost: (level) => filterCost({
      spiritStones: caveStoneCost(52, level),
      beastCores: level >= 2 ? caveMaterialCost(1, level - 1) : 0,
      arrayFlags: level >= 11 ? caveMaterialCost(1, level - 10) : 0,
    }),
    powerPerLevel: 24,
    dangerReductionPerLevel: 2,
  },
  forgingHall: {
    id: 'forgingHall',
    name: '炼器阁',
    detail: '归拢炉火与矿砂，提高淬炼把握和战利品分解收益。',
    maxLevel: 20,
    cost: (level) => filterCost({
      spiritStones: caveStoneCost(66, level),
      artifacts: level >= 2 ? caveMaterialCost(1, level - 1) : 0,
      forgingEssence: level >= 11 ? caveMaterialCost(2, level - 10) : 0,
    }),
    refineChancePerLevel: 0.006,
    dismantleBonusPerLevel: 0.025,
  },
  scriptureLibrary: {
    id: 'scriptureLibrary',
    name: '藏经阁',
    detail: '收藏残卷与心得，提升破境天机并沉淀悟道。',
    maxLevel: 20,
    cost: (level) => filterCost({
      spiritStones: caveStoneCost(72, level),
      arrayFlags: level >= 6 ? caveMaterialCost(1, level - 5) : 0,
      insight: level >= 16 ? caveMaterialCost(1, level - 15) : 0,
    }),
    breakthroughPerLevel: 0.006,
    insightRatePerLevel: 0.00012,
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
  bodyTemperPill: {
    id: 'bodyTemperPill',
    name: '淬体丹',
    duration: 75,
    unlockLevel: 3,
    cost: { herbs: 18, spiritStones: 45, beastCores: 1 },
  },
  spiritRootPill: {
    id: 'spiritRootPill',
    name: '培元丹',
    duration: 90,
    unlockLevel: 5,
    cost: { herbs: 26, spiritStones: 80, clearHeartPill: 1 },
  },
};

export const GEAR = {
  weapon: {
    id: 'weapon',
    name: '武器',
    maxLevel: 12,
    cost: (level) => ({ spiritStones: tieredLinearCost(80, level), beastCores: tieredMaterialCost(1, level) }),
    powerPerLevel: 35,
    attackPerLevel: 16,
  },
  offhand: {
    id: 'offhand',
    name: '副器',
    maxLevel: 12,
    cost: (level) => ({ spiritStones: tieredLinearCost(76, level), artifacts: tieredMaterialCost(1, level) }),
    powerPerLevel: 24,
    attackPerLevel: 10,
    piercePerLevel: 4,
  },
  amulet: {
    id: 'amulet',
    name: '护符',
    maxLevel: 12,
    cost: (level) => ({ spiritStones: tieredLinearCost(70, level), beastCores: tieredMaterialCost(1, level) }),
    breakthroughPerLevel: 0.03,
    vitalityPerLevel: 26,
  },
  robe: {
    id: 'robe',
    name: '法袍',
    maxLevel: 12,
    cost: (level) => ({ spiritStones: tieredLinearCost(60, level), beastCores: tieredMaterialCost(1, level) }),
    dangerReductionPerLevel: 10,
    defensePerLevel: 18,
  },
  jade: {
    id: 'jade',
    name: '玉佩',
    maxLevel: 12,
    cost: (level) => ({ spiritStones: tieredLinearCost(68, level), artifacts: tieredMaterialCost(1, level) }),
    qiBonusPerLevel: 0.012,
    vitalityPerLevel: 16,
    defensePerLevel: 8,
  },
  boots: {
    id: 'boots',
    name: '云履',
    maxLevel: 12,
    cost: (level) => ({ spiritStones: tieredLinearCost(58, level), beastCores: tieredMaterialCost(1, level) }),
    dangerReductionPerLevel: 6,
    speedPerLevel: 3,
  },
};

export const GEAR_INTENTS = {
  weapon: {
    id: 'suppressEvil',
    name: '镇煞',
    detail: '剑气锋锐，可压住山门首领与秘境凶煞。',
  },
  offhand: {
    id: 'echoBlade',
    name: '回响',
    detail: '副器牵动余势，斗法中更容易补足破势与锋芒。',
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
  jade: {
    id: 'holdPulse',
    name: '藏脉',
    detail: '玉佩温养地脉，长线吐纳和续战根基更稳。',
  },
  boots: {
    id: 'crossMist',
    name: '踏雾',
    detail: '云履承风避劫，深入秘境时更能保全身法。',
  },
};

export const GEAR_QUALITIES = [
  { name: '素胚', powerBonus: 0, refineChance: 0.82 },
  { name: '初火', powerBonus: 18, refineChance: 0.66 },
  { name: '凝火', powerBonus: 40, refineChance: 0.5 },
  { name: '明纹', powerBonus: 70, refineChance: 0.36 },
  { name: '真形', powerBonus: 110, refineChance: 0 },
];

export const GEAR_AFFIXES = {
  swordIntent: {
    id: 'swordIntent',
    name: '剑意',
    slot: 'weapon',
    powerBonus: 25,
    attack: 18,
    critChance: 0.03,
    element: 'metal',
    elementPower: 16,
  },
  breakerEdge: {
    id: 'breakerEdge',
    name: '破阵',
    slot: 'weapon',
    powerBonus: 16,
    dangerReduction: 8,
    attack: 12,
    pierce: 16,
    element: 'metal',
    elementPower: 10,
  },
  flameEdge: {
    id: 'flameEdge',
    name: '离火',
    slot: 'weapon',
    attack: 24,
    critChance: 0.05,
    element: 'fire',
    elementPower: 24,
  },
  shadowPierce: {
    id: 'shadowPierce',
    name: '玄阴',
    slot: 'weapon',
    attack: 18,
    pierce: 20,
    element: 'dark',
    elementPower: 22,
  },
  spiritVein: {
    id: 'spiritVein',
    name: '灵脉',
    slot: 'amulet',
    qiBonus: 0.055,
    vitality: 30,
    element: 'wood',
    elementPower: 16,
  },
  calmMind: {
    id: 'calmMind',
    name: '凝神',
    slot: 'amulet',
    breakthrough: 0.04,
    defense: 12,
    element: 'light',
    elementPower: 10,
  },
  sunSigil: {
    id: 'sunSigil',
    name: '曜阳',
    slot: 'amulet',
    breakthrough: 0.025,
    critChance: 0.025,
    element: 'light',
    elementPower: 22,
  },
  moonSeal: {
    id: 'moonSeal',
    name: '玄阴印',
    slot: 'amulet',
    vitality: 42,
    pierce: 10,
    element: 'dark',
    elementPower: 18,
  },
  cloudStep: {
    id: 'cloudStep',
    name: '云步',
    slot: 'robe',
    dangerReduction: 18,
    speed: 8,
    element: 'water',
    elementPower: 14,
  },
  guardedBody: {
    id: 'guardedBody',
    name: '护体',
    slot: 'robe',
    dangerReduction: 10,
    breakthrough: 0.02,
    defense: 18,
    element: 'earth',
    elementPower: 12,
  },
  earthWard: {
    id: 'earthWard',
    name: '厚土',
    slot: 'robe',
    dangerReduction: 12,
    defense: 30,
    element: 'earth',
    elementPower: 22,
  },
  waterMirror: {
    id: 'waterMirror',
    name: '玄水镜',
    slot: 'robe',
    defense: 18,
    speed: 6,
    element: 'water',
    elementPower: 20,
  },
  starWheel: {
    id: 'starWheel',
    name: '星轮',
    slot: 'offhand',
    attack: 14,
    pierce: 10,
    element: 'light',
    elementPower: 16,
  },
  spiritBell: {
    id: 'spiritBell',
    name: '灵钟',
    slot: 'offhand',
    qiBonus: 0.03,
    defense: 12,
    element: 'wood',
    elementPower: 12,
  },
  moonWheel: {
    id: 'moonWheel',
    name: '月轮',
    slot: 'offhand',
    critChance: 0.03,
    pierce: 12,
    element: 'dark',
    elementPower: 18,
  },
  sunWheel: {
    id: 'sunWheel',
    name: '日轮',
    slot: 'offhand',
    attack: 18,
    critChance: 0.025,
    element: 'fire',
    elementPower: 18,
  },
  jadeRoot: {
    id: 'jadeRoot',
    name: '玉根',
    slot: 'jade',
    vitality: 30,
    qiBonus: 0.024,
    element: 'earth',
    elementPower: 12,
  },
  clearJade: {
    id: 'clearJade',
    name: '澄玉',
    slot: 'jade',
    breakthrough: 0.025,
    defense: 14,
    element: 'water',
    elementPower: 12,
  },
  darkJade: {
    id: 'darkJade',
    name: '玄玉',
    slot: 'jade',
    pierce: 8,
    vitality: 24,
    element: 'dark',
    elementPower: 16,
  },
  brightJade: {
    id: 'brightJade',
    name: '曜玉',
    slot: 'jade',
    breakthrough: 0.02,
    critChance: 0.018,
    element: 'light',
    elementPower: 16,
  },
  cloudTrace: {
    id: 'cloudTrace',
    name: '云踪',
    slot: 'boots',
    speed: 8,
    dangerReduction: 8,
    element: 'water',
    elementPower: 12,
  },
  windStep: {
    id: 'windStep',
    name: '风行',
    slot: 'boots',
    speed: 12,
    critChance: 0.014,
    element: 'wood',
    elementPower: 12,
  },
  earthStep: {
    id: 'earthStep',
    name: '镇步',
    slot: 'boots',
    defense: 16,
    dangerReduction: 6,
    element: 'earth',
    elementPower: 12,
  },
  shadowStep: {
    id: 'shadowStep',
    name: '影步',
    slot: 'boots',
    speed: 8,
    pierce: 8,
    element: 'dark',
    elementPower: 16,
  },
};

export const GEAR_AFFIX_POOLS = {
  weapon: ['swordIntent', 'breakerEdge', 'flameEdge', 'shadowPierce'],
  offhand: ['starWheel', 'spiritBell', 'moonWheel', 'sunWheel'],
  amulet: ['spiritVein', 'calmMind', 'sunSigil', 'moonSeal'],
  robe: ['cloudStep', 'guardedBody', 'earthWard', 'waterMirror'],
  jade: ['jadeRoot', 'clearJade', 'darkJade', 'brightJade'],
  boots: ['cloudTrace', 'windStep', 'earthStep', 'shadowStep'],
};

export const GEAR_AFFIX_SETS = {
  greenLotusFlow: {
    id: 'greenLotusFlow',
    name: '青莲流影',
    detail: '剑意、灵钟、灵脉、云步、澄玉与云踪相互牵引，行游与吐纳都更顺畅。',
    affixes: ['swordIntent', 'spiritBell', 'spiritVein', 'cloudStep', 'clearJade', 'cloudTrace'],
    tiers: [
      { pieces: 2, name: '两器相生', bonuses: { powerBonus: 24, qiBonus: 0.02 } },
      { pieces: 4, name: '四象成势', bonuses: { dangerReduction: 8, speed: 3 } },
      { pieces: 6, name: '六器同流', bonuses: { powerBonus: 46, qiBonus: 0.035, dangerReduction: 6, speed: 2 } },
    ],
  },
  xuanGateGuard: {
    id: 'xuanGateGuard',
    name: '玄门守心',
    detail: '破阵、星轮、凝神、护体、玉根与镇步相互成势，叩关和历练更稳。',
    affixes: ['breakerEdge', 'starWheel', 'calmMind', 'guardedBody', 'jadeRoot', 'earthStep'],
    tiers: [
      { pieces: 2, name: '两器守心', bonuses: { breakthrough: 0.025, defense: 10 } },
      { pieces: 4, name: '四门镇气', bonuses: { powerBonus: 16, dangerReduction: 10 } },
      { pieces: 6, name: '玄门成阵', bonuses: { powerBonus: 18, breakthrough: 0.03, dangerReduction: 10, defense: 14 } },
    ],
  },
  fivePhaseTemper: {
    id: 'fivePhaseTemper',
    name: '离火炼形',
    detail: '离火、日轮、曜阳、厚土、曜玉与风行相济，斗法时攻守更有层次。',
    affixes: ['flameEdge', 'sunWheel', 'sunSigil', 'earthWard', 'brightJade', 'windStep'],
    tiers: [
      { pieces: 2, name: '离火初燃', bonuses: { attack: 14, elementPower: 8 } },
      { pieces: 4, name: '四相炼骨', bonuses: { defense: 12, critChance: 0.008 } },
      { pieces: 6, name: '六火炼形', bonuses: { attack: 22, defense: 14, elementPower: 16, critChance: 0.01 } },
    ],
  },
  eclipseMirror: {
    id: 'eclipseMirror',
    name: '阴月照影',
    detail: '玄阴锋、月轮、月印、玄水镜、玄玉与影步交错，破邪和续战更强。',
    affixes: ['shadowPierce', 'moonWheel', 'moonSeal', 'waterMirror', 'darkJade', 'shadowStep'],
    tiers: [
      { pieces: 2, name: '阴月初照', bonuses: { pierce: 10, vitality: 20 } },
      { pieces: 4, name: '四影相映', bonuses: { critChance: 0.015, speed: 3 } },
      { pieces: 6, name: '六镜照影', bonuses: { pierce: 14, vitality: 30, critChance: 0.02, speed: 3 } },
    ],
  },
};

export const BUILD_SCHOOLS = {
  swordRuin: {
    id: 'swordRuin',
    name: '剑煞',
    detail: '锋芒、破势、会心和灵根杀伐相互叠加。',
    stats: ['power', 'powerBonus', 'attack', 'pierce', 'critChance', 'elementPower'],
    elements: ['metal', 'fire', 'dark', 'light'],
    affixes: ['edge', 'pierce', 'spark', 'swordIntent', 'breakerEdge', 'flameEdge', 'shadowPierce', 'starWheel', 'moonWheel', 'sunWheel'],
  },
  spiritFlow: {
    id: 'spiritFlow',
    name: '灵息',
    detail: '吐纳、护关、灵草和丹火缩时更适合长期挂机。',
    stats: ['qiRate', 'qiBonus', 'breakthrough', 'herbRate', 'alchemySpeed'],
    elements: ['wood', 'light', 'water'],
    affixes: ['bell', 'breath', 'gate', 'clear', 'spiritVein', 'calmMind', 'spiritBell', 'clearJade', 'brightJade'],
  },
  earthGuard: {
    id: 'earthGuard',
    name: '玄守',
    detail: '护体、血元、避劫和地水气象更适合秘境承压。',
    stats: ['defense', 'vitality', 'dangerReduction', 'speed'],
    elements: ['earth', 'water'],
    affixes: ['guard', 'ward', 'root', 'tread', 'guardedBody', 'earthWard', 'waterMirror', 'jadeRoot', 'cloudStep', 'cloudTrace', 'earthStep'],
  },
  beastBlood: {
    id: 'beastBlood',
    name: '御血',
    detail: '御灵培养、血脉凝练和分解精粹服务长期养成。',
    stats: ['beastTraining', 'bloodEssenceBonus', 'dismantleBonus', 'lootRarity'],
    elements: ['dark', 'wood', 'fire'],
    affixes: ['shadow', 'life', 'moonSeal', 'darkJade', 'shadowStep', 'windStep'],
  },
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
    qiBonusPerLevel: 0.035,
    offlineBonusPerLevel: 0.03,
  },
};

export const FORMATIONS = {
  spiritGathering: {
    id: 'spiritGathering',
    name: '聚灵阵',
    rarityId: 'common',
    maxLevel: 12,
    cost: (level) => ({ spiritStones: scaleCost(70, level), arrayFlags: scaleCost(1, level) }),
    qiBonusPerLevel: 0.07,
  },
  mountainGuard: {
    id: 'mountainGuard',
    name: '护山阵',
    rarityId: 'common',
    maxLevel: 12,
    cost: (level) => ({ spiritStones: scaleCost(75, level), arrayFlags: scaleCost(1, level) }),
    stabilityPerLevel: 0.03,
  },
  swordArray: {
    id: 'swordArray',
    name: '剑阵',
    rarityId: 'spirit',
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
    reward: { spiritStones: 80, qi: 180 },
  },
  dailyMission: {
    id: 'dailyMission',
    title: '今日历练',
    detail: '完成任意历练后领取额外材料',
    progressKey: 'missions',
    target: 3,
    reward: { herbs: 20, spiritStones: 70 },
  },
  dailyMarket: {
    id: 'dailyMarket',
    title: '坊市问价',
    detail: '每日补贴一笔交易本金',
    progressKey: 'marketBuys',
    target: 1,
    reward: { spiritStones: 100 },
  },
  dailyDepth: {
    id: 'dailyDepth',
    title: '秘境探层',
    detail: '打通任意秘境层数，领取中期炼器补给',
    progressKey: 'depthTrials',
    target: 1,
    unlockRealmIndex: 4,
    reward: { forgingEssence: 1, arrayFlags: 1 },
  },
};

export const MARKET_ITEMS = {
  herbBundle: {
    id: 'herbBundle',
    name: '灵草包',
    type: '材料',
    unlockRealmIndex: 0,
    limit: 99,
    cost: { spiritStones: 40 },
    reward: { herbs: 12 },
  },
  beastCoreShard: {
    id: 'beastCoreShard',
    name: '妖核碎片',
    type: '材料',
    unlockRealmIndex: 0,
    limit: 30,
    cost: { spiritStones: 75 },
    reward: { beastCores: 1 },
  },
  gatherQiBottle: {
    id: 'gatherQiBottle',
    name: '聚气丹瓶',
    type: '丹药',
    unlockRealmIndex: 0,
    limit: 20,
    cost: { spiritStones: 60, herbs: 4 },
    reward: { gatherQiPill: 1 },
  },
  spiritSword: {
    id: 'spiritSword',
    name: '下品灵剑',
    type: '装备',
    unlockRealmIndex: 0,
    limit: 20,
    cost: { spiritStones: 80 },
    reward: { artifacts: 1 },
  },
  spiritDust: {
    id: 'spiritDust',
    name: '炼器灵砂',
    type: '炼器',
    unlockRealmIndex: 0,
    limit: 10,
    cost: { spiritStones: 95, artifacts: 1 },
    reward: { forgingEssence: 2 },
  },
  arrayManual: {
    id: 'arrayManual',
    name: '小周天阵旗',
    type: '阵法',
    unlockRealmIndex: 0,
    limit: 30,
    cost: { spiritStones: 90, beastCores: 1 },
    reward: { arrayFlags: 1 },
  },
  beastBoneBundle: {
    id: 'beastBoneBundle',
    name: '兽骨袋',
    type: '材料',
    unlockRealmIndex: 2,
    limit: 15,
    cost: { spiritStones: 130 },
    reward: { beastCores: 2 },
  },
  clearHeartBottle: {
    id: 'clearHeartBottle',
    name: '清心丹匣',
    type: '丹药',
    unlockRealmIndex: 4,
    limit: 10,
    cost: { spiritStones: 120, herbs: 6 },
    reward: { clearHeartPill: 1 },
  },
  forgingAsh: {
    id: 'forgingAsh',
    name: '炉底精魄',
    type: '炼器',
    unlockRealmIndex: 7,
    limit: 20,
    cost: { spiritStones: 150, artifacts: 1 },
    reward: { forgingEssence: 4 },
  },
  meridianPillBox: {
    id: 'meridianPillBox',
    name: '护脉丹匣',
    type: '丹药',
    unlockRealmIndex: 9,
    limit: 8,
    cost: { spiritStones: 220, beastCores: 1 },
    reward: { meridianPill: 1 },
  },
  arrayFlagPack: {
    id: 'arrayFlagPack',
    name: '残阵旗包',
    type: '阵法',
    unlockRealmIndex: 9,
    limit: 12,
    cost: { spiritStones: 180, beastCores: 2 },
    reward: { arrayFlags: 2 },
  },
  insightScroll: {
    id: 'insightScroll',
    name: '悟道残页',
    type: '奇物',
    unlockRealmIndex: 14,
    limit: 6,
    cost: { spiritStones: 360, arrayFlags: 1 },
    reward: { insight: 1 },
  },
  treasureOre: {
    id: 'treasureOre',
    name: '玄铁灵砂',
    type: '炼器',
    unlockRealmIndex: 18,
    limit: 10,
    cost: { spiritStones: 460, beastCores: 2, artifacts: 1 },
    reward: { forgingEssence: 8, artifacts: 1 },
  },
};

export const MAINLINE_CHAPTERS = [
  {
    id: 'qinglanStart',
    title: '青岚初启',
    subtitle: '立洞府、通吐纳、备丹药，完成最初的修行根基。',
    reward: { spiritStones: 260, herbs: 20, qiRateBonus: 0.03 },
    objectives: [
      {
        id: 'firstPatrol',
        title: '巡守一次洞府',
        detail: '熟悉行游节奏，带回第一批灵气和灵石',
        completed: (state) => (state.completedMissions?.cavePatrol ?? 0) >= 1,
        reward: { spiritStones: 80, herbs: 8, qi: 140 },
      },
      {
        id: 'realmTwo',
        title: '首次破境',
        detail: '突破至炼气二层，感受灵息与道行提升',
        completed: (state) => state.realmIndex >= 1,
        reward: { spiritStones: 120, pills: 2, qi: 120 },
      },
      {
        id: 'spiritField',
        title: '建成一阶灵田',
        detail: '让洞府开始自动生长灵草',
        completed: (state) => (state.buildings?.spiritField ?? 0) >= 1,
        reward: { herbs: 25, spiritStones: 80 },
      },
      {
        id: 'firstPill',
        title: '炼成一枚聚气丹',
        detail: '突破前用丹药快速补足灵气',
        completed: (state) => (state.craftedPills ?? 0) >= 1,
        reward: { qi: 360, spiritStones: 90, herbs: 12 },
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
        detail: '任意穿戴火候提升至初火或以上',
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
        title: '强化一处器位',
        detail: '任意装备器位强化至 2 级，新战利品会继承火候',
        completed: (state) => Object.values(state.gear ?? {}).some((level) => level >= 2),
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
    bloodEssence: 0,
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
    mapDepths: {},
    missionApproaches: {},
    mapApproachCompletions: {},
    mapSpecialDrops: {},
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
    marketStock: null,
    marketRefreshes: {},
    gear: Object.fromEntries(Object.keys(GEAR).map((id) => [id, 0])),
    gearQuality: Object.fromEntries(Object.keys(GEAR).map((id) => [id, 0])),
    gearAffixes: Object.fromEntries(Object.keys(GEAR).map((id) => [id, null])),
    lootEquipment: [],
    lootDropSerial: 0,
    equippedLoot: Object.fromEntries(Object.keys(GEAR).map((id) => [id, null])),
    lockedLoot: {},
    treasures: Object.fromEntries(Object.keys(TREASURES).map((id) => [id, 0])),
    spiritBeasts: Object.fromEntries(Object.keys(SPIRIT_BEASTS).map((id) => [id, 0])),
    activeSpiritBeast: null,
    bloodlines: Object.fromEntries(Object.keys(BLOODLINES).map((id) => [id, 0])),
    daoHearts: Object.fromEntries(Object.keys(DAO_HEARTS).map((id) => [id, 0])),
    claimedDaoHeartRealms: {},
    pendingDaoHeartChoice: null,
    tribulationRecords: [],
    activeOpportunity: null,
    resolvedOpportunities: {},
    lastMissionEvent: null,
    lastMissionReport: null,
    missionReportHistory: [],
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
    sectSkills: Object.fromEntries(Object.keys(SECT_SKILLS).map((id) => [id, 0])),
    sectAssignments: {
      herbGarden: 0,
      mine: 0,
      patrol: 0,
      forge: 0,
    },
    sectCarry: {
      spiritStones: 0,
      herbs: 0,
      beastCores: 0,
      artifacts: 0,
      forgingEssence: 0,
      bloodEssence: 0,
      reputation: 0,
    },
    buildings: {
      alchemyFurnace: 0,
      meditationSeat: 1,
      spiritField: 0,
      swordArray: 0,
      forgingHall: 0,
      scriptureLibrary: 0,
    },
    activeMission: null,
    totalCultivationSeconds: 0,
    breakthroughCount: 0,
    stoneCarry: 0,
    herbCarry: 0,
    insightCarry: 0,
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
  state.insightCarry = Math.max(0, Number(state.insightCarry) || 0);
  state.pillBoostUntil = Math.max(0, Number(state.pillBoostUntil) || 0);
  state.breakthroughBoostUntil = Math.max(0, Number(state.breakthroughBoostUntil) || 0);
  state.foundationStability = Math.max(0, Number(state.foundationStability) || 0);
  state.activeAlchemy = normalizeAlchemy(state.activeAlchemy);
  state.inventoryPills = normalizeInventoryPills(state.inventoryPills, state.pills);
  state.buildings = normalizeBuildings(state.buildings);
  state.gear = normalizeLevels(state.gear, GEAR);
  state.gearQuality = normalizeGearQuality(state.gearQuality);
  state.gearAffixes = normalizeGearAffixes(state.gearAffixes);
  const savedLootEquipment = state.lootEquipment;
  state.lootEquipment = normalizeLootEquipment(savedLootEquipment);
  state.gear = inheritLootLevelsToGear(state.gear, savedLootEquipment);
  state.lootDropSerial = Math.max(Math.floor(Number(state.lootDropSerial) || 0), state.lootEquipment.length);
  state.equippedLoot = normalizeEquippedLoot(state.equippedLoot, state.lootEquipment);
  state.lockedLoot = normalizeLockedLoot(state.lockedLoot, state.lootEquipment);
  state.treasures = normalizeLevels(state.treasures, TREASURES);
  state.spiritBeasts = normalizeLevels(state.spiritBeasts, SPIRIT_BEASTS);
  state.activeSpiritBeast = normalizeActiveSpiritBeast(state.activeSpiritBeast, state.spiritBeasts);
  state.bloodlines = normalizeLevels(state.bloodlines, BLOODLINES);
  state.daoHearts = normalizeLevels(state.daoHearts, DAO_HEARTS);
  state.claimedDaoHeartRealms = normalizeDaoHeartClaims(state.claimedDaoHeartRealms);
  state.pendingDaoHeartChoice = normalizePendingDaoHeartChoice(state.pendingDaoHeartChoice, state);
  if (!state.pendingDaoHeartChoice) {
    maybeOpenDaoHeartChoice(state, now);
  }
  state.tribulationRecords = normalizeTribulationRecords(state.tribulationRecords);
  state.activeOpportunity = normalizeOpportunity(state.activeOpportunity);
  state.resolvedOpportunities = normalizeResolvedOpportunities(state.resolvedOpportunities);
  state.lastMissionEvent = normalizeMissionEvent(state.lastMissionEvent);
  state.lastMissionReport = normalizeMissionReport(state.lastMissionReport);
  state.missionReportHistory = normalizeMissionReportHistory(state.missionReportHistory, state.lastMissionReport);
  state.cultivationPaths = normalizeLevels(state.cultivationPaths, CULTIVATION_PATHS);
  state.formations = normalizeLevels(state.formations, FORMATIONS);
  state.completedMissions = normalizeCompletedMissions(state.completedMissions);
  state.mapReputation = normalizeMapValues(state.mapReputation);
  state.mapDepths = normalizeMapDepths(state.mapDepths);
  state.missionApproaches = normalizeMissionApproaches(state.missionApproaches);
  state.mapApproachCompletions = normalizeMapApproachCompletions(state.mapApproachCompletions);
  state.mapSpecialDrops = normalizeMapSpecialDrops(state.mapSpecialDrops);
  state.defeatedBosses = normalizeDefeatedBosses(state.defeatedBosses);
  state.claimedGoals = normalizeClaimedGoals(state.claimedGoals);
  state.claimedChapterRewards = normalizeClaimedGoals(state.claimedChapterRewards);
  state.permanentBonuses = normalizePermanentBonuses(state.permanentBonuses);
  state.autoMissionId = MISSIONS[state.autoMissionId] ? state.autoMissionId : null;
  state.craftedPills = Math.max(0, Number(state.craftedPills) || 0);
  state.arrayFlags = Math.max(0, Number(state.arrayFlags) || 0);
  state.forgingEssence = Math.max(0, Number(state.forgingEssence) || 0);
  state.bloodEssence = Math.max(0, Number(state.bloodEssence) || 0);
  state.sectDisciples = clampInteger(state.sectDisciples, 0, getSectCapacity(state));
  state.sectReputation = Math.max(0, Number(state.sectReputation) || 0);
  state.sectSkills = normalizeLevels(state.sectSkills, SECT_SKILLS);
  state.sectRoster = normalizeSectRoster(state.sectRoster, state.sectDisciples);
  state.sectAssignments = normalizeSectAssignments(state.sectAssignments, state.sectDisciples);
  syncSectRosterJobs(state);
  state.sectCarry = normalizeSectCarry(state.sectCarry);
  state.dailyClaims = normalizeNestedClaims(state.dailyClaims);
  state.dailyProgress = normalizeDailyProgress(state.dailyProgress);
  state.marketPurchases = normalizeNestedClaims(state.marketPurchases);
  state.marketRefreshes = normalizeMarketRefreshes(state.marketRefreshes);
  state.marketStock = normalizeMarketStock(state.marketStock, state);
  state.pills = state.inventoryPills.gatherQiPill;
  state.log = Array.isArray(state.log) ? state.log.slice(0, 20) : [];
  state.activeMission = normalizeMission(state.activeMission);
  ensureActiveDepthBattle(state, now);
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

export function getCaveUpgradeTier(level) {
  return CAVE_UPGRADE_TIERS.find((tier) => level >= tier.minLevel && level <= tier.maxLevel) ?? CAVE_UPGRADE_TIERS[CAVE_UPGRADE_TIERS.length - 1];
}

export function getCaveUpgradeLimit(state) {
  const realmIndex = state.realmIndex ?? 0;
  return CAVE_UPGRADE_TIERS.reduce((limit, tier) => (realmIndex >= tier.realmIndex ? tier.maxLevel : limit), CAVE_UPGRADE_TIERS[0].maxLevel);
}

export function getCaveStage(state) {
  const buildingIds = Object.keys(BUILDINGS);
  const totalLevel = buildingIds.reduce((total, id) => total + clampInteger(state.buildings?.[id] ?? 0, 0, BUILDINGS[id].maxLevel), 0);
  const level = Math.max(1, Math.min(CAVE_STAGES.length, Math.ceil(totalLevel / buildingIds.length)));
  const stage = CAVE_STAGES[level - 1] ?? CAVE_STAGES[0];
  const next = CAVE_STAGES[level] ?? null;
  return {
    ...stage,
    totalLevel,
    next,
    maxLevel: CAVE_STAGES.length,
  };
}

export function getCaveStatus(state) {
  const stage = getCaveStage(state);
  const upgradeLimit = getCaveUpgradeLimit(state);
  const nextStageProgress = Math.min(1, stage.totalLevel / (stage.maxLevel * Object.keys(BUILDINGS).length));
  return {
    stage,
    upgradeLimit,
    nextStageProgress,
    summary: getCaveSummary(state),
    buildings: Object.values(BUILDINGS).map((building) => {
      const level = clampInteger(state.buildings?.[building.id] ?? 0, 0, building.maxLevel);
      const nextLevel = level + 1;
      const maxed = level >= building.maxLevel;
      const realmLocked = nextLevel > upgradeLimit;
      return {
        id: building.id,
        name: building.name,
        detail: building.detail,
        level,
        maxLevel: building.maxLevel,
        tier: getCaveUpgradeTier(Math.max(1, maxed ? level : nextLevel)),
        effects: getBuildingEffects(building.id, level),
        nextEffects: maxed ? [] : getBuildingEffects(building.id, nextLevel),
        upgrade: {
          maxed,
          realmLocked,
          nextLevel,
          cost: maxed || realmLocked ? null : building.cost(nextLevel),
        },
      };
    }),
  };
}

export function getDaoHeartChoices(state) {
  const pending = state.pendingDaoHeartChoice;
  if (!pending || !Array.isArray(pending.choices)) {
    return [];
  }
  return pending.choices
    .map((id) => {
      const heart = DAO_HEARTS[id];
      if (!heart) {
        return null;
      }
      const level = clampInteger(state.daoHearts?.[id] ?? 0, 0, heart.maxLevel);
      const nextLevel = Math.min(heart.maxLevel, level + 1);
      return {
        id,
        name: heart.name,
        detail: heart.detail,
        level,
        nextLevel,
        maxLevel: heart.maxLevel,
        effects: effectsFromBonusObject(scaleBonusObject(heart.bonuses, nextLevel)),
      };
    })
    .filter(Boolean);
}

export function chooseDaoHeart(state, heartId, now = Date.now()) {
  const pending = state.pendingDaoHeartChoice;
  if (!pending || !pending.choices?.includes(heartId) || !DAO_HEARTS[heartId]) {
    return { ok: false, reason: 'notAvailable' };
  }
  const heart = DAO_HEARTS[heartId];
  const level = clampInteger(state.daoHearts?.[heartId] ?? 0, 0, heart.maxLevel);
  if (level >= heart.maxLevel) {
    return { ok: false, reason: 'maxLevel' };
  }

  state.daoHearts ??= Object.fromEntries(Object.keys(DAO_HEARTS).map((id) => [id, 0]));
  state.claimedDaoHeartRealms ??= {};
  state.daoHearts[heartId] = level + 1;
  state.claimedDaoHeartRealms[String(pending.realmIndex)] = heartId;
  state.pendingDaoHeartChoice = null;
  addLog(state, now, `命格归位，凝成「${heart.name}」。`);
  maybeOpenDaoHeartChoice(state, now);
  return { ok: true, heart: { ...heart, level: level + 1 } };
}

export function getBreakthroughPreparation(state, now = Date.now()) {
  const realm = getCurrentRealm(state);
  const qiReady = (state.qi ?? 0) >= realm.requiredQi;
  const foundation = clampInteger(state.foundationStability ?? 0, 0, 3);
  const meridianReady = Boolean(state.breakthroughBoostUntil && state.breakthroughBoostUntil > now);
  const amuletLevel = clampInteger(state.gear?.amulet ?? 0, 0, GEAR.amulet.maxLevel);
  const guardLevel = clampInteger(state.formations?.mountainGuard ?? 0, 0, FORMATIONS.mountainGuard.maxLevel);
  const scriptureLevel = clampInteger(state.buildings?.scriptureLibrary ?? 0, 0, BUILDINGS.scriptureLibrary.maxLevel);
  const daoLevel = Object.values(state.daoHearts ?? {}).reduce((total, level) => total + (Number(level) || 0), 0);
  const demon = Math.max(0, Number(state.heartDemon) || 0);
  const items = [
    {
      id: 'qi',
      name: '灵机盈满',
      detail: `${Math.floor(state.qi ?? 0)} / ${realm.requiredQi}`,
      ready: qiReady,
      weight: 2,
    },
    {
      id: 'foundation',
      name: '根基沉稳',
      detail: `${foundation} / 3`,
      ready: foundation >= 2,
      weight: 2,
      backlash: foundation * 0.04,
    },
    {
      id: 'heartDemon',
      name: '魔息澄明',
      detail: demon > 0 ? `魔息 ${demon}` : '魔息未扰',
      ready: demon === 0,
      weight: 1,
    },
    {
      id: 'meridian',
      name: '护脉丹息',
      detail: meridianReady ? '丹息护持' : '丹息未续',
      ready: meridianReady,
      weight: 1,
      backlash: meridianReady ? 0.08 : 0,
    },
    {
      id: 'amulet',
      name: '符脉护持',
      detail: `${amuletLevel} / ${GEAR.amulet.maxLevel}`,
      ready: amuletLevel > 0,
      weight: 1,
      backlash: Math.min(0.08, amuletLevel * 0.018),
    },
    {
      id: 'guard',
      name: '山门护阵',
      detail: `${guardLevel} / ${FORMATIONS.mountainGuard.maxLevel}`,
      ready: guardLevel > 0,
      weight: 1,
      backlash: Math.min(0.08, guardLevel * 0.018),
    },
    {
      id: 'scripture',
      name: '经卷回照',
      detail: `${scriptureLevel} / ${BUILDINGS.scriptureLibrary.maxLevel}`,
      ready: scriptureLevel > 0,
      weight: 1,
      backlash: Math.min(0.06, scriptureLevel * 0.012),
    },
    {
      id: 'daoHeart',
      name: '道心共鸣',
      detail: daoLevel > 0 ? `命格 ${daoLevel}` : '尚未凝命',
      ready: daoLevel > 0,
      weight: 1,
      backlash: Math.min(0.06, daoLevel * 0.02),
    },
  ];
  const maxScore = items.reduce((total, item) => total + item.weight, 0);
  const readyScore = round(items.reduce((total, item) => total + (item.ready ? item.weight : 0), 0) / maxScore);
  const backlashBuffer = Math.min(0.32, items.reduce((total, item) => total + (item.backlash ?? 0), 0));
  const qiRetention = round(0.5 + backlashBuffer);
  const demonGuard = foundation > 0 || meridianReady || guardLevel >= 2 || daoLevel > 0;
  const counsel = !qiReady
    ? '灵机未满，暂不宜叩关。'
    : readyScore >= 0.72
      ? '诸缘较稳，可择机叩关。'
      : '气机可用，仍宜补足护持。';
  return {
    title: '天劫准备',
    readyScore,
    qiRetention,
    demonGuard,
    backlashBuffer,
    counsel,
    items: items.map(({ backlash, weight, ...item }) => item),
  };
}

function getCaveSummary(state) {
  const meditation = Math.max(0, (state.buildings?.meditationSeat ?? 1) - 1) * BUILDINGS.meditationSeat.qiBonusPerLevel;
  const field = (state.buildings?.spiritField ?? 0) * BUILDINGS.spiritField.herbRatePerLevel;
  const sword = (state.buildings?.swordArray ?? 0) * BUILDINGS.swordArray.powerPerLevel;
  const furnace = (state.buildings?.alchemyFurnace ?? 0) * BUILDINGS.alchemyFurnace.speedBonusPerLevel;
  const forging = (state.buildings?.forgingHall ?? 0) * BUILDINGS.forgingHall.refineChancePerLevel;
  const scripture = (state.buildings?.scriptureLibrary ?? 0) * BUILDINGS.scriptureLibrary.breakthroughPerLevel;
  return [
    { id: 'qi', label: '灵息增幅', value: round(meditation), mode: 'percent' },
    { id: 'herbs', label: '灵草生长', value: round(field * 60), suffix: ' / 分钟' },
    { id: 'power', label: '护山道威', value: Math.round(sword) },
    { id: 'alchemy', label: '丹火缩时', value: round(Math.min(0.65, furnace)), mode: 'percent' },
    { id: 'forging', label: '淬炼把握', value: round(Math.min(0.12, forging)), mode: 'percent' },
    { id: 'scripture', label: '破境天机', value: round(Math.min(0.12, scripture)), mode: 'percent' },
  ];
}

function getBuildingEffects(buildingId, level) {
  const safeLevel = clampInteger(level, 0, BUILDINGS[buildingId]?.maxLevel ?? 20);
  if (safeLevel <= 0 && buildingId !== 'meditationSeat') {
    return [];
  }
  if (buildingId === 'meditationSeat') {
    return [{ id: 'qiRate', label: '灵息增幅', value: round(Math.max(0, safeLevel - 1) * BUILDINGS.meditationSeat.qiBonusPerLevel), mode: 'percent' }];
  }
  if (buildingId === 'spiritField') {
    return [{ id: 'herbs', label: '灵草生长', value: round(safeLevel * BUILDINGS.spiritField.herbRatePerLevel * 60), suffix: ' / 分钟' }];
  }
  if (buildingId === 'alchemyFurnace') {
    return [{ id: 'alchemySpeed', label: '丹火缩时', value: round(Math.min(0.65, safeLevel * BUILDINGS.alchemyFurnace.speedBonusPerLevel)), mode: 'percent' }];
  }
  if (buildingId === 'swordArray') {
    return [
      { id: 'power', label: '护山道威', value: safeLevel * BUILDINGS.swordArray.powerPerLevel },
      { id: 'dangerReduction', label: '劫象消解', value: safeLevel * BUILDINGS.swordArray.dangerReductionPerLevel },
    ];
  }
  if (buildingId === 'forgingHall') {
    return [
      { id: 'refineChance', label: '淬炼把握', value: round(Math.min(0.12, safeLevel * BUILDINGS.forgingHall.refineChancePerLevel)), mode: 'percent' },
      { id: 'dismantle', label: '分解精魄', value: round(safeLevel * BUILDINGS.forgingHall.dismantleBonusPerLevel), mode: 'percent' },
    ];
  }
  if (buildingId === 'scriptureLibrary') {
    return [
      { id: 'breakthrough', label: '破境天机', value: round(Math.min(0.12, safeLevel * BUILDINGS.scriptureLibrary.breakthroughPerLevel)), mode: 'percent' },
      { id: 'insight', label: '悟道沉淀', value: round(safeLevel * BUILDINGS.scriptureLibrary.insightRatePerLevel * 3600), suffix: ' / 时辰' },
    ];
  }
  return [];
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

function getGearLevelBonus(state, field) {
  return Object.values(GEAR).reduce((total, item) => (
    total + getTieredLevelValue(state.gear?.[item.id] ?? 0, item[field] ?? 0)
  ), 0);
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
  const mapId = getMissionMapId(mission);
  const approach = getSelectedMissionApproach(state, mission);
  const approachReward = getMissionApproachReward(mission, approach.id);
  const completed = state.completedMissions?.[missionId] ?? 0;
  const rareEvery = mission.rareEvery ?? 0;
  const rareStep = rareEvery && completed > 0 && completed % rareEvery === 0 ? rareEvery : completed % rareEvery;
  const recommendedPower = getMissionDanger(state, mission);
  return {
    exists: true,
    id: mission.id,
    name: mission.name,
    map: mission.map ?? '青岚山',
    unlocked: (state.realmIndex ?? 0) >= (mission.unlockRealmIndex ?? 0),
    unlockRealmIndex: mission.unlockRealmIndex ?? 0,
    recommendedPower,
    omen: getMissionOmen(state, mission),
    approach,
    approaches: getMissionApproachOptions(state, mapId),
    approachReward,
    rewardPreview: mergeRewards(mission.reward, approachReward),
    specialDrop: getMapSpecialDropTemplate(mapId, approach.id),
    dropProgress: getApproachDropProgress(state, mapId, approach.id),
    failurePreview: getMissionFailurePreview(state, mission, recommendedPower),
    completed,
    rareProgress: rareEvery ? `${rareStep} / ${rareEvery}` : '',
    rareReward: mission.rareReward ?? null,
  };
}

export function getMapStatuses(state) {
  return Object.values(MISSION_MAPS).map((map) => {
    const routes = Object.values(MISSIONS).filter((mission) => getMissionMapId(mission) === map.id);
    const exploration = getMapExplorationInfo(state, map.id);
    const completed = exploration.completed;
    const target = exploration.target;
    const unlocked = (state.realmIndex ?? 0) >= map.unlockRealmIndex;
    const defeated = Boolean(state.defeatedBosses?.[map.id]);
    const depthGate = getBossDepthGate(state, map);
    const ready = unlocked && completed >= target && depthGate.ready && !defeated;
    const mastery = getMapMastery(state, map.id);
    const readiness = getMapReadiness(state, map, routes);
    const bossPower = getBossCombatPower(state, map);
    return {
      id: map.id,
      name: map.name,
      icon: map.icon,
      description: map.description,
      unlocked,
      unlockRealmIndex: map.unlockRealmIndex,
      routes: routes.map((mission) => mission.id),
      exploration,
      reputation: state.mapReputation?.[map.id] ?? 0,
      mastery,
      readiness,
      approachOptions: getMissionApproachOptions(state, map.id),
      selectedApproach: getSelectedMapApproach(state, map.id),
      depth: getMapDepthStatus(state, map.id),
      boss: {
        ...map.boss,
        basePower: map.boss.power,
        power: bossPower,
        status: defeated ? 'defeated' : ready ? 'ready' : !unlocked ? 'locked' : completed >= target && !depthGate.ready ? 'depthLocked' : 'hidden',
        defeated,
        depthGate,
        omen: getBossOmen(state, map),
      },
    };
  });
}

function getBossDepthGate(state, map) {
  const required = Math.min(8, 2 + Math.floor((map.unlockRealmIndex ?? 0) / 6));
  const cleared = clampInteger(state.mapDepths?.[map.id] ?? 0, 0, MAP_DEPTH_MAX_LAYER);
  return {
    required,
    cleared,
    ready: cleared >= required,
    label: `${cleared} / ${required}`,
  };
}

export function getMapDepthStatus(state, mapId) {
  const map = MISSION_MAPS[mapId];
  if (!map) {
    return { exists: false, unlocked: false };
  }
  const clearedLayer = clampInteger(state.mapDepths?.[mapId] ?? 0, 0, MAP_DEPTH_MAX_LAYER);
  const maxed = clearedLayer >= MAP_DEPTH_MAX_LAYER;
  const nextLayer = maxed ? MAP_DEPTH_MAX_LAYER : clearedLayer + 1;
  const unlocked = (state.realmIndex ?? 0) >= map.unlockRealmIndex;
  const pressure = maxed ? 0 : getDepthPressure(map, nextLayer);
  const danger = maxed ? 0 : getDepthDanger(state, map, nextLayer);
  const duration = getDepthDuration(map, nextLayer);
  const reward = maxed ? {} : getDepthReward(map, nextLayer);
  const tribulation = maxed ? null : getDepthTribulation(map, nextLayer);

  return {
    exists: true,
    mapId,
    mapName: map.name,
    clearedLayer,
    nextLayer,
    maxLayer: MAP_DEPTH_MAX_LAYER,
    unlocked,
    maxed,
    pressure,
    danger,
    duration,
    reward,
    tribulation,
    omen: buildOmen({
      power: calculatePower(state),
      pressure: danger,
      demon: nextLayer >= 8 || tribulation?.element === 'dark' ? 1 : 0,
      mapMastery: getMapMastery(state, map.id).level,
      unlocked,
    }),
  };
}

export function getDepthTribulation(mapOrId, layer) {
  const map = typeof mapOrId === 'string' ? MISSION_MAPS[mapOrId] : mapOrId;
  const safeLayer = clampInteger(layer, 1, MAP_DEPTH_MAX_LAYER);
  const mapIndex = Math.max(0, Object.keys(MISSION_MAPS).indexOf(map?.id));
  const base = DEPTH_TRIBULATIONS[(mapIndex + safeLayer - 1) % DEPTH_TRIBULATIONS.length] ?? DEPTH_TRIBULATIONS[0];
  const intensity = 1 + Math.floor((safeLayer - 1) / 8);
  return {
    ...base,
    intensity,
    name: intensity > 1 ? `${base.name}${intensity}重` : base.name,
    detail: intensity > 1 ? `${base.detail}劫象已入第 ${intensity} 重。` : base.detail,
  };
}

function getDepthPressure(map, layer) {
  const base = Math.max(180, (map.boss?.power ?? 180) + (map.unlockRealmIndex ?? 0) * 24);
  const ramp = 1 + (layer - 1) * 0.2 + Math.pow(Math.max(0, layer - 1), 1.35) * 0.05;
  const tribulation = getDepthTribulation(map, layer);
  const intensity = tribulation.intensity ?? 1;
  return Math.round(base * ramp * (tribulation.pressureMultiplier ?? 1) * (1 + (intensity - 1) * 0.035));
}

function getDepthDanger(state, map, layer) {
  return Math.max(0, getDepthPressure(map, layer) - getGearLevelBonus(state, 'dangerReductionPerLevel') - getGearAffixBonus(state, 'dangerReduction') - getGearSetBonus(state, 'dangerReduction') - getEquippedLootBonus(state, 'dangerReduction') - getMapMasteryBonus(state, 'dangerReduction') - getTreasureBonus(state, 'dangerReduction') - getSpiritBeastBonus(state, 'dangerReduction') - getDaoHeartBonus(state, 'dangerReduction') - (state.buildings?.swordArray ?? 0) * BUILDINGS.swordArray.dangerReductionPerLevel - (state.cultivationPaths?.sword ?? 0) * CULTIVATION_PATHS.sword.dangerReductionPerLevel);
}

function getDepthDuration(map, layer) {
  return Math.min(420, Math.round(70 + layer * 9 + (map.unlockRealmIndex ?? 0) * 2));
}

function getDepthReward(map, layer) {
  const reward = {
    spiritStones: Math.round(28 + layer * 10 + (map.unlockRealmIndex ?? 0) * 8),
    qi: Math.round(35 + layer * 18 + (map.unlockRealmIndex ?? 0) * 6),
  };
  if (map.id === 'qinglanMountain' || map.id === 'herbValley') {
    reward.herbs = 4 + Math.ceil(layer * 1.4);
  }
  if (layer % 3 === 0 || (map.unlockRealmIndex >= 7 && layer % 2 === 0)) {
    reward.beastCores = Math.max(1, Math.ceil(layer / 8));
  }
  if (layer % 4 === 0 || (map.id === 'swordTomb' && layer % 2 === 0)) {
    reward.artifacts = Math.max(1, Math.ceil(layer / 10));
  }
  if (layer % 5 === 0 || (map.id === 'ancientRuins' && layer % 2 === 0)) {
    reward.arrayFlags = Math.max(1, Math.ceil(layer / 12));
  }
  if (layer % 5 === 0) {
    reward.forgingEssence = Math.max(1, Math.ceil(layer / 5));
  }
  if (layer % 10 === 0) {
    reward.powerBonus = 8 + layer;
  }
  if (layer === MAP_DEPTH_MAX_LAYER) {
    reward.qiRateBonus = 0.02;
  }
  return reward;
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

function getMapReadiness(state, map, routes = []) {
  const unlocked = (state.realmIndex ?? 0) >= (map.unlockRealmIndex ?? 0);
  if (!unlocked) {
    return {
      label: '地势',
      name: '未感',
      ratio: 0,
      detail: '境界尚浅，山川气机仍未回应。',
    };
  }

  const pressures = routes
    .filter((mission) => (state.realmIndex ?? 0) >= (mission.unlockRealmIndex ?? 0))
    .map((mission) => getMissionDanger(state, mission))
    .filter((danger) => danger > 0);
  const pressure = pressures.length ? Math.min(...pressures) : 0;
  if (pressure <= 0) {
    return {
      label: '地势',
      name: '安稳',
      ratio: 1,
      detail: '此地劫象轻浅，可作为日常行游根基。',
    };
  }

  const power = calculatePower(state);
  const ratio = round(power / pressure);
  const name = ratio >= 1.25 ? '地熟' : ratio >= 0.95 ? '可行' : ratio >= 0.72 ? '未稳' : '凶重';
  const detail = {
    '地熟': '地脉已熟，主要劫象在可控范围内。',
    '可行': '气机可承，仍宜留意路线和护持。',
    '未稳': '劫象尚重，先补法袍、剑阵或低阶地图声望更稳。',
    '凶重': '山势压身，贸然深入多半折返。',
  }[name];

  return {
    label: '地势',
    name,
    ratio,
    power,
    pressure,
    detail,
  };
}

function getBossOmen(state, map) {
  return buildOmen({
    power: calculatePower(state),
    pressure: getBossCombatPower(state, map),
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
  if (!status.boss.depthGate?.ready) {
    addLog(state, now, `${map.name}秘境根基尚浅，需先推进至第 ${status.boss.depthGate.required} 层再寻${map.boss.name}。`);
    return { ok: false, reason: 'depthLocked', requiredLayer: status.boss.depthGate?.required ?? 0 };
  }
  const battle = simulateBossBattle(state, mapId, now);
  if (battle.outcome !== 'victory') {
    applyResources(state, map.boss.failurePenalty ?? {});
    state.injuryUntil = now + 120 * 1000;
    recordMissionReport(state, createBossReport(state, map, {
      outcome: 'failure',
      reward: map.boss.failurePenalty ?? {},
      battle,
      now,
    }));
    addLog(state, now, `挑战${map.boss.name}失利，${battle.summary}`);
    return { ok: false, reason: 'battleLost', requiredPower: getBossCombatPower(state, map), battle };
  }

  applyResources(state, map.boss.reward);
  addMapReputation(state, map.id, map.boss.reputation ?? 0);
  state.defeatedBosses[map.id] = true;
  recordMissionReport(state, createBossReport(state, map, {
    outcome: 'success',
    reward: map.boss.reward,
    battle,
    now,
  }));
  addLog(state, now, `镇压${map.boss.name}，${map.name}声望大涨，获得${formatReward(map.boss.reward)}。`);
  return { ok: true, reward: map.boss.reward, boss: map.boss, battle };
}

export function calculateQiRate(state, now = Date.now()) {
  const realm = getCurrentRealm(state);
  const buildingBonus = 1 + ((state.buildings?.meditationSeat ?? 1) - 1) * BUILDINGS.meditationSeat.qiBonusPerLevel;
  const formationBonus = 1 + (state.formations?.spiritGathering ?? 0) * FORMATIONS.spiritGathering.qiBonusPerLevel;
  const gearBonus = 1 + getGearLevelBonus(state, 'qiBonusPerLevel');
  const affixBonus = 1 + getGearAffixBonus(state, 'qiBonus');
  const pathBonus = 1 + (state.cultivationPaths?.formation ?? 0) * CULTIVATION_PATHS.formation.qiBonusPerLevel;
  const permanentBonus = 1 + (state.permanentBonuses?.qiRate ?? 0);
  const lootBonus = 1 + getEquippedLootBonus(state, 'qiRate');
  const masteryBonus = 1 + getMapMasteryBonus(state, 'qiRate');
  const treasureBonus = 1 + getTreasureBonus(state, 'qiRate');
  const beastBonus = 1 + getSpiritBeastBonus(state, 'qiRate');
  const bloodlineBonus = 1 + getBloodlineBonus(state, 'qiRate');
  const sectSkillBonus = 1 + getSectSkillBonus(state, 'qiRate');
  const daoHeartBonus = 1 + getDaoHeartBonus(state, 'qiRate');
  const setBonus = 1 + getGearSetBonus(state, 'qiBonus');
  const pillBoost = state.pillBoostUntil && state.pillBoostUntil > now ? getGatherQiPillBoostMultiplier(state) : 1;
  const injuryPenalty = state.injuryUntil && state.injuryUntil > now ? 0.75 : 1;
  return round(realm.qiRate * buildingBonus * formationBonus * gearBonus * affixBonus * pathBonus * permanentBonus * lootBonus * masteryBonus * treasureBonus * beastBonus * bloodlineBonus * sectSkillBonus * daoHeartBonus * setBonus * pillBoost * injuryPenalty);
}

function getGatherQiPillBoostMultiplier(state) {
  const realmIndex = state.realmIndex ?? 0;
  if (realmIndex >= 27) {
    return 1.15;
  }
  if (realmIndex >= 18) {
    return 1.22;
  }
  if (realmIndex >= 9) {
    return 1.32;
  }
  return 1.45;
}

export function calculateBreakthroughChance(state, now = Date.now()) {
  const realm = getCurrentRealm(state);
  const overfill = Math.max(0, state.qi - realm.requiredQi);
  const preparation = Math.min(0.2, overfill / realm.requiredQi / 2);
  const insightBonus = Math.min(0.15, (state.insight ?? 0) * 0.03);
  const gearBonus = Math.min(0.18, getGearLevelBonus(state, 'breakthroughPerLevel'));
  const affixBonus = Math.min(0.08, getGearAffixBonus(state, 'breakthrough'));
  const lootBonus = Math.min(0.1, getEquippedLootBonus(state, 'breakthrough'));
  const formationBonus = Math.min(0.12, (state.formations?.mountainGuard ?? 0) * FORMATIONS.mountainGuard.stabilityPerLevel);
  const treasureBonus = Math.min(0.12, getTreasureBonus(state, 'breakthrough'));
  const beastBonus = Math.min(0.08, getSpiritBeastBonus(state, 'breakthrough'));
  const bloodlineBonus = Math.min(0.1, getBloodlineBonus(state, 'breakthrough'));
  const sectSkillBonus = Math.min(0.08, getSectSkillBonus(state, 'breakthrough'));
  const daoHeartBonus = Math.min(0.1, getDaoHeartBonus(state, 'breakthrough'));
  const setBonus = Math.min(0.08, getGearSetBonus(state, 'breakthrough'));
  const scriptureBonus = Math.min(0.12, (state.buildings?.scriptureLibrary ?? 0) * BUILDINGS.scriptureLibrary.breakthroughPerLevel);
  const pillBonus = state.breakthroughBoostUntil && state.breakthroughBoostUntil > now ? 0.12 : 0;
  const foundationBonus = Math.min(0.15, (state.foundationStability ?? 0) * 0.05);
  const heartDemonPenalty = Math.min(0.35, (state.heartDemon ?? 0) * 0.15);
  return round(Math.max(0.25, Math.min(0.95, 0.75 + preparation + insightBonus + gearBonus + affixBonus + lootBonus + formationBonus + treasureBonus + beastBonus + bloodlineBonus + sectSkillBonus + daoHeartBonus + setBonus + scriptureBonus + pillBonus + foundationBonus - heartDemonPenalty)));
}

export function calculatePower(state) {
  const realmPower = getRealmPower(state);
  const pathPower = (state.cultivationPaths?.sword ?? 0) * CULTIVATION_PATHS.sword.powerPerLevel;
  const swordPower = (state.buildings?.swordArray ?? 0) * BUILDINGS.swordArray.powerPerLevel;
  const gearPower = getGearLevelBonus(state, 'powerPerLevel');
  const gearQualityPower = Object.values(state.gearQuality ?? {}).reduce((total, qualityIndex) => total + (GEAR_QUALITIES[qualityIndex]?.powerBonus ?? 0), 0);
  const affixPower = getGearAffixBonus(state, 'powerBonus');
  const setPower = getGearSetBonus(state, 'powerBonus');
  const formationPower = (state.formations?.swordArray ?? 0) * FORMATIONS.swordArray.powerPerLevel;
  const permanentPower = state.permanentBonuses?.power ?? 0;
  const lootPower = getEquippedLootBonus(state, 'power');
  const lootResonancePower = getLootResonanceBonus(state, 'power');
  const masteryPower = getMapMasteryBonus(state, 'power');
  const treasurePower = getTreasureBonus(state, 'power');
  const beastPower = getSpiritBeastBonus(state, 'power');
  const bloodlinePower = getBloodlineBonus(state, 'power');
  const sectSkillPower = getSectSkillBonus(state, 'power');
  const daoHeartPower = getDaoHeartBonus(state, 'power');
  const sectPower = Math.floor((state.sectReputation ?? 0) / 20) * 4;
  const qiPower = Math.min(90, Math.floor((state.qi ?? 0) * 0.5));
  const demonPenalty = (state.heartDemon ?? 0) * 8;
  return Math.max(10, Math.floor(realmPower + pathPower + swordPower + gearPower + gearQualityPower + affixPower + setPower + formationPower + permanentPower + lootPower + lootResonancePower + masteryPower + treasurePower + beastPower + bloodlinePower + sectSkillPower + daoHeartPower + sectPower + qiPower - demonPenalty));
}

function getRealmPower(state) {
  return Math.round(((state.realmIndex ?? 0) + 1) * 22);
}

export function getCombatProfile(state) {
  const power = calculatePower(state);
  const attackSources = compactSources([
    { label: '道行底蕴', value: Math.floor(power * 0.62) },
    { label: '器位锋芒', value: getGearLevelBonus(state, 'attackPerLevel') },
    ...getGearAffixSources(state, 'attack'),
    ...getGearSetSources(state, 'attack'),
    ...getEquippedLootSources(state, 'attack'),
    ...getLootResonanceSources(state, 'attack'),
    ...getBloodlineSources(state, 'attack'),
    ...getSectSkillSources(state, 'attack'),
    ...getDeployedSpiritBeastSources(state, 'attack'),
  ]);
  const defenseSources = compactSources([
    { label: '道体根基', value: Math.floor(power * 0.18) },
    { label: '器位护体', value: getGearLevelBonus(state, 'defensePerLevel') },
    ...getGearAffixSources(state, 'defense'),
    ...getGearSetSources(state, 'defense'),
    ...getEquippedLootSources(state, 'defense'),
    ...getLootResonanceSources(state, 'defense'),
    ...getBloodlineSources(state, 'defense'),
    ...getSectSkillSources(state, 'defense'),
    ...getDeployedSpiritBeastSources(state, 'defense'),
  ]);
  const vitalitySources = compactSources([
    { label: '境界血元', value: 260 + (state.realmIndex ?? 0) * 36 },
    { label: '器位养命', value: getGearLevelBonus(state, 'vitalityPerLevel') },
    ...getGearAffixSources(state, 'vitality'),
    ...getGearSetSources(state, 'vitality'),
    ...getEquippedLootSources(state, 'vitality'),
    ...getLootResonanceSources(state, 'vitality'),
    ...getBloodlineSources(state, 'vitality'),
    ...getSectSkillSources(state, 'vitality'),
    ...getDeployedSpiritBeastSources(state, 'vitality'),
  ]);
  const speedSources = compactSources([
    { label: '身法根基', value: 12 + Math.floor((state.realmIndex ?? 0) / 2) },
    { label: '器位身法', value: getGearLevelBonus(state, 'speedPerLevel') },
    ...getGearAffixSources(state, 'speed'),
    ...getGearSetSources(state, 'speed'),
    ...getEquippedLootSources(state, 'speed'),
    ...getBloodlineSources(state, 'speed'),
    ...getDeployedSpiritBeastSources(state, 'speed'),
  ]);
  const critSources = compactSources([
    { label: '本命灵觉', value: 0.05, mode: 'percent' },
    ...getGearAffixSources(state, 'critChance', 'percent'),
    ...getGearSetSources(state, 'critChance', 'percent'),
    ...getEquippedLootSources(state, 'critChance', 'percent'),
    ...getBloodlineSources(state, 'critChance', 'percent'),
    ...getDeployedSpiritBeastSources(state, 'critChance', 'percent'),
  ]);
  const pierceSources = compactSources([
    { label: '器位破势', value: getGearLevelBonus(state, 'piercePerLevel') },
    ...getGearAffixSources(state, 'pierce'),
    ...getGearSetSources(state, 'pierce'),
    ...getEquippedLootSources(state, 'pierce'),
    ...getBloodlineSources(state, 'pierce'),
    ...getDeployedSpiritBeastSources(state, 'pierce'),
  ]);
  const elementScores = getCombatElementScores(state);
  const element = getDominantCombatElement(elementScores);
  const elementSources = compactSources(elementScores[element.id]?.sources ?? []);

  return {
    element,
    attack: createCombatStat('锋芒', attackSources),
    defense: createCombatStat('护体', defenseSources),
    vitality: createCombatStat('血元', vitalitySources),
    speed: createCombatStat('身法', speedSources),
    critChance: createCombatStat('会心', critSources, 'percent'),
    pierce: createCombatStat('破势', pierceSources),
    elementPower: {
      label: '灵根偏向',
      value: Math.max(0, elementScores[element.id]?.value ?? 0),
      element,
      sources: elementSources,
    },
  };
}

export function simulateBossBattle(state, mapId, now = Date.now(), random = null) {
  const map = MISSION_MAPS[mapId];
  if (!map) {
    return { outcome: 'defeat', reason: 'unknownMap', rounds: [] };
  }
  return runTurnBattle(getPlayerCombatant(state), getBossCombatant(state, map), {
    type: 'boss',
    now,
    random,
    beast: getSpiritBeastCombatant(state),
  });
}

export function getCharacterProfile(state, now = Date.now()) {
  const realm = getCurrentRealm(state);
  const combat = getCombatProfile(state);
  const attackSources = compactSources([
    { label: '境界威压', value: getRealmPower(state) },
    { label: '剑诀火候', value: (state.cultivationPaths?.sword ?? 0) * CULTIVATION_PATHS.sword.powerPerLevel },
    { label: '洞府剑阵', value: (state.buildings?.swordArray ?? 0) * BUILDINGS.swordArray.powerPerLevel },
    { label: '器位阶位', value: getGearLevelBonus(state, 'powerPerLevel') },
    { label: '炼器火候', value: Object.values(state.gearQuality ?? {}).reduce((total, qualityIndex) => total + (GEAR_QUALITIES[qualityIndex]?.powerBonus ?? 0), 0) },
    { label: '灵纹词条', value: getGearAffixBonus(state, 'powerBonus') },
    { label: '同调器象', value: getGearSetBonus(state, 'powerBonus') },
    { label: '剑阵杀意', value: (state.formations?.swordArray ?? 0) * FORMATIONS.swordArray.powerPerLevel },
    { label: '奇珍加持', value: getEquippedLootBonus(state, 'power') },
    { label: '战利共鸣', value: getLootResonanceBonus(state, 'power') },
    { label: '地脉熟稔', value: getMapMasteryBonus(state, 'power') },
    { label: '法宝灵蕴', value: getTreasureBonus(state, 'power') },
    { label: '灵兽护持', value: getSpiritBeastBonus(state, 'power') },
    { label: '血脉灵契', value: getBloodlineBonus(state, 'power') },
    { label: '宗门秘传', value: getSectSkillBonus(state, 'power') },
    { label: '命格道心', value: getDaoHeartBonus(state, 'power') },
    { label: '洞天底蕴', value: state.permanentBonuses?.power ?? 0 },
    { label: '山门威望', value: Math.floor((state.sectReputation ?? 0) / 20) * 4 },
  ]);
  const cultivationSources = compactSources([
    { label: '境界周天', value: realm.qiRate, mode: 'base' },
    { label: '静室蒲团', value: ((state.buildings?.meditationSeat ?? 1) - 1) * BUILDINGS.meditationSeat.qiBonusPerLevel, mode: 'percent' },
    { label: '聚灵阵纹', value: (state.formations?.spiritGathering ?? 0) * FORMATIONS.spiritGathering.qiBonusPerLevel, mode: 'percent' },
    { label: '玉佩藏脉', value: getGearLevelBonus(state, 'qiBonusPerLevel'), mode: 'percent' },
    { label: '护符灵纹', value: getGearAffixBonus(state, 'qiBonus'), mode: 'percent' },
    { label: '同调器象', value: getGearSetBonus(state, 'qiBonus'), mode: 'percent' },
    { label: '阵道感悟', value: (state.cultivationPaths?.formation ?? 0) * CULTIVATION_PATHS.formation.qiBonusPerLevel, mode: 'percent' },
    { label: '奇珍加持', value: getEquippedLootBonus(state, 'qiRate'), mode: 'percent' },
    { label: '地脉熟稔', value: getMapMasteryBonus(state, 'qiRate'), mode: 'percent' },
    { label: '法宝灵蕴', value: getTreasureBonus(state, 'qiRate'), mode: 'percent' },
    { label: '灵兽护持', value: getSpiritBeastBonus(state, 'qiRate'), mode: 'percent' },
    { label: '血脉灵契', value: getBloodlineBonus(state, 'qiRate'), mode: 'percent' },
    { label: '宗门秘传', value: getSectSkillBonus(state, 'qiRate'), mode: 'percent' },
    { label: '命格道心', value: getDaoHeartBonus(state, 'qiRate'), mode: 'percent' },
    { label: '洞天底蕴', value: state.permanentBonuses?.qiRate ?? 0, mode: 'percent' },
    { label: '丹力催行', value: state.pillBoostUntil && state.pillBoostUntil > now ? getGatherQiPillBoostMultiplier(state) - 1 : 0, mode: 'percent' },
  ]);
  const breakthroughSources = compactSources([
    { label: '本命道基', value: 0.75, mode: 'percent' },
    { label: '器位护脉', value: Math.min(0.18, getGearLevelBonus(state, 'breakthroughPerLevel')), mode: 'percent' },
    { label: '灵纹词条', value: Math.min(0.08, getGearAffixBonus(state, 'breakthrough')), mode: 'percent' },
    { label: '同调器象', value: Math.min(0.08, getGearSetBonus(state, 'breakthrough')), mode: 'percent' },
    { label: '护山阵势', value: Math.min(0.12, (state.formations?.mountainGuard ?? 0) * FORMATIONS.mountainGuard.stabilityPerLevel), mode: 'percent' },
    { label: '奇珍加持', value: Math.min(0.1, getEquippedLootBonus(state, 'breakthrough')), mode: 'percent' },
    { label: '法宝灵蕴', value: Math.min(0.12, getTreasureBonus(state, 'breakthrough')), mode: 'percent' },
    { label: '血脉灵契', value: Math.min(0.1, getBloodlineBonus(state, 'breakthrough')), mode: 'percent' },
    { label: '宗门秘传', value: Math.min(0.08, getSectSkillBonus(state, 'breakthrough')), mode: 'percent' },
    { label: '命格道心', value: Math.min(0.1, getDaoHeartBonus(state, 'breakthrough')), mode: 'percent' },
    { label: '悟道灵光', value: Math.min(0.15, (state.insight ?? 0) * 0.03), mode: 'percent' },
    { label: '根基沉淀', value: Math.min(0.15, (state.foundationStability ?? 0) * 0.05), mode: 'percent' },
    { label: '心魔侵扰', value: -Math.min(0.35, (state.heartDemon ?? 0) * 0.15), mode: 'percent' },
  ], true);
  const explorationSafety = getGearLevelBonus(state, 'dangerReductionPerLevel')
    + getGearAffixBonus(state, 'dangerReduction')
    + getGearSetBonus(state, 'dangerReduction')
    + getEquippedLootBonus(state, 'dangerReduction')
    + getMapMasteryBonus(state, 'dangerReduction')
    + getTreasureBonus(state, 'dangerReduction')
    + getSpiritBeastBonus(state, 'dangerReduction')
    + getBloodlineBonus(state, 'dangerReduction')
    + getSectSkillBonus(state, 'dangerReduction')
    + getDaoHeartBonus(state, 'dangerReduction')
    + (state.cultivationPaths?.sword ?? 0) * CULTIVATION_PATHS.sword.dangerReductionPerLevel;
  const bloodlinePower = getBloodlineBonus(state, 'power')
    + getBloodlineBonus(state, 'attack')
    + getBloodlineBonus(state, 'defense')
    + getBloodlineBonus(state, 'vitality')
    + getBloodlineBonus(state, 'elementPower');
  const bloodlineSources = compactSources([
    ...getBloodlineSources(state, 'power'),
    ...getBloodlineSources(state, 'attack'),
    ...getBloodlineSources(state, 'defense'),
    ...getBloodlineSources(state, 'vitality'),
    ...getBloodlineSources(state, 'elementPower'),
    ...getBloodlineSources(state, 'qiRate', 'percent'),
    ...getBloodlineSources(state, 'breakthrough', 'percent'),
  ]);
  const attributes = [
    { id: 'combatAttack', label: combat.attack.label, value: combat.attack.value, sources: combat.attack.sources },
    { id: 'combatDefense', label: combat.defense.label, value: combat.defense.value, sources: combat.defense.sources },
    { id: 'vitality', label: combat.vitality.label, value: combat.vitality.value, sources: combat.vitality.sources },
    { id: 'critChance', label: combat.critChance.label, value: combat.critChance.value, unit: '%', sources: combat.critChance.sources },
    { id: 'elementPower', label: combat.elementPower.label, value: combat.elementPower.value, unit: combat.element.name, sources: combat.elementPower.sources },
    { id: 'cultivationSpeed', label: '灵息', value: calculateQiRate(state, now), unit: '/分钟', sources: cultivationSources },
    { id: 'breakthrough', label: '破境天机', value: calculateBreakthroughChance(state, now), unit: '%', sources: breakthroughSources },
    { id: 'explorationSafety', label: '护体玄光', value: explorationSafety, sources: compactSources([
      { label: '器位护身', value: getGearLevelBonus(state, 'dangerReductionPerLevel') },
      { label: '灵纹词条', value: getGearAffixBonus(state, 'dangerReduction') },
      { label: '同调器象', value: getGearSetBonus(state, 'dangerReduction') },
      { label: '奇珍加持', value: getEquippedLootBonus(state, 'dangerReduction') },
      { label: '地脉熟稔', value: getMapMasteryBonus(state, 'dangerReduction') },
      { label: '法宝灵蕴', value: getTreasureBonus(state, 'dangerReduction') },
      { label: '灵兽护持', value: getSpiritBeastBonus(state, 'dangerReduction') },
      { label: '血脉灵契', value: getBloodlineBonus(state, 'dangerReduction') },
      { label: '宗门秘传', value: getSectSkillBonus(state, 'dangerReduction') },
      { label: '命格道心', value: getDaoHeartBonus(state, 'dangerReduction') },
    ]) },
    { id: 'sectInfluence', label: '山门气运', value: Math.floor(state.sectReputation ?? 0), sources: [{ label: getSectLevel(state).name, value: Math.floor(state.sectReputation ?? 0) }] },
  ];
  if (bloodlineSources.length) {
    attributes.splice(5, 0, { id: 'bloodline', label: '血脉灵契', value: round(bloodlinePower), sources: bloodlineSources });
  }

  return {
    realmName: realm.name,
    combatPower: {
      label: '道行总纲',
      value: calculatePower(state),
      sources: attackSources,
    },
    attributes,
  };
}

export function getGearQuality(state, gearId) {
  const qualityIndex = state.gearQuality?.[gearId] ?? 0;
  const affixId = state.gearAffixes?.[gearId] ?? null;
  const affix = affixId ? GEAR_AFFIXES[affixId] : null;
  const rarity = getRarityTier(getGearQualityRarityId(qualityIndex));
  return {
    qualityIndex,
    qualityName: GEAR_QUALITIES[qualityIndex]?.name ?? GEAR_QUALITIES[0].name,
    rarity,
    affixId,
    affixName: affix?.name ?? '无词条',
  };
}

export function getRarityTierForLevel(level = 0, baseRarityId = 'common') {
  return getRarityTier(getGrowthRarityId(level, baseRarityId));
}

function getSpiritBeastQuality(beast) {
  return SPIRIT_BEAST_QUALITIES[beast?.qualityId] ?? SPIRIT_BEAST_QUALITIES.spirit;
}

function getSpiritBeastGrowthMultiplier(beast) {
  const quality = getSpiritBeastQuality(beast);
  return round((quality.growthMultiplier ?? 1) * (beast?.growthMultiplier ?? 1));
}

function getSpiritBeastGuidanceUnlockRealm(beast) {
  const qualityUnlocks = {
    wild: 0,
    spirit: 0,
    mystic: 7,
    earth: 14,
    heaven: 18,
    ancient: 24,
  };
  return beast?.unlock?.realmIndex ?? beast?.unlockRealmIndex ?? qualityUnlocks[beast?.qualityId] ?? 0;
}

function getSpiritBeastUnlockStatus(state, beast) {
  if (!beast) {
    return { unlocked: false, requirements: ['未知灵兽'], hint: '未知灵兽' };
  }
  const owned = (state.spiritBeasts?.[beast.id] ?? 0) > 0;
  if (owned) {
    return { unlocked: true, requirements: [], hint: '已结契，可继续培养' };
  }
  const unlock = beast.unlock ?? { realmIndex: getSpiritBeastGuidanceUnlockRealm(beast) };
  const requirements = [];
  if ((state.realmIndex ?? 0) < (unlock.realmIndex ?? 0)) {
    requirements.push(`境界至${REALMS[unlock.realmIndex]?.name ?? '更高境界'}`);
  }
  if (unlock.mapId && (state.mapDepths?.[unlock.mapId] ?? 0) < (unlock.depthLayer ?? 1)) {
    const map = MISSION_MAPS[unlock.mapId];
    requirements.push(`${map?.name ?? '对应秘境'}第 ${unlock.depthLayer ?? 1} 层`);
  }
  if (unlock.bossId && !state.defeatedBosses?.[unlock.bossId]) {
    const map = MISSION_MAPS[unlock.bossId];
    requirements.push(`镇压${map?.boss?.name ?? map?.name ?? '对应首领'}`);
  }
  if (unlock.bloodEssence && (state.bloodEssence ?? 0) < unlock.bloodEssence) {
    requirements.push(`血脉精魄 ${Math.floor(state.bloodEssence ?? 0)} / ${unlock.bloodEssence}`);
  }
  if (unlock.forgingEssence && (state.forgingEssence ?? 0) < unlock.forgingEssence) {
    requirements.push(`精魄 ${Math.floor(state.forgingEssence ?? 0)} / ${unlock.forgingEssence}`);
  }
  if (unlock.insight && (state.insight ?? 0) < unlock.insight) {
    requirements.push(`悟道 ${Math.floor(state.insight ?? 0)} / ${unlock.insight}`);
  }
  return {
    unlocked: requirements.length === 0,
    requirements,
    hint: requirements.length ? requirements.join('、') : '线索已齐，可尝试结契',
  };
}

export function getGearSetStatus(state) {
  const activeAffixes = new Set(Object.entries(state.gearAffixes ?? {})
    .filter(([gearId, affixId]) => (state.gear?.[gearId] ?? 0) > 0 && GEAR_AFFIXES[affixId])
    .map(([, affixId]) => affixId));

  return Object.values(GEAR_AFFIX_SETS).map((set) => {
    const matchedAffixes = set.affixes.filter((affixId) => activeAffixes.has(affixId));
    const activeTier = getGearSetActiveTier(set, matchedAffixes.length);
    const nextTier = getGearSetNextTier(set, matchedAffixes.length);
    const active = Boolean(activeTier);
    const bonuses = getGearSetMatchedBonuses(set, matchedAffixes.length);
    const affixes = set.affixes.map((affixId) => ({
      id: affixId,
      name: GEAR_AFFIXES[affixId]?.name ?? affixId,
      slot: GEAR_AFFIXES[affixId]?.slot ?? null,
      slotName: GEAR[GEAR_AFFIXES[affixId]?.slot]?.name ?? '器物',
      active: activeAffixes.has(affixId),
    }));
    return {
      id: set.id,
      name: set.name,
      detail: set.detail,
      matched: matchedAffixes.length,
      total: set.affixes.length,
      active,
      activeTier,
      nextTier,
      bonuses,
      effects: effectsFromBonusObject(bonuses),
      tiers: getGearSetTiers(set).map((tier) => ({
        ...tier,
        active: matchedAffixes.length >= tier.pieces,
        missing: Math.max(0, tier.pieces - matchedAffixes.length),
        effects: effectsFromBonusObject(tier.bonuses ?? {}),
      })),
      missingAffixes: affixes.filter((affix) => !affix.active),
      affixes,
    };
  });
}

function getGearSetTiers(set) {
  if (Array.isArray(set?.tiers) && set.tiers.length) {
    return [...set.tiers].sort((a, b) => a.pieces - b.pieces);
  }
  return [{ pieces: set?.affixes?.length ?? 0, name: '同调', bonuses: set?.bonuses ?? {} }];
}

function getGearSetActiveTier(set, matched) {
  return getGearSetTiers(set).filter((tier) => matched >= tier.pieces).at(-1) ?? null;
}

function getGearSetNextTier(set, matched) {
  return getGearSetTiers(set).find((tier) => matched < tier.pieces) ?? null;
}

function getGearSetMatchedBonuses(set, matched) {
  return getGearSetTiers(set)
    .filter((tier) => matched >= tier.pieces)
    .reduce((bonuses, tier) => addBonusObjects(bonuses, tier.bonuses ?? {}), {});
}

function addBonusObjects(left = {}, right = {}) {
  const result = { ...left };
  Object.entries(right).forEach(([key, value]) => {
    result[key] = round((result[key] ?? 0) + value);
  });
  return result;
}

export function getLootResonanceStatus(state) {
  const slots = Object.keys(GEAR);
  const equippedItems = slots
    .map((slot) => getEquippedLoot(state, slot))
    .filter((item) => item && COMBAT_ELEMENTS[item.element]);
  const total = slots.length;
  if (equippedItems.length < 2) {
    return {
      active: false,
      name: '器象未合',
      detail: '装备同源灵根的战利品可唤起额外器象。',
      matched: equippedItems.length,
      total,
      element: null,
      bonuses: {},
      effects: [],
    };
  }

  const elementCounts = equippedItems.reduce((counts, item) => {
    counts[item.element] = (counts[item.element] ?? 0) + 1;
    return counts;
  }, {});
  const [elementId, matched] = Object.entries(elementCounts)
    .sort((a, b) => b[1] - a[1])[0] ?? [null, 0];
  const element = COMBAT_ELEMENTS[elementId];
  if (!element || matched < 2) {
    return {
      active: false,
      name: '器象未合',
      detail: '装备同源灵根的战利品可唤起额外器象。',
      matched,
      total,
      element: null,
      bonuses: {},
      effects: [],
    };
  }

  const complete = matched >= 4;
  const bonuses = complete
    ? { power: 54, attack: 32, defense: 18, vitality: 52, elementPower: 26 }
    : matched >= 3
      ? { power: 38, attack: 22, defense: 12, vitality: 28, elementPower: 18 }
    : { power: 22, attack: 14, defense: 8, elementPower: 12 };
  return {
    active: true,
    id: `lootResonance:${element.id}:${matched}`,
    name: `${element.name}${complete ? '四象成阵' : matched >= 3 ? '三器同鸣' : '双器相生'}`,
    detail: complete ? '四件以上战利品灵根同源，器象贯通成阵。' : matched >= 3 ? '三件战利品灵根同源，气机互引成势。' : '两件战利品灵根相合，气机开始互引。',
    matched,
    total,
    complete,
    element,
    bonuses,
    effects: effectsFromBonusObject(bonuses),
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
        rarity: quality.rarity,
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
          chance: qualityMaxed || level <= 0 ? 0 : getRefineChance(state, quality.qualityIndex),
          cost: qualityMaxed || level <= 0 ? null : getRefineCost(nextQuality),
        },
        reroll: {
          available: level > 0 && quality.affixId !== null,
          cost: level > 0 && quality.affixId ? getGearAffixRerollCost(state, item.id) : null,
          preview: level > 0 && quality.affixId ? getGearAffixRerollPreview(state, item.id) : { candidates: [], warnings: [] },
        },
      };
    }),
    sets: getGearSetStatus(state),
    lootResonance: getLootResonanceStatus(state),
    loot: (state.lootEquipment ?? []).map((item) => {
      const slotLevel = state.gear?.[item.slot] ?? 0;
      const maxLevel = getLootMaxLevel(item);
      const maxed = slotLevel >= maxLevel;
      const nextLevel = slotLevel + 1;
      const realmLocked = nextLevel > getRealmUpgradeLimit(state);
      const buildTags = getLootBuildTags(item);
      return {
        uid: item.uid,
        name: item.name,
        slot: item.slot,
        realmBand: LOOT_EQUIPMENT[item.templateId]?.realmBand ?? '炼气',
        minRealmIndex: LOOT_EQUIPMENT[item.templateId]?.minRealmIndex ?? 0,
        lootTier: LOOT_EQUIPMENT[item.templateId]?.lootTier ?? 0,
        variant: item.variant ?? null,
        rarity: getLootRarity(item),
        level: item.level ?? 0,
        slotLevel,
        maxLevel,
        slotMaxLevel: maxLevel,
        tier: getUpgradeTier(Math.max(1, maxed ? slotLevel : nextLevel)),
        intent: getGearIntent(item.slot),
        buildTags,
        primaryBuild: buildTags[0] ?? { id: 'balanced', name: '守中', score: 0, detail: '气象均衡。' },
        equipped: state.equippedLoot?.[item.slot] === item.uid,
        locked: Boolean(state.lockedLoot?.[item.uid]),
        effects: effectsFromBonusObject(item.bonuses ?? {}),
        slotEffects: getGearEffects(item.slot, slotLevel, state.gearQuality?.[item.slot] ?? 0, null),
        comparison: compareLootEquipment(state, item),
        nextEffects: maxed || realmLocked ? [] : getGearEffects(item.slot, nextLevel, state.gearQuality?.[item.slot] ?? 0, null),
        empower: {
          maxed,
          realmLocked,
          nextLevel,
          cost: maxed || realmLocked ? null : getLootEmpowerCost(nextLevel),
        },
      };
    }),
    formations: Object.values(FORMATIONS).map((formation) => {
      const level = state.formations?.[formation.id] ?? 0;
      const maxed = level >= formation.maxLevel;
      const nextLevel = level + 1;
      return {
        id: formation.id,
        name: formation.name,
        detail: getFormationDetail(formation.id),
        level,
        maxLevel: formation.maxLevel,
        rarity: getRarityTierForLevel(level, formation.rarityId ?? 'common'),
        nextRarity: getNextRarityMilestone(level, formation.maxLevel, formation.rarityId ?? 'common'),
        effects: getFormationEffects(formation, level),
        nextEffects: maxed ? [] : getFormationEffects(formation, nextLevel),
        upgrade: {
          maxed,
          nextLevel,
          cost: maxed ? null : formation.cost(nextLevel),
        },
      };
    }),
    treasures: Object.values(TREASURES).map((treasure) => {
      const level = state.treasures?.[treasure.id] ?? 0;
      return {
        id: treasure.id,
        name: treasure.name,
        detail: treasure.detail,
        level,
        maxLevel: treasure.maxLevel,
        rarity: getRarityTierForLevel(level, treasure.rarityId ?? 'common'),
        nextRarity: getNextRarityMilestone(level, treasure.maxLevel, treasure.rarityId ?? 'common'),
        effects: effectsFromBonusObject(scaleBonusObject(treasure.bonuses, level)),
        nextEffects: level < treasure.maxLevel ? effectsFromBonusObject(scaleBonusObject(treasure.bonuses, level + 1)) : [],
      };
    }),
    spiritBeasts: Object.values(SPIRIT_BEASTS).map((beast) => {
      const level = state.spiritBeasts?.[beast.id] ?? 0;
      const quality = getSpiritBeastQuality(beast);
      const growthMultiplier = getSpiritBeastGrowthMultiplier(beast);
      const unlock = getSpiritBeastUnlockStatus(state, beast);
      return {
        id: beast.id,
        name: beast.name,
        detail: beast.detail,
        quality,
        unlock,
        growthMultiplier,
        level,
        maxLevel: beast.maxLevel,
        rarity: getRarityTierForLevel(level, beast.rarityId ?? 'common'),
        nextRarity: getNextRarityMilestone(level, beast.maxLevel, beast.rarityId ?? 'common'),
        deployed: state.activeSpiritBeast === beast.id,
        effects: effectsFromBonusObject(scaleBonusObject(beast.bonuses, level * growthMultiplier)),
        collectionEffects: effectsFromBonusObject(scaleBonusObject(beast.bonuses, level * growthMultiplier)),
        battleEffects: effectsFromBonusObject(scaleBonusObject(beast.deployedBonuses ?? {}, level * growthMultiplier)),
        nextEffects: level < beast.maxLevel ? effectsFromBonusObject(scaleBonusObject(beast.bonuses, (level + 1) * growthMultiplier)) : [],
        nextBattleEffects: level < beast.maxLevel ? effectsFromBonusObject(scaleBonusObject(beast.deployedBonuses ?? {}, (level + 1) * growthMultiplier)) : [],
        skill: beast.skill ? { ...beast.skill } : null,
      };
    }),
    bloodlines: Object.values(BLOODLINES).map((bloodline) => {
      const level = state.bloodlines?.[bloodline.id] ?? 0;
      const maxed = level >= bloodline.maxLevel;
      const nextLevel = level + 1;
      return {
        id: bloodline.id,
        name: bloodline.name,
        detail: bloodline.detail,
        level,
        maxLevel: bloodline.maxLevel,
        rarity: getRarityTierForLevel(level, bloodline.rarityId ?? 'common'),
        nextRarity: getNextRarityMilestone(level, bloodline.maxLevel, bloodline.rarityId ?? 'common'),
        effects: effectsFromBonusObject(scaleBonusObject(bloodline.bonuses, level)),
        nextEffects: maxed ? [] : effectsFromBonusObject(scaleBonusObject(bloodline.bonuses, nextLevel)),
        upgrade: {
          maxed,
          nextLevel,
          cost: maxed ? null : bloodline.cost(nextLevel),
        },
      };
    }),
  };
}

export function getEquippedLoot(state, slot) {
  const uid = state.equippedLoot?.[slot] ?? null;
  return state.lootEquipment?.find((item) => item.uid === uid) ?? null;
}

function getLootBuildTags(item) {
  const bonuses = item?.bonuses ?? {};
  const affixIds = new Set([
    item?.variant?.affixId,
    ...(item?.variant?.affixIds ?? []),
    ...(item?.variant?.affixes ?? []).map((affix) => affix.id),
  ].filter(Boolean));
  return Object.values(BUILD_SCHOOLS)
    .map((school) => {
      const statScore = school.stats.reduce((score, stat) => {
        const value = Math.abs(Number(bonuses[stat]) || 0);
        return score + (value > 0 ? (stat === 'critChance' || stat.endsWith('Bonus') || stat === 'qiRate' || stat === 'breakthrough' ? value * 900 : value) : 0);
      }, 0);
      const affixScore = school.affixes.reduce((score, affixId) => score + (affixIds.has(affixId) ? 24 : 0), 0);
      const elementScore = school.elements.includes(item?.element ?? item?.variant?.element) ? 18 : 0;
      return {
        id: school.id,
        name: school.name,
        detail: school.detail,
        score: Math.round(statScore + affixScore + elementScore),
      };
    })
    .filter((tag) => tag.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 2);
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

export function lockRareLootEquipment(state, minRarityId = 'mystic', now = Date.now()) {
  const minIndex = getRarityIndex(minRarityId);
  const items = (state.lootEquipment ?? []).filter((item) => {
    if (state.equippedLoot?.[item.slot] === item.uid || state.lockedLoot?.[item.uid]) {
      return false;
    }
    return getRarityIndex(getLootRarity(item).id) >= minIndex;
  });
  if (!items.length) {
    addLog(state, now, '整理战利品，没有新的高品器物需要锁定。');
    return { ok: true, locked: 0, items: [] };
  }
  state.lockedLoot ??= {};
  items.forEach((item) => {
    state.lockedLoot[item.uid] = true;
  });
  addLog(state, now, `已锁定 ${items.length} 件玄纹以上战利品，批量整理时会保留。`);
  return { ok: true, locked: items.length, items };
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
  const dismantleMultiplier = getLootDismantleMultiplier(state, item);
  const rarityIndex = getRarityIndex(getLootRarity(item).id);
  const reward = filterCost({
    forgingEssence: Math.floor(2 * dismantleMultiplier),
    artifacts: 1,
    bloodEssence: rarityIndex >= 2 ? Math.max(1, Math.floor((rarityIndex - 1) * dismantleMultiplier)) : 0,
  });
  applyResources(state, reward);
  addLog(state, now, `分解${item.name}，获得${formatReward(reward)}。`);
  return { ok: true, reward, item };
}

export function organizeLootEquipment(state, now = Date.now(), options = {}) {
  const items = state.lootEquipment ?? [];
  if (!items.length) {
    return { ok: true, removed: 0, reward: {}, items: [] };
  }

  const keepUids = new Set(Object.values(state.equippedLoot ?? {}).filter(Boolean));
  const selectedRarities = normalizeLootRaritySelection(options.rarityIds);
  const keepStrategy = ['bestPerSlot', 'rareAndSets'].includes(options.keepStrategy) ? options.keepStrategy : 'equippedOnly';
  Object.entries(state.lockedLoot ?? {}).forEach(([uid, locked]) => {
    if (locked) keepUids.add(uid);
  });

  if (!selectedRarities || keepStrategy === 'bestPerSlot' || keepStrategy === 'rareAndSets') {
    Object.values(GEAR).forEach((gearItem) => {
      const candidate = items
        .filter((item) => item.slot === gearItem.id && !keepUids.has(item.uid))
        .sort((a, b) => getLootScore(b) - getLootScore(a))[0];
      if (candidate) {
        keepUids.add(candidate.uid);
      }
    });
  }
  if (keepStrategy === 'rareAndSets') {
    items.forEach((item) => {
      const rarityIndex = getRarityIndex(getLootRarity(item).id);
      const buildTags = getLootBuildTags(item);
      if (rarityIndex >= getRarityIndex('earthFiend') || buildTags.some((tag) => tag.score >= 90)) {
        keepUids.add(item.uid);
      }
    });
  }

  const removedItems = items.filter((item) => !keepUids.has(item.uid)
    && (!selectedRarities || selectedRarities.has(getLootRarity(item).id)));
  if (!removedItems.length) {
    addLog(state, now, '整理战利品，没有可分解的闲置装备。');
    return { ok: true, removed: 0, reward: {}, items: [] };
  }

  const reward = filterCost(removedItems.reduce((total, item) => ({
    forgingEssence: total.forgingEssence + Math.floor(2 * getLootDismantleMultiplier(state, item)),
    artifacts: total.artifacts + 1,
    bloodEssence: total.bloodEssence + (getRarityIndex(getLootRarity(item).id) >= 2 ? Math.max(1, Math.floor((getRarityIndex(getLootRarity(item).id) - 1) * getLootDismantleMultiplier(state, item))) : 0),
  }), { forgingEssence: 0, artifacts: 0, bloodEssence: 0 }));
  const removedUids = new Set(removedItems.map((item) => item.uid));
  state.lootEquipment = items.filter((item) => !removedUids.has(item.uid));
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

function normalizeLootRaritySelection(rarityIds) {
  if (!Array.isArray(rarityIds)) {
    return null;
  }
  const validIds = new Set(RARITY_TIERS.map((tier) => tier.id));
  const selected = rarityIds.filter((id) => validIds.has(id));
  return selected.length ? new Set(selected) : new Set();
}

export function empowerLootEquipment(state, uid, now = Date.now()) {
  const item = state.lootEquipment?.find((candidate) => candidate.uid === uid);
  if (!item) {
    return { ok: false, reason: 'unknownLoot' };
  }
  const slot = item.slot;
  if (!GEAR[slot]) {
    return { ok: false, reason: 'unknownSlot' };
  }
  state.gear = normalizeLevels(state.gear, GEAR);
  const level = state.gear[slot] ?? 0;
  if (level >= GEAR[slot].maxLevel) {
    return { ok: false, reason: 'maxLevel' };
  }
  if (level + 1 > getRealmUpgradeLimit(state)) {
    addLog(state, now, `${getUpgradeTier(level + 1).name}${GEAR[slot].name}需要更高境界。`);
    return { ok: false, reason: 'realmLocked' };
  }
  const cost = getLootEmpowerCost(level + 1);
  if (!canAfford(state, cost)) {
    addLog(state, now, `强化${GEAR[slot].name}器位需要${formatReward(cost)}。`);
    return { ok: false, reason: 'notEnoughResources' };
  }

  payResources(state, cost);
  state.gear[slot] = level + 1;
  item.level = 0;
  item.bonuses = createLootBonuses(item.templateId, 0, item.variant);
  addLog(state, now, `${GEAR[slot].name}器位强化至 ${state.gear[slot]} 级，${item.name}继承此火候。`);
  return { ok: true, item, slot, level: state.gear[slot] };
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

export function getResourceGuidance(state) {
  const needs = collectResourceNeeds(state);
  const items = Object.values(needs)
    .map((need) => hydrateResourceNeed(state, need))
    .sort((a, b) => b.score - a.score || b.shortfall - a.shortfall)
    .slice(0, 3);

  if (!items.length) {
    return {
      stable: true,
      primary: null,
      items: [],
      summary: '当前资源缺口不明显，可以继续刷地图声望、推进秘境层数或准备下一次破境。',
    };
  }

  const primary = items[0];
  return {
    stable: false,
    primary,
    items,
    summary: `${primary.label}缺口最明显，${primary.route.detail}`,
  };
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

  const chapter = getMainlineChapters(state).find((candidate) => !candidate.locked && !candidate.rewardClaimed);
  const claimableObjective = chapter?.objectives.find((objective) => objective.completed && !objective.claimed);
  if (claimableObjective) {
    return {
      title: `领取${claimableObjective.title}`,
      detail: `目标已完成，可领取 ${formatReward(claimableObjective.reward)}。`,
      tab: 'goals',
      action: 'claimGoal',
      targetId: claimableObjective.id,
    };
  }
  if (chapter?.completed && chapter.allObjectivesClaimed && !chapter.rewardClaimed) {
    return {
      title: `领取${chapter.title}篇章`,
      detail: `篇章已圆满，可领取 ${formatReward(chapter.reward)}。`,
      tab: 'goals',
      action: 'claimChapter',
      targetId: chapter.id,
    };
  }

  const realm = getCurrentRealm(state);
  if ((state.qi ?? 0) >= realm.requiredQi && state.realmIndex < REALMS.length - 1) {
    const preparation = getBreakthroughPreparation(state);
    const majorGate = [8, 17, 26].includes(state.realmIndex ?? 0);
    const shouldSettleFoundation = majorGate && preparation.readyScore < 0.55 && (state.foundationStability ?? 0) < 2;
    if (shouldSettleFoundation) {
      const foundationCost = { spiritStones: 35, herbs: 8 };
      if (canAfford(state, foundationCost)) {
        return {
          title: '叩关前先稳根基',
          detail: `天劫准备 ${Math.round(preparation.readyScore * 100)}%，先稳一轮根基，再破境更稳。`,
          tab: 'overview',
          action: 'stabilize',
        };
      }
      return {
        title: '备齐稳根基材料',
        detail: `稳固根基需要 ${formatReward(foundationCost)}，先去青岚山寻药或看坊市货架。`,
        tab: 'missions',
        targetId: 'herbGathering',
      };
    }
    return {
      title: '可以破境',
      detail: `灵气已满，当前破境天机 ${Math.round(calculateBreakthroughChance(state) * 100)}%。`,
      tab: 'overview',
      action: 'breakthrough',
    };
  }
  if ((state.completedMissions?.cavePatrol ?? 0) < 1 && (state.realmIndex ?? 0) <= 1) {
    return {
      title: '先巡守洞府',
      detail: '去行游完成一次巡守，带回第一笔灵气和灵石。',
      tab: 'missions',
      targetId: 'cavePatrol',
    };
  }

  const sect = getSectStatus(state);
  if (sect.unlocked && sect.disciples <= 0 && sect.recruitCost) {
    if (!canAfford(state, sect.recruitCost)) {
      return {
        title: '先备山门供给',
        detail: `首名弟子还需 ${formatReward(sect.recruitCost)}，青岚山寻药能补上早期灵草。`,
        tab: 'missions',
        targetId: 'herbGathering',
      };
    }
    return {
      title: '招收首名弟子',
      detail: '山门已有余粮，招人后可派去采药、采矿，补上长期材料。',
      tab: 'sect',
    };
  }

  const beastGuidance = getSpiritBeastGuidance(state);
  if (beastGuidance) {
    return beastGuidance;
  }

  const readyBoss = getMapStatuses(state).find((map) => map.boss.status === 'ready' && calculatePower(state) >= map.boss.power);
  if (readyBoss) {
    return {
      title: `挑战${readyBoss.boss.name}`,
      detail: `${readyBoss.name}探索已足，镇压首领可获得永久成长和炼器精魄。`,
      tab: 'missions',
      targetId: readyBoss.id,
    };
  }

  const swordTombStatus = getMissionStatus(state, 'ancientSwordTomb');
  const justFoundedFoundation = (state.realmIndex ?? 0) >= 9 && (state.realmIndex ?? 0) <= 11;
  if (justFoundedFoundation && swordTombStatus.unlocked && ['大凶', '有险'].includes(swordTombStatus.omen.name)) {
    return {
      title: '筑基初稳，先养外功',
      detail: '古剑冢劫象仍重，先刷灵草谷或雾隐秘境，补妖核、法器和洞府静室。',
      tab: 'missions',
      targetId: 'mistyValley',
    };
  }

  const nextObjective = chapter?.objectives.find((objective) => !objective.completed);
  if (nextObjective) {
    const preparation = getObjectivePreparationGuidance(state, nextObjective);
    if (preparation) {
      return preparation;
    }
    return {
      title: nextObjective.title,
      detail: nextObjective.detail,
      tab: getGuidanceTabForObjective(nextObjective.id),
      targetId: getGuidanceTargetForObjective(nextObjective.id),
    };
  }

  if ((state.realmIndex ?? 0) <= 1) {
    return {
      title: '积攒灵气',
      detail: `距离下一次突破还差 ${Math.ceil(Math.max(0, realm.requiredQi - (state.qi ?? 0)))} 灵气。`,
      tab: 'goals',
    };
  }

  if (sect.unlocked && sect.idle > 0) {
    return {
      title: '分配宗门弟子',
      detail: '空闲弟子不会产出，把弟子派去采药、采矿或护山。',
      tab: 'sect',
    };
  }
  const resourceGuidance = getResourceGuidance(state);
  if (!resourceGuidance.stable && resourceGuidance.primary) {
    const primary = resourceGuidance.primary;
    const commissionText = primary.commission?.unlocked ? `，宗门可派${primary.commission.name}` : '';
    return {
      title: `补足${primary.label}`,
      detail: `${primary.demandText}，${primary.route.detail}${commissionText}。`,
      tab: primary.route.unlocked ? 'missions' : 'market',
    };
  }
  return {
    title: '继续积累底蕴',
    detail: '刷地图声望、强化战利品、提升洞府和阵法，准备下一轮突破。',
    tab: 'missions',
  };
}

export function getProgressPlan(state, now = Date.now()) {
  const realm = getCurrentRealm(state);
  const qi = Math.max(0, Number(state.qi) || 0);
  const realmPercent = realm.requiredQi ? Math.min(1, qi / realm.requiredQi) : 1;
  const power = calculatePower(state);
  const maps = getMapStatuses(state);
  const depthTarget = maps.find((map) => map.unlocked && map.boss.status === 'depthLocked')
    ?? maps.find((map) => map.depth?.unlocked && !map.depth.maxed)
    ?? maps.find((map) => map.unlocked);
  const bossTarget = maps.find((map) => ['ready', 'depthLocked', 'hidden'].includes(map.boss.status) && !map.boss.defeated)
    ?? maps.find((map) => !map.boss.defeated);
  const resourceGuidance = getResourceGuidance(state);
  const equipment = getEquipmentDetails(state);
  const equippedLoot = equipment.loot.filter((item) => item.equipped);
  const primaryBuild = equippedLoot
    .flatMap((item) => item.buildTags ?? [])
    .sort((left, right) => right.score - left.score)[0] ?? null;
  const nextGuidance = getNextGuidance(state);
  const cards = [
    {
      id: 'realm',
      title: '境界',
      value: `${Math.round(realmPercent * 100)}%`,
      detail: realmPercent >= 1 ? '灵气圆满，可看天劫准备。' : `还差 ${Math.ceil(Math.max(0, realm.requiredQi - qi))} 灵气。`,
      tab: 'overview',
      action: realmPercent >= 1 ? 'breakthrough' : '',
    },
    {
      id: 'depth',
      title: '秘境',
      value: depthTarget?.depth?.maxed ? '圆满' : `${depthTarget?.name ?? '青岚山'} ${depthTarget?.depth?.clearedLayer ?? 0}/${depthTarget?.depth?.maxLayer ?? MAP_DEPTH_MAX_LAYER}`,
      detail: depthTarget?.depth?.unlocked
        ? `下一层 ${depthTarget.depth.nextLayer}，劫象 ${depthTarget.depth.omen.name}，产出 ${formatReward(depthTarget.depth.reward)}。`
        : `${REALMS[depthTarget?.unlockRealmIndex ?? 0]?.name ?? '更高境界'}后开启。`,
      tab: 'missions',
      targetId: depthTarget?.id ?? 'qinglanMountain',
    },
    {
      id: 'boss',
      title: '首领',
      value: bossTarget?.boss.status === 'ready' ? '可战' : bossTarget?.boss.status === 'depthLocked' ? `秘境 ${bossTarget.boss.depthGate.label}` : bossTarget?.boss.status === 'defeated' ? '已镇压' : '未显',
      detail: bossTarget
        ? `${bossTarget.boss.name} · 道行 ${power}/${bossTarget.boss.power}，${bossTarget.boss.depthGate?.ready ? bossTarget.boss.omen.name : `先稳第 ${bossTarget.boss.depthGate?.required ?? 1} 层` }。`
        : '暂无首领气机。',
      tab: 'missions',
      targetId: bossTarget?.id ?? 'qinglanMountain',
    },
    {
      id: 'gear',
      title: '器物',
      value: primaryBuild ? primaryBuild.name : `${equippedLoot.length}/6`,
      detail: primaryBuild ? `${primaryBuild.detail}` : '先凑齐六个战利品部位，再看流派共鸣。',
      tab: 'gear',
      targetId: 'loot',
    },
  ];
  if (!resourceGuidance.stable && resourceGuidance.primary) {
    cards.push({
      id: 'resource',
      title: '材料',
      value: resourceGuidance.primary.label,
      detail: `${resourceGuidance.primary.demandText}，${resourceGuidance.primary.route.detail}。`,
      tab: resourceGuidance.primary.route.unlocked ? 'missions' : 'market',
      targetId: resourceGuidance.primary.route.missionId ?? resourceGuidance.primary.route.mapId ?? '',
    });
  }
  const actions = [
    {
      id: 'next',
      title: nextGuidance.title,
      detail: nextGuidance.detail,
      tab: nextGuidance.tab ?? 'goals',
      action: nextGuidance.action ?? '',
      targetId: nextGuidance.targetId ?? '',
    },
  ];
  if (depthTarget?.depth?.unlocked && !depthTarget.depth.maxed) {
    actions.push({
      id: 'pushDepth',
      title: `推进${depthTarget.name}`,
      detail: `秘境第 ${depthTarget.depth.nextLayer} 层会提高首领准备和中后期材料产出。`,
      tab: 'missions',
      targetId: depthTarget.id,
    });
  }
  actions.push({
    id: 'sortLoot',
    title: '整理战利品',
    detail: primaryBuild ? `继续围绕${primaryBuild.name}筛装备。` : '保留高战力和高品器物，低品可沉淀器位材料。',
    tab: 'gear',
    targetId: 'loot',
  });
  return {
    realm: {
      name: realm.name,
      qi,
      requiredQi: realm.requiredQi,
      percent: round(realmPercent),
    },
    power,
    primaryBuild,
    cards,
    actions,
    generatedAt: now,
  };
}

function getSpiritBeastGuidance(state) {
  const activeId = normalizeActiveSpiritBeast(state.activeSpiritBeast, state.spiritBeasts);
  if (!activeId) {
    const ownedId = Object.keys(SPIRIT_BEASTS).find((beastId) => (state.spiritBeasts?.[beastId] ?? 0) > 0);
    if (ownedId) {
      const beast = SPIRIT_BEASTS[ownedId];
      return {
        title: `派灵兽${beast.name}出战`,
        detail: '灵兽已培养，派它随行后会提供出战属性，并在秘境与首领斗法中协战。',
        tab: 'gear',
        targetId: 'beasts',
      };
    }
    const affordable = Object.values(SPIRIT_BEASTS)
      .find((beast) => getSpiritBeastUnlockStatus(state, beast).unlocked && canAfford(state, beast.cost(1)));
    if (affordable) {
      return {
        title: `培养灵兽${affordable.name}`,
        detail: '灵兽同时带来收集底蕴和出战协战，可补上秘境、首领前的一段气机差。',
        tab: 'gear',
        targetId: 'beasts',
      };
    }
  }
  return null;
}

function getObjectivePreparationGuidance(state, objective) {
  const targetMissions = {
    swordTombTrial: 'ancientSwordTomb',
    demonRiftTrial: 'demonRift',
  };
  const missionId = targetMissions[objective.id];
  if (!missionId) {
    return null;
  }
  const status = getMissionStatus(state, missionId);
  const power = calculatePower(state);
  if (!status.unlocked || status.recommendedPower <= 0 || power >= status.recommendedPower || !['大凶', '有险'].includes(status.omen.name)) {
    return null;
  }
  return {
    title: `整备${status.map}`,
    detail: `当前道行 ${power} / ${status.recommendedPower}，先提升武器、法袍、剑修、剑阵，或回低阶秘境积累材料。`,
    tab: 'gear',
    action: 'prepareMission',
    targetId: missionId,
  };
}

export function isDailyUnlocked(state) {
  return getGoals(state).filter((goal) => goal.completed).length >= 3;
}

function isDailyTaskUnlocked(state, task) {
  return isDailyUnlocked(state) && (state.realmIndex ?? 0) >= (task.unlockRealmIndex ?? 0);
}

export function getDailyTasks(state, dateKey = getDateKey()) {
  const unlocked = isDailyUnlocked(state);
  const claims = state.dailyClaims?.[dateKey] ?? {};
  const progress = getDailyProgress(state, dateKey);
  return Object.values(DAILY_TASKS).map((task) => {
    const taskUnlocked = unlocked && (state.realmIndex ?? 0) >= (task.unlockRealmIndex ?? 0);
    return {
      ...task,
      unlocked: taskUnlocked,
      progress: Math.min(task.target, Math.floor(progress[task.progressKey] ?? 0)),
      completed: taskUnlocked && (progress[task.progressKey] ?? 0) >= task.target,
      claimed: Boolean(claims[task.id]),
    };
  });
}

export function claimDailyTask(state, taskId, dateKey = getDateKey(), now = Date.now()) {
  const task = DAILY_TASKS[taskId];
  if (!task) {
    return { ok: false, reason: 'unknownTask' };
  }
  if (!isDailyTaskUnlocked(state, task)) {
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

export function getMarketStock(state, dateKey = getDateKey()) {
  state.marketStock = normalizeMarketStock(state.marketStock, state, dateKey);
  if (!state.marketStock || state.marketStock.dateKey !== dateKey) {
    state.marketStock = createMarketStock(state, dateKey, state.marketRefreshes?.[dateKey] ?? 0);
  }
  const purchases = state.marketPurchases?.[dateKey] ?? {};
  return {
    dateKey,
    refreshIndex: state.marketStock.refreshIndex,
    refreshCost: getMarketRefreshCost(state, dateKey),
    items: state.marketStock.items.map((itemId) => {
      const item = MARKET_ITEMS[itemId];
      const bought = purchases[itemId] ?? 0;
      return {
        ...item,
        bought,
        remaining: Math.max(0, (item.limit ?? 1) - bought),
        soldOut: bought >= (item.limit ?? 1),
      };
    }).filter(Boolean),
  };
}

export function refreshMarketStock(state, dateOrNow = getDateKey(), now = Date.now()) {
  const dateKey = typeof dateOrNow === 'string' ? dateOrNow : getDateKey(dateOrNow);
  const actionTime = typeof dateOrNow === 'string' ? now : dateOrNow;
  const cost = getMarketRefreshCost(state, dateKey);
  if (!canAfford(state, cost)) {
    addLog(state, actionTime, `刷新坊市货架需要${formatReward(cost)}。`);
    return { ok: false, reason: 'notEnoughResources', cost };
  }
  payResources(state, cost);
  state.marketRefreshes ??= {};
  state.marketRefreshes[dateKey] = (state.marketRefreshes[dateKey] ?? 0) + 1;
  state.marketStock = createMarketStock(state, dateKey, state.marketRefreshes[dateKey]);
  addLog(state, actionTime, '坊市货架已换新。');
  return { ok: true, stock: getMarketStock(state, dateKey), cost };
}

export function buyMarketItem(state, itemId, dateOrNow = Date.now(), now = Date.now()) {
  const dateKey = typeof dateOrNow === 'string' ? dateOrNow : getDateKey(dateOrNow);
  const actionTime = typeof dateOrNow === 'string' ? now : dateOrNow;
  const item = MARKET_ITEMS[itemId];
  if (!item) {
    return { ok: false, reason: 'unknownItem' };
  }
  const stock = getMarketStock(state, dateKey);
  const stockItem = stock.items.find((candidate) => candidate.id === itemId);
  if (!stockItem) {
    addLog(state, actionTime, `${item.name}今日未上架。`);
    return { ok: false, reason: 'notInStock' };
  }
  if (stockItem.soldOut) {
    return { ok: false, reason: 'soldOut' };
  }
  if (!canAfford(state, item.cost)) {
    addLog(state, actionTime, `购买${item.name}需要${formatReward(item.cost)}。`);
    return { ok: false, reason: 'notEnoughResources' };
  }

  payResources(state, item.cost);
  applyResources(state, item.reward);
  addDailyProgress(state, 'marketBuys', 1, actionTime);
  state.marketPurchases[dateKey] ??= {};
  state.marketPurchases[dateKey][itemId] = (state.marketPurchases[dateKey][itemId] ?? 0) + 1;
  addLog(state, actionTime, `坊市购得${item.name}，获得${formatReward(item.reward)}。`);
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
    skills: Object.values(SECT_SKILLS).map((skill) => {
      const level = state.sectSkills?.[skill.id] ?? 0;
      const maxed = level >= skill.maxLevel;
      const nextLevel = level + 1;
      const requiredReputation = maxed ? null : skill.requiredReputation(nextLevel);
      const reputationLocked = !maxed && (state.sectReputation ?? 0) < requiredReputation;
      return {
        id: skill.id,
        name: skill.name,
        detail: skill.detail,
        level,
        maxLevel: skill.maxLevel,
        rarity: getRarityTierForLevel(level, 'spirit'),
        nextRarity: getNextRarityMilestone(level, skill.maxLevel, 'spirit'),
        effects: effectsFromBonusObject(scaleBonusObject(skill.bonuses, level)),
        nextEffects: maxed ? [] : effectsFromBonusObject(scaleBonusObject(skill.bonuses, nextLevel)),
        upgrade: {
          maxed,
          nextLevel,
          reputationLocked,
          requiredReputation,
          cost: maxed ? null : skill.cost(nextLevel),
        },
      };
    }),
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

  const repeat = getResolvedOpportunityChoiceCount(state, opportunity.id, choice.id) > 0;
  const reward = repeat && choice.repeatReward ? choice.repeatReward : choice.reward ?? {};
  applyResources(state, reward);
  state.activeOpportunity = null;
  addResolvedOpportunity(state, opportunity.id, choice.id);
  addLog(state, now, `机缘「${opportunity.name}」选择「${choice.title}」，${repeat ? '余韵已淡，' : ''}获得${formatReward(reward)}。`);
  return { ok: true, reward, repeat, opportunity, choice };
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
  const unlock = getSpiritBeastUnlockStatus(state, beast);
  if (!unlock.unlocked) {
    addLog(state, now, `${beast.name}尚未现踪：${unlock.hint}。`);
    return { ok: false, reason: 'locked', unlock };
  }
  const nextLevel = currentLevel + 1;
  const cost = beast.cost(nextLevel);
  if (!canAfford(state, cost)) {
    addLog(state, now, `培养${beast.name}需要${formatReward(cost)}。`);
    return { ok: false, reason: 'notEnoughResources' };
  }

  payResources(state, cost);
  state.spiritBeasts[beastId] = nextLevel;
  const previousActive = state.activeSpiritBeast;
  state.activeSpiritBeast = normalizeActiveSpiritBeast(state.activeSpiritBeast, state.spiritBeasts);
  const autoDeployed = !previousActive && state.activeSpiritBeast === beastId;
  addLog(state, now, `${beast.name}培养至 ${nextLevel} 级${autoDeployed ? '，并已随行出战' : ''}。`);
  return { ok: true, level: nextLevel, autoDeployed };
}

export function deploySpiritBeast(state, beastId, now = Date.now()) {
  if (!SPIRIT_BEASTS[beastId]) {
    return { ok: false, reason: 'unknownSpiritBeast' };
  }
  state.spiritBeasts = normalizeLevels(state.spiritBeasts, SPIRIT_BEASTS);
  if ((state.spiritBeasts[beastId] ?? 0) <= 0) {
    return { ok: false, reason: 'notOwned' };
  }
  state.activeSpiritBeast = beastId;
  addLog(state, now, `${SPIRIT_BEASTS[beastId].name}随行出战。`);
  return { ok: true, beast: SPIRIT_BEASTS[beastId], level: state.spiritBeasts[beastId] };
}

export function awakenBloodline(state, bloodlineId, now = Date.now()) {
  const bloodline = BLOODLINES[bloodlineId];
  if (!bloodline) {
    return { ok: false, reason: 'unknownBloodline' };
  }
  state.bloodlines = normalizeLevels(state.bloodlines, BLOODLINES);
  const currentLevel = state.bloodlines[bloodlineId] ?? 0;
  if (currentLevel >= bloodline.maxLevel) {
    return { ok: false, reason: 'maxLevel' };
  }
  const nextLevel = currentLevel + 1;
  const cost = bloodline.cost(nextLevel);
  if (!canAfford(state, cost)) {
    addLog(state, now, `淬醒${bloodline.name}需要${formatReward(cost)}。`);
    return { ok: false, reason: 'notEnoughResources', cost };
  }

  payResources(state, cost);
  state.bloodlines[bloodlineId] = nextLevel;
  addLog(state, now, `${bloodline.name}淬醒至 ${nextLevel} 重。`);
  return { ok: true, bloodline, level: nextLevel };
}

export function upgradeSectSkill(state, skillId, now = Date.now()) {
  const skill = SECT_SKILLS[skillId];
  if (!skill) {
    return { ok: false, reason: 'unknownSectSkill' };
  }
  if (!isSectUnlocked(state)) {
    return { ok: false, reason: 'locked' };
  }
  state.sectSkills = normalizeLevels(state.sectSkills, SECT_SKILLS);
  const currentLevel = state.sectSkills[skillId] ?? 0;
  if (currentLevel >= skill.maxLevel) {
    return { ok: false, reason: 'maxLevel' };
  }
  const nextLevel = currentLevel + 1;
  const requiredReputation = skill.requiredReputation(nextLevel);
  if ((state.sectReputation ?? 0) < requiredReputation) {
    return { ok: false, reason: 'reputationLocked', requiredReputation };
  }
  const cost = skill.cost(nextLevel);
  if (!canAfford(state, cost)) {
    addLog(state, now, `研修${skill.name}需要${formatReward(cost)}。`);
    return { ok: false, reason: 'notEnoughResources', cost };
  }

  payResources(state, cost);
  state.sectSkills[skillId] = nextLevel;
  addLog(state, now, `${skill.name}研修至 ${nextLevel} 重。`);
  return { ok: true, skill, level: nextLevel };
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
  state.herbCarry += ((state.buildings?.spiritField ?? 0) * BUILDINGS.spiritField.herbRatePerLevel + getSpiritBeastBonus(state, 'herbRate') + getBloodlineBonus(state, 'herbRate')) * seconds;
  state.insightCarry += ((state.buildings?.scriptureLibrary ?? 0) * BUILDINGS.scriptureLibrary.insightRatePerLevel) * seconds;

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

  const insightGained = Math.floor(state.insightCarry);
  if (insightGained > 0) {
    state.insight += insightGained;
    state.insightCarry = round(state.insightCarry - insightGained);
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
  const preparation = getBreakthroughPreparation(state, now);
  if (random() > chance) {
    state.qi = round(state.qi * preparation.qiRetention);
    if ((state.foundationStability ?? 0) > 0) {
      state.foundationStability = Math.max(0, state.foundationStability - 1);
    } else if (!preparation.demonGuard) {
      state.heartDemon = (state.heartDemon ?? 0) + 1;
    }
    state.tribulationRecords ??= [];
    state.tribulationRecords.unshift({ time: now, realmIndex: state.realmIndex, result: 'failed', readyScore: preparation.readyScore });
    state.tribulationRecords = state.tribulationRecords.slice(0, 8);
    addLog(state, now, '突破时心魔骤起，灵气逆行，修为折损。');
    return { ok: false, reason: 'failed', chance, preparation };
  }

  const carriedQi = calculateBreakthroughCarryQi(state, realm);
  state.realmIndex += 1;
  state.qi = Math.min(carriedQi, round(getCurrentRealm(state).requiredQi * 0.4));
  state.heartDemon = Math.max(0, (state.heartDemon ?? 0) - 1);
  state.insight = (state.insight ?? 0) + 1;
  state.foundationStability = 0;
  state.breakthroughBoostUntil = 0;
  state.breakthroughCount += 1;
  maybeOpenDaoHeartChoice(state, now);
  state.tribulationRecords ??= [];
  state.tribulationRecords.unshift({ time: now, realmIndex: state.realmIndex, result: 'success', readyScore: preparation.readyScore });
  state.tribulationRecords = state.tribulationRecords.slice(0, 8);
  addLog(state, now, `灵气贯通周天，突破至${getCurrentRealm(state).name}。`);
  return { ok: true, chance };
}

export function calculateBreakthroughCarryQi(state, realm = getCurrentRealm(state)) {
  const overflowQi = Math.max(0, (state.qi ?? 0) - realm.requiredQi);
  return round(overflowQi * 0.5);
}

function maybeOpenDaoHeartChoice(state, now) {
  state.claimedDaoHeartRealms ??= {};
  const realmIndex = DAO_HEART_REALM_INDICES.find((index) => (state.realmIndex ?? 0) >= index && !state.claimedDaoHeartRealms[String(index)]);
  if (realmIndex == null) {
    return;
  }
  state.pendingDaoHeartChoice = {
    realmIndex,
    choices: DAO_HEART_CHOICES,
    createdAt: now,
  };
}

export function startMapDepthTrial(state, mapId, now = Date.now()) {
  if (state.activeMission) {
    return { ok: false, reason: 'busy' };
  }
  const status = getMapDepthStatus(state, mapId);
  if (!status.exists) {
    return { ok: false, reason: 'unknownMap' };
  }
  if (!status.unlocked) {
    addLog(state, now, `${status.mapName}秘境尚未感应，境界不足。`);
    return { ok: false, reason: 'realmLocked' };
  }
  if (status.maxed) {
    return { ok: false, reason: 'maxLayer' };
  }

  const map = MISSION_MAPS[mapId];
  const layer = status.nextLayer;
  const battle = simulateDepthBattle(state, map, layer, now);
  addLog(state, now, `深入${status.mapName}秘境第 ${layer} 层。`);
  const result = settleMapDepthTrial(state, map, layer, battle, now);
  return { ok: true, status, battle, report: result.report, outcome: result.outcome };
}

export function setMissionApproach(state, mapId, approachId, now = Date.now()) {
  if (!MISSION_MAPS[mapId]) {
    return { ok: false, reason: 'unknownMap' };
  }
  if (!MISSION_APPROACHES[approachId]) {
    return { ok: false, reason: 'unknownApproach' };
  }
  state.missionApproaches ??= {};
  state.missionApproaches[mapId] = approachId;
  addLog(state, now, `${MISSION_MAPS[mapId].name}改走「${MISSION_APPROACHES[approachId].name}」路线。`);
  return { ok: true, mapId, approach: MISSION_APPROACHES[approachId] };
}

export function startMission(state, missionId, now = Date.now(), approachId = null) {
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

  const approach = getSelectedMissionApproach(state, mission, approachId);
  const duration = getMissionDuration(mission, approach.id);
  state.activeMission = {
    id: mission.id,
    approachId: approach.id,
    startedAt: now,
    endsAt: now + duration * 1000,
  };
  addLog(state, now, `外出执行「${mission.name}」，路线「${approach.name}」。`);
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
  if (nextLevel > getCaveUpgradeLimit(state)) {
    addLog(state, now, `${getCaveUpgradeTier(nextLevel).name}洞府需要更高境界。`);
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
  const chance = getRefineChance(state, currentQuality);
  if (random() > chance) {
    addLog(state, now, `淬炼${gear.name}火候不足，器火未进。`);
    return { ok: false, reason: 'failed', chance };
  }
  state.gearQuality[gearId] = currentQuality + 1;
  state.gearAffixes[gearId] ||= rollAffixForGear(gearId, random);
  const quality = GEAR_QUALITIES[state.gearQuality[gearId]];
  addLog(state, now, `${gear.name}淬炼至${quality.name}，获得词条「${GEAR_AFFIXES[state.gearAffixes[gearId]].name}」。`);
  return { ok: true, quality: state.gearQuality[gearId], affix: state.gearAffixes[gearId] };
}

export function getGearAffixRerollCost(state, gearId) {
  if (!GEAR[gearId]) {
    return null;
  }
  const qualityIndex = state.gearQuality?.[gearId] ?? 0;
  return {
    spiritStones: 120 + qualityIndex * 50,
    artifacts: 1,
    forgingEssence: 2 + qualityIndex,
  };
}

function getGearAffixRerollPreview(state, gearId) {
  const currentAffix = state.gearAffixes?.[gearId] ?? null;
  const candidates = (GEAR_AFFIX_POOLS[gearId] ?? [])
    .filter((affixId) => affixId !== currentAffix && GEAR_AFFIXES[affixId]);
  if (!currentAffix || !candidates.length) {
    return { candidates: [], warnings: [] };
  }

  const beforeSets = getGearSetStatus(state);
  const previewCandidates = candidates.map((affixId) => {
    const afterState = {
      ...state,
      gearAffixes: {
        ...(state.gearAffixes ?? {}),
        [gearId]: affixId,
      },
    };
    const setChanges = compareSetStatus(beforeSets, getGearSetStatus(afterState));
    return {
      affixId,
      affixName: GEAR_AFFIXES[affixId].name,
      effects: effectsFromBonusObject(GEAR_AFFIXES[affixId]),
      setChanges,
    };
  });
  const warnings = [...new Set(previewCandidates.flatMap((candidate) => candidate.setChanges
    .filter((change) => change.status === 'lost')
    .map((change) => `可能使${change.name}失效`)))];

  return { candidates: previewCandidates, warnings };
}

export function rerollGearAffix(state, gearId, now = Date.now(), random = Math.random) {
  const gear = GEAR[gearId];
  if (!gear) {
    return { ok: false, reason: 'unknownGear' };
  }
  if ((state.gear?.[gearId] ?? 0) <= 0) {
    return { ok: false, reason: 'notEquipped' };
  }
  const previousAffix = state.gearAffixes?.[gearId] ?? null;
  if (!previousAffix) {
    return { ok: false, reason: 'noAffix' };
  }
  const cost = getGearAffixRerollCost(state, gearId);
  if (!canAfford(state, cost)) {
    addLog(state, now, `洗练${gear.name}词条需要${formatReward(cost)}。`);
    return { ok: false, reason: 'notEnoughResources', cost };
  }

  const beforeImpact = getGearAffixImpactSnapshot(state, now);
  payResources(state, cost);
  state.gearAffixes[gearId] = rollAffixForGear(gearId, random, previousAffix);
  const impact = compareGearAffixImpact(beforeImpact, getGearAffixImpactSnapshot(state, now));
  addLog(state, now, `${gear.name}洗练出词条「${GEAR_AFFIXES[state.gearAffixes[gearId]].name}」。`);
  return { ok: true, previousAffix, affix: state.gearAffixes[gearId], cost, impact };
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
  } else if (recipeId === 'bodyTemperPill') {
    state.permanentBonuses ??= { qiRate: 0, power: 0 };
    state.permanentBonuses.power = round((state.permanentBonuses.power ?? 0) + 12);
    addLog(state, now, '服下一枚淬体丹，肉身道威沉入根骨。');
  } else if (recipeId === 'spiritRootPill') {
    state.permanentBonuses ??= { qiRate: 0, power: 0 };
    state.permanentBonuses.qiRate = round((state.permanentBonuses.qiRate ?? 0) + 0.01);
    addLog(state, now, '服下一枚培元丹，灵根吐纳更绵长。');
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
  if (active.type === 'mapDepth') {
    completeMapDepthTrial(state, active, now);
    return;
  }

  const mission = MISSIONS[active.id];
  state.activeMission = null;
  if (!mission) {
    return;
  }

  const approach = getSelectedMissionApproach(state, mission, active.approachId);
  const approachReward = getMissionApproachReward(mission, approach.id);
  const missionReward = mergeRewards(mission.reward, approachReward);
  const danger = getMissionDanger(state, mission, approach.id);
  if (danger && calculatePower(state) < danger) {
    const mapId = getMissionMapId(mission);
    const reputationGained = getFailureScoutingReputation(state, mission, danger);
    if (reputationGained > 0) {
      addMapReputation(state, mapId, reputationGained);
    }
    applyResources(state, mission.failurePenalty);
    state.injuryUntil = now + 90 * 1000;
    recordMissionReport(state, createMissionReport(state, mission, {
      outcome: 'failure',
      reward: mission.failurePenalty ?? {},
      approach,
      approachReward: {},
      specialDrop: null,
      reputationGained,
      eventResult: null,
      rareReward: null,
      now,
    }));
    addLog(state, now, `挑战「${mission.name}」失利，负伤退回洞府${reputationGained ? `，摸清少许地势` : ''}。`);
    stopAutoMissionAfterFailure(state, mission.id, now);
    return;
  }

  applyResources(state, missionReward);
  state.completedMissions[mission.id] = (state.completedMissions[mission.id] ?? 0) + 1;
  const mapId = getMissionMapId(mission);
  const approachCompletedCount = recordMapApproachCompletion(state, mapId, approach.id);
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
  const specialDrop = resolveMapSpecialDrop(state, mission, approach.id, approachCompletedCount, now);
  const mapLoot = resolveMapLootDrop(state, mission, eventResult, now);
  maybeCreateOpportunity(state, mission, now);
  addDailyProgress(state, 'missions', 1, now);
  recordMissionReport(state, createMissionReport(state, mission, {
    outcome: 'success',
    reward: missionReward,
    approach,
    approachReward,
    specialDrop,
    mapLoot,
    reputationGained,
    eventResult,
    rareReward,
    now,
  }));
  addLog(state, now, `完成「${mission.name}」，收获${formatReward(missionReward)}。`);
  restartAutoMission(state, mission.id, now);
}

function completeMapDepthTrial(state, active, now) {
  const map = MISSION_MAPS[active.mapId];
  state.activeMission = null;
  if (!map) {
    return;
  }
  const layer = clampInteger(active.layer ?? 1, 1, MAP_DEPTH_MAX_LAYER);
  const battle = normalizeBattle(active.battle) ?? simulateDepthBattle(state, map, layer, active.startedAt ?? now);
  settleMapDepthTrial(state, map, layer, battle, now);
}

function settleMapDepthTrial(state, map, layer, battle, now) {
  if (battle.outcome !== 'victory') {
    const penalty = {
      qi: -Math.max(25, Math.round(layer * 12 + (map.unlockRealmIndex ?? 0) * 6)),
      heartDemon: layer >= 8 ? 1 : 0,
    };
    applyResources(state, penalty);
    state.injuryUntil = now + 120 * 1000;
    recordMissionReport(state, createDepthReport(state, map, layer, {
      outcome: 'failure',
      reward: penalty,
      reputationGained: 0,
      battle,
      now,
    }));
    addLog(state, now, `${map.name}秘境第 ${layer} 层折返，劫象反噬。`);
    return { outcome: 'failure', battle, report: state.lastMissionReport, reward: penalty };
  }

  const reward = getDepthReward(map, layer);
  const reputationGained = Math.ceil((map.reputationPerMission ?? 4) * 0.8 + layer / 3);
  applyResources(state, reward);
  state.mapDepths ??= {};
  state.mapDepths[map.id] = Math.max(state.mapDepths[map.id] ?? 0, layer);
  addMapReputation(state, map.id, reputationGained);
  addDailyProgress(state, 'missions', 1, now);
  recordMissionReport(state, createDepthReport(state, map, layer, {
    outcome: 'success',
    reward,
    reputationGained,
    battle,
    now,
  }));
  addDailyProgress(state, 'depthTrials', 1, now);
  addLog(state, now, `打通${map.name}秘境第 ${layer} 层，获得${formatReward(reward)}。`);
  return { outcome: 'success', battle, report: state.lastMissionReport, reward };
}

function createDepthReport(state, map, layer, { outcome, reward, reputationGained = 0, battle = null, now = Date.now() }) {
  const rewardText = formatReward(reward);
  return {
    id: `depth-${map.id}-${layer}-${now}`,
    missionId: `depth:${map.id}`,
    missionName: `${map.name}秘境第 ${layer} 层`,
    mapId: map.id,
    mapName: map.name,
    outcome,
    reward: reward ?? {},
    rewardText,
    rareReward: null,
    rareRewardText: '',
    reputationGained,
    completedCount: state.mapDepths?.[map.id] ?? 0,
    event: null,
    mapProgress: getReportMapProgress(state, map.id),
    battle,
    summary: outcome === 'success'
      ? `打通${map.name}秘境第 ${layer} 层，${battle?.summary ?? ''} 收获${rewardText}。`
      : `${map.name}秘境第 ${layer} 层折返，${battle?.summary ?? '劫象反噬'}${rewardText ? `：${rewardText}` : '。'}`,
    time: now,
  };
}

function createBossReport(state, map, { outcome, reward, battle = null, now = Date.now() }) {
  const rewardText = formatReward(reward);
  return {
    id: `boss-${map.id}-${now}`,
    missionId: `boss:${map.id}`,
    missionName: map.boss.name,
    mapId: map.id,
    mapName: map.name,
    outcome,
    reward: reward ?? {},
    rewardText,
    rareReward: null,
    rareRewardText: '',
    reputationGained: outcome === 'success' ? map.boss.reputation ?? 0 : 0,
    completedCount: state.defeatedBosses?.[map.id] ? 1 : 0,
    event: null,
    mapProgress: getReportMapProgress(state, map.id),
    battle,
    summary: outcome === 'success'
      ? `镇压${map.boss.name}，${battle?.summary ?? ''} 获得${rewardText}。`
      : `挑战${map.boss.name}失利，${battle?.summary ?? '需继续整备'}${rewardText ? `：${rewardText}` : '。'}`,
    time: now,
  };
}

function recordMissionReport(state, report) {
  state.lastMissionReport = report;
  state.missionReportHistory = [report, ...(state.missionReportHistory ?? []).filter((item) => item?.id !== report.id)].slice(0, 5);
  return report;
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

export function getMissionApproachOptions(state, mapId) {
  const selected = getSelectedMapApproach(state, mapId);
  const specialDrops = MAP_SPECIAL_DROPS[mapId] ?? {};
  return Object.values(MISSION_APPROACHES).map((approach) => ({
    ...approach,
    selected: approach.id === selected.id,
    specialDrop: getMapSpecialDropTemplate(mapId, approach.id),
    specialDropCount: state.mapSpecialDrops?.[mapId]?.[approach.id] ?? 0,
    dropProgress: getApproachDropProgress(state, mapId, approach.id),
    comparison: getApproachComparison(state, mapId, approach.id),
    locked: approach.id !== 'balanced' && !specialDrops[approach.id],
  }));
}

function getMissionFailurePreview(state, mission, danger = getMissionDanger(state, mission)) {
  const penalty = { ...(mission.failurePenalty ?? {}) };
  return {
    penalty,
    penaltyText: formatReward(penalty),
    injurySeconds: danger > 0 ? 90 : 0,
    autoStops: danger > 0,
    scoutingReputation: getFailureScoutingReputation(state, mission, danger),
  };
}

function getApproachComparison(state, mapId, approachId) {
  const selected = getSelectedMapApproach(state, mapId);
  const approach = MISSION_APPROACHES[approachId] ?? MISSION_APPROACHES.balanced;
  const selectedDuration = selected.durationMultiplier ?? 1;
  const selectedDanger = selected.dangerMultiplier ?? 1;
  return {
    durationDeltaPct: Math.round(((approach.durationMultiplier ?? 1) / selectedDuration - 1) * 100),
    dangerDeltaPct: Math.round(((approach.dangerMultiplier ?? 1) / selectedDanger - 1) * 100),
  };
}

function getApproachDropProgress(state, mapId, approachId) {
  const template = getMapSpecialDropTemplate(mapId, approachId);
  const approach = MISSION_APPROACHES[approachId] ?? MISSION_APPROACHES.balanced;
  const every = template?.every ?? approach.dropEvery ?? 0;
  if (!template || every <= 0) {
    return null;
  }
  const completed = state.mapApproachCompletions?.[mapId]?.[approachId] ?? 0;
  const current = completed % every;
  const nextIn = current === 0 ? every : every - current;
  return {
    completed,
    current,
    target: every,
    nextIn,
    label: `${current} / ${every}`,
  };
}

function getSelectedMissionApproach(state, mission, explicitApproachId = null) {
  return getSelectedMapApproach(state, getMissionMapId(mission), explicitApproachId);
}

function getSelectedMapApproach(state, mapId, explicitApproachId = null) {
  const approachId = explicitApproachId || state.missionApproaches?.[mapId] || 'balanced';
  return MISSION_APPROACHES[approachId] ?? MISSION_APPROACHES.balanced;
}

function getMissionDuration(mission, approachId = 'balanced') {
  const approach = MISSION_APPROACHES[approachId] ?? MISSION_APPROACHES.balanced;
  return Math.max(10, Math.round(mission.duration * (approach.durationMultiplier ?? 1)));
}

function getMissionApproachReward(mission, approachId = 'balanced') {
  const approach = MISSION_APPROACHES[approachId] ?? MISSION_APPROACHES.balanced;
  return mergeRewards(approach.flatReward ?? {}, Object.fromEntries(
    Object.entries(approach.rewardBonus ?? {}).map(([resource, multiplier]) => {
      const base = mission.reward?.[resource] ?? 0;
      if (resource === 'insight') {
        return [resource, base > 0 ? Math.max(1, Math.ceil(base * multiplier)) : 0];
      }
      return [resource, base > 0 ? Math.max(1, Math.ceil(base * multiplier)) : 0];
    }),
  ));
}

function mergeRewards(baseReward = {}, bonusReward = {}) {
  const merged = { ...baseReward };
  Object.entries(bonusReward).forEach(([resource, amount]) => {
    merged[resource] = round((merged[resource] ?? 0) + amount);
  });
  return filterCost(merged);
}

function getMapSpecialDropTemplate(mapId, approachId) {
  return MAP_SPECIAL_DROPS[mapId]?.[approachId] ?? null;
}

function resolveMapSpecialDrop(state, mission, approachId, completedCount, now) {
  const mapId = getMissionMapId(mission);
  const template = getMapSpecialDropTemplate(mapId, approachId);
  const approach = MISSION_APPROACHES[approachId] ?? MISSION_APPROACHES.balanced;
  const every = template?.every ?? approach.dropEvery ?? 0;
  if (!template || every <= 0 || completedCount <= 0 || completedCount % every !== 0) {
    return null;
  }
  applyResources(state, template.reward ?? {});
  state.mapSpecialDrops ??= {};
  state.mapSpecialDrops[mapId] ??= {};
  state.mapSpecialDrops[mapId][approachId] = (state.mapSpecialDrops[mapId][approachId] ?? 0) + 1;
  const drop = { name: template.name, reward: template.reward ?? {}, approachId };
  addLog(state, now, `${MISSION_MAPS[mapId]?.name ?? mission.name}路线收获「${template.name}」：${formatReward(template.reward ?? {})}。`);
  return drop;
}

function getFailureScoutingReputation(state, mission, danger) {
  const map = MISSION_MAPS[getMissionMapId(mission)];
  if (!map || !danger) {
    return 0;
  }
  const ratio = calculatePower(state) / danger;
  if (ratio < 0.72) {
    return 0;
  }
  return Math.max(1, Math.floor((map.reputationPerMission ?? 4) * 0.4));
}

function recordMapApproachCompletion(state, mapId, approachId) {
  state.mapApproachCompletions ??= {};
  state.mapApproachCompletions[mapId] ??= {};
  state.mapApproachCompletions[mapId][approachId] = (state.mapApproachCompletions[mapId][approachId] ?? 0) + 1;
  return state.mapApproachCompletions[mapId][approachId];
}

function createMissionReport(state, mission, { outcome, reward, approach = getSelectedMissionApproach(state, mission), approachReward = {}, specialDrop = null, reputationGained = 0, eventResult = null, rareReward = null, now = Date.now() }) {
  const mapId = getMissionMapId(mission);
  const map = MISSION_MAPS[mapId];
  const rewardText = formatReward(reward);
  const approachRewardText = formatReward(approachReward);
  const specialDropText = specialDrop ? formatReward(specialDrop.reward ?? {}) : '';
  const rareRewardText = rareReward ? formatReward(rareReward) : '';
  const mapProgress = getReportMapProgress(state, mapId);
  const challenge = getMissionChallengeSnapshot(state, mission, approach);
  const event = eventResult?.event ? {
    id: eventResult.event.id,
    name: eventResult.event.name,
    reward: eventResult.event.reward ?? {},
    rewardText: formatReward(eventResult.event.reward ?? {}),
    equipmentName: eventResult.item?.name ?? null,
  } : null;
  const summary = outcome === 'success'
    ? `完成「${mission.name}」，收获${rewardText || '少许历练'}${event?.equipmentName ? `，并得${event.equipmentName}` : ''}。`
    : `「${mission.name}」失利，劫象反噬${rewardText ? `：${rewardText}` : ''}${reputationGained ? `，摸清少许地势，声望 +${reputationGained}。` : '。'}`;

  return {
    id: `${mission.id}-${now}`,
    missionId: mission.id,
    missionName: mission.name,
    mapId,
    mapName: map?.name ?? mission.map ?? mission.name,
    outcome,
    approach: approach ? { id: approach.id, name: approach.name } : null,
    reward: reward ?? {},
    rewardText,
    approachReward: approachReward ?? {},
    approachRewardText,
    specialDrop,
    specialDropText,
    rareReward: rareReward ?? null,
    rareRewardText,
    reputationGained,
    mapProgress,
    challenge,
    completedCount: state.completedMissions?.[mission.id] ?? 0,
    event,
    summary,
    time: now,
  };
}

function getMissionChallengeSnapshot(state, mission, approach) {
  const required = getMissionDanger(state, mission, approach?.id);
  if (!required) {
    return null;
  }
  const power = calculatePower(state);
  return {
    power,
    required,
    gap: power - required,
    label: power >= required ? `${power} / ${required}` : `${power} / ${required} · 差 ${Math.ceil(required - power)}`,
  };
}

function getReportMapProgress(state, mapId) {
  const exploration = getMapExplorationInfo(state, mapId);
  const mastery = getMapMastery(state, mapId);
  const nextReputationGap = mastery.nextReputation == null ? 0 : Math.max(0, mastery.nextReputation - mastery.reputation);
  return {
    explorationLabel: exploration.label,
    remainingToBoss: Math.max(0, exploration.target - exploration.completed),
    masteryName: mastery.name,
    nextReputationGap,
    label: nextReputationGap > 0
      ? `${exploration.label} · ${mastery.name}，距下阶 ${nextReputationGap}`
      : `${exploration.label} · ${mastery.name}`,
  };
}

function getMissionDanger(state, mission, approachId = null) {
  const approach = getSelectedMissionApproach(state, mission, approachId);
  const pressure = getMissionPressure(state, mission);
  const approachPressure = round(pressure * (approach.dangerMultiplier ?? 1));
  if (approachPressure <= 0) {
    return 0;
  }
  const mitigation = getGearLevelBonus(state, 'dangerReductionPerLevel') + getGearAffixBonus(state, 'dangerReduction') + getGearSetBonus(state, 'dangerReduction') + getEquippedLootBonus(state, 'dangerReduction') + getMapMasteryBonus(state, 'dangerReduction') + getTreasureBonus(state, 'dangerReduction') + getSpiritBeastBonus(state, 'dangerReduction') + getBloodlineBonus(state, 'dangerReduction') + getSectSkillBonus(state, 'dangerReduction') + getDaoHeartBonus(state, 'dangerReduction') + (state.buildings?.swordArray ?? 0) * BUILDINGS.swordArray.dangerReductionPerLevel + (state.cultivationPaths?.sword ?? 0) * CULTIVATION_PATHS.sword.dangerReductionPerLevel;
  const residualPressure = Math.round(approachPressure * MISSION_RESIDUAL_DANGER_RATIO);
  return Math.max(residualPressure, approachPressure - mitigation);
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
  const stageMultiplier = 1.08 + Math.max(0, unlockStage - 3) * 0.045;
  const rareEvery = Math.max(2, mission.rareEvery ?? 4);
  const completed = state.completedMissions?.[mission.id] ?? 0;
  const deepeningMultiplier = Math.min(0.28, Math.floor(completed / rareEvery) * 0.04);
  return round(baseDanger * (stageMultiplier + deepeningMultiplier));
}

function addLog(state, time, text) {
  state.log.unshift({ time, text });
  state.log = state.log.slice(0, 20);
}

function normalizeMission(mission) {
  if (!mission) {
    return null;
  }
  if (mission.type === 'mapDepth') {
    const mapId = mission.mapId;
    if (!MISSION_MAPS[mapId]) {
      return null;
    }
    const layer = clampInteger(mission.layer ?? 1, 1, MAP_DEPTH_MAX_LAYER);
    return {
      type: 'mapDepth',
      id: `depth:${mapId}:${layer}`,
      mapId,
      layer,
      startedAt: Number(mission.startedAt) || Date.now(),
      endsAt: Number(mission.endsAt) || Date.now(),
      battle: normalizeBattle(mission.battle),
    };
  }
  if (!MISSIONS[mission.id]) {
    return null;
  }
  return {
    id: mission.id,
    approachId: MISSION_APPROACHES[mission.approachId] ? mission.approachId : null,
    startedAt: Number(mission.startedAt) || Date.now(),
    endsAt: Number(mission.endsAt) || Date.now(),
  };
}

function ensureActiveDepthBattle(state, now = Date.now()) {
  const active = state.activeMission;
  if (active?.type !== 'mapDepth') {
    return;
  }
  const map = MISSION_MAPS[active.mapId];
  if (!map) {
    state.activeMission = null;
    return;
  }
  const layer = clampInteger(active.layer ?? 1, 1, MAP_DEPTH_MAX_LAYER);
  const battle = normalizeBattle(active.battle)
    ?? simulateDepthBattle(state, map, layer, Number(active.startedAt) || now);
  state.activeMission = null;
  settleMapDepthTrial(state, map, layer, battle, now);
}

function normalizeBattle(battle) {
  if (!battle || typeof battle !== 'object' || !Array.isArray(battle.rounds)) {
    return null;
  }
  const rounds = battle.rounds
    .filter((round) => round && typeof round === 'object')
    .map((round) => ({
      round: Math.max(1, Math.floor(Number(round.round) || 1)),
      actor: ['enemy', 'beast'].includes(round.actor) ? round.actor : 'player',
      actorName: String(round.actorName || ''),
      targetName: String(round.targetName || ''),
      damage: Math.max(0, Math.round(Number(round.damage) || 0)),
      critical: Boolean(round.critical),
      skillName: typeof round.skillName === 'string' ? round.skillName : null,
      element: normalizeBattleElement(round.element),
      targetElement: normalizeBattleElement(round.targetElement),
      elementModifier: Number.isFinite(Number(round.elementModifier)) ? Number(round.elementModifier) : 1,
      defenseMitigation: Number.isFinite(Number(round.defenseMitigation)) ? Number(round.defenseMitigation) : 0,
      mitigated: Math.max(0, Math.round(Number(round.mitigated) || 0)),
      rawDamage: Math.max(0, round(Number(round.rawDamage) || Number(round.damage) || 0)),
      effectiveDefense: Math.max(0, round(Number(round.effectiveDefense) || 0)),
      elementText: String(round.elementText || ''),
      targetHp: Math.max(0, Math.round(Number(round.targetHp) || 0)),
      targetMaxHp: Math.max(1, Math.round(Number(round.targetMaxHp) || Number(round.targetHp) || 1)),
    }));
  if (!rounds.length) {
    return null;
  }
  return {
    type: battle.type === 'boss' ? 'boss' : 'depth',
    outcome: battle.outcome === 'victory' ? 'victory' : 'defeat',
    player: normalizeBattleCombatant(battle.player, '修士'),
    pet: battle.pet ? normalizeBattleCombatant(battle.pet, '灵兽') : null,
    enemy: normalizeBattleCombatant(battle.enemy, '劫影'),
    rounds,
    diagnosis: battle.diagnosis && typeof battle.diagnosis === 'object' ? { ...battle.diagnosis } : null,
    summary: typeof battle.summary === 'string' ? battle.summary : '',
  };
}

function normalizeBattleCombatant(combatant, fallbackName) {
  return {
    name: String(combatant?.name || fallbackName),
    element: normalizeBattleElement(combatant?.element),
    maxHp: Math.max(1, Math.round(Number(combatant?.maxHp) || Number(combatant?.vitality) || 1)),
    hp: Math.max(0, Math.round(Number(combatant?.hp) || 0)),
    skillName: typeof combatant?.skillName === 'string' ? combatant.skillName : null,
    tribulation: combatant?.tribulation && typeof combatant.tribulation === 'object' ? { ...combatant.tribulation } : null,
  };
}

function normalizeBattleElement(element) {
  if (element?.id && COMBAT_ELEMENTS[element.id]) {
    return COMBAT_ELEMENTS[element.id];
  }
  return element && typeof element === 'object' ? { ...element } : COMBAT_ELEMENTS.earth;
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

function normalizeActiveSpiritBeast(activeId, levels) {
  if (activeId && SPIRIT_BEASTS[activeId] && (levels?.[activeId] ?? 0) > 0) {
    return activeId;
  }
  return Object.keys(SPIRIT_BEASTS).find((id) => (levels?.[id] ?? 0) > 0) ?? null;
}

function normalizeDaoHeartClaims(claims) {
  if (!claims || typeof claims !== 'object') {
    return {};
  }
  return Object.fromEntries(
    Object.entries(claims).filter(([realmIndex, heartId]) => DAO_HEART_REALM_INDICES.includes(Number(realmIndex)) && DAO_HEARTS[heartId]),
  );
}

function normalizePendingDaoHeartChoice(choice, state) {
  if (!choice || typeof choice !== 'object') {
    return null;
  }
  const realmIndex = clampInteger(choice.realmIndex ?? -1, -1, REALMS.length - 1);
  if (!DAO_HEART_REALM_INDICES.includes(realmIndex) || state.claimedDaoHeartRealms?.[String(realmIndex)]) {
    return null;
  }
  const choices = Array.isArray(choice.choices)
    ? choice.choices.filter((id) => DAO_HEARTS[id])
    : DAO_HEART_CHOICES;
  return {
    realmIndex,
    choices: choices.length ? [...new Set(choices)] : DAO_HEART_CHOICES,
    createdAt: Number(choice.createdAt) || Date.now(),
  };
}

function normalizeTribulationRecords(records) {
  if (!Array.isArray(records)) {
    return [];
  }
  return records
    .map((record) => ({
      time: Number(record?.time) || Date.now(),
      realmIndex: clampInteger(record?.realmIndex ?? 0, 0, REALMS.length - 1),
      result: record?.result === 'success' ? 'success' : 'failed',
      readyScore: Math.max(0, Math.min(1, Number(record?.readyScore) || 0)),
    }))
    .slice(0, 8);
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

function normalizeMapDepths(values) {
  if (!values || typeof values !== 'object') {
    return {};
  }
  return Object.fromEntries(
    Object.keys(MISSION_MAPS).map((id) => [id, clampInteger(values[id] ?? 0, 0, MAP_DEPTH_MAX_LAYER)]),
  );
}

function normalizeMissionApproaches(values) {
  if (!values || typeof values !== 'object') {
    return {};
  }
  return Object.fromEntries(
    Object.entries(values).filter(([mapId, approachId]) => MISSION_MAPS[mapId] && MISSION_APPROACHES[approachId]),
  );
}

function normalizeMapApproachCompletions(values) {
  if (!values || typeof values !== 'object') {
    return {};
  }
  const normalized = {};
  Object.entries(values).forEach(([mapId, approaches]) => {
    if (!MISSION_MAPS[mapId] || !approaches || typeof approaches !== 'object') {
      return;
    }
    const valid = Object.fromEntries(
      Object.entries(approaches)
        .filter(([approachId]) => MISSION_APPROACHES[approachId])
        .map(([approachId, count]) => [approachId, Math.max(0, Math.floor(Number(count) || 0))]),
    );
    if (Object.keys(valid).length) {
      normalized[mapId] = valid;
    }
  });
  return normalized;
}

function normalizeMapSpecialDrops(values) {
  if (!values || typeof values !== 'object') {
    return {};
  }
  const normalized = {};
  Object.entries(values).forEach(([mapId, drops]) => {
    if (!MISSION_MAPS[mapId] || !drops || typeof drops !== 'object') {
      return;
    }
    const valid = Object.fromEntries(
      Object.entries(drops)
        .filter(([approachId]) => MISSION_APPROACHES[approachId])
        .map(([approachId, count]) => [approachId, Math.max(0, Math.floor(Number(count) || 0))]),
    );
    if (Object.keys(valid).length) {
      normalized[mapId] = valid;
    }
  });
  return normalized;
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
      return createLootItem(template.id, item.uid || `${template.id}-${index + 1}`, 0, item.variant);
    })
    .filter(Boolean)
    .slice(0, 40);
}

function inheritLootLevelsToGear(gearLevels, items) {
  const normalized = normalizeLevels(gearLevels, GEAR);
  if (!Array.isArray(items)) {
    return normalized;
  }
  items.forEach((item) => {
    const template = LOOT_EQUIPMENT[item?.templateId] ?? LOOT_EQUIPMENT[item?.id];
    const slot = template?.slot;
    if (!slot || !GEAR[slot]) {
      return;
    }
    const legacyLevel = clampInteger(item?.level ?? 0, 0, GEAR[slot].maxLevel);
    normalized[slot] = Math.max(normalized[slot] ?? 0, legacyLevel);
  });
  return normalized;
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
    forgingEssence: Math.max(0, Number(carry?.forgingEssence) || 0),
    bloodEssence: Math.max(0, Number(carry?.bloodEssence) || 0),
    reputation: Math.max(0, Number(carry?.reputation) || 0),
  };
}

function normalizeEquippedLoot(equippedLoot, lootEquipment) {
  const slots = Object.fromEntries(Object.keys(GEAR).map((slot) => [slot, null]));
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
    approach: report.approach && MISSION_APPROACHES[report.approach.id] ? { id: report.approach.id, name: MISSION_APPROACHES[report.approach.id].name } : null,
    reward,
    rewardText: formatReward(reward),
    approachReward: report.approachReward && typeof report.approachReward === 'object' ? { ...report.approachReward } : {},
    approachRewardText: formatReward(report.approachReward ?? {}),
    specialDrop: report.specialDrop?.name ? { name: report.specialDrop.name, reward: report.specialDrop.reward ?? {}, approachId: report.specialDrop.approachId ?? null } : null,
    specialDropText: report.specialDrop?.reward ? formatReward(report.specialDrop.reward) : '',
    rareReward,
    rareRewardText: rareReward ? formatReward(rareReward) : '',
    reputationGained: Math.max(0, Number(report.reputationGained) || 0),
      completedCount: Math.max(0, Number(report.completedCount) || 0),
      event,
      battle: normalizeBattle(report.battle),
      summary: typeof report.summary === 'string' && report.summary ? report.summary : `${mission.name}结算已记录。`,
      time: Number(report.time) || Date.now(),
    };
  }

function normalizeMissionReportHistory(history, lastReport = null) {
  const reports = Array.isArray(history) ? history.map((report) => normalizeMissionReport(report)).filter(Boolean) : [];
  const merged = lastReport ? [lastReport, ...reports] : reports;
  const seen = new Set();
  return merged.filter((report) => {
    if (seen.has(report.id)) {
      return false;
    }
    seen.add(report.id);
    return true;
  }).slice(0, 5);
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
      .map(([id, value]) => {
        if (value && typeof value === 'object') {
          const choices = Object.fromEntries(
            Object.entries(value.choices ?? {})
              .filter(([choiceId]) => OPPORTUNITIES[id].choices.some((choice) => choice.id === choiceId))
              .map(([choiceId, count]) => [choiceId, Math.max(0, Math.floor(Number(count) || 0))]),
          );
          const total = Math.max(
            Math.floor(Number(value.total) || 0),
            Object.values(choices).reduce((sum, count) => sum + count, 0),
          );
          return [id, { total, choices }];
        }
        const total = Math.max(0, Math.floor(Number(value) || 0));
        return [id, { total, choices: {} }];
      }),
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
    return objectiveId.toLowerCase().includes('realm') ? 'overview' : 'missions';
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

function getGuidanceTargetForObjective(objectiveId) {
  const targets = {
    firstPatrol: 'cavePatrol',
    realmTwo: 'breakthrough',
    spiritField: 'spiritField',
    firstPill: 'gatherQiPill',
    foundationRealm: 'breakthrough',
    firstPath: 'sword',
    firstArmament: 'weapon',
    swordTombTrial: 'ancientSwordTomb',
    goldenCoreRealm: 'breakthrough',
    refinedGear: 'weapon',
    pathThree: 'sword',
    demonRiftTrial: 'demonRift',
    goldenCoreCompletion: 'breakthrough',
    demonBoss: 'demonRift',
    empoweredLoot: 'loot',
    sectReputation: 'sect',
    nascentSoulRealm: 'breakthrough',
    ancientRuinsBoss: 'ancientRuins',
  };
  return targets[objectiveId] ?? objectiveId;
}

function restartAutoMission(state, completedMissionId, now) {
  const missionId = state.autoMissionId;
  if (!missionId || missionId !== completedMissionId || !MISSIONS[missionId]) {
    return;
  }

  const mission = MISSIONS[missionId];
  const approach = getSelectedMissionApproach(state, mission);
  state.activeMission = {
    id: mission.id,
    approachId: approach.id,
    startedAt: now,
    endsAt: now + getMissionDuration(mission, approach.id) * 1000,
  };
  addLog(state, now, `自动继续「${mission.name}」，路线「${approach.name}」。`);
}

function stopAutoMissionAfterFailure(state, failedMissionId, now) {
  if (state.autoMissionId !== failedMissionId) {
    return false;
  }
  const mission = MISSIONS[failedMissionId];
  state.autoMissionId = null;
  addLog(state, now, `自动历练已停：${mission.name}劫象过重，需提升道行后再行游。`);
  return true;
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

function normalizeMarketRefreshes(refreshes) {
  if (!refreshes || typeof refreshes !== 'object') {
    return {};
  }
  return Object.fromEntries(
    Object.entries(refreshes).map(([dateKey, count]) => [dateKey, Math.max(0, Math.floor(Number(count) || 0))]),
  );
}

function getMarketShelfSize(state, poolLength) {
  const realmIndex = state.realmIndex ?? 0;
  return Math.min(poolLength, realmIndex >= 18 ? 10 : realmIndex >= 9 ? 9 : 8);
}

function normalizeMarketStock(stock, state, fallbackDateKey = getDateKey()) {
  if (!stock || typeof stock !== 'object' || !Array.isArray(stock.items)) {
    return createMarketStock(state, fallbackDateKey, state.marketRefreshes?.[fallbackDateKey] ?? 0);
  }
  const dateKey = typeof stock.dateKey === 'string' ? stock.dateKey : fallbackDateKey;
  const refreshIndex = Math.max(0, Math.floor(Number(stock.refreshIndex) || 0));
  const validItems = stock.items.filter((itemId) => MARKET_ITEMS[itemId] && (state.realmIndex ?? 0) >= (MARKET_ITEMS[itemId].unlockRealmIndex ?? 0));
  if (!validItems.length) {
    return createMarketStock(state, dateKey, refreshIndex);
  }
  const availableCount = Object.values(MARKET_ITEMS)
    .filter((item) => (state.realmIndex ?? 0) >= (item.unlockRealmIndex ?? 0))
    .length;
  const shelfSize = getMarketShelfSize(state, availableCount);
  const replenishedItems = validItems.length >= shelfSize
    ? validItems
    : [...validItems, ...createMarketStock(state, dateKey, refreshIndex).items];
  return {
    dateKey,
    refreshIndex,
    items: [...new Set(replenishedItems)].slice(0, shelfSize),
  };
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
        depthTrials: Math.max(0, Number(value.depthTrials) || 0),
      }]),
  );
}

function getDailyProgress(state, dateKey) {
  state.dailyProgress[dateKey] ??= { cultivationSeconds: 0, missions: 0, marketBuys: 0, depthTrials: 0 };
  return state.dailyProgress[dateKey];
}

function addDailyProgress(state, key, amount, now = Date.now()) {
  const progress = getDailyProgress(state, getDateKey(now));
  progress[key] = (progress[key] ?? 0) + amount;
}

function getAlchemyDuration(state, recipe) {
  const furnaceLevel = state.buildings?.alchemyFurnace ?? 0;
  const pathLevel = state.cultivationPaths?.alchemy ?? 0;
  const speedMultiplier = Math.max(0.35, 1 - furnaceLevel * BUILDINGS.alchemyFurnace.speedBonusPerLevel - pathLevel * CULTIVATION_PATHS.alchemy.alchemySpeedPerLevel - getDaoHeartBonus(state, 'alchemySpeed'));
  return Math.max(10, Math.round(recipe.duration * speedMultiplier));
}

function createMarketStock(state, dateKey, refreshIndex = 0) {
  const realmIndex = state.realmIndex ?? 0;
  const pool = Object.values(MARKET_ITEMS)
    .filter((item) => realmIndex >= (item.unlockRealmIndex ?? 0));
  const guaranteed = ['herbBundle', 'beastCoreShard', 'gatherQiBottle', 'spiritSword', 'spiritDust', 'arrayManual']
    .filter((itemId) => pool.some((item) => item.id === itemId));
  const rotating = pool
    .filter((item) => !guaranteed.includes(item.id))
    .sort((a, b) => hashString(`${dateKey}:${refreshIndex}:${realmIndex}:${a.id}`) - hashString(`${dateKey}:${refreshIndex}:${realmIndex}:${b.id}`))
    .map((item) => item.id);
  const shiftedGuaranteed = guaranteed
    .map((itemId, index) => ({ itemId, rank: hashString(`${dateKey}:${refreshIndex}:base:${index}:${itemId}`) }))
    .sort((a, b) => a.rank - b.rank)
    .map((entry) => entry.itemId);
  const shelfSize = getMarketShelfSize(state, pool.length);
  return {
    dateKey,
    refreshIndex,
    items: [...shiftedGuaranteed, ...rotating].slice(0, shelfSize),
  };
}

function getMarketRefreshCost(state, dateKey = getDateKey()) {
  const refreshCount = state.marketRefreshes?.[dateKey] ?? 0;
  return {
    spiritStones: Math.round(35 + refreshCount * 45 + (state.realmIndex ?? 0) * 4),
  };
}

function canAfford(state, cost) {
  return Object.entries(cost).every(([resource, amount]) => getResourceAmount(state, resource) >= amount);
}

function collectResourceNeeds(state) {
  const needs = {};
  const addCost = (label, cost, weight = 1) => {
    if (!cost || !Object.keys(cost).length || canAfford(state, cost)) {
      return;
    }
    Object.entries(cost).forEach(([resource, amount]) => {
      const guide = RESOURCE_GUIDES[resource];
      if (!guide || amount <= 0) {
        return;
      }
      const shortfall = Math.max(0, amount - getResourceAmount(state, resource));
      if (shortfall <= 0) {
        return;
      }
      needs[resource] ??= {
        resource,
        label: guide.label,
        shortfall: 0,
        maxShortfall: 0,
        score: 0,
        demandLabels: new Set(),
      };
      needs[resource].shortfall += shortfall;
      needs[resource].maxShortfall = Math.max(needs[resource].maxShortfall, shortfall);
      needs[resource].score += shortfall * weight * guide.priority;
      needs[resource].demandLabels.add(label);
    });
  };

  Object.values(BUILDINGS).forEach((building) => {
    const level = state.buildings?.[building.id] ?? 0;
    const nextLevel = level + 1;
    if (nextLevel <= building.maxLevel && nextLevel <= getCaveUpgradeLimit(state)) {
      addCost(`洞府·${building.name}`, building.cost(nextLevel), building.id === 'meditationSeat' || building.id === 'swordArray' ? 1.15 : 1);
    }
  });

  Object.values(GEAR).forEach((gear) => {
    const level = state.gear?.[gear.id] ?? 0;
    const nextLevel = level + 1;
    if (nextLevel <= gear.maxLevel && nextLevel <= getRealmUpgradeLimit(state)) {
      addCost(`装备·${gear.name}`, gear.cost(nextLevel), 1.25);
    }
  });

  Object.values(FORMATIONS).forEach((formation) => {
    const level = state.formations?.[formation.id] ?? 0;
    const nextLevel = level + 1;
    if (nextLevel <= formation.maxLevel && nextLevel <= getRealmUpgradeLimit(state)) {
      addCost(`阵法·${formation.name}`, formation.cost(nextLevel), 1.2);
    }
  });

  Object.values(CULTIVATION_PATHS).forEach((path) => {
    const level = state.cultivationPaths?.[path.id] ?? 0;
    const nextLevel = level + 1;
    if (nextLevel <= path.maxLevel && nextLevel <= getRealmUpgradeLimit(state)) {
      addCost(`功法·${path.name}`, path.cost(nextLevel), 1.05);
    }
  });

  Object.values(GEAR).forEach((gearItem) => {
    const level = state.gear?.[gearItem.id] ?? 0;
    if (level < gearItem.maxLevel && level + 1 <= getRealmUpgradeLimit(state)) {
      addCost(`器位·${gearItem.name}`, getLootEmpowerCost(level + 1), 1.35);
    }
  });

  Object.values(TREASURES).forEach((treasure) => {
    const level = state.treasures?.[treasure.id] ?? 0;
    if (level < treasure.maxLevel) {
      addCost(`法宝·${treasure.name}`, treasure.cost(level + 1), 0.95);
    }
  });

  Object.values(SPIRIT_BEASTS).forEach((beast) => {
    const level = state.spiritBeasts?.[beast.id] ?? 0;
    if (level < beast.maxLevel && getSpiritBeastUnlockStatus(state, beast).unlocked) {
      addCost(`灵兽·${beast.name}`, beast.cost(level + 1), 0.9);
    }
  });

  if (!state.activeAlchemy) {
    const recipe = Object.values(PILL_RECIPES).find((candidate) => (state.buildings?.alchemyFurnace ?? 0) >= candidate.unlockLevel);
    if (recipe) {
      addCost(`丹房·${recipe.name}`, recipe.cost, 0.75);
    }
  }

  const realm = getCurrentRealm(state);
  const qiShortfall = Math.max(0, realm.requiredQi - (state.qi ?? 0));
  if (qiShortfall > Math.max(120, calculateQiRate(state) * 30)) {
    const qiWeight = Object.keys(needs).length ? 0.05 : RESOURCE_GUIDES.qi.priority;
    needs.qi ??= {
      resource: 'qi',
      label: RESOURCE_GUIDES.qi.label,
      shortfall: 0,
      maxShortfall: 0,
      score: 0,
      demandLabels: new Set(),
    };
    needs.qi.shortfall += qiShortfall;
    needs.qi.maxShortfall = Math.max(needs.qi.maxShortfall, qiShortfall);
    needs.qi.score += Math.sqrt(qiShortfall) * qiWeight;
    needs.qi.demandLabels.add(`破境·${realm.name}`);
  }

  return needs;
}

function hydrateResourceNeed(state, need) {
  const guide = RESOURCE_GUIDES[need.resource];
  const demandLabels = [...need.demandLabels].slice(0, 3);
  return {
    resource: need.resource,
    label: guide.label,
    shortfall: Math.ceil(need.maxShortfall || need.shortfall),
    score: round(need.score),
    detail: guide.detail,
    demandLabels,
    demandText: `${demandLabels.join('、')}需要${guide.label}`,
    route: getResourceRoute(state, need.resource),
    commission: getResourceCommission(state, guide.commissionId),
    market: getResourceMarketItem(state, guide.marketItemId),
  };
}

function getResourceRoute(state, resource) {
  const guide = RESOURCE_GUIDES[resource] ?? RESOURCE_GUIDES.spiritStones;
  const mapId = guide.mapIds.find((candidate) => (state.realmIndex ?? 0) >= (MISSION_MAPS[candidate]?.unlockRealmIndex ?? 0)) ?? guide.mapIds[guide.mapIds.length - 1] ?? 'qinglanMountain';
  const map = MISSION_MAPS[mapId] ?? MISSION_MAPS.qinglanMountain;
  const mission = getResourceMission(mapId, guide.missionId);
  const approach = MISSION_APPROACHES[guide.approachId] ?? MISSION_APPROACHES.balanced;
  const unlocked = (state.realmIndex ?? 0) >= (map.unlockRealmIndex ?? 0);
  const unlockRealm = REALMS[map.unlockRealmIndex]?.name ?? '更高境界';
  const readiness = getResourceMapReadiness(state, map.id);
  const stable = isResourceRouteStable(readiness);
  const fallback = stable ? null : getResourceFallbackRoute(state, guide, map.id, approach);
  return {
    mapId: map.id,
    mapName: map.name,
    missionId: mission?.id ?? null,
    missionName: mission?.name ?? map.name,
    approachId: approach.id,
    approachName: approach.name,
    readinessName: readiness.name,
    readinessDetail: readiness.detail,
    stable,
    fallback,
    unlocked,
    unlockRealmName: unlockRealm,
    detail: unlocked ? `去${map.name}走「${approach.name}」路线` : `${unlockRealm}后可去${map.name}走「${approach.name}」路线`,
  };
}

function getResourceMapReadiness(state, mapId) {
  const map = MISSION_MAPS[mapId] ?? MISSION_MAPS.qinglanMountain;
  const routes = Object.values(MISSIONS).filter((mission) => getMissionMapId(mission) === map.id);
  return getMapReadiness(state, map, routes);
}

function isResourceRouteStable(readiness) {
  return ['安稳', '地熟', '可行'].includes(readiness?.name);
}

function getResourceFallbackRoute(state, guide, currentMapId, approach) {
  const fallbackMapId = guide.mapIds.find((candidate) => {
    if (candidate === currentMapId) {
      return false;
    }
    const map = MISSION_MAPS[candidate];
    if (!map || (state.realmIndex ?? 0) < (map.unlockRealmIndex ?? 0)) {
      return false;
    }
    return isResourceRouteStable(getResourceMapReadiness(state, candidate));
  });
  if (!fallbackMapId) {
    return null;
  }
  const fallbackMap = MISSION_MAPS[fallbackMapId];
  const fallbackMission = getResourceMission(fallbackMapId, guide.missionId);
  const fallbackReadiness = getResourceMapReadiness(state, fallbackMapId);
  return {
    mapId: fallbackMap.id,
    mapName: fallbackMap.name,
    missionId: fallbackMission?.id ?? null,
    missionName: fallbackMission?.name ?? fallbackMap.name,
    approachId: approach.id,
    approachName: approach.name,
    readinessName: fallbackReadiness.name,
  };
}

function getResourceMission(mapId, preferredMissionId) {
  if (preferredMissionId && MISSIONS[preferredMissionId] && getMissionMapId(MISSIONS[preferredMissionId]) === mapId) {
    return MISSIONS[preferredMissionId];
  }
  return Object.values(MISSIONS).find((mission) => getMissionMapId(mission) === mapId) ?? null;
}

function getResourceCommission(state, commissionId) {
  const commission = commissionId ? SECT_COMMISSIONS[commissionId] : null;
  if (!commission) {
    return null;
  }
  return {
    id: commission.id,
    name: commission.name,
    detail: commission.detail,
    unlocked: isSectUnlocked(state),
  };
}

function getResourceMarketItem(state, marketItemId) {
  const item = marketItemId ? MARKET_ITEMS[marketItemId] : null;
  if (!item) {
    return null;
  }
  return {
    id: item.id,
    name: item.name,
    unlocked: (state.realmIndex ?? 0) >= (item.unlockRealmIndex ?? 0),
    unlockRealmName: REALMS[item.unlockRealmIndex]?.name ?? '更高境界',
  };
}

function getRefineCost(nextQuality) {
  return {
    spiritStones: scaleCost(50, nextQuality),
    artifacts: nextQuality,
  };
}

function getRefineChance(state, qualityIndex) {
  const baseChance = GEAR_QUALITIES[qualityIndex]?.refineChance ?? 0;
  const forgeBonus = Math.min(0.12, (state.buildings?.forgingHall ?? 0) * BUILDINGS.forgingHall.refineChancePerLevel);
  return round(Math.min(0.95, baseChance + forgeBonus));
}

function getDefaultAffixForGear(gearId) {
  const defaults = {
    weapon: 'swordIntent',
    offhand: 'starWheel',
    amulet: 'spiritVein',
    robe: 'cloudStep',
    jade: 'jadeRoot',
    boots: 'cloudTrace',
  };
  return defaults[gearId] ?? null;
}

function rollAffixForGear(gearId, random = Math.random, excludeAffix = null) {
  const fullPool = GEAR_AFFIX_POOLS[gearId] ?? [getDefaultAffixForGear(gearId)].filter(Boolean);
  const pool = fullPool.filter((affixId) => affixId !== excludeAffix);
  const candidates = pool.length ? pool : fullPool;
  if (!candidates.length) {
    return null;
  }
  const index = Math.min(candidates.length - 1, Math.floor(random() * candidates.length));
  return candidates[index] ?? getDefaultAffixForGear(gearId);
}

function getGearAffixBonus(state, key) {
  return Object.values(state.gearAffixes ?? {}).reduce((total, affixId) => total + (GEAR_AFFIXES[affixId]?.[key] ?? 0), 0);
}

function getGearSetBonus(state, key) {
  return getGearSetStatus(state).reduce((total, set) => {
    return total + (set.bonuses?.[key] ?? 0);
  }, 0);
}

function getGearAffixSources(state, key, mode = 'flat') {
  return Object.entries(state.gearAffixes ?? {})
    .filter(([gearId, affixId]) => (state.gear?.[gearId] ?? 0) > 0 && GEAR_AFFIXES[affixId]?.[key])
    .map(([, affixId]) => ({
      label: `灵纹·${GEAR_AFFIXES[affixId].name}`,
      value: GEAR_AFFIXES[affixId][key],
      mode,
    }));
}

function getGearSetSources(state, key, mode = 'flat') {
  return getGearSetStatus(state)
    .filter((set) => set.bonuses?.[key])
    .map((set) => ({
      label: `同调·${set.name}`,
      value: set.bonuses[key],
      mode,
    }));
}

function getEquippedLootSources(state, key, mode = 'flat') {
  return Object.values(state.equippedLoot ?? {})
    .map((uid) => state.lootEquipment?.find((item) => item.uid === uid))
    .filter((item) => item?.bonuses?.[key])
    .map((item) => ({
      label: `战利·${item.name}`,
      value: item.bonuses[key],
      mode,
    }));
}

function getLootResonanceBonus(state, key) {
  const resonance = getLootResonanceStatus(state);
  return resonance.active ? resonance.bonuses?.[key] ?? 0 : 0;
}

function getLootResonanceSources(state, key, mode = 'flat') {
  const value = getLootResonanceBonus(state, key);
  if (!value) {
    return [];
  }
  return [{ label: '战利共鸣', value, mode }];
}

function createCombatStat(label, sources, mode = 'flat') {
  return {
    label,
    value: round(sources.reduce((total, source) => total + source.value, 0)),
    mode,
    sources,
  };
}

function getCombatElementScores(state) {
  const scores = Object.fromEntries(Object.values(COMBAT_ELEMENTS).map((element) => [element.id, { value: 0, sources: [] }]));
  const add = (elementId, value, label) => {
    const element = COMBAT_ELEMENTS[elementId];
    if (!element || value <= 0) {
      return;
    }
    scores[element.id].value += value;
    scores[element.id].sources.push({ label: `${label}·${element.name}`, value });
  };

  Object.entries(state.gearAffixes ?? {}).forEach(([gearId, affixId]) => {
    if ((state.gear?.[gearId] ?? 0) <= 0) {
      return;
    }
    const affix = GEAR_AFFIXES[affixId];
    add(affix?.element, affix?.elementPower ?? 0, `灵纹${affix?.name ?? ''}`);
  });

  getGearSetStatus(state).forEach((set) => {
    if (set.active) {
      const elementId = set.affixes.map((affix) => GEAR_AFFIXES[affix.id]?.element).find((id) => id && COMBAT_ELEMENTS[id]);
      add(elementId, set.bonuses?.elementPower ?? 0, `同调${set.name}`);
    }
  });

  Object.values(state.equippedLoot ?? {}).forEach((uid) => {
    const item = state.lootEquipment?.find((candidate) => candidate.uid === uid);
    const template = LOOT_EQUIPMENT[item?.templateId];
    add(item?.element ?? template?.element, item?.bonuses?.elementPower ?? 0, `战利${item?.name ?? ''}`);
  });

  const resonance = getLootResonanceStatus(state);
  if (resonance.active) {
    add(resonance.element?.id, resonance.bonuses.elementPower ?? 0, '战利共鸣');
  }

  const activeBeast = getActiveSpiritBeast(state);
  if (activeBeast) {
    const level = state.spiritBeasts?.[activeBeast.id] ?? 0;
    add(activeBeast.combat?.element, (activeBeast.combat?.attack ?? 0) * level * 0.3, `出战${activeBeast.name}`);
  }

  return scores;
}

function getDominantCombatElement(scores) {
  const [elementId] = Object.entries(scores)
    .sort((a, b) => b[1].value - a[1].value || Object.keys(COMBAT_ELEMENTS).indexOf(a[0]) - Object.keys(COMBAT_ELEMENTS).indexOf(b[0]))[0] ?? ['metal'];
  return COMBAT_ELEMENTS[elementId] ?? COMBAT_ELEMENTS.metal;
}

function getPlayerCombatant(state) {
  const profile = getCombatProfile(state);
  return {
    name: '修士',
    element: profile.element,
    attack: Math.max(1, profile.attack.value),
    defense: Math.max(0, profile.defense.value),
    vitality: Math.max(1, profile.vitality.value),
    speed: Math.max(1, profile.speed.value),
    critChance: Math.min(0.5, Math.max(0, profile.critChance.value)),
    pierce: Math.max(0, profile.pierce.value),
  };
}

function getSpiritBeastCombatant(state) {
  const beast = getActiveSpiritBeast(state);
  if (!beast) {
    return null;
  }
  const level = state.spiritBeasts?.[beast.id] ?? 0;
  const growthMultiplier = getSpiritBeastGrowthMultiplier(beast);
  const combat = beast.combat ?? {};
  return {
    name: beast.name,
    element: COMBAT_ELEMENTS[combat.element] ?? COMBAT_ELEMENTS.wood,
    attack: Math.max(1, Math.round((combat.attack ?? 16) * level * growthMultiplier)),
    defense: Math.max(0, Math.round((combat.defense ?? 4) * level * growthMultiplier)),
    vitality: Math.max(1, Math.round((combat.vitality ?? 40) + level * 18 * growthMultiplier)),
    speed: Math.max(1, Math.round((combat.speed ?? 10) + level * growthMultiplier)),
    critChance: Math.min(0.42, Math.max(0, (combat.critChance ?? 0.04) + level * 0.006 * growthMultiplier)),
    pierce: Math.max(0, Math.round((combat.pierce ?? 2) * level * growthMultiplier)),
    skill: beast.skill ? { ...beast.skill } : null,
    skillName: beast.skill?.name ?? null,
  };
}

function getBossPressureScale(state, map) {
  const clearedDepth = clampInteger(state.mapDepths?.[map.id] ?? 0, 0, MAP_DEPTH_MAX_LAYER);
  const masteryLevel = getMapMastery(state, map.id).level;
  const depthScale = Math.min(0.5, clearedDepth * 0.045);
  const masteryScale = Math.min(0.16, masteryLevel * 0.04);
  return round(1 + depthScale + masteryScale);
}

function getBossCombatPower(state, map) {
  return Math.round((map.boss.power ?? 120) * getBossPressureScale(state, map));
}

function getBossCombatant(state, map) {
  const power = map.boss.power ?? 120;
  const unlock = map.unlockRealmIndex ?? 0;
  const scale = getBossPressureScale(state, map);
  const attackFactor = 0.46 + Math.min(0.16, unlock * 0.005);
  const defenseFactor = 0.2 + Math.min(0.1, unlock * 0.003);
  const vitalityFactor = 1.25 + Math.min(0.9, unlock * 0.05);
  return {
    name: map.boss.name,
    element: COMBAT_ELEMENTS[map.boss.element] ?? COMBAT_ELEMENTS.earth,
    attack: Math.round((power * attackFactor + unlock * 2) * scale),
    defense: Math.round((power * defenseFactor + unlock) * scale),
    vitality: Math.round((power * vitalityFactor + unlock * 14) * scale),
    speed: 10 + Math.floor(unlock / 3),
    critChance: Math.min(0.18, 0.04 + unlock * 0.003),
    pierce: Math.round(unlock * 1.4 * scale),
  };
}

function getDepthCombatant(map, layer, danger) {
  const tribulation = getDepthTribulation(map, layer);
  const elementId = tribulation.element ?? map.boss?.element ?? 'earth';
  const intensity = tribulation.intensity ?? 1;
  const attack = Math.round((danger * 0.42 + layer * 3) * (tribulation.attackMultiplier ?? 1) * (1 + (intensity - 1) * 0.04));
  const defense = Math.round((danger * 0.18 + layer * 2) * (tribulation.defenseMultiplier ?? 1) * (1 + (intensity - 1) * 0.035));
  const vitality = Math.round((danger * 1.05 + layer * 24) * (tribulation.vitalityMultiplier ?? 1) * (1 + (intensity - 1) * 0.04));
  return {
    name: `${tribulation.name}·${map.name}第 ${layer} 层劫影`,
    element: COMBAT_ELEMENTS[elementId] ?? COMBAT_ELEMENTS.earth,
    attack,
    defense,
    vitality,
    speed: 9 + Math.floor(layer / 5) + (tribulation.speedBonus ?? 0),
    critChance: Math.min(0.24, 0.035 + layer * 0.002 + (tribulation.critBonus ?? 0)),
    pierce: Math.round(layer * 1.5 + (tribulation.pierceBonus ?? 0) * intensity),
    tribulation,
  };
}

function simulateDepthBattle(state, map, layer, now = Date.now(), random = null) {
  const danger = getDepthDanger(state, map, layer);
  return runTurnBattle(getPlayerCombatant(state), getDepthCombatant(map, layer, danger), {
    type: 'depth',
    now,
    random,
    beast: getSpiritBeastCombatant(state),
  });
}

function runTurnBattle(player, enemy, { type = 'boss', now = Date.now(), random = null, beast = null } = {}) {
  let playerHp = player.vitality;
  let enemyHp = enemy.vitality;
  const rounds = [];
  const maxRounds = type === 'depth' ? 8 : 10;
  for (let round = 1; round <= maxRounds; round += 1) {
    const playerHit = resolveCombatHit(player, enemy, round, true, now, random);
    enemyHp = Math.max(0, enemyHp - playerHit.damage);
    rounds.push(createBattleRound(round, 'player', player, enemy, playerHit, enemyHp));
      if (enemyHp <= 0) {
        break;
      }

      if (beast) {
        const skill = getBeastSkillForRound(beast, round);
        const beastHit = resolveCombatHit(beast, enemy, round, true, now, random, skill);
        enemyHp = Math.max(0, enemyHp - beastHit.damage);
        rounds.push(createBattleRound(round, 'beast', beast, enemy, beastHit, enemyHp, skill?.name ?? null));
        if (enemyHp <= 0) {
          break;
        }
    }

    const enemyHit = resolveCombatHit(enemy, player, round, false, now, random);
    playerHp = Math.max(0, playerHp - enemyHit.damage);
    rounds.push(createBattleRound(round, 'enemy', enemy, player, enemyHit, playerHp));
    if (playerHp <= 0) {
      break;
    }
  }
  const outcome = enemyHp <= 0 ? 'victory' : 'defeat';
  const diagnosis = createBattleDiagnosis(player, enemy, rounds, playerHp, enemyHp, outcome);
  return {
    type,
    outcome,
    player: {
      name: player.name,
      element: player.element,
      maxHp: player.vitality,
      hp: playerHp,
    },
      pet: beast ? {
        name: beast.name,
        element: beast.element,
        maxHp: beast.vitality,
        hp: beast.vitality,
        skillName: beast.skill?.name ?? null,
      } : null,
      enemy: {
        name: enemy.name,
        element: enemy.element,
        maxHp: enemy.vitality,
        hp: enemyHp,
        tribulation: enemy.tribulation ?? null,
      },
    rounds,
    diagnosis,
    summary: outcome === 'victory'
      ? `${rounds.at(-1)?.round ?? 0} 回合压住${enemy.name}。`
      : `${rounds.at(-1)?.round ?? 0} 回合后退守，${enemy.name}仍有余势。`,
  };
}

function createBattleDiagnosis(player, enemy, rounds, playerHp, enemyHp, outcome) {
  const playerRounds = rounds.filter((round) => round.actor === 'player' || round.actor === 'beast');
  const enemyRounds = rounds.filter((round) => round.actor === 'enemy');
  const playerDamage = playerRounds.reduce((total, round) => total + round.damage, 0);
  const enemyDamage = enemyRounds.reduce((total, round) => total + round.damage, 0);
  const playerModifier = playerRounds[0]?.elementModifier ?? getElementModifier(player.element, enemy.element);
  const enemyModifier = enemyRounds[0]?.elementModifier ?? getElementModifier(enemy.element, player.element);
  const enemyRemainingHp = Math.max(0, enemyHp);
  const playerRemainingHp = Math.max(0, playerHp);
  const elementText = formatElementInteraction(player.element, enemy.element, playerModifier);

  if (outcome === 'victory') {
    return null;
  }

  let title = '锋芒不足';
  let advice = '锋芒尚未破开劫影，可先温养杀伐气机，待阵势相随后再入局。';
  if (playerModifier < 1) {
    title = '灵根受制';
    advice = '灵根被劫象牵制，宜先调整器纹与随行气机，避开此地锋芒。';
  } else if (playerHp <= 0 && enemyDamage >= player.vitality * 0.85) {
    title = '护体不足';
    advice = '护身气机被冲散，宜先稳住衣符与山门阵势，少与劫影硬撼。';
  } else if (playerHp <= 0 && enemyHp <= enemy.vitality * 0.28) {
    title = '血元不足';
    advice = '只差收束一口气，宜先养血元与道心，让随行护持补上余势。';
  }
  advice = `${advice} 若仍觉差一线，先整备随行、丹息与阵势，再试探一层。`;

  return {
    outcome,
    title,
    detail: `${elementText}，敌方仍余 ${enemyRemainingHp} 血元，我方累计造成 ${playerDamage} 伤害。`,
    advice,
    playerDamage,
    enemyDamage,
    playerRemainingHp,
    enemyRemainingHp,
    playerElementModifier: playerModifier,
    enemyElementModifier: enemyModifier,
    elementText,
  };
}

function getBeastSkillForRound(beast, round) {
  const skill = beast?.skill;
  const cadence = Math.max(1, Math.floor(skill?.cadence ?? 0));
  return skill && cadence > 0 && round % cadence === 0 ? skill : null;
}

function resolveCombatHit(attacker, defender, round, isPlayer, now, random, technique = null) {
  const elementModifier = getElementModifier(attacker.element, defender.element);
  const roll = typeof random === 'function'
    ? random()
    : seededCombatRoll(now, round, isPlayer ? 13 : 71);
  const critical = roll < Math.min(0.75, attacker.critChance + (technique?.critBonus ?? 0));
  const techniqueMultiplier = technique?.multiplier ?? 1;
  const critMultiplier = critical ? 1.45 : 1;
  const variance = 0.94 + roll * 0.12;
  const effectiveDefense = Math.max(0, defender.defense - attacker.pierce * 0.65);
  const defenseMitigation = clampNumber(effectiveDefense / (effectiveDefense + attacker.attack * 1.65 + 30), 0, 0.72);
  const raw = attacker.attack * techniqueMultiplier * elementModifier * critMultiplier * variance + attacker.pierce * 0.35;
  const damage = Math.max(1, Math.round(raw * (1 - defenseMitigation)));
  return {
    damage,
    rawDamage: Math.round(raw * 100) / 100,
    mitigated: Math.max(0, Math.round(raw - damage)),
    defenseMitigation: Math.round(defenseMitigation * 100) / 100,
    effectiveDefense: Math.round(effectiveDefense * 100) / 100,
    critical,
    elementModifier,
  };
}

function createBattleRound(round, actor, attacker, defender, hit, targetHp, skillName = null) {
  return {
    round,
    actor,
    actorName: attacker.name,
    targetName: defender.name,
    damage: hit.damage,
    critical: hit.critical,
    skillName,
    element: attacker.element,
    targetElement: defender.element,
    elementModifier: hit.elementModifier,
    defenseMitigation: hit.defenseMitigation,
    mitigated: hit.mitigated,
    rawDamage: hit.rawDamage,
    effectiveDefense: hit.effectiveDefense,
    elementText: formatElementInteraction(attacker.element, defender.element, hit.elementModifier),
    targetHp,
    targetMaxHp: defender.maxHp ?? defender.vitality,
  };
}

function seededCombatRoll(now, round, salt) {
  const seed = Math.abs(Math.floor(now / 1000) + round * 97 + salt * 17);
  return ((seed * 9301 + 49297) % 233280) / 233280;
}

function getElementModifier(attacker, defender) {
  if (!attacker || !defender) {
    return 1;
  }
  if (attacker.restrains === defender.id) {
    return 1.16;
  }
  if (defender.restrains === attacker.id) {
    return 0.9;
  }
  return 1;
}

function formatElementInteraction(attacker, defender, modifier) {
  if (modifier > 1) {
    return `${attacker.name}克${defender.name}`;
  }
  if (modifier < 1) {
    return `${attacker.name}受${defender.name}所制`;
  }
  return `${attacker.name}平势`;
}

function getGearAffixImpactSnapshot(state, now) {
  return {
    power: calculatePower(state),
    qiRate: calculateQiRate(state, now),
    breakthroughChance: calculateBreakthroughChance(state, now),
    sets: getGearSetStatus(state),
  };
}

function compareGearAffixImpact(before, after) {
  return {
    previousPower: before.power,
    currentPower: after.power,
    powerDelta: round(after.power - before.power),
    previousQiRate: before.qiRate,
    currentQiRate: after.qiRate,
    qiRateDelta: round(after.qiRate - before.qiRate),
    previousBreakthroughChance: before.breakthroughChance,
    currentBreakthroughChance: after.breakthroughChance,
    breakthroughChanceDelta: round(after.breakthroughChance - before.breakthroughChance),
    setChanges: compareSetStatus(before.sets, after.sets),
  };
}

function compareSetStatus(beforeSets, afterSets) {
  return beforeSets
    .map((beforeSet) => {
      const afterSet = afterSets.find((set) => set.id === beforeSet.id);
      if (!afterSet || (beforeSet.matched === afterSet.matched && beforeSet.active === afterSet.active)) {
        return null;
      }
      let status = afterSet.matched > beforeSet.matched ? 'progress' : 'weakened';
      if (!beforeSet.active && afterSet.active) {
        status = 'gained';
      } else if (beforeSet.active && !afterSet.active) {
        status = 'lost';
      }
      return {
        id: beforeSet.id,
        name: beforeSet.name,
        beforeMatched: beforeSet.matched,
        afterMatched: afterSet.matched,
        total: beforeSet.total,
        beforeActive: beforeSet.active,
        afterActive: afterSet.active,
        status,
      };
    })
    .filter(Boolean);
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
  }, 0) + (item?.quality ?? 0) * 4;
}

function getLootDismantleMultiplier(state, item) {
  const forgeMultiplier = 1 + (state.buildings?.forgingHall ?? 0) * BUILDINGS.forgingHall.dismantleBonusPerLevel;
  const sectMultiplier = 1 + getSectSkillBonus(state, 'dismantleBonus');
  return forgeMultiplier * sectMultiplier * (getLootRarity(item).dismantleMultiplier ?? 1);
}

function formatEffectDelta(effect) {
  const sign = effect.value > 0 ? '+' : '';
  if (effect.mode === 'percent') {
    return `${effect.label} ${sign}${Math.round(effect.value * 100)}%`;
  }
  return `${effect.label} ${sign}${effect.value}`;
}

function getRarityTier(rarityId = 'common') {
  return RARITY_TIERS.find((tier) => tier.id === rarityId) ?? RARITY_TIERS[0];
}

function getRarityIndex(rarityId = 'common') {
  return Math.max(0, RARITY_TIERS.findIndex((tier) => tier.id === rarityId));
}

function getHigherRarityId(leftId = 'common', rightId = 'common') {
  return getRarityIndex(leftId) >= getRarityIndex(rightId) ? leftId : rightId;
}

function getGearQualityRarityId(qualityIndex = 0) {
  return ['common', 'spirit', 'mystic', 'earthFiend', 'heavenWork', 'dao'][qualityIndex] ?? 'common';
}

function getGrowthRarityId(level = 0, baseRarityId = 'common') {
  const safeLevel = Math.max(0, Math.floor(Number(level) || 0));
  let growthId = 'common';
  if (safeLevel >= 10) {
    growthId = 'heavenWork';
  } else if (safeLevel >= 7) {
    growthId = 'earthFiend';
  } else if (safeLevel >= 4) {
    growthId = 'mystic';
  } else if (safeLevel >= 1) {
    growthId = 'spirit';
  }
  return getHigherRarityId(baseRarityId, growthId);
}

function getNextRarityMilestone(level = 0, maxLevel = 0, baseRarityId = 'common') {
  const currentIndex = getRarityIndex(getGrowthRarityId(level, baseRarityId));
  return [1, 4, 7, 10]
    .filter((threshold) => threshold > level && threshold <= maxLevel)
    .map((threshold) => ({ level: threshold, ...getRarityTierForLevel(threshold, baseRarityId) }))
    .find((candidate) => getRarityIndex(candidate.id) > currentIndex) ?? null;
}

function getTreasureBonus(state, key) {
  return Object.entries(state.treasures ?? {}).reduce((total, [treasureId, level]) => {
    const treasure = TREASURES[treasureId];
    return total + (treasure?.bonuses?.[key] ?? 0) * (level ?? 0);
  }, 0);
}

function getActiveSpiritBeast(state) {
  const activeId = normalizeActiveSpiritBeast(state.activeSpiritBeast, state.spiritBeasts);
  return activeId ? SPIRIT_BEASTS[activeId] : null;
}

function getSpiritBeastBonus(state, key) {
  return Object.entries(state.spiritBeasts ?? {}).reduce((total, [beastId, level]) => {
    const beast = SPIRIT_BEASTS[beastId];
    return total + (beast?.bonuses?.[key] ?? 0) * (level ?? 0) * getSpiritBeastGrowthMultiplier(beast);
  }, 0);
}

function getBloodlineBonus(state, key) {
  return Object.entries(state.bloodlines ?? {}).reduce((total, [bloodlineId, level]) => {
    const bloodline = BLOODLINES[bloodlineId];
    return total + (bloodline?.bonuses?.[key] ?? 0) * (level ?? 0);
  }, 0);
}

function getBloodlineSources(state, key, mode = 'flat') {
  return Object.entries(state.bloodlines ?? {})
    .map(([bloodlineId, level]) => {
      const bloodline = BLOODLINES[bloodlineId];
      const value = (bloodline?.bonuses?.[key] ?? 0) * (level ?? 0);
      return value ? { label: bloodline.name, value, mode } : null;
    })
    .filter(Boolean);
}

function getSectSkillBonus(state, key) {
  return Object.entries(state.sectSkills ?? {}).reduce((total, [skillId, level]) => {
    const skill = SECT_SKILLS[skillId];
    return total + (skill?.bonuses?.[key] ?? 0) * (level ?? 0);
  }, 0);
}

function getSectSkillSources(state, key, mode = 'flat') {
  return Object.entries(state.sectSkills ?? {})
    .map(([skillId, level]) => {
      const skill = SECT_SKILLS[skillId];
      const value = (skill?.bonuses?.[key] ?? 0) * (level ?? 0);
      return value ? { label: skill.name, value, mode } : null;
    })
    .filter(Boolean);
}

function getDeployedSpiritBeastBonus(state, key) {
  const beast = getActiveSpiritBeast(state);
  if (!beast) {
    return 0;
  }
  const level = state.spiritBeasts?.[beast.id] ?? 0;
  return (beast.deployedBonuses?.[key] ?? 0) * level * getSpiritBeastGrowthMultiplier(beast);
}

function getDeployedSpiritBeastSources(state, key, mode = 'flat') {
  const value = getDeployedSpiritBeastBonus(state, key);
  return value ? [{ label: '出战灵兽', value, mode }] : [];
}

function getLootRarity(item) {
  return getRarityTier(item?.variant?.rarityId ?? item?.variant?.gradeId ?? getGearQualityRarityId(item?.quality ?? 0));
}

function getDaoHeartBonus(state, key) {
  return Object.entries(state.daoHearts ?? {}).reduce((total, [heartId, level]) => {
    const heart = DAO_HEARTS[heartId];
    return total + (heart?.bonuses?.[key] ?? 0) * (level ?? 0);
  }, 0);
}

function getFormationEffects(formation, level) {
  const effects = [];
  if (formation.qiBonusPerLevel) {
    effects.push({ id: 'qiBonus', label: '灵息', value: getTieredLevelValue(level, formation.qiBonusPerLevel), mode: 'percent' });
  }
  if (formation.stabilityPerLevel) {
    effects.push({ id: 'breakthrough', label: '破境天机', value: getTieredLevelValue(level, formation.stabilityPerLevel), mode: 'percent' });
  }
  if (formation.powerPerLevel) {
    effects.push({ id: 'power', label: '道威', value: getTieredLevelValue(level, formation.powerPerLevel), mode: 'flat' });
  }
  return effects.filter((effect) => effect.value !== 0);
}

function getFormationDetail(id) {
  return {
    spiritGathering: '聚拢洞府灵机，提升长期吐纳。',
    mountainGuard: '稳住山门气机，叩关时护持根基。',
    swordArray: '铺开护山剑势，提升斗法道威。',
  }[id] ?? '阵图运转后会改变长期修行气象。';
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
  if (item.attackPerLevel) {
    effects.push({ id: 'attack', label: '锋芒', value: getTieredLevelValue(level, item.attackPerLevel), mode: 'flat' });
  }
  if (item.defensePerLevel) {
    effects.push({ id: 'defense', label: '护体', value: getTieredLevelValue(level, item.defensePerLevel), mode: 'flat' });
  }
  if (item.vitalityPerLevel) {
    effects.push({ id: 'vitality', label: '血元', value: getTieredLevelValue(level, item.vitalityPerLevel), mode: 'flat' });
  }
  if (item.qiBonusPerLevel) {
    effects.push({ id: 'qiBonus', label: '灵息', value: getTieredLevelValue(level, item.qiBonusPerLevel), mode: 'percent' });
  }
  if (item.speedPerLevel) {
    effects.push({ id: 'speed', label: '身法', value: getTieredLevelValue(level, item.speedPerLevel), mode: 'flat' });
  }
  if (item.piercePerLevel) {
    effects.push({ id: 'pierce', label: '破势', value: getTieredLevelValue(level, item.piercePerLevel), mode: 'flat' });
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
    attack: '锋芒',
    defense: '护体',
    vitality: '血元',
    speed: '身法',
    critChance: '会心',
    pierce: '破势',
    elementPower: '灵根',
    herbRate: '灵草生长',
    alchemySpeed: '丹火缩时',
    dismantleBonus: '分解精粹',
    lootRarity: '寻器气运',
    bloodEssenceBonus: '血脉凝练',
    beastTraining: '御灵培养',
  };
  return Object.entries(bonuses)
    .filter(([key, value]) => typeof value === 'number' && labels[key] && value !== 0)
    .map(([key, value]) => ({
      id: key,
      label: `${prefix}${labels[key]}`,
      value,
      mode: key === 'qiRate' || key === 'qiBonus' || key === 'breakthrough' || key === 'herbRate' || key === 'alchemySpeed' || key === 'critChance' || key === 'dismantleBonus' || key === 'lootRarity' || key === 'bloodEssenceBonus' || key === 'beastTraining' ? 'percent' : key === 'dangerReduction' ? 'reduction' : 'flat',
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

function getMapExplorationInfo(state, mapId) {
  const map = MISSION_MAPS[mapId];
  if (!map) {
    return { completed: 0, cappedCompleted: 0, target: 0, percent: 1, label: '探索 0 / 0' };
  }
  const completed = Object.values(MISSIONS)
    .filter((mission) => getMissionMapId(mission) === mapId)
    .reduce((total, mission) => total + (state.completedMissions?.[mission.id] ?? 0), 0);
  const target = map.explorationTarget;
  const cappedCompleted = Math.min(completed, target);
  return {
    completed,
    cappedCompleted,
    target,
    percent: target ? Math.min(1, completed / target) : 1,
    label: completed > target ? `探索 ${target} / ${target} · 累计 ${completed}` : `探索 ${cappedCompleted} / ${target}`,
  };
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

  ['spiritStones', 'herbs', 'beastCores', 'artifacts', 'forgingEssence', 'bloodEssence'].forEach((resource) => {
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
    return 1 + getSectLevel(state).commissionBonus + getSectSkillBonus(state, 'commissionBonus');
  }
  const discipleBonus = assigned.reduce((total, disciple) => total + getDiscipleJobMultiplier(disciple), 0) / assigned.length;
  return 1 + getSectLevel(state).commissionBonus + getSectSkillBonus(state, 'commissionBonus') + discipleBonus;
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

function addResolvedOpportunity(state, opportunityId, choiceId = null) {
  state.resolvedOpportunities ??= {};
  const entry = normalizeResolvedOpportunityEntry(state.resolvedOpportunities[opportunityId]);
  entry.total += 1;
  if (choiceId) {
    entry.choices[choiceId] = (entry.choices[choiceId] ?? 0) + 1;
  }
  state.resolvedOpportunities[opportunityId] = entry;
}

function getResolvedOpportunityChoiceCount(state, opportunityId, choiceId) {
  const entry = normalizeResolvedOpportunityEntry(state.resolvedOpportunities?.[opportunityId]);
  return entry.choices[choiceId] ?? 0;
}

function normalizeResolvedOpportunityEntry(entry) {
  if (entry && typeof entry === 'object') {
    return {
      total: Math.max(0, Math.floor(Number(entry.total) || 0)),
      choices: Object.fromEntries(
        Object.entries(entry.choices ?? {}).map(([choiceId, count]) => [choiceId, Math.max(0, Math.floor(Number(count) || 0))]),
      ),
    };
  }
  return {
    total: Math.max(0, Math.floor(Number(entry) || 0)),
    choices: {},
  };
}

function applyMissionEvent(state, mission, event, now) {
  applyResources(state, event.reward ?? {});
  const item = event.equipment ? addLootEquipment(state, event.equipment, { mapId: getMissionMapId(mission), missionId: mission.id, state }) : null;
  state.lastMissionEvent = {
    id: event.id,
    name: event.name,
    missionId: mission.id,
    reward: event.reward ?? {},
    equipmentName: item?.name ?? null,
    item,
    time: now,
  };

  const rewardText = formatReward(event.reward ?? {});
  const equipmentText = item ? `，并获得${item.name}` : '';
  addLog(state, now, `奇遇「${event.name}」：${event.detail}${rewardText ? ` 获得${rewardText}` : ''}${equipmentText}。`);
  return { event, item };
}

function addLootEquipment(state, templateId, context = null) {
  const template = LOOT_EQUIPMENT[templateId];
  if (!template) {
    return null;
  }
  state.lootEquipment ??= [];
  state.lootDropSerial = Math.max(Math.floor(Number(state.lootDropSerial) || 0), state.lootEquipment.length) + 1;
  const uid = `${template.id}-${state.lootDropSerial}`;
  const item = createLootItem(template.id, uid, 0, null, context);
  state.lootEquipment.unshift(item);
  state.lootEquipment = state.lootEquipment.slice(0, 40);
  return item;
}

function createLootItem(templateId, uid, level = 0, savedVariant = null, context = null) {
  const template = LOOT_EQUIPMENT[templateId];
  const variant = createLootVariant(template, uid, savedVariant, context);
  const quality = clampInteger((template.quality ?? 0) + (variant.qualityBonus ?? 0), 0, RARITY_TIERS.length - 1);
  return {
    uid,
    templateId,
    name: template.name,
    slot: template.slot,
    quality,
    element: variant.element ?? template.element ?? null,
    variant,
    level: 0,
    bonuses: createLootBonuses(templateId, 0, variant),
  };
}

function createLootVariant(template, uid, savedVariant = null, context = null) {
  if (savedVariant && typeof savedVariant === 'object') {
    const rarity = getSavedLootRarity(savedVariant);
    const affixes = selectLootAffixes(template.slot, hashString(`${template.id}:${uid}:saved`), rarity.affixCount, savedVariant.affixIds ?? [savedVariant.affixId].filter(Boolean));
    const element = COMBAT_ELEMENTS[savedVariant.element] ? savedVariant.element : template.element;
    return buildLootVariant(template, rarity, affixes, element, savedVariant.name);
  }
  const seed = hashString(`${template.id}:${uid}`);
  const rarity = rollLootRarity(seed, uid, context);
  const affixes = selectLootAffixes(template.slot, seed, rarity.affixCount);
  const elementIds = Object.keys(COMBAT_ELEMENTS);
  const element = elementIds[Math.floor(seed / 13) % elementIds.length] ?? template.element;
  return buildLootVariant(template, rarity, affixes, element);
}

function getSavedLootRarity(savedVariant) {
  const legacyGradeMap = {
    steady: 'common',
    bright: 'spirit',
    hidden: 'mystic',
  };
  return getRarityTier(savedVariant.rarityId ?? legacyGradeMap[savedVariant.gradeId] ?? savedVariant.gradeId ?? 'common');
}

function rollLootRarity(seed, uid = '', context = null) {
  const serial = Number(String(uid).match(/-(\d+)$/)?.[1]) || 0;
  const profile = getMapLootProfile(context?.mapId);
  if (serial > 0) {
    const daoInterval = Math.max(120, Math.floor((profile.daoInterval ?? 500) / (1 + getSectSkillBonus(context?.state ?? {}, 'lootRarity'))));
    if (serial % daoInterval === 0) return getRarityTier('dao');
    if (serial % Math.max(70, Math.floor(daoInterval / 4)) === 0) return getRarityTier('heavenWork');
    if (serial % Math.max(28, Math.floor(daoInterval / 12)) === 0) return getRarityTier('earthFiend');
    if (serial % Math.max(10, Math.floor(daoInterval / 36)) === 0) return getRarityTier('mystic');
    if (serial % Math.max(4, Math.floor(daoInterval / 120)) === 0) return getRarityTier('spirit');
  }
  const tierShift = profile.tier ?? 0;
  const adjustedWeights = RARITY_TIERS.map((tier, index) => {
    if (index === 0) return { ...tier, weight: Math.max(220, tier.weight - tierShift * 28) };
    if (tier.id === 'dao') return { ...tier, weight: Math.max(1, tierShift + 1) };
    return { ...tier, weight: tier.weight + tierShift * (index + 2) };
  });
  const totalWeight = adjustedWeights.reduce((total, tier) => total + tier.weight, 0);
  let roll = seed % totalWeight;
  for (const tier of adjustedWeights) {
    if (roll < tier.weight) {
      return getRarityTier(tier.id);
    }
    roll -= tier.weight;
  }
  return RARITY_TIERS[0];
}

function getMapLootProfile(mapId) {
  return MAP_LOOT_PROFILES[mapId] ?? MAP_LOOT_PROFILES.qinglanMountain;
}

function shouldDropMapLoot(state, mission, eventResult) {
  if (eventResult?.item) {
    return false;
  }
  const mapId = getMissionMapId(mission);
  const profile = getMapLootProfile(mapId);
  const completed = state.completedMissions?.[mission.id] ?? 0;
  return completed > 0 && completed % profile.dropEvery === 0;
}

function selectMapLootTemplate(state, mission) {
  const mapId = getMissionMapId(mission);
  const profile = getMapLootProfile(mapId);
  const completed = state.completedMissions?.[mission.id] ?? 0;
  const dropIndex = Math.max(0, Math.floor(completed / profile.dropEvery) - 1);
  const allTemplates = Object.values(LOOT_EQUIPMENT);
  const preferredTemplates = allTemplates.filter((template) => (template.lootTier ?? 0) <= (profile.tier ?? 0) + 1);
  const rareWindow = Math.max(10, 34 - (profile.tier ?? 0) * 5);
  const useFullPool = dropIndex > 0 && (dropIndex + hashString(`${mapId}:rare`)) % rareWindow === 0;
  const templates = useFullPool ? allTemplates : preferredTemplates;
  const seedOffset = hashString(`${mapId}:${mission.id}`) % templates.length;
  return templates[(dropIndex + seedOffset) % templates.length]?.id ?? allTemplates[0].id;
}

function resolveMapLootDrop(state, mission, eventResult, now) {
  if (!shouldDropMapLoot(state, mission, eventResult)) {
    return null;
  }
  const mapId = getMissionMapId(mission);
  const templateId = selectMapLootTemplate(state, mission);
  const item = addLootEquipment(state, templateId, { mapId, missionId: mission.id, state });
  if (!item) {
    return null;
  }
  if (state.lastMissionEvent?.missionId === mission.id && state.lastMissionEvent.time === now) {
    state.lastMissionEvent.item = item;
    state.lastMissionEvent.mapLootName = item.name;
  }
  addLog(state, now, `${MISSION_MAPS[mapId]?.name ?? mission.map ?? mission.name}行游中寻得${item.name}。`);
  return item;
}

function selectLootAffixes(slot, seed, count, preferredIds = []) {
  const pool = LOOT_VARIANT_AFFIXES[slot] ?? [];
  const selected = [];
  const add = (affixId) => {
    const affix = pool.find((candidate) => candidate.id === affixId);
    if (affix && !selected.some((candidate) => candidate.id === affix.id)) {
      selected.push(affix);
    }
  };
  preferredIds.forEach(add);
  for (let offset = 0; selected.length < Math.max(1, count) && offset < pool.length * 2; offset += 1) {
    add(pool[Math.floor(seed / (7 + offset * 3)) % pool.length]?.id);
  }
  return selected.length ? selected.slice(0, count) : [{ id: 'none', name: '无纹', bonuses: {} }];
}

function buildLootVariant(template, rarity, affixes, element, savedName = null) {
  const affixBonuses = affixes.reduce((total, affix) => mergeBonusObjects(total, affix.bonuses ?? {}), {});
  const scaledBonuses = scaleBonusObject(affixBonuses, rarity.bonusMultiplier);
  const affixNames = affixes.map((affix) => affix.name).join('·');
  return {
    gradeId: rarity.id,
    rarityId: rarity.id,
    rarity: { id: rarity.id, name: rarity.name },
    affixId: affixes[0]?.id ?? 'none',
    affixIds: affixes.map((affix) => affix.id),
    affixes: affixes.map((affix) => ({ id: affix.id, name: affix.name, bonuses: scaleBonusObject(affix.bonuses ?? {}, rarity.bonusMultiplier) })),
    name: savedName ?? `${rarity.name}${COMBAT_ELEMENTS[element]?.name ?? ''}${affixNames}`,
    qualityBonus: rarity.qualityBonus,
    bonusMultiplier: rarity.bonusMultiplier,
    dismantleMultiplier: rarity.dismantleMultiplier,
    element,
    bonuses: scaledBonuses,
  };
}

function mergeBonusObjects(left, right) {
  const merged = { ...left };
  Object.entries(right ?? {}).forEach(([key, value]) => {
    merged[key] = round((merged[key] ?? 0) + value);
  });
  return merged;
}

function createLootBonuses(templateId, level = 0, variant = null) {
  const template = LOOT_EQUIPMENT[templateId];
  const multiplier = 1;
  const bonuses = Object.fromEntries(
    Object.entries(template.bonuses).map(([key, value]) => [key, key === 'breakthrough' || key === 'qiRate' || key === 'critChance' ? round(value) : Math.round(value * multiplier)]),
  );
  Object.entries(variant?.bonuses ?? {}).forEach(([key, value]) => {
    bonuses[key] = round((bonuses[key] ?? 0) + value);
  });
  if (variant?.element && COMBAT_ELEMENTS[variant.element]) {
    bonuses.elementPower = round((bonuses.elementPower ?? 0) + 8 + (variant.qualityBonus ?? 0) * 4);
  }
  return bonuses;
}

function getLootMaxLevel(itemOrTemplate) {
  return GEAR[itemOrTemplate?.slot]?.maxLevel ?? 12;
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
    bodyTemperPill: '淬体丹',
    spiritRootPill: '培元丹',
    beastCores: '妖核',
    artifacts: '法器',
    arrayFlags: '阵旗',
    forgingEssence: '炼器精魄',
    bloodEssence: '血脉精魄',
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

function caveStoneCost(base, level) {
  if (level <= 0) {
    return 0;
  }
  const tier = getCaveUpgradeTier(level);
  const tierLevel = Math.max(0, level - tier.minLevel);
  const longRamp = Math.pow(level, 1.16);
  return Math.ceil(base * tier.costMultiplier * longRamp * (1 + tierLevel * 0.18));
}

function caveMaterialCost(base, level) {
  if (level <= 0) {
    return 0;
  }
  const tier = getCaveUpgradeTier(level);
  const tierLevel = Math.max(0, level - tier.minLevel);
  return Math.ceil(base * tier.materialMultiplier * Math.pow(level, 0.92) * (1 + tierLevel * 0.14));
}

function filterCost(cost) {
  return Object.fromEntries(Object.entries(cost).filter(([, amount]) => amount > 0));
}

function hashString(value) {
  return String(value).split('').reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) >>> 0, 2166136261);
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function getDateKey(now = Date.now()) {
  return new Date(now).toISOString().slice(0, 10);
}
