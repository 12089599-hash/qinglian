(function () {
  const realmGroups = [
    { prefix: '炼气', suffixes: ['一层', '二层', '三层', '四层', '五层', '六层', '七层', '八层', '九层'], startQi: 25, endQi: 8_000, startRate: 1.5, endRate: 5.5, startStone: 2, endStone: 8 },
    { prefix: '筑基', suffixes: ['一层', '二层', '三层', '四层', '五层', '六层', '七层', '八层', '九层'], startQi: 16_000, endQi: 220_000, startRate: 6, endRate: 16, startStone: 10, endStone: 24 },
    { prefix: '金丹', suffixes: ['一转', '二转', '三转', '四转', '五转', '六转', '七转', '八转', '九转'], startQi: 360_000, endQi: 2_800_000, startRate: 18, endRate: 45, startStone: 28, endStone: 68 },
    { prefix: '元婴', suffixes: ['一变', '二变', '三变', '四变', '五变', '六变', '七变', '八变', '九变'], startQi: 4_200_000, endQi: 20_000_000, startRate: 55, endRate: 115, startStone: 84, endStone: 170 },
  ];

  const legacyRealmIndexMap = [0, 1, 2, 9, 13, 18, 26, 27];
  const realms = createRealmTrack();

  const currentBalanceVersion = 6;
  const mapDepthMaxLayer = 30;

  function createRealmTrack() {
    return realmGroups.flatMap((group) => group.suffixes.map((suffix, index) => {
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

  const upgradeTiers = [
    { name: '凡阶', minLevel: 1, maxLevel: 3, realmIndex: 0, effectMultiplier: 1, costBase: 1, costStep: 1, essenceBase: 1, essenceStep: 1, lootBonusPerLevel: 0.22, percentBonusPerLevel: 0.01 },
    { name: '灵阶', minLevel: 4, maxLevel: 6, realmIndex: 9, effectMultiplier: 1.35, costBase: 4.2, costStep: 1.35, essenceBase: 5, essenceStep: 2, lootBonusPerLevel: 0.32, percentBonusPerLevel: 0.014 },
    { name: '玄阶', minLevel: 7, maxLevel: 9, realmIndex: 18, effectMultiplier: 1.85, costBase: 9.5, costStep: 2.1, essenceBase: 12, essenceStep: 4, lootBonusPerLevel: 0.46, percentBonusPerLevel: 0.02 },
    { name: '地阶', minLevel: 10, maxLevel: 12, realmIndex: 27, effectMultiplier: 2.5, costBase: 18, costStep: 3.2, essenceBase: 24, essenceStep: 7, lootBonusPerLevel: 0.65, percentBonusPerLevel: 0.028 },
  ];

  const caveStages = [
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

  const caveUpgradeTiers = [
    { name: '筑庐', minLevel: 1, maxLevel: 5, realmIndex: 0, costMultiplier: 1, materialMultiplier: 1 },
    { name: '灵府', minLevel: 6, maxLevel: 10, realmIndex: 9, costMultiplier: 2.8, materialMultiplier: 2.2 },
    { name: '玄庭', minLevel: 11, maxLevel: 15, realmIndex: 18, costMultiplier: 7.4, materialMultiplier: 4.4 },
    { name: '洞天', minLevel: 16, maxLevel: 20, realmIndex: 27, costMultiplier: 18, materialMultiplier: 8 },
  ];

  const missions = {
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
      reward: { spiritStones: 10, qi: 6 },
      events: ['spiritSpring', 'cloudRobeCache'],
    },
    marketTrade: {
      id: 'marketTrade',
      name: '坊市交易',
      mapId: 'qinglanMountain',
      map: '青岚山',
      unlockRealmIndex: 0,
      duration: 90,
      reward: { spiritStones: 36 },
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
      reward: { artifacts: 2, spiritStones: 50, beastCores: 1, forgingEssence: 1 },
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
      reward: { beastCores: 3, spiritStones: 90, qi: 120 },
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
      unlockRealmIndex: 21,
      duration: 240,
      danger: 820,
      reward: { spiritStones: 150, beastCores: 4, arrayFlags: 2, qi: 180 },
      rareEvery: 5,
      rareReward: { artifacts: 3, meridianPill: 1 },
      failurePenalty: { qi: -130, heartDemon: 2 },
      events: ['ancientCache', 'swordRemnant', 'xuanmuAmuletCache'],
    },
  };

  const missionMaps = {
    qinglanMountain: {
      id: 'qinglanMountain',
      name: '青岚山',
      icon: '山',
      description: '洞府外山脉，根基由此打牢。',
      unlockRealmIndex: 0,
      explorationTarget: 5,
      reputationPerMission: 6,
      masteryBonus: { qiRate: 0.03 },
      boss: { name: '青岚山魈', title: '山门首领', power: 180, reward: { spiritStones: 120, powerBonus: 24, forgingEssence: 2 }, reputation: 25, failurePenalty: { qi: -35, heartDemon: 1 } },
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
      boss: { name: '百年药灵', title: '谷中灵魄', power: 300, reward: { herbs: 36, qiRateBonus: 0.02, forgingEssence: 3 }, reputation: 30, failurePenalty: { qi: -45 } },
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
      boss: { name: '雾隐妖', title: '秘境守影', power: 420, reward: { beastCores: 3, artifacts: 1, powerBonus: 32, forgingEssence: 4 }, reputation: 35, failurePenalty: { qi: -65, heartDemon: 1 } },
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
      boss: { name: '无名剑魂', title: '剑冢残念', power: 650, reward: { artifacts: 3, beastCores: 2, powerBonus: 48, forgingEssence: 5 }, reputation: 40, failurePenalty: { qi: -90, heartDemon: 1 } },
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
      boss: { name: '裂隙魔影', title: '魔气化身', power: 950, reward: { beastCores: 5, arrayFlags: 2, powerBonus: 64, forgingEssence: 6 }, reputation: 45, failurePenalty: { qi: -120, heartDemon: 2 } },
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
      boss: { name: '残阵守灵', title: '遗迹阵枢', power: 1300, reward: { spiritStones: 320, arrayFlags: 4, qiRateBonus: 0.03, forgingEssence: 8 }, reputation: 55, failurePenalty: { qi: -160, heartDemon: 2 } },
    },
  };
  const missionMapIds = Object.keys(missionMaps);

  const mapMasteryTiers = [
    { level: 0, name: '初探', reputation: 0 },
    { level: 1, name: '熟路', reputation: 10 },
    { level: 2, name: '知势', reputation: 35 },
    { level: 3, name: '名扬', reputation: 75 },
    { level: 4, name: '镇域', reputation: 140 },
  ];

  const missionApproaches = {
    balanced: { id: 'balanced', name: '循迹', detail: '按原路线稳步行游，收益和劫象保持均衡。', rewardBonus: {}, durationMultiplier: 1, dangerMultiplier: 1, dropEvery: 0 },
    herbSeeking: { id: 'herbSeeking', name: '寻药', detail: '放慢脚步辨认草木灵机，偏向灵草和清心收获。', rewardBonus: { herbs: 0.45 }, flatReward: { herbs: 3 }, durationMultiplier: 1.05, dangerMultiplier: 0.96, dropEvery: 2 },
    monsterHunt: { id: 'monsterHunt', name: '猎妖', detail: '主动追索妖踪，妖核更多，但劫象会更重。', rewardBonus: { beastCores: 0.55, spiritStones: 0.12 }, flatReward: { beastCores: 1 }, durationMultiplier: 1, dangerMultiplier: 1.12, dropEvery: 2 },
    relicSearch: { id: 'relicSearch', name: '探遗', detail: '搜寻残器旧阵，偏向法器、阵旗和炼器精魄。', rewardBonus: { artifacts: 0.5, arrayFlags: 0.35, forgingEssence: 0.3 }, flatReward: { forgingEssence: 1 }, durationMultiplier: 1.1, dangerMultiplier: 1.05, dropEvery: 2 },
    daoInquiry: { id: 'daoInquiry', name: '问道', detail: '静观地脉与残念，偏向灵气、悟道和破境准备。', rewardBonus: { qi: 0.35, insight: 0.35 }, flatReward: { insight: 1 }, durationMultiplier: 1.12, dangerMultiplier: 1.02, dropEvery: 2 },
  };

  const mapSpecialDrops = {
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

  const sectCommissions = {
    herbGarden: { id: 'herbGarden', name: '采药委托', detail: '弟子巡山采药，稳定补充灵草。', rates: { herbs: 0.05, reputation: 0.01 } },
    mine: { id: 'mine', name: '采矿委托', detail: '弟子整理灵脉碎矿，缓慢产出灵石。', rates: { spiritStones: 0.08, reputation: 0.008 } },
    patrol: { id: 'patrol', name: '护山委托', detail: '弟子巡守山门，偶得妖核并提升宗门名望。', rates: { beastCores: 0.01, reputation: 0.01 } },
    forge: { id: 'forge', name: '炼器委托', detail: '弟子整理残器与炉火，缓慢沉淀法器和炼器精魄。', rates: { artifacts: 0.006, forgingEssence: 0.004, reputation: 0.008 } },
  };

  const resourceGuides = {
    spiritStones: { label: '灵石', priority: 0.9, mapIds: ['qinglanMountain'], missionId: 'marketTrade', approachId: 'balanced', commissionId: 'mine', detail: '洞府、装备和坊市刷新都会消耗灵石。' },
    herbs: { label: '灵草', priority: 1, mapIds: ['herbValley', 'qinglanMountain'], missionId: 'herbValley', approachId: 'herbSeeking', commissionId: 'herbGarden', detail: '炼丹、灵田和丹修成长都需要稳定灵草。' },
    beastCores: { label: '妖核', priority: 1.25, mapIds: ['demonRift', 'mistyValley', 'qinglanMountain'], missionId: 'mistyValley', approachId: 'monsterHunt', commissionId: 'patrol', detail: '武器、法袍、剑阵和护脉丹容易被妖核卡住。' },
    artifacts: { label: '法器', priority: 1.2, mapIds: ['swordTomb', 'mistyValley', 'qinglanMountain'], missionId: 'ancientSwordTomb', approachId: 'relicSearch', commissionId: 'forge', detail: '法器可用于淬炼、分解和炼器阁营建。' },
    arrayFlags: { label: '阵旗', priority: 1.15, mapIds: ['ancientRuins', 'demonRift', 'swordTomb', 'qinglanMountain'], missionId: 'demonRift', approachId: 'relicSearch', commissionId: null, marketItemId: 'arrayFlagPack', detail: '阵法、静室高阶和藏经阁会持续消耗阵旗。' },
    forgingEssence: { label: '炼器精魄', priority: 1.35, mapIds: ['swordTomb', 'mistyValley', 'qinglanMountain'], missionId: 'ancientSwordTomb', approachId: 'relicSearch', commissionId: 'forge', marketItemId: 'forgingAsh', detail: '战利品强化、法宝和炼器阁中后期都需要炼器精魄。' },
    insight: { label: '悟道', priority: 1.05, mapIds: ['ancientRuins', 'demonRift', 'swordTomb', 'qinglanMountain'], missionId: 'ancientRuins', approachId: 'daoInquiry', commissionId: null, marketItemId: 'insightScroll', detail: '悟道支撑藏经阁高阶和后续功法沉淀。' },
    qi: { label: '灵气', priority: 0.55, mapIds: ['swordTomb', 'herbValley', 'qinglanMountain'], missionId: 'cavePatrol', approachId: 'daoInquiry', commissionId: null, detail: '灵气不足时，问道路线、丹药和长期吐纳更重要。' },
  };

  const sectLevels = [
    { level: 1, name: '外门草创', reputation: 0, capacityBonus: 0, commissionBonus: 0 },
    { level: 2, name: '山门初立', reputation: 30, capacityBonus: 1, commissionBonus: 0.06 },
    { level: 3, name: '内门成形', reputation: 90, capacityBonus: 2, commissionBonus: 0.12 },
    { level: 4, name: '一方名门', reputation: 180, capacityBonus: 3, commissionBonus: 0.2 },
    { level: 5, name: '洞天雏形', reputation: 320, capacityBonus: 5, commissionBonus: 0.3 },
  ];

  const opportunities = {
    swordEcho: {
      id: 'swordEcho',
      name: '剑冢回响',
      detail: '剑冢残念回应你的神识，可以趁势淬炼本命剑意。',
      choices: [
        { id: 'temperSword', title: '以法器淬锋', detail: '消耗一件法器，换取稳定的道威底蕴和炼器精魄。', cost: { artifacts: 1 }, reward: { powerBonus: 18, forgingEssence: 2 }, successChance: 1 },
        { id: 'listenDao', title: '静听剑鸣', detail: '不消耗材料，获得悟道灵感和一段灵气。', cost: {}, reward: { insight: 1, qi: 120 }, successChance: 1 },
      ],
    },
    spiritSpringChoice: {
      id: 'spiritSpringChoice',
      name: '灵泉分流',
      detail: '山脉灵泉短暂涌动，可引入洞府或当场吐纳。',
      choices: [
        { id: 'leadToCave', title: '引泉入府', detail: '布下简易阵纹，永久提升少量灵息效率。', cost: { arrayFlags: 1 }, reward: { qiRateBonus: 0.015 }, successChance: 1 },
        { id: 'cultivateNow', title: '当场吐纳', detail: '不消耗材料，立刻获得一段灵气。', cost: {}, reward: { qi: 160 }, successChance: 1 },
      ],
    },
    riftDemonThought: {
      id: 'riftDemonThought',
      name: '魔念低语',
      detail: '裂隙中浮出魔念，镇压后可换来更高收益。',
      choices: [
        { id: 'suppressDemon', title: '镇压魔念', detail: '直面心魔反噬，换取妖核和阵旗。', cost: {}, reward: { beastCores: 2, arrayFlags: 1 }, failurePenalty: { heartDemon: 1, qi: -90 }, successChance: 0.78 },
        { id: 'sealRift', title: '稳妥封印', detail: '消耗阵旗压住裂隙，降低心魔压力。', cost: { arrayFlags: 1 }, reward: { clearHeartPill: 1, forgingEssence: 1 }, successChance: 1 },
      ],
    },
  };

  const treasures = {
    lifeBoundSeal: { id: 'lifeBoundSeal', name: '本命青印', detail: '护持经脉和神识，牵引破境天机，并提供少量道威。', maxLevel: 8, cost: (level) => ({ spiritStones: scaleCost(120, level), artifacts: level, forgingEssence: level * 2 }), bonuses: { breakthrough: 0.025, power: 10 } },
    swordGourd: { id: 'swordGourd', name: '养剑葫', detail: '温养剑气，凝练历练道威并平息行游劫象。', maxLevel: 8, cost: (level) => ({ spiritStones: scaleCost(140, level), beastCores: level, forgingEssence: level * 2 }), bonuses: { power: 24, dangerReduction: 4 } },
    spiritLamp: { id: 'spiritLamp', name: '聚灵灯', detail: '牵引洞府灵机，提升长期灵息效率。', maxLevel: 8, cost: (level) => ({ spiritStones: scaleCost(110, level), arrayFlags: level, herbs: scaleCost(10, level) }), bonuses: { qiRate: 0.025 } },
  };

  const spiritBeasts = {
    cloudFox: { id: 'cloudFox', name: '云纹灵狐', detail: '亲近灵气，辅助周天灵息和灵田照料。', maxLevel: 8, cost: (level) => ({ spiritStones: scaleCost(90, level), herbs: scaleCost(18, level), beastCores: level }), bonuses: { qiRate: 0.04, herbRate: 0.015 } },
    thunderTiger: { id: 'thunderTiger', name: '雷纹幼虎', detail: '守山善战，凝练道威并护持外出行游。', maxLevel: 8, cost: (level) => ({ spiritStones: scaleCost(130, level), beastCores: level * 2 }), bonuses: { power: 22, dangerReduction: 5 } },
  };

  const daoHearts = {
    greenLotusSwordBone: { id: 'greenLotusSwordBone', name: '青莲剑骨', detail: '一念如锋，行游遇煞时更容易压住局面。', maxLevel: 3, bonuses: { power: 48, dangerReduction: 6 } },
    xuanFurnaceDanMind: { id: 'xuanFurnaceDanMind', name: '玄炉丹心', detail: '丹火入神，周天更绵长，炉火更听使唤。', maxLevel: 3, bonuses: { qiRate: 0.035, alchemySpeed: 0.03 } },
    ninePalaceArraySoul: { id: 'ninePalaceArraySoul', name: '九宫阵魂', detail: '心神合阵，叩关前能多留一线回旋。', maxLevel: 3, bonuses: { breakthrough: 0.025, dangerReduction: 4 } },
  };
  const daoHeartChoices = Object.keys(daoHearts);
  const daoHeartRealmIndices = [9, 18, 27];

  const missionOpportunities = {
    cavePatrol: 'spiritSpringChoice',
    ancientSwordTomb: 'swordEcho',
    demonRift: 'riftDemonThought',
  };

  const missionEvents = {
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

  const lootEquipment = {
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

  const buildings = {
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
      qiBonusPerLevel: 0.08,
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

  const pillRecipes = {
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

  const gear = {
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

  const gearIntents = {
    weapon: { id: 'suppressEvil', name: '镇煞', detail: '剑气锋锐，可压住山门首领与秘境凶煞。' },
    amulet: { id: 'knockGate', name: '叩关', detail: '符脉护持道基，破境前更容易稳住气机。' },
    robe: { id: 'wanderGuard', name: '行游', detail: '云纹护身，外出历练时更能避开劫象。' },
  };

  const gearQualities = [
    { name: '凡品', powerBonus: 0, refineChance: 0.82 },
    { name: '下品', powerBonus: 18, refineChance: 0.66 },
    { name: '中品', powerBonus: 40, refineChance: 0.5 },
    { name: '上品', powerBonus: 70, refineChance: 0.36 },
    { name: '极品', powerBonus: 110, refineChance: 0 },
  ];

  const gearAffixes = {
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

  const gearAffixPools = {
    weapon: ['swordIntent', 'breakerEdge'],
    amulet: ['spiritVein', 'calmMind'],
    robe: ['cloudStep', 'guardedBody'],
  };

  const cultivationPaths = {
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

  const formations = {
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

  const dailyTasks = {
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

  const marketItems = {
    herbBundle: {
      id: 'herbBundle',
      name: '灵草包',
      type: '材料',
      unlockRealmIndex: 0,
      limit: 1,
      cost: { spiritStones: 40 },
      reward: { herbs: 12 },
    },
    beastCoreShard: {
      id: 'beastCoreShard',
      name: '妖核碎片',
      type: '材料',
      unlockRealmIndex: 0,
      limit: 1,
      cost: { spiritStones: 75 },
      reward: { beastCores: 1 },
    },
    spiritSword: {
      id: 'spiritSword',
      name: '下品灵剑',
      type: '装备',
      unlockRealmIndex: 0,
      limit: 1,
      cost: { spiritStones: 80 },
      reward: { artifacts: 1 },
    },
    arrayManual: {
      id: 'arrayManual',
      name: '小周天阵旗',
      type: '阵法',
      unlockRealmIndex: 0,
      limit: 1,
      cost: { spiritStones: 90, beastCores: 1 },
      reward: { arrayFlags: 1 },
    },
    clearHeartBottle: {
      id: 'clearHeartBottle',
      name: '清心丹匣',
      type: '丹药',
      unlockRealmIndex: 4,
      limit: 1,
      cost: { spiritStones: 120, herbs: 6 },
      reward: { clearHeartPill: 1 },
    },
    forgingAsh: {
      id: 'forgingAsh',
      name: '炉底精魄',
      type: '炼器',
      unlockRealmIndex: 7,
      limit: 1,
      cost: { spiritStones: 150, artifacts: 1 },
      reward: { forgingEssence: 4 },
    },
    meridianPillBox: {
      id: 'meridianPillBox',
      name: '护脉丹匣',
      type: '丹药',
      unlockRealmIndex: 9,
      limit: 1,
      cost: { spiritStones: 220, beastCores: 1 },
      reward: { meridianPill: 1 },
    },
    arrayFlagPack: {
      id: 'arrayFlagPack',
      name: '残阵旗包',
      type: '阵法',
      unlockRealmIndex: 9,
      limit: 1,
      cost: { spiritStones: 180, beastCores: 2 },
      reward: { arrayFlags: 2 },
    },
    insightScroll: {
      id: 'insightScroll',
      name: '悟道残页',
      type: '奇物',
      unlockRealmIndex: 14,
      limit: 1,
      cost: { spiritStones: 360, arrayFlags: 1 },
      reward: { insight: 1 },
    },
    treasureOre: {
      id: 'treasureOre',
      name: '玄铁灵砂',
      type: '炼器',
      unlockRealmIndex: 18,
      limit: 1,
      cost: { spiritStones: 460, beastCores: 2, artifacts: 1 },
      reward: { forgingEssence: 8, artifacts: 1 },
    },
  };

  const mainlineChapters = [
    {
      id: 'qinglanStart',
      title: '青岚初启',
      subtitle: '立洞府、通吐纳、备丹药，完成最初的修行根基。',
      reward: { spiritStones: 120, qiRateBonus: 0.03 },
      objectives: [
        {
          id: 'firstPatrol',
          title: '巡守一次洞府',
          detail: '熟悉行游节奏，带回第一批灵气和灵石',
          completed: (state) => (state.completedMissions.cavePatrol || 0) >= 1,
          reward: { spiritStones: 40, qi: 35 },
        },
        {
          id: 'realmTwo',
          title: '首次破境',
          detail: '突破至炼气二层，感受灵息与道行提升',
          completed: (state) => state.realmIndex >= 1,
          reward: { spiritStones: 70, pills: 1 },
        },
        {
          id: 'spiritField',
          title: '建成一阶灵田',
          detail: '让洞府开始自动生长灵草',
          completed: (state) => (state.buildings.spiritField || 0) >= 1,
          reward: { herbs: 10, spiritStones: 30 },
        },
        {
          id: 'firstPill',
          title: '炼成一枚聚气丹',
          detail: '突破前用丹药快速补足灵气',
          completed: (state) => (state.craftedPills || 0) >= 1,
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
          completed: (state) => Object.values(state.cultivationPaths || {}).some((level) => level >= 1),
          reward: { spiritStones: 90, arrayFlags: 1 },
        },
        {
          id: 'firstArmament',
          title: '整备护身法器',
          detail: '任意装备或阵法升至 1 级',
          completed: (state) => [...Object.values(state.gear || {}), ...Object.values(state.formations || {})].some((level) => level >= 1),
          reward: { beastCores: 1, artifacts: 1 },
        },
        {
          id: 'swordTombTrial',
          title: '踏入古剑冢',
          detail: '完成一次古剑冢历练',
          completed: (state) => (state.completedMissions.ancientSwordTomb || 0) >= 1,
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
          completed: (state) => Object.values(state.gearQuality || {}).some((quality) => quality >= 1),
          reward: { artifacts: 2, spiritStones: 180 },
        },
        {
          id: 'pathThree',
          title: '主修小成',
          detail: '任一功法达到 3 级',
          completed: (state) => Object.values(state.cultivationPaths || {}).some((level) => level >= 3),
          reward: { clearHeartPill: 1, spiritStones: 160 },
        },
        {
          id: 'demonRiftTrial',
          title: '镇压魔气裂隙',
          detail: '完成两次魔气裂隙历练',
          completed: (state) => (state.completedMissions.demonRift || 0) >= 2,
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
          completed: (state) => Boolean(state.defeatedBosses.demonRift),
          reward: { beastCores: 4, arrayFlags: 2 },
        },
        {
          id: 'empoweredLoot',
          title: '强化一件战利品',
          detail: '任意具名战利品强化至 2 级',
          completed: (state) => (state.lootEquipment || []).some((item) => (item.level || 0) >= 2),
          reward: { forgingEssence: 3, spiritStones: 220 },
        },
        {
          id: 'sectReputation',
          title: '宗门初具名望',
          detail: '宗门声望达到 20',
          completed: (state) => (state.sectReputation || 0) >= 20,
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
          completed: (state) => Boolean(state.defeatedBosses.ancientRuins),
          reward: { arrayFlags: 4, forgingEssence: 4 },
        },
        {
          id: 'sectSixDisciples',
          title: '宗门六徒',
          detail: '招募 6 名弟子，形成稳定委托循环',
          completed: (state) => (state.sectDisciples || 0) >= 6,
          reward: { spiritStones: 360, herbs: 60 },
        },
        {
          id: 'earthTierFormation',
          title: '地阶阵法',
          detail: '任意阵法达到 7 级',
          completed: (state) => Object.values(state.formations || {}).some((level) => level >= 7),
          reward: { powerBonus: 60, qiRateBonus: 0.03 },
        },
      ],
    },
  ];

  const saveKey = 'idle-xianxia-save-v1';
  const refs = {
    realm: document.querySelector('[data-realm]'),
    qi: document.querySelector('[data-qi]'),
    qiRate: document.querySelector('[data-qi-rate]'),
    stones: document.querySelector('[data-stones]'),
    herbs: document.querySelector('[data-herbs]'),
    pills: document.querySelector('[data-pills]'),
    clearHeartPills: document.querySelector('[data-clear-heart-pills]'),
    meridianPills: document.querySelector('[data-meridian-pills]'),
    beastCores: document.querySelector('[data-beast-cores]'),
    artifacts: document.querySelector('[data-artifacts]'),
    arrayFlags: document.querySelector('[data-array-flags]'),
    forgingEssence: document.querySelector('[data-forging-essence]'),
    heartDemon: document.querySelector('[data-heart-demon]'),
    power: document.querySelector('[data-power]'),
    breakthroughChance: document.querySelector('[data-breakthrough-chance]'),
    dominantPath: document.querySelector('[data-dominant-path]'),
    upgradeLimit: document.querySelector('[data-upgrade-limit]'),
    progress: document.querySelector('[data-progress]'),
    progressText: document.querySelector('[data-progress-text]'),
    hudQi: document.querySelector('[data-hud-qi]'),
    hudRate: document.querySelector('[data-hud-rate]'),
    hudAction: document.querySelector('[data-hud-action]'),
    nextGuidance: document.querySelector('[data-next-guidance]'),
    mission: document.querySelector('[data-mission]'),
    missionTime: document.querySelector('[data-mission-time]'),
    pillBoost: document.querySelector('[data-pill-boost]'),
    profileRealm: document.querySelector('[data-profile-realm]'),
    attributeList: document.querySelector('[data-attribute-list]'),
    daoHeartList: document.querySelector('[data-dao-heart-list]'),
    breakthroughPrep: document.querySelector('[data-breakthrough-prep]'),
    goals: document.querySelector('[data-goals]'),
    goalCount: document.querySelector('[data-goal-count]'),
    mainlineHeader: document.querySelector('[data-mainline-header]'),
    mainlineChapters: document.querySelector('[data-mainline-chapters]'),
    alchemyList: document.querySelector('[data-alchemy-list]'),
    gearList: document.querySelector('[data-gear-list]'),
    lootList: document.querySelector('[data-loot-list]'),
    formationList: document.querySelector('[data-formation-list]'),
    treasureList: document.querySelector('[data-treasure-list]'),
    beastList: document.querySelector('[data-beast-list]'),
    cultivationList: document.querySelector('[data-cultivation-list]'),
    caveList: document.querySelector('[data-cave-list]'),
    sectList: document.querySelector('[data-sect-list]'),
    sectStatus: document.querySelector('[data-sect-status]'),
    foundation: document.querySelector('[data-foundation]'),
    dailyList: document.querySelector('[data-daily-list]'),
    dailyStatus: document.querySelector('[data-daily-status]'),
    marketList: document.querySelector('[data-market-list]'),
    opportunity: document.querySelector('[data-opportunity]'),
    missionReport: document.querySelector('[data-mission-report]'),
    resourceGuidance: document.querySelector('[data-resource-guidance]'),
    missionList: document.querySelector('[data-mission-list]'),
    subTabs: document.querySelector('[data-sub-tabs]'),
    gearSubTabs: document.querySelector('[data-gear-subtabs]'),
    offlineDialog: document.querySelector('[data-offline-dialog]'),
    offlineSummary: document.querySelector('[data-offline-summary]'),
    toastStack: document.querySelector('[data-toast-stack]'),
    log: document.querySelector('[data-log]'),
    canvas: document.querySelector('[data-world]'),
  };

  const ctx = refs.canvas.getContext('2d');
  const renderCache = {};
  const openLootDetails = new Set();
  const panelTabs = ['overview', 'goals', 'daily', 'market', 'alchemy', 'gear', 'cultivation', 'sect', 'cave', 'missions', 'log'];
  const tabGroups = {
    practice: { label: '修行', tabs: ['overview', 'goals', 'daily', 'cultivation'] },
    travel: { label: '行游', tabs: ['missions'] },
    vault: { label: '库藏', tabs: ['market', 'alchemy', 'gear'] },
    mountain: { label: '山门', tabs: ['sect', 'cave', 'log'] },
  };
  const tabLabels = {
    overview: '修行',
    goals: '主线',
    daily: '日常',
    market: '坊市',
    alchemy: '丹房',
    gear: '装备',
    cultivation: '功法',
    sect: '宗门',
    cave: '洞府',
    missions: '历练',
    log: '日志',
  };
  const gearSections = ['wear', 'loot', 'treasures'];
  const isMobileLayout = () => typeof window !== 'undefined' && window.matchMedia?.('(max-width: 760px)').matches;
  const storedActiveTab = localStorage.getItem('idle-xianxia-active-tab');
  let activeTab = isMobileLayout() ? 'overview' : (storedActiveTab === 'overview' ? 'goals' : storedActiveTab || 'goals');
  if (!panelTabs.includes(activeTab)) {
    activeTab = isMobileLayout() ? 'overview' : 'goals';
  }
  let activeGearSection = localStorage.getItem('idle-xianxia-gear-section') || 'wear';
  if (!gearSections.includes(activeGearSection)) {
    activeGearSection = 'wear';
  }
  const lootFilters = ['all', 'weapon', 'amulet', 'robe'];
  let activeLootFilter = localStorage.getItem('idle-xianxia-loot-filter') || 'all';
  if (!lootFilters.includes(activeLootFilter)) {
    activeLootFilter = 'all';
  }
  let activeMissionMapId = localStorage.getItem('idle-xianxia-mission-map') || missionMapIds[0];
  if (!missionMaps[activeMissionMapId]) {
    activeMissionMapId = missionMapIds[0];
  }
  let activeBuildingId = localStorage.getItem('idle-xianxia-cave-building') || 'meditationSeat';
  if (!buildings[activeBuildingId]) {
    activeBuildingId = 'meditationSeat';
  }
  let scrolledMissionReportId = null;
  let pendingOfflineSummary = null;
  let state = loadState();
  let lastFrameAt = performance.now();
  let animationTime = 0;

  document.querySelector('[data-breakthrough]').addEventListener('click', () => {
    const beforeRealm = getCurrentRealm(state);
    const beforePower = calculatePower(state);
    const result = performBreakthrough(state);
    if (result.ok) {
      const afterRealm = getCurrentRealm(state);
      const powerGain = Math.max(0, calculatePower(state) - beforePower);
      showToast('破境成功', `${beforeRealm.name} → ${afterRealm.name}${powerGain ? `，道行 +${powerGain}` : ''}。`);
      triggerBattleFeedback('victory');
    } else if (result.reason === 'notEnoughQi') {
      showToast('灵气未满', `还差 ${Math.ceil(Math.max(0, beforeRealm.requiredQi - state.qi))} 灵气，可先行游或等待吐纳。`, 'warning');
    } else if (result.reason === 'failed') {
      showToast('破境受挫', '心魔骤起，灵气折损；稳固根基或服用护脉丹后再试。', 'warning');
      triggerBattleFeedback('danger');
    } else if (result.reason === 'maxRealm') {
      showToast('已至尽头', '此界修行已至当前上限。');
    }
    saveState();
    render(true);
  });

  document.querySelector('[data-craft-pill]').addEventListener('click', () => {
    craftPill(state);
    saveState();
    render();
  });

  document.querySelector('[data-consume-pill]').addEventListener('click', () => {
    consumePill(state);
    saveState();
    render();
  });

  document.querySelector('[data-stabilize-foundation]')?.addEventListener('click', () => {
    const result = stabilizeFoundation(state);
    if (result.ok) {
      showToast('稳固根基', `根基稳固 ${result.level} 层。`);
    }
    saveState();
    render(true);
  });

  refs.alchemyList?.addEventListener('click', (event) => {
    const craftButton = event.target.closest('[data-craft-recipe]');
    if (craftButton) {
      craftPill(state, craftButton.dataset.craftRecipe);
      saveState();
      render(true);
      return;
    }
    const consumeButton = event.target.closest('[data-consume-recipe]');
    if (consumeButton) {
      const result = consumePill(state, consumeButton.dataset.consumeRecipe);
      if (result.ok) {
        showToast('服丹', '丹药生效。');
      }
      saveState();
      render(true);
    }
  });

  refs.daoHeartList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-choose-dao-heart]');
    if (!button) {
      return;
    }
    const result = chooseDaoHeart(state, button.dataset.chooseDaoHeart);
    if (result.ok) {
      showToast('命格凝定', `已凝成「${result.heart.name}」。`);
    }
    saveState();
    render(true);
  });

  refs.gearList?.addEventListener('click', (event) => {
    const upgradeButton = event.target.closest('[data-upgrade-gear]');
    if (upgradeButton) {
      upgradeGear(state, upgradeButton.dataset.upgradeGear);
      saveState();
      render(true);
      return;
    }
    const refineButton = event.target.closest('[data-refine-gear]');
    if (!refineButton) return;
    const result = refineGear(state, refineButton.dataset.refineGear);
    if (result.ok) {
      showToast('淬炼成功', `${gear[refineButton.dataset.refineGear].name}提升为${gearQualities[result.quality].name}。`);
    }
    saveState();
    render(true);
  });

  refs.lootList?.addEventListener('click', (event) => {
    const equipButton = event.target.closest('[data-equip-loot]');
    if (equipButton) {
      const result = equipLootEquipment(state, equipButton.dataset.equipLoot);
      if (result.ok) {
        showToast('换上战利品', `${result.item.name}已生效。`);
      }
      saveState();
      render(true);
      return;
    }
    const empowerButton = event.target.closest('[data-empower-loot]');
    if (empowerButton) {
      const result = empowerLootEquipment(state, empowerButton.dataset.empowerLoot);
      if (result.ok) {
        showToast('战利品强化', `${result.item.name}升至 ${result.level} 级。`);
      }
      saveState();
      render(true);
      return;
    }
    const lockButton = event.target.closest('[data-toggle-loot-lock]');
    if (lockButton) {
      const result = toggleLootLock(state, lockButton.dataset.toggleLootLock);
      if (result.ok) {
        showToast(result.locked ? '战利品锁定' : '战利品解锁', `${result.item.name}${result.locked ? '已保留' : '可整理'}。`);
      }
      saveState();
      render(true);
      return;
    }
    const disassembleButton = event.target.closest('[data-disassemble-loot]');
    if (disassembleButton) {
      const result = disassembleLootEquipment(state, disassembleButton.dataset.disassembleLoot);
      if (result.ok) {
        openLootDetails.delete(result.item.uid);
        showToast('战利品分解', `获得${formatReward(result.reward)}。`);
      }
      saveState();
      render(true);
    }
  });

  document.querySelector('[data-organize-loot]')?.addEventListener('click', () => {
    const result = organizeLootEquipment(state);
    if (result.removed > 0) {
      result.items.forEach((item) => openLootDetails.delete(item.uid));
      showToast('战利品整理', `分解 ${result.removed} 件闲置装备，获得${formatReward(result.reward)}。`);
    } else {
      showToast('战利品整理', '没有可整理的闲置装备。');
    }
    saveState();
    render(true);
  });

  document.querySelectorAll('[data-loot-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      activeLootFilter = lootFilters.includes(button.dataset.lootFilter) ? button.dataset.lootFilter : 'all';
      localStorage.setItem('idle-xianxia-loot-filter', activeLootFilter);
      renderLoot(true);
    });
  });

  refs.lootList?.addEventListener('toggle', (event) => {
    const detail = event.target.closest?.('[data-loot-detail]');
    if (!detail) {
      return;
    }
    if (detail.open) {
      openLootDetails.add(detail.dataset.lootDetail);
    } else {
      openLootDetails.delete(detail.dataset.lootDetail);
    }
  }, true);

  refs.missionReport?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-dismiss-mission-report]');
    if (!button) {
      return;
    }
    state.lastMissionReport = null;
    saveState();
    renderMissionReport(true);
  });

  refs.treasureList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-upgrade-treasure]');
    if (!button) return;
    const result = upgradeTreasure(state, button.dataset.upgradeTreasure);
    if (result.ok) {
      showToast('法宝温养', `${treasures[button.dataset.upgradeTreasure].name}升至 ${result.level} 级。`);
    }
    saveState();
    render(true);
  });

  refs.beastList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-train-beast]');
    if (!button) return;
    const result = trainSpiritBeast(state, button.dataset.trainBeast);
    if (result.ok) {
      showToast('灵兽培养', `${spiritBeasts[button.dataset.trainBeast].name}升至 ${result.level} 级。`);
    }
    saveState();
    render(true);
  });

  refs.formationList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-upgrade-formation]');
    if (!button) return;
    upgradeFormation(state, button.dataset.upgradeFormation);
    saveState();
    render(true);
  });

  refs.cultivationList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-upgrade-path]');
    if (!button) return;
    const result = upgradeCultivationPath(state, button.dataset.upgradePath);
    if (result.ok) {
      showToast('功法精进', `${cultivationPaths[button.dataset.upgradePath].name}升至 ${result.level} 级。`);
    }
    saveState();
    render(true);
  });

  refs.opportunity?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-resolve-opportunity]');
    if (!button) return;
    const result = resolveOpportunity(state, button.dataset.resolveOpportunity);
    if (result.ok) {
      showToast('机缘已定', `获得${formatReward(result.reward)}。`);
    } else if (result.reason === 'notEnoughResources') {
      showToast('机缘未成', `还需要${formatReward(result.cost)}。`, 'warning');
    } else if (result.reason === 'failed') {
      showToast('机缘反噬', '选择失手，已承受代价。', 'warning');
    }
    saveState();
    render(true);
  });

  document.querySelectorAll('[data-start-mission]').forEach((button) => {
    button.addEventListener('click', () => {
      startMission(state, button.dataset.startMission);
      saveState();
      render();
    });
  });

  document.querySelectorAll('[data-auto-mission]').forEach((button) => {
    button.addEventListener('click', () => {
      toggleAutoMission(state, button.dataset.autoMission);
      saveState();
      render();
    });
  });

  refs.missionList?.addEventListener('click', (event) => {
    const mapButton = event.target.closest('[data-select-mission-map]');
    if (mapButton) {
      activeMissionMapId = mapButton.dataset.selectMissionMap;
      localStorage.setItem('idle-xianxia-mission-map', activeMissionMapId);
      render(true);
      return;
    }
    const approachButton = event.target.closest('[data-select-approach]');
    if (approachButton) {
      const [mapId, approachId] = approachButton.dataset.selectApproach.split(':');
      const result = setMissionApproach(state, mapId, approachId);
      if (result.ok) {
        showToast('路线已定', `${missionMaps[mapId].name}改走「${result.approach.name}」。`);
      }
      saveState();
      render(true);
      return;
    }
    const startButton = event.target.closest('[data-start-mission]');
    if (startButton) {
      startMission(state, startButton.dataset.startMission);
      saveState();
      render(true);
      return;
    }
    const autoButton = event.target.closest('[data-auto-mission]');
    if (autoButton) {
      toggleAutoMission(state, autoButton.dataset.autoMission);
      saveState();
      render(true);
      return;
    }
    const depthButton = event.target.closest('[data-start-depth]');
    if (depthButton) {
      const result = startMapDepthTrial(state, depthButton.dataset.startDepth);
      if (result.ok) {
        showToast('秘境深入', `${result.status.mapName}第 ${result.status.nextLayer} 层。`);
      } else if (result.reason === 'busy') {
        showToast('正在行动', '当前行动结束后再深入秘境。', 'warning');
      }
      saveState();
      render(true);
      return;
    }
    const bossButton = event.target.closest('[data-challenge-boss]');
    if (bossButton) {
      const result = challengeMapBoss(state, bossButton.dataset.challengeBoss);
      if (result.ok) {
        showToast('首领镇压', `击败${result.boss.name}，获得${formatReward(result.reward)}。`);
        triggerBattleFeedback('victory');
      } else if (result.reason === 'powerLow') {
      showToast('道行不足', `需要道行 ${result.requiredPower}。`, 'warning');
        triggerBattleFeedback('danger');
      }
      saveState();
      render(true);
    }
  });

  refs.sectList?.addEventListener('click', (event) => {
    const recruitButton = event.target.closest('[data-recruit-disciple]');
    if (recruitButton) {
      const result = recruitDisciple(state);
      if (result.ok) {
        showToast('宗门招募', `弟子增至 ${result.disciples} 人。`);
      }
      saveState();
      render(true);
      return;
    }
    const assignButton = event.target.closest('[data-assign-sect]');
    if (assignButton) {
      assignSectDisciple(state, assignButton.dataset.assignSect, Number(assignButton.dataset.delta || 1));
      saveState();
      render(true);
    }
  });

  refs.caveList?.addEventListener('click', (event) => {
    const upgradeButton = event.target.closest('[data-upgrade-building]');
    if (upgradeButton) {
      const result = upgradeBuilding(state, upgradeButton.dataset.upgradeBuilding);
      activeBuildingId = upgradeButton.dataset.upgradeBuilding;
      localStorage.setItem('idle-xianxia-cave-building', activeBuildingId);
      if (result.ok) {
        showToast('洞府升阶', `${buildings[activeBuildingId].name}升至 ${result.level} 级。`);
      } else if (result.reason === 'realmLocked') {
        showToast('境界未至', '此阶洞府需要更高境界。', 'warning');
      } else if (result.reason === 'notEnoughResources') {
        showToast('材料不足', '先去行游、坊市或宗门补充资源。', 'warning');
      }
      saveState();
      render(true);
      return;
    }
    const selectButton = event.target.closest('[data-select-building]');
    if (selectButton) {
      activeBuildingId = selectButton.dataset.selectBuilding;
      localStorage.setItem('idle-xianxia-cave-building', activeBuildingId);
      render(true);
    }
  });

  refs.goals?.addEventListener('click', (event) => {
    const goalButton = event.target.closest('[data-claim-goal]');
    if (goalButton) {
      const result = claimGoalReward(state, goalButton.dataset.claimGoal);
      if (result.ok) {
        showToast('目标奖励', `获得${formatReward(result.reward)}。`);
      }
      saveState();
      render(true);
    }
  });

  refs.mainlineHeader?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-claim-chapter]');
    if (!button) return;
    const result = claimChapterReward(state, button.dataset.claimChapter);
    if (result.ok) {
      showToast('主线完成', `获得${formatReward(result.reward)}。`);
    }
    saveState();
    render(true);
  });

  refs.dailyList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-claim-daily]');
    if (!button) return;
    const result = claimDailyTask(state, button.dataset.claimDaily);
    if (result.ok) {
      showToast('日常完成', `获得${formatReward(result.reward)}。`);
    }
    saveState();
    render(true);
  });

  refs.marketList?.addEventListener('click', (event) => {
    const refreshButton = event.target.closest('[data-refresh-market]');
    if (refreshButton) {
      const result = refreshMarketStock(state);
      if (result.ok) {
        showToast('坊市换货', '货架已刷新。');
      } else if (result.reason === 'notEnoughResources') {
        showToast('灵石不足', `刷新需要${formatReward(result.cost)}。`, 'warning');
      }
      saveState();
      render(true);
      return;
    }
    const button = event.target.closest('[data-buy-market]');
    if (!button) return;
    const result = buyMarketItem(state, button.dataset.buyMarket);
    if (result.ok) {
      showToast('坊市交易', `获得${formatReward(result.reward)}。`);
    } else if (result.reason === 'soldOut') {
      showToast('坊市售罄', '这件货物今日已购完。', 'warning');
    } else if (result.reason === 'notEnoughResources') {
      showToast('资源不足', '暂时买不起这件货物。', 'warning');
    }
    saveState();
    render(true);
  });

  document.querySelectorAll('[data-tab-group]').forEach((button) => {
    button.addEventListener('click', () => {
      const group = tabGroups[button.dataset.tabGroup];
      if (!group) {
        return;
      }
      if (button.dataset.tabGroup === 'practice' && isMobileLayout()) {
        activeTab = 'overview';
        localStorage.setItem('idle-xianxia-active-tab', activeTab);
        localStorage.setItem('idle-xianxia-practice-tab', activeTab);
        renderTabs();
        window.scrollTo?.({ top: 0, behavior: 'smooth' });
        return;
      }
      const remembered = localStorage.getItem(`idle-xianxia-${button.dataset.tabGroup}-tab`);
      activeTab = group.tabs.includes(remembered) ? remembered : group.tabs[0];
      localStorage.setItem('idle-xianxia-active-tab', activeTab);
      renderTabs();
      window.scrollTo?.({ top: 0, behavior: 'smooth' });
    });
  });

  refs.subTabs?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-tab]');
    if (!button || !panelTabs.includes(button.dataset.tab)) {
      return;
    }
    activeTab = button.dataset.tab;
    localStorage.setItem('idle-xianxia-active-tab', activeTab);
    localStorage.setItem(`idle-xianxia-${getTabGroup(activeTab)}-tab`, activeTab);
    renderTabs();
    window.scrollTo?.({ top: 0, behavior: 'smooth' });
  });

  refs.gearSubTabs?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-gear-section]');
    if (!button || !gearSections.includes(button.dataset.gearSection)) {
      return;
    }
    activeGearSection = button.dataset.gearSection;
    localStorage.setItem('idle-xianxia-gear-section', activeGearSection);
    renderGearSections();
  });

  refs.nextGuidance?.addEventListener('click', () => {
    if (refs.nextGuidance.dataset.guidanceAction === 'breakthrough') {
      document.querySelector('[data-breakthrough]')?.click();
      return;
    }
    const tab = refs.nextGuidance.dataset.gotoTab;
    if (!panelTabs.includes(tab)) {
      return;
    }
    activeTab = tab;
    localStorage.setItem('idle-xianxia-active-tab', activeTab);
    localStorage.setItem(`idle-xianxia-${getTabGroup(activeTab)}-tab`, activeTab);
    renderTabs();
  });

  document.querySelector('[data-reset]').addEventListener('click', () => {
    localStorage.removeItem(saveKey);
    openLootDetails.clear();
    state = createGameState();
    saveState();
    render(true);
  });

  render();
  showOfflineSummary();
  requestAnimationFrame(loop);
  setInterval(saveState, 5000);

  function createGameState(now = Date.now()) {
    return {
      balanceVersion: currentBalanceVersion,
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
      treasures: Object.fromEntries(Object.keys(treasures).map((id) => [id, 0])),
      spiritBeasts: Object.fromEntries(Object.keys(spiritBeasts).map((id) => [id, 0])),
      daoHearts: Object.fromEntries(Object.keys(daoHearts).map((id) => [id, 0])),
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
      log: [{ time: now, text: '你在青岚山开辟洞府，开始吐纳灵气。' }],
    };
  }

  function reviveGameState(saved, now = Date.now()) {
    const state = Object.assign(createGameState(now), saved);
    const savedBalanceVersion = Number(saved?.balanceVersion) || 0;
    state.realmIndex = Math.min(realms.length - 1, Math.max(0, Math.floor(Number(state.realmIndex) || 0)));
    if (savedBalanceVersion < 3) {
      state.realmIndex = migrateLegacyRealmIndex(state.realmIndex);
    }
    state.qi = Math.max(0, Number(state.qi) || 0);
    if (savedBalanceVersion < currentBalanceVersion) {
      state.qi = Math.min(state.qi, round(getCurrentRealm(state).requiredQi * 1.15));
    }
    state.balanceVersion = currentBalanceVersion;
    state.heartDemon = Math.max(0, Number(state.heartDemon) || 0);
    state.insight = Math.max(0, Number(state.insight) || 0);
    state.insightCarry = Math.max(0, Number(state.insightCarry) || 0);
    state.pillBoostUntil = Math.max(0, Number(state.pillBoostUntil) || 0);
    state.breakthroughBoostUntil = Math.max(0, Number(state.breakthroughBoostUntil) || 0);
    state.foundationStability = Math.max(0, Number(state.foundationStability) || 0);
    state.activeAlchemy = normalizeAlchemy(state.activeAlchemy);
    state.inventoryPills = normalizeInventoryPills(state.inventoryPills, state.pills);
    state.craftedPills = Math.max(0, Number(state.craftedPills) || 0);
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
    state.autoMissionId = missions[state.autoMissionId] ? state.autoMissionId : null;
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
    state.marketRefreshes = normalizeMarketRefreshes(state.marketRefreshes);
    state.marketStock = normalizeMarketStock(state.marketStock, state);
    state.gear = normalizeLevels(state.gear, gear);
    state.gearQuality = normalizeGearQuality(state.gearQuality);
    state.gearAffixes = normalizeGearAffixes(state.gearAffixes);
    state.lootEquipment = normalizeLootEquipment(state.lootEquipment);
    state.equippedLoot = normalizeEquippedLoot(state.equippedLoot, state.lootEquipment);
    state.lockedLoot = normalizeLockedLoot(state.lockedLoot, state.lootEquipment);
    state.treasures = normalizeLevels(state.treasures, treasures);
    state.spiritBeasts = normalizeLevels(state.spiritBeasts, spiritBeasts);
    state.daoHearts = normalizeLevels(state.daoHearts, daoHearts);
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
    state.cultivationPaths = normalizeLevels(state.cultivationPaths, cultivationPaths);
    state.formations = normalizeLevels(state.formations, formations);
    state.buildings = normalizeBuildings(state.buildings);
    state.pills = state.inventoryPills.gatherQiPill;
    state.log = Array.isArray(state.log) ? state.log.slice(0, 20) : [];
    state.activeMission = normalizeMission(state.activeMission);
    state.lastUpdatedAt = Number.isFinite(state.lastUpdatedAt) ? state.lastUpdatedAt : now;
    return state;
  }

  function loop(now) {
    const delta = Math.min((now - lastFrameAt) / 1000, 4);
    lastFrameAt = now;
    animationTime += delta;

    updateGame(state, delta, Date.now());
    render();
    drawWorld();
    requestAnimationFrame(loop);
  }

  function updateGame(state, deltaSeconds, now = Date.now()) {
    const seconds = Math.max(0, Math.min(deltaSeconds, 60 * 60 * 12));
    const realm = getCurrentRealm(state);
    state.qi = round(state.qi + (calculateQiRate(state, now) / 60) * seconds);
    state.stoneCarry += (realm.stoneRate / 60) * seconds;
    state.herbCarry += ((state.buildings.spiritField || 0) * buildings.spiritField.herbRatePerLevel + getSpiritBeastBonus(state, 'herbRate')) * seconds;
    state.insightCarry += ((state.buildings.scriptureLibrary || 0) * buildings.scriptureLibrary.insightRatePerLevel) * seconds;

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
  }

  function performBreakthrough(state, now = Date.now()) {
    const realm = getCurrentRealm(state);
    if (state.realmIndex >= realms.length - 1) {
      addLog(state, now, '此界修行已至尽头，静待新的机缘。');
      return { ok: false, reason: 'maxRealm' };
    }
    if (state.qi < realm.requiredQi) {
      addLog(state, now, '灵气尚未圆满，突破会伤及根基。');
      return { ok: false, reason: 'notEnoughQi' };
    }
    const chance = calculateBreakthroughChance(state, now);
    const preparation = getBreakthroughPreparation(state, now);
    if (Math.random() > chance) {
      state.qi = round(state.qi * preparation.qiRetention);
      if ((state.foundationStability || 0) > 0) {
        state.foundationStability = Math.max(0, state.foundationStability - 1);
      } else if (!preparation.demonGuard) {
        state.heartDemon += 1;
      }
      state.tribulationRecords ||= [];
      state.tribulationRecords.unshift({ time: now, realmIndex: state.realmIndex, result: 'failed', readyScore: preparation.readyScore });
      state.tribulationRecords = state.tribulationRecords.slice(0, 8);
      addLog(state, now, '突破时心魔骤起，灵气逆行，修为折损。');
      return { ok: false, reason: 'failed', chance, preparation };
    }
    const carriedQi = calculateBreakthroughCarryQi(state, realm);
    state.realmIndex += 1;
    state.qi = Math.min(carriedQi, round(getCurrentRealm(state).requiredQi * 0.4));
    state.heartDemon = Math.max(0, state.heartDemon - 1);
    state.insight += 1;
    state.foundationStability = 0;
    state.breakthroughBoostUntil = 0;
    state.breakthroughCount += 1;
    maybeOpenDaoHeartChoice(state, now);
    state.tribulationRecords ||= [];
    state.tribulationRecords.unshift({ time: now, realmIndex: state.realmIndex, result: 'success', readyScore: preparation.readyScore });
    state.tribulationRecords = state.tribulationRecords.slice(0, 8);
    addLog(state, now, `灵气贯通周天，突破至${getCurrentRealm(state).name}。`);
    return { ok: true, chance };
  }

  function maybeOpenDaoHeartChoice(state, now) {
    state.claimedDaoHeartRealms ||= {};
    const realmIndex = daoHeartRealmIndices.find((index) => (state.realmIndex || 0) >= index && !state.claimedDaoHeartRealms[String(index)]);
    if (realmIndex == null) {
      return;
    }
    state.pendingDaoHeartChoice = {
      realmIndex,
      choices: daoHeartChoices,
      createdAt: now,
    };
  }

  function startMapDepthTrial(state, mapId, now = Date.now()) {
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

    state.activeMission = {
      type: 'mapDepth',
      id: `depth:${mapId}:${status.nextLayer}`,
      mapId,
      layer: status.nextLayer,
      startedAt: now,
      endsAt: now + status.duration * 1000,
    };
    addLog(state, now, `深入${status.mapName}秘境第 ${status.nextLayer} 层。`);
    return { ok: true, status };
  }

  function setMissionApproach(state, mapId, approachId, now = Date.now()) {
    if (!missionMaps[mapId]) {
      return { ok: false, reason: 'unknownMap' };
    }
    if (!missionApproaches[approachId]) {
      return { ok: false, reason: 'unknownApproach' };
    }
    state.missionApproaches ||= {};
    state.missionApproaches[mapId] = approachId;
    addLog(state, now, `${missionMaps[mapId].name}改走「${missionApproaches[approachId].name}」路线。`);
    return { ok: true, mapId, approach: missionApproaches[approachId] };
  }

  function startMission(state, missionId, now = Date.now(), approachId = null) {
    if (state.activeMission || !missions[missionId]) {
      return;
    }
    const mission = missions[missionId];
    if (!getMissionStatus(state, missionId).unlocked) {
      addLog(state, now, `境界不足，暂不能进入「${mission.map || mission.name}」。`);
      return;
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
  }

  function craftPill(state, recipeId = 'gatherQiPill', now = Date.now()) {
    if (typeof recipeId === 'number') {
      now = recipeId;
      recipeId = 'gatherQiPill';
    }
    const recipe = pillRecipes[recipeId];
    if (!recipe) {
      return { ok: false, reason: 'unknownRecipe' };
    }
    const furnaceLevel = state.buildings.alchemyFurnace || 0;
    if (furnaceLevel < recipe.unlockLevel) {
      addLog(state, now, `${recipe.name}需要 ${recipe.unlockLevel} 级炼丹炉解锁。`);
      return { ok: false, reason: 'locked' };
    }
    if (state.activeAlchemy) {
      addLog(state, now, '丹炉正在炼制，暂时不能再开一炉。');
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

  function upgradeBuilding(state, buildingId, now = Date.now()) {
    const building = buildings[buildingId];
    if (!building) {
      return;
    }
    const currentLevel = state.buildings[buildingId] || 0;
    if (currentLevel >= building.maxLevel) {
      addLog(state, now, `${building.name}已升至当前上限。`);
      return;
    }
    const nextLevel = currentLevel + 1;
    if (nextLevel > getCaveUpgradeLimit(state)) {
      addLog(state, now, `${getCaveUpgradeTier(nextLevel).name}洞府需要更高境界。`);
      return { ok: false, reason: 'realmLocked' };
    }
    const cost = building.cost(nextLevel);
    if (!canAfford(state, cost)) {
      addLog(state, now, `升级${building.name}需要${formatReward(cost)}。`);
      return;
    }
    payResources(state, cost);
    state.buildings[buildingId] = nextLevel;
    addLog(state, now, `${building.name}升至 ${nextLevel} 级。`);
  }

  function upgradeGear(state, gearId, now = Date.now()) {
    const item = gear[gearId];
    if (!item) {
      return { ok: false, reason: 'unknownGear' };
    }
    const currentLevel = state.gear[gearId] || 0;
    if (currentLevel >= item.maxLevel) {
      addLog(state, now, `${item.name}已升至当前上限。`);
      return { ok: false, reason: 'maxLevel' };
    }
    if (currentLevel + 1 > getRealmUpgradeLimit(state)) {
      addLog(state, now, `${getUpgradeTier(currentLevel + 1).name}装备需要更高境界。`);
      return { ok: false, reason: 'realmLocked' };
    }
    const cost = item.cost(currentLevel + 1);
    if (!canAfford(state, cost)) {
      addLog(state, now, `升级${item.name}需要${formatReward(cost)}。`);
      return { ok: false, reason: 'notEnoughResources' };
    }
    payResources(state, cost);
    state.gear[gearId] = currentLevel + 1;
    addLog(state, now, `${item.name}升至 ${currentLevel + 1} 级。`);
    return { ok: true, level: currentLevel + 1 };
  }

  function upgradeCultivationPath(state, pathId, now = Date.now()) {
    const path = cultivationPaths[pathId];
    if (!path) {
      return { ok: false, reason: 'unknownPath' };
    }
    const currentLevel = state.cultivationPaths[pathId] || 0;
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

  function refineGear(state, gearId, now = Date.now(), random = Math.random) {
    const item = gear[gearId];
    if (!item) {
      return { ok: false, reason: 'unknownGear' };
    }
    if ((state.gear[gearId] || 0) <= 0) {
      return { ok: false, reason: 'notEquipped' };
    }
    const currentQuality = state.gearQuality[gearId] || 0;
    if (currentQuality >= gearQualities.length - 1) {
      addLog(state, now, `${item.name}已是极品。`);
      return { ok: false, reason: 'maxQuality' };
    }
    const cost = getRefineCost(currentQuality + 1);
    if (!canAfford(state, cost)) {
      addLog(state, now, `淬炼${item.name}需要${formatReward(cost)}。`);
      return { ok: false, reason: 'notEnoughResources' };
    }
    payResources(state, cost);
    const chance = getRefineChance(state, currentQuality);
    if (random() > chance) {
      addLog(state, now, `淬炼${item.name}火候不足，品质未提升。`);
      return { ok: false, reason: 'failed', chance };
    }
    state.gearQuality[gearId] = currentQuality + 1;
    state.gearAffixes[gearId] ||= rollAffixForGear(gearId, random);
    addLog(state, now, `${item.name}淬炼至${gearQualities[state.gearQuality[gearId]].name}，获得词条「${gearAffixes[state.gearAffixes[gearId]].name}」。`);
    return { ok: true, quality: state.gearQuality[gearId], affix: state.gearAffixes[gearId] };
  }

  function upgradeFormation(state, formationId, now = Date.now()) {
    const formation = formations[formationId];
    if (!formation) {
      return { ok: false, reason: 'unknownFormation' };
    }
    const currentLevel = state.formations[formationId] || 0;
    if (currentLevel >= formation.maxLevel) {
      addLog(state, now, `${formation.name}已升至当前上限。`);
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

  function stabilizeFoundation(state, now = Date.now()) {
    const cost = { spiritStones: 35, herbs: 8 };
    if (!canAfford(state, cost)) {
      addLog(state, now, `稳固根基需要${formatReward(cost)}。`);
      return { ok: false, reason: 'notEnoughResources' };
    }
    payResources(state, cost);
    state.foundationStability = Math.min(3, (state.foundationStability || 0) + 1);
    state.heartDemon = Math.max(0, state.heartDemon - 1);
    addLog(state, now, '运转周天稳固根基，本次突破更有把握。');
    return { ok: true, level: state.foundationStability };
  }

  function consumePill(state, recipeId = 'gatherQiPill', now = Date.now()) {
    if (typeof recipeId === 'number') {
      now = recipeId;
      recipeId = 'gatherQiPill';
    }
    const recipe = pillRecipes[recipeId];
    if (!recipe) {
      return { ok: false, reason: 'unknownRecipe' };
    }
    if ((state.inventoryPills[recipeId] || 0) <= 0) {
      addLog(state, now, '丹瓶已空。');
      return { ok: false };
    }
    state.inventoryPills[recipeId] -= 1;
    if (recipeId === 'gatherQiPill') {
      const alchemyBonus = 1 + (state.cultivationPaths.alchemy || 0) * cultivationPaths.alchemy.pillQiBonusPerLevel;
      state.qi = round(state.qi + (65 + state.realmIndex * 30) * alchemyBonus);
      state.pillBoostUntil = Math.max(state.pillBoostUntil || 0, now) + 120 * 1000;
      state.pills = state.inventoryPills.gatherQiPill;
      addLog(state, now, '服下一枚聚气丹，灵息周天暂时加快。');
    } else if (recipeId === 'clearHeartPill') {
      state.heartDemon = Math.max(0, state.heartDemon - 1);
      addLog(state, now, '服下一枚清心丹，心魔压力减轻。');
    } else if (recipeId === 'meridianPill') {
      state.breakthroughBoostUntil = Math.max(state.breakthroughBoostUntil || 0, now) + 180 * 1000;
      addLog(state, now, '服下一枚护脉丹，破境天机暂时明朗。');
    }
    return { ok: true };
  }

  function completeAlchemyIfReady(state, now) {
    if (!state.activeAlchemy || now < state.activeAlchemy.endsAt) {
      return;
    }

    const recipe = pillRecipes[state.activeAlchemy.recipeId] || pillRecipes.gatherQiPill;
    state.activeAlchemy = null;
    state.inventoryPills[recipe.id] = (state.inventoryPills[recipe.id] || 0) + 1;
    state.pills = state.inventoryPills.gatherQiPill;
    state.craftedPills += 1;
    addLog(state, now, `丹炉火候正好，炼成一枚${recipe.name}。`);
    showToast('炼丹完成', `获得 1 枚${recipe.name}。`);
  }

  function getMissionApproachOptions(state, mapId) {
    const selected = getSelectedMapApproach(state, mapId);
    const specialDrops = mapSpecialDrops[mapId] || {};
    return Object.values(missionApproaches).map((approach) => ({
      ...approach,
      selected: approach.id === selected.id,
      specialDrop: getMapSpecialDropTemplate(mapId, approach.id),
      specialDropCount: state.mapSpecialDrops?.[mapId]?.[approach.id] || 0,
      dropProgress: getApproachDropProgress(state, mapId, approach.id),
      comparison: getApproachComparison(state, mapId, approach.id),
      locked: approach.id !== 'balanced' && !specialDrops[approach.id],
    }));
  }

  function getMissionFailurePreview(state, mission, danger = getMissionDanger(state, mission)) {
    const penalty = { ...(mission.failurePenalty || {}) };
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
    const approach = missionApproaches[approachId] || missionApproaches.balanced;
    const selectedDuration = selected.durationMultiplier || 1;
    const selectedDanger = selected.dangerMultiplier || 1;
    return {
      durationDeltaPct: Math.round(((approach.durationMultiplier || 1) / selectedDuration - 1) * 100),
      dangerDeltaPct: Math.round(((approach.dangerMultiplier || 1) / selectedDanger - 1) * 100),
    };
  }

  function getApproachDropProgress(state, mapId, approachId) {
    const template = getMapSpecialDropTemplate(mapId, approachId);
    const approach = missionApproaches[approachId] || missionApproaches.balanced;
    const every = template?.every || approach.dropEvery || 0;
    if (!template || every <= 0) {
      return null;
    }
    const completed = state.mapApproachCompletions?.[mapId]?.[approachId] || 0;
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
    return missionApproaches[approachId] || missionApproaches.balanced;
  }

  function getMissionDuration(mission, approachId = 'balanced') {
    const approach = missionApproaches[approachId] || missionApproaches.balanced;
    return Math.max(10, Math.round(mission.duration * (approach.durationMultiplier || 1)));
  }

  function getMissionApproachReward(mission, approachId = 'balanced') {
    const approach = missionApproaches[approachId] || missionApproaches.balanced;
    return mergeRewards(approach.flatReward || {}, Object.fromEntries(
      Object.entries(approach.rewardBonus || {}).map(([resource, multiplier]) => {
        const base = mission.reward?.[resource] || 0;
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
      merged[resource] = round((merged[resource] || 0) + amount);
    });
    return filterCost(merged);
  }

  function getMapSpecialDropTemplate(mapId, approachId) {
    return mapSpecialDrops[mapId]?.[approachId] || null;
  }

  function resolveMapSpecialDrop(state, mission, approachId, completedCount, now) {
    const mapId = getMissionMapId(mission);
    const template = getMapSpecialDropTemplate(mapId, approachId);
    const approach = missionApproaches[approachId] || missionApproaches.balanced;
    const every = template?.every || approach.dropEvery || 0;
    if (!template || every <= 0 || completedCount <= 0 || completedCount % every !== 0) {
      return null;
    }
    applyResources(state, template.reward || {});
    state.mapSpecialDrops ||= {};
    state.mapSpecialDrops[mapId] ||= {};
    state.mapSpecialDrops[mapId][approachId] = (state.mapSpecialDrops[mapId][approachId] || 0) + 1;
    const drop = { name: template.name, reward: template.reward || {}, approachId };
    addLog(state, now, `${missionMaps[mapId]?.name || mission.name}路线收获「${template.name}」：${formatReward(template.reward || {})}。`);
    return drop;
  }

  function getFailureScoutingReputation(state, mission, danger) {
    const map = missionMaps[getMissionMapId(mission)];
    if (!map || !danger) {
      return 0;
    }
    const ratio = calculatePower(state) / danger;
    if (ratio < 0.72) {
      return 0;
    }
    return Math.max(1, Math.floor((map.reputationPerMission || 4) * 0.4));
  }

  function recordMapApproachCompletion(state, mapId, approachId) {
    state.mapApproachCompletions ||= {};
    state.mapApproachCompletions[mapId] ||= {};
    state.mapApproachCompletions[mapId][approachId] = (state.mapApproachCompletions[mapId][approachId] || 0) + 1;
    return state.mapApproachCompletions[mapId][approachId];
  }

  function getMissionDanger(state, mission, approachId = null) {
    const approach = getSelectedMissionApproach(state, mission, approachId);
    const pressure = getMissionPressure(state, mission);
    const approachPressure = round(pressure * (approach.dangerMultiplier || 1));
    return Math.max(0, approachPressure - getTieredLevelValue(state.gear.robe || 0, gear.robe.dangerReductionPerLevel) - getGearAffixBonus(state, 'dangerReduction') - getEquippedLootBonus(state, 'dangerReduction') - getMapMasteryBonus(state, 'dangerReduction') - getTreasureBonus(state, 'dangerReduction') - getSpiritBeastBonus(state, 'dangerReduction') - getDaoHeartBonus(state, 'dangerReduction') - (state.buildings.swordArray || 0) * buildings.swordArray.dangerReductionPerLevel - (state.cultivationPaths.sword || 0) * cultivationPaths.sword.dangerReductionPerLevel);
  }

  function getMissionPressure(state, mission) {
    const baseDanger = mission.danger || 0;
    if (baseDanger <= 0) {
      return 0;
    }
    const unlockStage = Math.max(0, mission.unlockRealmIndex || 0);
    if (unlockStage < 3) {
      return baseDanger;
    }
    const stageMultiplier = 1.6 + Math.max(0, unlockStage - 3) * 0.25;
    const rareEvery = Math.max(2, mission.rareEvery || 4);
    const completed = state.completedMissions?.[mission.id] || 0;
    const deepeningMultiplier = Math.min(0.28, Math.floor(completed / rareEvery) * 0.04);
    return round(baseDanger * (stageMultiplier + deepeningMultiplier));
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
    const mission = missions[active.id];
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
        reward: mission.failurePenalty || {},
        approach,
        approachReward: {},
        specialDrop: null,
        reputationGained,
        eventResult: null,
        rareReward: null,
        now,
      }));
      addLog(state, now, `挑战「${mission.name}」失利，负伤退回洞府${reputationGained ? `，摸清少许地势` : ''}。`);
      showToast('历练失利', `${mission.name} 道行不足，负伤并滋生心魔。`, 'warning');
      if (stopAutoMissionAfterFailure(state, mission.id, now)) {
        showToast('自动历练已停', '先提升道行或换低阶地图。', 'warning');
      }
      return;
    }
    applyResources(state, missionReward);
    state.completedMissions[mission.id] = (state.completedMissions[mission.id] || 0) + 1;
    const mapId = getMissionMapId(mission);
    const approachCompletedCount = recordMapApproachCompletion(state, mapId, approach.id);
    const reputationGained = missionMaps[mapId]?.reputationPerMission || 0;
    addMapReputation(state, mapId, reputationGained);
    const event = resolveMissionEvent(mission, state.completedMissions[mission.id]);
    let eventResult = null;
    if (event) {
      eventResult = applyMissionEvent(state, mission, event, now);
      showToast('历练奇遇', `${event.name}${eventResult.item ? ` · 获得${eventResult.item.name}` : ''}`);
    }
    let rareReward = null;
    if (mission.rareEvery && state.completedMissions[mission.id] % mission.rareEvery === 0) {
      applyResources(state, mission.rareReward);
      rareReward = mission.rareReward;
      addLog(state, now, `深入「${mission.map || mission.name}」有所感悟，额外获得${formatReward(mission.rareReward)}。`);
      showToast('稀有收获', `${mission.name} 额外获得${formatReward(mission.rareReward)}。`);
    }
    const specialDrop = resolveMapSpecialDrop(state, mission, approach.id, approachCompletedCount, now);
    if (specialDrop) {
      showToast('路线收获', `${specialDrop.name} · ${formatReward(specialDrop.reward)}`);
    }
    maybeCreateOpportunity(state, mission, now);
    addDailyProgress(state, 'missions', 1, now);
    recordMissionReport(state, createMissionReport(state, mission, {
      outcome: 'success',
      reward: missionReward,
      approach,
      approachReward,
      specialDrop,
      reputationGained,
      eventResult,
      rareReward,
      now,
    }));
    addLog(state, now, `完成「${mission.name}」，收获${formatReward(missionReward)}。`);
    showToast('历练完成', `${mission.name} 收获${formatReward(missionReward)}。`);
    triggerBattleFeedback('pulse');
    restartAutoMission(state, mission.id, now);
  }

  function completeMapDepthTrial(state, active, now) {
    const map = missionMaps[active.mapId];
    state.activeMission = null;
    if (!map) {
      return;
    }
    const layer = clampInteger(active.layer || 1, 1, mapDepthMaxLayer);
    const danger = getDepthDanger(state, map, layer);
    if (calculatePower(state) < danger) {
      const penalty = {
        qi: -Math.max(25, Math.round(layer * 12 + (map.unlockRealmIndex || 0) * 6)),
        heartDemon: layer >= 8 ? 1 : 0,
      };
      applyResources(state, penalty);
      state.injuryUntil = now + 120 * 1000;
      recordMissionReport(state, createDepthReport(state, map, layer, {
        outcome: 'failure',
        reward: penalty,
        reputationGained: 0,
        now,
      }));
      addLog(state, now, `${map.name}秘境第 ${layer} 层折返，劫象反噬。`);
      showToast('秘境折返', `${map.name}第 ${layer} 层劫象过重。`, 'warning');
      triggerBattleFeedback('shake');
      return;
    }

    const reward = getDepthReward(map, layer);
    const reputationGained = Math.ceil((map.reputationPerMission || 4) * 0.8 + layer / 3);
    applyResources(state, reward);
    state.mapDepths ||= {};
    state.mapDepths[map.id] = Math.max(state.mapDepths[map.id] || 0, layer);
    addMapReputation(state, map.id, reputationGained);
    addDailyProgress(state, 'missions', 1, now);
    addDailyProgress(state, 'depthTrials', 1, now);
    recordMissionReport(state, createDepthReport(state, map, layer, {
      outcome: 'success',
      reward,
      reputationGained,
      now,
    }));
    addLog(state, now, `打通${map.name}秘境第 ${layer} 层，获得${formatReward(reward)}。`);
    showToast('秘境突破', `${map.name}第 ${layer} 层收获${formatReward(reward)}。`);
    triggerBattleFeedback('pulse');
  }

  function createDepthReport(state, map, layer, { outcome, reward, reputationGained = 0, now = Date.now() }) {
    const rewardText = formatReward(reward);
    return {
      id: `depth-${map.id}-${layer}-${now}`,
      missionId: `depth:${map.id}`,
      missionName: `${map.name}秘境第 ${layer} 层`,
      mapId: map.id,
      mapName: map.name,
      outcome,
      reward: reward || {},
      rewardText,
      rareReward: null,
      rareRewardText: '',
      reputationGained,
      completedCount: state.mapDepths?.[map.id] || 0,
      event: null,
      summary: outcome === 'success'
        ? `打通${map.name}秘境第 ${layer} 层，收获${rewardText}。`
        : `${map.name}秘境第 ${layer} 层折返，劫象反噬${rewardText ? `：${rewardText}` : '。'}`,
      time: now,
    };
  }

  function recordMissionReport(state, report) {
    state.lastMissionReport = report;
    state.missionReportHistory = [report, ...(state.missionReportHistory || []).filter((item) => item?.id !== report.id)].slice(0, 5);
    return report;
  }

  function createMissionReport(state, mission, { outcome, reward, approach = getSelectedMissionApproach(state, mission), approachReward = {}, specialDrop = null, reputationGained = 0, eventResult = null, rareReward = null, now = Date.now() }) {
    const mapId = getMissionMapId(mission);
    const map = missionMaps[mapId];
    const rewardText = formatReward(reward);
    const approachRewardText = formatReward(approachReward);
    const specialDropText = specialDrop ? formatReward(specialDrop.reward || {}) : '';
    const rareRewardText = rareReward ? formatReward(rareReward) : '';
    const mapProgress = getReportMapProgress(state, mapId);
    const challenge = getMissionChallengeSnapshot(state, mission, approach);
    const event = eventResult?.event ? {
      id: eventResult.event.id,
      name: eventResult.event.name,
      reward: eventResult.event.reward || {},
      rewardText: formatReward(eventResult.event.reward || {}),
      equipmentName: eventResult.item?.name || null,
    } : null;
    const summary = outcome === 'success'
      ? `完成「${mission.name}」，收获${rewardText || '少许历练'}${event?.equipmentName ? `，并得${event.equipmentName}` : ''}。`
      : `「${mission.name}」失利，劫象反噬${rewardText ? `：${rewardText}` : ''}${reputationGained ? `，摸清少许地势，声望 +${reputationGained}。` : '。'}`;

    return {
      id: `${mission.id}-${now}`,
      missionId: mission.id,
      missionName: mission.name,
      mapId,
      mapName: map?.name || mission.map || mission.name,
      outcome,
      approach: approach ? { id: approach.id, name: approach.name } : null,
      reward: reward || {},
      rewardText,
      approachReward: approachReward || {},
      approachRewardText,
      specialDrop,
      specialDropText,
      rareReward: rareReward || null,
      rareRewardText,
      reputationGained,
      mapProgress,
      challenge,
      completedCount: state.completedMissions?.[mission.id] || 0,
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

  function render(forceLists = false) {
    const realm = getCurrentRealm(state);
    const progress = Math.max(0, Math.min(1, state.qi / realm.requiredQi));
    const remainingQi = Math.max(0, realm.requiredQi - state.qi);
    const activeMission = state.activeMission && !state.activeMission.type ? missions[state.activeMission.id] : null;
    const activeDepth = state.activeMission?.type === 'mapDepth' ? state.activeMission : null;

    refs.realm.textContent = realm.name;
    refs.qi.textContent = `${Math.floor(state.qi)} / ${realm.requiredQi}`;
    refs.qiRate.textContent = `${formatRate(calculateQiRate(state, Date.now()))} / 分钟`;
    if (refs.hudQi) refs.hudQi.textContent = `${Math.floor(state.qi)} / ${realm.requiredQi}`;
    if (refs.hudRate) refs.hudRate.textContent = `${formatRate(calculateQiRate(state, Date.now()))} / 分钟`;
    refs.stones.textContent = Math.floor(state.spiritStones);
    refs.herbs.textContent = Math.floor(state.herbs);
    refs.pills.textContent = Math.floor(state.pills);
    if (refs.clearHeartPills) refs.clearHeartPills.textContent = Math.floor(state.inventoryPills.clearHeartPill || 0);
    if (refs.meridianPills) refs.meridianPills.textContent = Math.floor(state.inventoryPills.meridianPill || 0);
    refs.beastCores.textContent = Math.floor(state.beastCores);
    refs.artifacts.textContent = Math.floor(state.artifacts);
    if (refs.arrayFlags) refs.arrayFlags.textContent = Math.floor(state.arrayFlags);
    if (refs.forgingEssence) refs.forgingEssence.textContent = Math.floor(state.forgingEssence || 0);
    refs.heartDemon.textContent = Math.floor(state.heartDemon);
    refs.power.textContent = calculatePower(state);
    refs.breakthroughChance.textContent = `${Math.round(calculateBreakthroughChance(state, Date.now()) * 100)}%`;
    refs.progress.style.width = `${progress * 100}%`;
    refs.progressText.textContent = remainingQi > 0 ? `距突破还差 ${Math.ceil(remainingQi)} 灵气` : '灵气圆满，可以尝试突破';
    if (refs.nextGuidance) {
      const guidance = getNextGuidance(state);
      refs.nextGuidance.innerHTML = `<strong>${guidance.title}</strong><span>${guidance.detail}</span>`;
      refs.nextGuidance.dataset.gotoTab = guidance.tab || 'goals';
      refs.nextGuidance.dataset.guidanceAction = guidance.action || '';
    }

    if (activeDepth) {
      const map = missionMaps[activeDepth.mapId];
      refs.mission.textContent = `${map?.name || '秘境'}第 ${activeDepth.layer} 层`;
      refs.missionTime.textContent = formatDuration((activeDepth.endsAt - Date.now()) / 1000);
    } else if (activeMission) {
      refs.mission.textContent = activeMission.name;
      refs.missionTime.textContent = formatDuration((state.activeMission.endsAt - Date.now()) / 1000);
    } else if (state.activeAlchemy) {
      refs.mission.textContent = `炼制${(pillRecipes[state.activeAlchemy.recipeId] || pillRecipes.gatherQiPill).name}`;
      refs.missionTime.textContent = formatDuration((state.activeAlchemy.endsAt - Date.now()) / 1000);
    } else {
      refs.mission.textContent = '闭关修炼';
      refs.missionTime.textContent = '待命';
    }
    if (refs.hudAction) refs.hudAction.textContent = refs.mission.textContent;

    if (refs.pillBoost) {
      const secondsLeft = Math.max(0, Math.ceil(((state.pillBoostUntil || 0) - Date.now()) / 1000));
      const meridianLeft = Math.max(0, Math.ceil(((state.breakthroughBoostUntil || 0) - Date.now()) / 1000));
      refs.pillBoost.textContent = secondsLeft > 0 ? `吐纳 ${formatDuration(secondsLeft)}` : meridianLeft > 0 ? `护脉 ${formatDuration(meridianLeft)}` : '未服丹';
    }
    if (refs.foundation) {
      refs.foundation.textContent = `${state.foundationStability || 0} / 3`;
    }
    if (refs.dominantPath) {
      const path = getDominantPath(state);
      refs.dominantPath.textContent = path.level > 0 ? `${path.name} ${path.level}` : path.name;
    }
    if (refs.upgradeLimit) {
      const limit = getRealmUpgradeLimit(state);
      refs.upgradeLimit.textContent = `${getUpgradeTier(limit).name} ${limit}`;
    }

    const logSignature = state.log.map((entry) => `${entry.time}:${entry.text}`).join('|');
    if (forceLists || renderCache.log !== logSignature) {
      refs.log.innerHTML = state.log
        .map((entry) => `<li><time>${new Date(entry.time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</time>${entry.text}</li>`)
        .join('');
      renderCache.log = logSignature;
    }

    renderGoals(forceLists);
    renderDailyTasks(forceLists);
    renderMarket(forceLists);
    renderAlchemy(forceLists);
    renderAttributes(forceLists);
    renderDaoHeart(forceLists);
    renderBreakthroughPreparation(forceLists);
    renderGear(forceLists);
    renderLoot(forceLists);
    renderFormations(forceLists);
    renderTreasures(forceLists);
    renderSpiritBeasts(forceLists);
    renderCultivation(forceLists);
    renderCave(forceLists);
    renderSect(forceLists);
    renderOpportunity(forceLists);
    renderMissionReport(forceLists);
    renderResourceGuidance(forceLists);
    renderMissions(forceLists);
    renderTabs();

    document.querySelectorAll('[data-start-mission]').forEach((button) => {
      button.disabled = Boolean(state.activeMission);
    });

    document.querySelectorAll('[data-auto-mission]').forEach((button) => {
      const active = state.autoMissionId === button.dataset.autoMission;
      button.classList.toggle('active', active);
      button.textContent = active ? '自动中' : '自动';
    });

  }

  function drawWorld() {
    const canvas = refs.canvas;
    const width = canvas.width;
    const height = canvas.height;
    const pulse = Math.sin(animationTime * 2);

    ctx.clearRect(0, 0, width, height);

    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, '#111827');
    sky.addColorStop(0.52, '#18313b');
    sky.addColorStop(1, '#23321f');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    drawMoon(width - 92, 76, 32 + pulse * 1.5);
    drawMountains(width, height);
    drawPlatform(width, height);
    drawCultivator(width / 2, height - 105, pulse);
    drawQiStreams(width, height);
  }

  function drawMoon(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#f7e7a6';
    ctx.shadowColor = '#f7e7a6';
    ctx.shadowBlur = 22;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function drawMountains(width, height) {
    [
      { y: height - 86, color: '#17262a', points: [0, 120, 250, 85, 420, 130, 610, 70, width, 120] },
      { y: height - 54, color: '#20372f', points: [0, 92, 180, 50, 330, 96, 510, 42, width, 80] },
    ].forEach((ridge) => {
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let i = 0; i < ridge.points.length; i += 2) {
        ctx.lineTo(ridge.points[i], ridge.y - ridge.points[i + 1]);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = ridge.color;
      ctx.fill();
    });
  }

  function drawPlatform(width, height) {
    ctx.fillStyle = '#3d3426';
    ctx.beginPath();
    ctx.ellipse(width / 2, height - 62, 150, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#9b7a38';
    ctx.beginPath();
    ctx.ellipse(width / 2, height - 69, 120, 18, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCultivator(x, y, pulse) {
    ctx.save();
    ctx.translate(x, y + pulse * 2);

    ctx.strokeStyle = 'rgba(124, 211, 183, 0.58)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i += 1) {
      ctx.beginPath();
      ctx.ellipse(0, 8, 34 + i * 20 + pulse * 3, 15 + i * 9, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.arc(0, -28, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#355f54';
    ctx.beginPath();
    ctx.moveTo(-24, 14);
    ctx.quadraticCurveTo(0, -24, 24, 14);
    ctx.lineTo(15, 36);
    ctx.lineTo(-15, 36);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  function drawQiStreams(width) {
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.45)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 9; i += 1) {
      const offset = (animationTime * 34 + i * 72) % (width + 140);
      const x = offset - 70;
      const y = 80 + Math.sin(animationTime * 1.5 + i) * 26 + i * 15;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 32, y - 26, x + 70, y + 4);
      ctx.stroke();
    }
  }

  function saveState() {
    localStorage.setItem(saveKey, JSON.stringify(state));
  }

  function loadState() {
    const saved = localStorage.getItem(saveKey);
    const now = Date.now();
    if (!saved) {
      return createGameState(now);
    }
    try {
      const revived = reviveGameState(JSON.parse(saved), now);
      const offlineSeconds = Math.floor((now - revived.lastUpdatedAt) / 1000);
      if (offlineSeconds > 5) {
        pendingOfflineSummary = applyOfflineProgress(revived, offlineSeconds, now);
        revived.log.unshift({ time: now, text: `闭关离线 ${formatDuration(offlineSeconds)}，灵气仍在缓慢增长。` });
      }
      return revived;
    } catch (error) {
      return createGameState(now);
    }
  }

  function getCurrentRealm(state) {
    return realms[state.realmIndex] || realms[0];
  }

  function getUpgradeTier(level) {
    return upgradeTiers.find((tier) => level >= tier.minLevel && level <= tier.maxLevel) || upgradeTiers[upgradeTiers.length - 1];
  }

  function getRealmUpgradeLimit(state) {
    return upgradeTiers.reduce((limit, tier) => (state.realmIndex >= tier.realmIndex ? tier.maxLevel : limit), upgradeTiers[0].maxLevel);
  }

  function getCaveUpgradeTier(level) {
    return caveUpgradeTiers.find((tier) => level >= tier.minLevel && level <= tier.maxLevel) || caveUpgradeTiers[caveUpgradeTiers.length - 1];
  }

  function getCaveUpgradeLimit(state) {
    return caveUpgradeTiers.reduce((limit, tier) => (state.realmIndex >= tier.realmIndex ? tier.maxLevel : limit), caveUpgradeTiers[0].maxLevel);
  }

  function getCaveStage(state) {
    const buildingIds = Object.keys(buildings);
    const totalLevel = buildingIds.reduce((total, id) => total + clampInteger(state.buildings?.[id] || 0, 0, buildings[id].maxLevel), 0);
    const level = Math.max(1, Math.min(caveStages.length, Math.ceil(totalLevel / buildingIds.length)));
    const stage = caveStages[level - 1] || caveStages[0];
    return {
      ...stage,
      totalLevel,
      next: caveStages[level] || null,
      maxLevel: caveStages.length,
    };
  }

  function getCaveStatus(state) {
    const stage = getCaveStage(state);
    const upgradeLimit = getCaveUpgradeLimit(state);
    return {
      stage,
      upgradeLimit,
      nextStageProgress: Math.min(1, stage.totalLevel / (stage.maxLevel * Object.keys(buildings).length)),
      summary: getCaveSummary(state),
      buildings: Object.values(buildings).map((building) => {
        const level = clampInteger(state.buildings?.[building.id] || 0, 0, building.maxLevel);
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

  function getDaoHeartChoices(state) {
    const pending = state.pendingDaoHeartChoice;
    if (!pending || !Array.isArray(pending.choices)) {
      return [];
    }
    return pending.choices
      .map((id) => {
        const heart = daoHearts[id];
        if (!heart) {
          return null;
        }
        const level = clampInteger(state.daoHearts?.[id] || 0, 0, heart.maxLevel);
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

  function chooseDaoHeart(state, heartId, now = Date.now()) {
    const pending = state.pendingDaoHeartChoice;
    if (!pending || !pending.choices?.includes(heartId) || !daoHearts[heartId]) {
      return { ok: false, reason: 'notAvailable' };
    }
    const heart = daoHearts[heartId];
    const level = clampInteger(state.daoHearts?.[heartId] || 0, 0, heart.maxLevel);
    if (level >= heart.maxLevel) {
      return { ok: false, reason: 'maxLevel' };
    }
    state.daoHearts ||= Object.fromEntries(Object.keys(daoHearts).map((id) => [id, 0]));
    state.claimedDaoHeartRealms ||= {};
    state.daoHearts[heartId] = level + 1;
    state.claimedDaoHeartRealms[String(pending.realmIndex)] = heartId;
    state.pendingDaoHeartChoice = null;
    addLog(state, now, `命格归位，凝成「${heart.name}」。`);
    maybeOpenDaoHeartChoice(state, now);
    return { ok: true, heart: { ...heart, level: level + 1 } };
  }

  function getBreakthroughPreparation(state, now = Date.now()) {
    const realm = getCurrentRealm(state);
    const qiReady = (state.qi || 0) >= realm.requiredQi;
    const foundation = clampInteger(state.foundationStability || 0, 0, 3);
    const meridianReady = Boolean(state.breakthroughBoostUntil && state.breakthroughBoostUntil > now);
    const amuletLevel = clampInteger(state.gear?.amulet || 0, 0, gear.amulet.maxLevel);
    const guardLevel = clampInteger(state.formations?.mountainGuard || 0, 0, formations.mountainGuard.maxLevel);
    const scriptureLevel = clampInteger(state.buildings?.scriptureLibrary || 0, 0, buildings.scriptureLibrary.maxLevel);
    const daoLevel = Object.values(state.daoHearts || {}).reduce((total, level) => total + (Number(level) || 0), 0);
    const demon = Math.max(0, Number(state.heartDemon) || 0);
    const items = [
      { id: 'qi', name: '灵机盈满', detail: `${Math.floor(state.qi || 0)} / ${realm.requiredQi}`, ready: qiReady, weight: 2 },
      { id: 'foundation', name: '根基沉稳', detail: `${foundation} / 3`, ready: foundation >= 2, weight: 2, backlash: foundation * 0.04 },
      { id: 'heartDemon', name: '魔息澄明', detail: demon > 0 ? `魔息 ${demon}` : '魔息未扰', ready: demon === 0, weight: 1 },
      { id: 'meridian', name: '护脉丹息', detail: meridianReady ? '丹息护持' : '丹息未续', ready: meridianReady, weight: 1, backlash: meridianReady ? 0.08 : 0 },
      { id: 'amulet', name: '符脉护持', detail: `${amuletLevel} / ${gear.amulet.maxLevel}`, ready: amuletLevel > 0, weight: 1, backlash: Math.min(0.08, amuletLevel * 0.018) },
      { id: 'guard', name: '山门护阵', detail: `${guardLevel} / ${formations.mountainGuard.maxLevel}`, ready: guardLevel > 0, weight: 1, backlash: Math.min(0.08, guardLevel * 0.018) },
      { id: 'scripture', name: '经卷回照', detail: `${scriptureLevel} / ${buildings.scriptureLibrary.maxLevel}`, ready: scriptureLevel > 0, weight: 1, backlash: Math.min(0.06, scriptureLevel * 0.012) },
      { id: 'daoHeart', name: '道心共鸣', detail: daoLevel > 0 ? `命格 ${daoLevel}` : '尚未凝命', ready: daoLevel > 0, weight: 1, backlash: Math.min(0.06, daoLevel * 0.02) },
    ];
    const maxScore = items.reduce((total, item) => total + item.weight, 0);
    const readyScore = round(items.reduce((total, item) => total + (item.ready ? item.weight : 0), 0) / maxScore);
    const backlashBuffer = Math.min(0.32, items.reduce((total, item) => total + (item.backlash || 0), 0));
    const qiRetention = round(0.5 + backlashBuffer);
    const demonGuard = foundation > 0 || meridianReady || guardLevel >= 2 || daoLevel > 0;
    const counsel = !qiReady ? '灵机未满，暂不宜叩关。' : readyScore >= 0.72 ? '诸缘较稳，可择机叩关。' : '气机可用，仍宜补足护持。';
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
    const meditation = Math.max(0, (state.buildings?.meditationSeat || 1) - 1) * buildings.meditationSeat.qiBonusPerLevel;
    const field = (state.buildings?.spiritField || 0) * buildings.spiritField.herbRatePerLevel;
    const sword = (state.buildings?.swordArray || 0) * buildings.swordArray.powerPerLevel;
    const furnace = (state.buildings?.alchemyFurnace || 0) * buildings.alchemyFurnace.speedBonusPerLevel;
    const forging = (state.buildings?.forgingHall || 0) * buildings.forgingHall.refineChancePerLevel;
    const scripture = (state.buildings?.scriptureLibrary || 0) * buildings.scriptureLibrary.breakthroughPerLevel;
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
    const safeLevel = clampInteger(level, 0, buildings[buildingId]?.maxLevel || 20);
    if (safeLevel <= 0 && buildingId !== 'meditationSeat') {
      return [];
    }
    if (buildingId === 'meditationSeat') {
      return [{ id: 'qiRate', label: '灵息增幅', value: round(Math.max(0, safeLevel - 1) * buildings.meditationSeat.qiBonusPerLevel), mode: 'percent' }];
    }
    if (buildingId === 'spiritField') {
      return [{ id: 'herbs', label: '灵草生长', value: round(safeLevel * buildings.spiritField.herbRatePerLevel * 60), suffix: ' / 分钟' }];
    }
    if (buildingId === 'alchemyFurnace') {
      return [{ id: 'alchemySpeed', label: '丹火缩时', value: round(Math.min(0.65, safeLevel * buildings.alchemyFurnace.speedBonusPerLevel)), mode: 'percent' }];
    }
    if (buildingId === 'swordArray') {
      return [
        { id: 'power', label: '护山道威', value: safeLevel * buildings.swordArray.powerPerLevel },
        { id: 'dangerReduction', label: '劫象消解', value: safeLevel * buildings.swordArray.dangerReductionPerLevel },
      ];
    }
    if (buildingId === 'forgingHall') {
      return [
        { id: 'refineChance', label: '淬炼把握', value: round(Math.min(0.12, safeLevel * buildings.forgingHall.refineChancePerLevel)), mode: 'percent' },
        { id: 'dismantle', label: '分解精魄', value: round(safeLevel * buildings.forgingHall.dismantleBonusPerLevel), mode: 'percent' },
      ];
    }
    if (buildingId === 'scriptureLibrary') {
      return [
        { id: 'breakthrough', label: '破境天机', value: round(Math.min(0.12, safeLevel * buildings.scriptureLibrary.breakthroughPerLevel)), mode: 'percent' },
        { id: 'insight', label: '悟道沉淀', value: round(safeLevel * buildings.scriptureLibrary.insightRatePerLevel * 3600), suffix: ' / 时辰' },
      ];
    }
    return [];
  }

  function getGearIntent(slot) {
    return gearIntents[slot] || { id: 'balanced', name: '守中', detail: '气机均衡，可稳步修行。' };
  }

  function getTieredLevelValue(level, perLevel) {
    const safeLevel = clampInteger(level, 0, upgradeTiers[upgradeTiers.length - 1].maxLevel);
    if (safeLevel <= 0 || !perLevel) return 0;
    const value = upgradeTiers.reduce((total, tier) => {
      const counted = Math.max(0, Math.min(safeLevel, tier.maxLevel) - tier.minLevel + 1);
      return total + counted * perLevel * tier.effectMultiplier;
    }, 0);
    return perLevel < 1 ? round(value) : Math.round(value);
  }

  function getTieredLootBonus(level) {
    const safeLevel = clampInteger(level, 0, upgradeTiers[upgradeTiers.length - 1].maxLevel);
    return round(upgradeTiers.reduce((total, tier) => {
      const counted = Math.max(0, Math.min(safeLevel, tier.maxLevel) - tier.minLevel + 1);
      return total + counted * tier.lootBonusPerLevel;
    }, 0));
  }

  function getTieredPercentBonus(level) {
    const safeLevel = clampInteger(level, 0, upgradeTiers[upgradeTiers.length - 1].maxLevel);
    return round(upgradeTiers.reduce((total, tier) => {
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

  function getMissionStatus(state, missionId) {
    const mission = missions[missionId];
    if (!mission) {
      return { exists: false, unlocked: false };
    }
    const mapId = getMissionMapId(mission);
    const approach = getSelectedMissionApproach(state, mission);
    const approachReward = getMissionApproachReward(mission, approach.id);
    const completed = state.completedMissions[missionId] || 0;
    const rareEvery = mission.rareEvery || 0;
    const rareStep = rareEvery && completed > 0 && completed % rareEvery === 0 ? rareEvery : completed % rareEvery;
    const recommendedPower = getMissionDanger(state, mission);
    return {
      exists: true,
      id: mission.id,
      name: mission.name,
      map: mission.map || '青岚山',
      unlocked: state.realmIndex >= (mission.unlockRealmIndex || 0),
      unlockRealmIndex: mission.unlockRealmIndex || 0,
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
      rareReward: mission.rareReward || null,
    };
  }

  function getMapStatuses(state) {
    return Object.values(missionMaps).map((map) => {
      const routes = Object.values(missions).filter((mission) => getMissionMapId(mission) === map.id);
      const exploration = getMapExplorationInfo(state, map.id);
      const completed = exploration.completed;
      const unlocked = state.realmIndex >= map.unlockRealmIndex;
      const defeated = Boolean(state.defeatedBosses[map.id]);
      const ready = unlocked && completed >= map.explorationTarget && !defeated;
      return {
        ...map,
        unlocked,
        routes: routes.map((mission) => mission.id),
        exploration,
        reputation: state.mapReputation[map.id] || 0,
        mastery: getMapMastery(state, map.id),
        readiness: getMapReadiness(state, map, routes),
        approachOptions: getMissionApproachOptions(state, map.id),
        selectedApproach: getSelectedMapApproach(state, map.id),
        depth: getMapDepthStatus(state, map.id),
        boss: {
          ...map.boss,
          status: defeated ? 'defeated' : ready ? 'ready' : unlocked ? 'hidden' : 'locked',
          defeated,
          omen: getBossOmen(state, map),
        },
      };
    });
  }

  function getMapDepthStatus(state, mapId) {
    const map = missionMaps[mapId];
    if (!map) {
      return { exists: false, unlocked: false };
    }
    const clearedLayer = clampInteger(state.mapDepths?.[mapId] || 0, 0, mapDepthMaxLayer);
    const maxed = clearedLayer >= mapDepthMaxLayer;
    const nextLayer = maxed ? mapDepthMaxLayer : clearedLayer + 1;
    const unlocked = state.realmIndex >= map.unlockRealmIndex;
    const pressure = maxed ? 0 : getDepthPressure(map, nextLayer);
    const danger = maxed ? 0 : getDepthDanger(state, map, nextLayer);
    const duration = getDepthDuration(map, nextLayer);
    const reward = maxed ? {} : getDepthReward(map, nextLayer);

    return {
      exists: true,
      mapId,
      mapName: map.name,
      clearedLayer,
      nextLayer,
      maxLayer: mapDepthMaxLayer,
      unlocked,
      maxed,
      pressure,
      danger,
      duration,
      reward,
      omen: buildOmen({
        power: calculatePower(state),
        pressure: danger,
        demon: nextLayer >= 8 ? 1 : 0,
        mapMastery: getMapMastery(state, map.id).level,
        unlocked,
      }),
    };
  }

  function getDepthPressure(map, layer) {
    const base = Math.max(70, (map.boss?.power || 180) * 0.35 + (map.unlockRealmIndex || 0) * 6);
    const ramp = 1 + (layer - 1) * 0.16 + Math.pow(Math.max(0, layer - 1), 1.35) * 0.035;
    return Math.round(base * ramp);
  }

  function getDepthDanger(state, map, layer) {
    return Math.max(0, getDepthPressure(map, layer) - getTieredLevelValue(state.gear?.robe || 0, gear.robe.dangerReductionPerLevel) - getGearAffixBonus(state, 'dangerReduction') - getEquippedLootBonus(state, 'dangerReduction') - getMapMasteryBonus(state, 'dangerReduction') - getTreasureBonus(state, 'dangerReduction') - getSpiritBeastBonus(state, 'dangerReduction') - getDaoHeartBonus(state, 'dangerReduction') - (state.buildings.swordArray || 0) * buildings.swordArray.dangerReductionPerLevel - (state.cultivationPaths?.sword || 0) * cultivationPaths.sword.dangerReductionPerLevel);
  }

  function getDepthDuration(map, layer) {
    return Math.min(420, Math.round(70 + layer * 9 + (map.unlockRealmIndex || 0) * 2));
  }

  function getDepthReward(map, layer) {
    const reward = {
      spiritStones: Math.round(28 + layer * 10 + (map.unlockRealmIndex || 0) * 8),
      qi: Math.round(35 + layer * 18 + (map.unlockRealmIndex || 0) * 6),
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
    if (layer === mapDepthMaxLayer) {
      reward.qiRateBonus = 0.02;
    }
    return reward;
  }

  function getMissionOmen(state, mission) {
    return buildOmen({
      power: calculatePower(state),
      pressure: getMissionDanger(state, mission),
      demon: mission.failurePenalty?.heartDemon || 0,
      mapMastery: getMapMastery(state, getMissionMapId(mission)).level,
      unlocked: state.realmIndex >= (mission.unlockRealmIndex || 0),
    });
  }

  function getMapReadiness(state, map, routes = []) {
    const unlocked = (state.realmIndex || 0) >= (map.unlockRealmIndex || 0);
    if (!unlocked) {
      return { label: '地势', name: '未感', ratio: 0, detail: '境界尚浅，山川气机仍未回应。' };
    }

    const pressures = routes
      .filter((mission) => (state.realmIndex || 0) >= (mission.unlockRealmIndex || 0))
      .map((mission) => getMissionDanger(state, mission))
      .filter((danger) => danger > 0);
    const pressure = pressures.length ? Math.min(...pressures) : 0;
    if (pressure <= 0) {
      return { label: '地势', name: '安稳', ratio: 1, detail: '此地劫象轻浅，可作为日常行游根基。' };
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
    return { label: '地势', name, ratio, power, pressure, detail };
  }

  function getBossOmen(state, map) {
    return buildOmen({
      power: calculatePower(state),
      pressure: map.boss.power,
      demon: map.boss.failurePenalty?.heartDemon || 0,
      mapMastery: getMapMastery(state, map.id).level,
      unlocked: state.realmIndex >= map.unlockRealmIndex,
    });
  }

  function buildOmen({ power, pressure, demon = 0, mapMastery = 0, unlocked = true }) {
    if (!unlocked) {
      return { label: '卦象', name: '缘浅', detail: '劫象未显，境界尚未引动此地气机。', counsel: '宜备：先稳固境界，再循图而行。' };
    }
    if (pressure <= 0) {
      return { label: '卦象', name: '大吉', detail: '劫象已平，气机顺遂。', counsel: '宜备：可安心行游。' };
    }
    const ratio = power / pressure;
    const name = ratio >= 1.3 ? '小吉' : ratio >= 0.95 ? '平' : ratio >= 0.72 ? '有险' : '大凶';
    const signs = [];
    if (demon > 0) signs.push('魔息偏盛');
    if (ratio < 1) signs.push('妖氛未散');
    if (mapMastery <= 1) signs.push('地势未熟');
    if (ratio < 1.15) signs.push('护持尚浅');
    const detail = signs.length ? `劫象：${[...new Set(signs)].join('，')}` : '劫象：气机相合';
    const counsel = ratio < 1
      ? '宜备：先凝练道威，或温养法袍护身。'
      : mapMastery <= 1
        ? '宜备：多行游此地，熟悉地脉。'
        : '宜备：气机已稳，可择机前往。';
    return { label: '卦象', name, detail, counsel };
  }

  function challengeMapBoss(state, mapId, now = Date.now()) {
    const map = missionMaps[mapId];
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
      applyResources(state, map.boss.failurePenalty || {});
      state.injuryUntil = now + 120 * 1000;
      addLog(state, now, `挑战${map.boss.name}失利，需继续提升道行。`);
      return { ok: false, reason: 'powerLow', requiredPower: map.boss.power };
    }
    applyResources(state, map.boss.reward);
    addMapReputation(state, map.id, map.boss.reputation || 0);
    state.defeatedBosses[map.id] = true;
    addLog(state, now, `镇压${map.boss.name}，${map.name}声望大涨，获得${formatReward(map.boss.reward)}。`);
    return { ok: true, reward: map.boss.reward, boss: map.boss };
  }

  function getGearQuality(state, gearId) {
    const qualityIndex = state.gearQuality[gearId] || 0;
    const affixId = state.gearAffixes[gearId] || null;
    const affix = affixId ? gearAffixes[affixId] : null;
    return {
      qualityIndex,
      qualityName: gearQualities[qualityIndex]?.name || gearQualities[0].name,
      affixId,
      affixName: affix?.name || '无词条',
    };
  }

  function getCharacterProfile(state, now = Date.now()) {
    const realm = getCurrentRealm(state);
    const attackSources = compactSources([
        { label: '境界威压', value: getRealmPower(state) },
      { label: '剑诀火候', value: (state.cultivationPaths.sword || 0) * cultivationPaths.sword.powerPerLevel },
      { label: '洞府剑阵', value: (state.buildings.swordArray || 0) * buildings.swordArray.powerPerLevel },
      { label: '兵刃品阶', value: getTieredLevelValue(state.gear.weapon || 0, gear.weapon.powerPerLevel) },
      { label: '炼器品相', value: Object.values(state.gearQuality || {}).reduce((total, qualityIndex) => total + (gearQualities[qualityIndex]?.powerBonus || 0), 0) },
      { label: '灵纹词条', value: getGearAffixBonus(state, 'powerBonus') },
      { label: '剑阵杀意', value: (state.formations.swordArray || 0) * formations.swordArray.powerPerLevel },
      { label: '奇珍加持', value: getEquippedLootBonus(state, 'power') },
      { label: '地脉熟稔', value: getMapMasteryBonus(state, 'power') },
      { label: '法宝灵蕴', value: getTreasureBonus(state, 'power') },
      { label: '灵兽护持', value: getSpiritBeastBonus(state, 'power') },
      { label: '命格道心', value: getDaoHeartBonus(state, 'power') },
      { label: '洞天底蕴', value: state.permanentBonuses.power || 0 },
      { label: '山门威望', value: Math.floor((state.sectReputation || 0) / 20) * 4 },
    ]);
    const cultivationSources = compactSources([
      { label: '境界周天', value: realm.qiRate, mode: 'base' },
      { label: '静室蒲团', value: ((state.buildings.meditationSeat || 1) - 1) * buildings.meditationSeat.qiBonusPerLevel, mode: 'percent' },
      { label: '聚灵阵纹', value: (state.formations.spiritGathering || 0) * formations.spiritGathering.qiBonusPerLevel, mode: 'percent' },
      { label: '护符灵纹', value: getGearAffixBonus(state, 'qiBonus'), mode: 'percent' },
      { label: '阵道感悟', value: (state.cultivationPaths.formation || 0) * cultivationPaths.formation.qiBonusPerLevel, mode: 'percent' },
      { label: '奇珍加持', value: getEquippedLootBonus(state, 'qiRate'), mode: 'percent' },
      { label: '地脉熟稔', value: getMapMasteryBonus(state, 'qiRate'), mode: 'percent' },
      { label: '法宝灵蕴', value: getTreasureBonus(state, 'qiRate'), mode: 'percent' },
      { label: '灵兽护持', value: getSpiritBeastBonus(state, 'qiRate'), mode: 'percent' },
      { label: '命格道心', value: getDaoHeartBonus(state, 'qiRate'), mode: 'percent' },
      { label: '洞天底蕴', value: state.permanentBonuses.qiRate || 0, mode: 'percent' },
      { label: '丹力催行', value: state.pillBoostUntil && state.pillBoostUntil > now ? 0.4 : 0, mode: 'percent' },
    ]);
    const breakthroughSources = compactSources([
      { label: '本命道基', value: 0.75, mode: 'percent' },
      { label: '护符护脉', value: Math.min(0.18, getTieredLevelValue(state.gear.amulet || 0, gear.amulet.breakthroughPerLevel)), mode: 'percent' },
      { label: '灵纹词条', value: Math.min(0.08, getGearAffixBonus(state, 'breakthrough')), mode: 'percent' },
      { label: '护山阵势', value: Math.min(0.12, (state.formations.mountainGuard || 0) * formations.mountainGuard.stabilityPerLevel), mode: 'percent' },
      { label: '奇珍加持', value: Math.min(0.1, getEquippedLootBonus(state, 'breakthrough')), mode: 'percent' },
      { label: '法宝灵蕴', value: Math.min(0.12, getTreasureBonus(state, 'breakthrough')), mode: 'percent' },
      { label: '命格道心', value: Math.min(0.1, getDaoHeartBonus(state, 'breakthrough')), mode: 'percent' },
      { label: '悟道灵光', value: Math.min(0.15, (state.insight || 0) * 0.03), mode: 'percent' },
      { label: '根基沉淀', value: Math.min(0.15, (state.foundationStability || 0) * 0.05), mode: 'percent' },
      { label: '心魔侵扰', value: -Math.min(0.35, (state.heartDemon || 0) * 0.15), mode: 'percent' },
    ], true);
    const explorationSafety = getTieredLevelValue(state.gear.robe || 0, gear.robe.dangerReductionPerLevel)
      + getGearAffixBonus(state, 'dangerReduction')
      + getEquippedLootBonus(state, 'dangerReduction')
      + getMapMasteryBonus(state, 'dangerReduction')
      + getTreasureBonus(state, 'dangerReduction')
      + getSpiritBeastBonus(state, 'dangerReduction')
      + getDaoHeartBonus(state, 'dangerReduction')
      + (state.cultivationPaths.sword || 0) * cultivationPaths.sword.dangerReductionPerLevel;
    return {
      realmName: realm.name,
      combatPower: { label: '道行总纲', value: calculatePower(state), sources: attackSources },
      attributes: [
        { id: 'attack', label: '道威', value: attackSources.reduce((total, source) => total + source.value, 0), sources: attackSources },
        { id: 'cultivationSpeed', label: '灵息', value: calculateQiRate(state, now), unit: '/分钟', sources: cultivationSources },
        { id: 'breakthrough', label: '破境天机', value: calculateBreakthroughChance(state, now), unit: '%', sources: breakthroughSources },
        { id: 'explorationSafety', label: '护体玄光', value: explorationSafety, sources: compactSources([
          { label: '法袍护身', value: getTieredLevelValue(state.gear.robe || 0, gear.robe.dangerReductionPerLevel) },
          { label: '灵纹词条', value: getGearAffixBonus(state, 'dangerReduction') },
          { label: '奇珍加持', value: getEquippedLootBonus(state, 'dangerReduction') },
          { label: '地脉熟稔', value: getMapMasteryBonus(state, 'dangerReduction') },
          { label: '法宝灵蕴', value: getTreasureBonus(state, 'dangerReduction') },
          { label: '灵兽护持', value: getSpiritBeastBonus(state, 'dangerReduction') },
          { label: '命格道心', value: getDaoHeartBonus(state, 'dangerReduction') },
        ]) },
        { id: 'sectInfluence', label: '山门气运', value: Math.floor(state.sectReputation || 0), sources: [{ label: getSectLevel(state).name, value: Math.floor(state.sectReputation || 0) }] },
      ],
    };
  }

  function getEquipmentDetails(state) {
    return {
      gear: Object.values(gear).map((item) => {
        const level = state.gear[item.id] || 0;
        const quality = getGearQuality(state, item.id);
        const affix = quality.affixId ? gearAffixes[quality.affixId] : null;
        const maxed = level >= item.maxLevel;
        const nextLevel = level + 1;
        const realmLocked = nextLevel > getRealmUpgradeLimit(state);
        const qualityMaxed = quality.qualityIndex >= gearQualities.length - 1;
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
          upgrade: { maxed, realmLocked, nextLevel, cost: maxed || realmLocked ? null : item.cost(nextLevel) },
          refinement: {
            maxed: qualityMaxed,
            nextQualityName: qualityMaxed ? null : gearQualities[nextQuality]?.name,
            chance: qualityMaxed || level <= 0 ? 0 : getRefineChance(state, quality.qualityIndex),
            cost: qualityMaxed || level <= 0 ? null : getRefineCost(nextQuality),
          },
        };
      }),
      loot: (state.lootEquipment || []).map((item) => ({
        uid: item.uid,
        name: item.name,
        slot: item.slot,
        level: item.level || 0,
        maxLevel: getLootMaxLevel(item),
        tier: getUpgradeTier(Math.max(1, item.level || 1)),
        intent: getGearIntent(item.slot),
        equipped: state.equippedLoot[item.slot] === item.uid,
        locked: Boolean(state.lockedLoot?.[item.uid]),
        effects: effectsFromBonusObject(item.bonuses || {}),
        comparison: compareLootEquipment(state, item),
        nextEffects: (item.level || 0) >= getLootMaxLevel(item) ? [] : effectsFromBonusObject(createLootBonuses(item.templateId, (item.level || 0) + 1)),
        empower: {
          maxed: (item.level || 0) >= getLootMaxLevel(item),
          nextLevel: (item.level || 0) + 1,
          cost: (item.level || 0) >= getLootMaxLevel(item) ? null : getLootEmpowerCost((item.level || 0) + 1),
        },
      })),
      treasures: Object.values(treasures).map((treasure) => {
        const level = state.treasures?.[treasure.id] || 0;
        return { id: treasure.id, name: treasure.name, detail: treasure.detail, level, maxLevel: treasure.maxLevel, effects: effectsFromBonusObject(scaleBonusObject(treasure.bonuses, level)), nextEffects: level < treasure.maxLevel ? effectsFromBonusObject(scaleBonusObject(treasure.bonuses, level + 1)) : [] };
      }),
      spiritBeasts: Object.values(spiritBeasts).map((beast) => {
        const level = state.spiritBeasts?.[beast.id] || 0;
        return { id: beast.id, name: beast.name, detail: beast.detail, level, maxLevel: beast.maxLevel, effects: effectsFromBonusObject(scaleBonusObject(beast.bonuses, level)), nextEffects: level < beast.maxLevel ? effectsFromBonusObject(scaleBonusObject(beast.bonuses, level + 1)) : [] };
      }),
    };
  }

  function getDominantPath(state) {
    const entries = Object.entries(state.cultivationPaths || {});
    const [pathId, level] = entries.reduce((best, current) => (current[1] > best[1] ? current : best), ['none', 0]);
    if (!level || !cultivationPaths[pathId]) {
      return { id: 'none', name: '未定', level: 0 };
    }
    return { id: pathId, name: cultivationPaths[pathId].name, level };
  }

  function getGoals(state) {
    return mainlineChapters[0].objectives.map((objective) => hydrateMainlineObjective(state, objective));
  }

  function getResourceGuidance(state) {
    const needs = collectResourceNeeds(state);
    const items = Object.values(needs)
      .map((need) => hydrateResourceNeed(state, need))
      .sort((a, b) => b.score - a.score || b.shortfall - a.shortfall)
      .slice(0, 3);
    if (!items.length) {
      return { stable: true, primary: null, items: [], summary: '当前资源缺口不明显，可以继续刷地图声望、推进秘境层数或准备下一次破境。' };
    }
    const primary = items[0];
    return { stable: false, primary, items, summary: `${primary.label}缺口最明显，${primary.route.detail}` };
  }

  function getMainlineChapters(state) {
    return mainlineChapters.map((chapter, index) => {
      const locked = !isMainlineChapterUnlocked(state, index);
      const objectives = chapter.objectives.map((objective) => hydrateMainlineObjective(state, objective));
      const completedCount = objectives.filter((objective) => objective.completed).length;
      const completed = completedCount === objectives.length;
      const allObjectivesClaimed = objectives.every((objective) => objective.claimed);
      const rewardClaimed = Boolean(state.claimedChapterRewards[chapter.id]);
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

  function hydrateMainlineObjective(state, objective) {
    return {
      id: objective.id,
      title: objective.title,
      detail: objective.detail,
      completed: Boolean(objective.completed(state)),
      claimed: Boolean(state.claimedGoals[objective.id]),
      reward: objective.reward,
    };
  }

  function isMainlineChapterUnlocked(state, index) {
    if (index <= 0) {
      return true;
    }
    return mainlineChapters.slice(0, index).every((chapter) => Boolean(state.claimedChapterRewards[chapter.id]));
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

  function getActiveMainlineChapter(state) {
    const chapters = getMainlineChapters(state);
    return chapters.find((chapter) => !chapter.locked && !chapter.rewardClaimed) || chapters[chapters.length - 1];
  }

  function getNextGuidance(state) {
    const activeMission = state.activeMission ? missions[state.activeMission.id] : null;
    if (activeMission) {
      return { title: `正在历练：${activeMission.name}`, detail: '等待历练完成，或先处理丹房、装备和宗门委托。', tab: 'missions' };
    }
    if (state.activeAlchemy) {
      const recipe = pillRecipes[state.activeAlchemy.recipeId] || pillRecipes.gatherQiPill;
      return { title: `正在炼制${recipe.name}`, detail: '丹成后服用或继续排下一炉，能明显提高突破准备效率。', tab: 'alchemy' };
    }
    const realm = getCurrentRealm(state);
    if ((state.qi || 0) >= realm.requiredQi && state.realmIndex < realms.length - 1) {
      return { title: '可以破境', detail: `灵气已满，当前破境天机 ${Math.round(calculateBreakthroughChance(state) * 100)}%。`, tab: 'overview', action: 'breakthrough' };
    }
    if ((state.completedMissions.cavePatrol || 0) < 1 && (state.realmIndex || 0) <= 1) {
      return { title: '先巡守洞府', detail: '去行游完成一次巡守，带回第一笔灵气和灵石。', tab: 'missions' };
    }
    if ((state.realmIndex || 0) <= 1) {
      return { title: '积攒灵气', detail: `距离下一次突破还差 ${Math.ceil(Math.max(0, realm.requiredQi - (state.qi || 0)))} 灵气。`, tab: 'goals' };
    }
    const readyBoss = getMapStatuses(state).find((map) => map.boss.status === 'ready' && calculatePower(state) >= map.boss.power);
    if (readyBoss) {
      return { title: `挑战${readyBoss.boss.name}`, detail: `${readyBoss.name}探索已足，镇压首领可获得永久成长和炼器精魄。`, tab: 'missions' };
    }
    const chapter = getMainlineChapters(state).find((candidate) => !candidate.locked && !candidate.rewardClaimed);
    const claimableObjective = chapter?.objectives.find((objective) => objective.completed && !objective.claimed);
    if (claimableObjective) {
      return { title: `领取${claimableObjective.title}`, detail: `目标已完成，可领取 ${formatReward(claimableObjective.reward)}。`, tab: 'goals' };
    }
    const nextObjective = chapter?.objectives.find((objective) => !objective.completed);
    if (nextObjective) {
      return { title: nextObjective.title, detail: nextObjective.detail, tab: getGuidanceTabForObjective(nextObjective.id) };
    }
    const sect = getSectStatus(state);
    if (sect.unlocked && sect.idle > 0) {
      return { title: '分配宗门弟子', detail: '空闲弟子不会产出，把弟子派去采药、采矿或护山。', tab: 'sect' };
    }
    const resourceGuidance = getResourceGuidance(state);
    if (!resourceGuidance.stable && resourceGuidance.primary) {
      const primary = resourceGuidance.primary;
      const commissionText = primary.commission?.unlocked ? `，宗门可派${primary.commission.name}` : '';
      return { title: `补足${primary.label}`, detail: `${primary.demandText}，${primary.route.detail}${commissionText}。`, tab: primary.route.unlocked ? 'missions' : 'market' };
    }
    return { title: '继续积累底蕴', detail: '刷地图声望、强化战利品、提升洞府和阵法，准备下一轮突破。', tab: 'missions' };
  }

  function getGuidanceTabForObjective(objectiveId) {
    if (/Mission|Trial|Boss|demon|Ruins|Tomb|Valley|Rift|realm|Realm/i.test(objectiveId)) {
      return objectiveId.toLowerCase().includes('realm') ? 'goals' : 'missions';
    }
    if (/Pill|alchemy/i.test(objectiveId)) return 'alchemy';
    if (/Gear|Armament|Loot|Formation/i.test(objectiveId)) return 'gear';
    if (/sect|Disciple/i.test(objectiveId)) return 'sect';
    if (/Field|building/i.test(objectiveId)) return 'cave';
    return 'goals';
  }

  function isDailyUnlocked(state) {
    return getGoals(state).filter((goal) => goal.completed).length >= 3;
  }

  function isDailyTaskUnlocked(state, task) {
    return isDailyUnlocked(state) && (state.realmIndex || 0) >= (task.unlockRealmIndex || 0);
  }

  function getDailyTasks(state, dateKey = getDateKey()) {
    const unlocked = isDailyUnlocked(state);
    const claims = state.dailyClaims[dateKey] || {};
    const progress = getDailyProgress(state, dateKey);
    return Object.values(dailyTasks).map((task) => {
      const taskUnlocked = unlocked && (state.realmIndex || 0) >= (task.unlockRealmIndex || 0);
      return {
        ...task,
        unlocked: taskUnlocked,
        progress: Math.min(task.target, Math.floor(progress[task.progressKey] || 0)),
        completed: taskUnlocked && (progress[task.progressKey] || 0) >= task.target,
        claimed: Boolean(claims[task.id]),
      };
    });
  }

  function renderDailyTasks(force = false) {
    if (!refs.dailyList || !refs.dailyStatus) {
      return;
    }

    const tasks = getDailyTasks(state);
    const unlocked = isDailyUnlocked(state);
    const claimable = tasks.some((task) => task.unlocked && task.completed && !task.claimed);
    refs.dailyStatus.textContent = unlocked ? (claimable ? '有奖励可领取' : '今日进度') : '完成 3 个目标解锁';
    const signature = tasks.map((task) => `${task.id}:${task.unlocked}:${task.progress}:${task.completed}:${task.claimed}`).join('|');
    if (!force && renderCache.daily === signature) {
      return;
    }

    refs.dailyList.innerHTML = tasks
      .map((task) => `
        <button data-claim-daily="${task.id}" ${!task.unlocked || !task.completed || task.claimed ? 'disabled' : ''}>
          <strong>${task.title}</strong>
          <span>${task.detail} · ${formatDailyProgress(task)}</span>
          <small>${formatDailyClaimHint(task)}</small>
        </button>
      `)
      .join('');
    renderCache.daily = signature;
  }

  function formatDailyClaimHint(task) {
    if (!isDailyUnlocked(state)) {
      return '完成 3 个新手目标后解锁';
    }
    if (!task.unlocked) {
      return `${realms[task.unlockRealmIndex]?.name || '更高境界'}后解锁`;
    }
    if (task.claimed) {
      return '已领取';
    }
    if (task.completed) {
      return `可领取 ${formatReward(task.reward)}`;
    }
    return `奖励 ${formatReward(task.reward)}`;
  }

  function renderMarket(force = false) {
    if (!refs.marketList) {
      return;
    }

    const stock = getMarketStock(state);
    const signature = `${stock.dateKey}:${stock.refreshIndex}:${stock.items.map((item) => `${item.id}:${item.bought}:${item.remaining}`).join('|')}:${state.spiritStones}:${state.herbs}:${state.beastCores}:${state.artifacts}:${state.arrayFlags}`;
    if (!force && renderCache.market === signature) {
      return;
    }

    refs.marketList.innerHTML = `
      <div class="market-refresh-row">
        <div>
          <strong>今日货架 <small>第 ${stock.refreshIndex + 1} 轮</small></strong>
          <span>货物随境界和刷新轮次变化，稀有材料会逐步上架。</span>
        </div>
        <button data-refresh-market>刷新 ${formatReward(stock.refreshCost)}</button>
      </div>
      ${stock.items
        .map((item) => `
        <button data-buy-market="${item.id}" ${item.soldOut ? 'disabled' : ''}>
          <strong>${item.name} · ${item.type}</strong>
          <span>获得 ${formatReward(item.reward)}</span>
          <small>${item.soldOut ? '今日售罄' : `价格 ${formatReward(item.cost)} · 限购 ${item.bought} / ${item.limit || 1}`}</small>
        </button>
      `)
        .join('')}
    `;
    renderCache.market = signature;
  }

  function renderResourceGuidance(force = false) {
    if (!refs.resourceGuidance) {
      return;
    }
    const guidance = getResourceGuidance(state);
    const signature = guidance.stable
      ? 'stable'
      : guidance.items.map((item) => `${item.resource}:${item.shortfall}:${item.route.mapId}:${item.route.approachId}:${item.commission?.id || ''}:${item.commission?.unlocked ? 1 : 0}`).join('|');
    if (!force && renderCache.resourceGuidance === signature) {
      return;
    }
    if (guidance.stable || !guidance.primary) {
      refs.resourceGuidance.innerHTML = `
        <div class="resource-guidance-card">
          <div>
            <strong>寻材指引 <small>底蕴均衡</small></strong>
            <span>${guidance.summary}</span>
          </div>
          <div class="resource-guidance-list">
            <div><b>可做</b><small>推进秘境层数、刷地图声望或整备下一件装备。</small></div>
          </div>
        </div>
      `;
      renderCache.resourceGuidance = signature;
      return;
    }
    const primary = guidance.primary;
    const routeText = primary.route.unlocked
      ? `${primary.route.mapName} · ${primary.route.approachName}`
      : `${primary.route.unlockRealmName}后解锁 ${primary.route.mapName}`;
    refs.resourceGuidance.innerHTML = `
      <div class="resource-guidance-card">
        <div>
          <strong>寻材指引 <small>${primary.label}缺口 ${primary.shortfall}</small></strong>
          <span>${primary.demandText}，${primary.route.detail}。</span>
          <small>${primary.detail}</small>
        </div>
        <div class="resource-guidance-list">
          <div><b>行游</b><small>${routeText}${primary.route.missionName ? ` · 可刷${primary.route.missionName}` : ''}</small></div>
          ${primary.commission ? `<div><b>宗门</b><small>${primary.commission.unlocked ? `派弟子做${primary.commission.name}` : `解锁后可做${primary.commission.name}`}</small></div>` : ''}
          ${primary.market ? `<div><b>坊市</b><small>${primary.market.unlocked ? `留意${primary.market.name}` : `${primary.market.unlockRealmName}后留意${primary.market.name}`}</small></div>` : ''}
          ${guidance.items.slice(1).map((item) => `<div><b>${item.label}</b><small>缺 ${item.shortfall} · ${item.route.mapName}${item.commission?.unlocked ? ` · ${item.commission.name}` : ''}</small></div>`).join('')}
        </div>
      </div>
    `;
    renderCache.resourceGuidance = signature;
  }

  function renderMissions(force = false) {
    if (!refs.missionList) {
      return;
    }
    const mapStatuses = getMapStatuses(state);
    const selectedMapId = resolveActiveMissionMapId(mapStatuses);
    const activeMap = mapStatuses.find((map) => map.id === selectedMapId) || mapStatuses[0];
    const signature = `${selectedMapId}|${state.realmIndex}|${state.autoMissionId || ''}|${state.activeMission?.id || ''}:${state.activeMission?.layer || ''}|${Object.keys(missions).map((id) => `${id}:${state.completedMissions[id] || 0}`).join('|')}|${Object.entries(state.mapReputation).map(([id, value]) => `${id}:${value}`).join('|')}|${Object.entries(state.mapDepths || {}).map(([id, value]) => `${id}:${value}`).join('|')}|${Object.keys(state.defeatedBosses).join('|')}`;
    if (!force && renderCache.missions === signature) {
      return;
    }
    refs.missionList.innerHTML = `
      <div class="mission-map-layout">
        ${renderMapSelector(mapStatuses)}
        <div class="mission-map-detail">
          ${activeMap ? renderMapGroup(activeMap) : ''}
        </div>
      </div>
    `;
    renderCache.missions = signature;
  }

  function resolveActiveMissionMapId(mapStatuses) {
    if (mapStatuses.some((map) => map.id === activeMissionMapId)) {
      return activeMissionMapId;
    }
    activeMissionMapId = mapStatuses.find((map) => map.unlocked)?.id || mapStatuses[0]?.id || missionMapIds[0];
    localStorage.setItem('idle-xianxia-mission-map', activeMissionMapId);
    return activeMissionMapId;
  }

  function renderOpportunity(force = false) {
    if (!refs.opportunity) {
      return;
    }
    const active = normalizeOpportunity(state.activeOpportunity);
    const signature = active ? `${active.id}:${getOpportunityResourceSignature(state, active.id)}` : 'none';
    if (!force && renderCache.opportunity === signature) {
      return;
    }
    if (!active) {
      refs.opportunity.innerHTML = '';
      refs.opportunity.hidden = true;
      renderCache.opportunity = signature;
      return;
    }
    const opportunity = opportunities[active.id];
    refs.opportunity.hidden = false;
    refs.opportunity.innerHTML = `
      <div>
        <span>当前机缘</span>
        <strong>${opportunity.name}</strong>
        <small>${opportunity.detail}</small>
      </div>
      <div class="opportunity-actions">
        ${opportunity.choices.map((choice) => {
          const affordable = canAfford(state, choice.cost || {});
          return `
          <button data-resolve-opportunity="${choice.id}" data-opportunity-affordable="${affordable}" class="${affordable ? '' : 'unaffordable'}">
            <strong>${choice.title}</strong>
            <span>${choice.detail}</span>
            <small>${formatChoiceCostReward(choice)}</small>
          </button>
        `;
        }).join('')}
      </div>
    `;
    renderCache.opportunity = signature;
  }

  function getOpportunityResourceSignature(state, opportunityId) {
    const opportunity = opportunities[opportunityId];
    const keys = new Set();
    opportunity?.choices.forEach((choice) => {
      Object.keys(choice.cost || {}).forEach((key) => keys.add(key));
    });
    return [...keys].sort().map((key) => `${key}:${state[key] || 0}`).join('|');
  }

  function renderMissionReport(force = false) {
    if (!refs.missionReport) {
      return;
    }
    const report = state.lastMissionReport;
    const signature = report ? `${report.id}:${report.outcome}:${report.rewardText}:${report.approach?.id || ''}:${report.approachRewardText || ''}:${report.specialDropText || ''}:${report.rareRewardText}:${report.event?.id || ''}` : 'none';
    if (!force && renderCache.missionReport === signature) {
      return;
    }
    if (!report) {
      refs.missionReport.hidden = true;
      refs.missionReport.innerHTML = '';
      renderCache.missionReport = signature;
      return;
    }
    const history = (state.missionReportHistory || []).filter((item) => item.id !== report.id).slice(0, 4);
    refs.missionReport.hidden = false;
    refs.missionReport.classList.toggle('failure', report.outcome === 'failure');
    refs.missionReport.innerHTML = `
      <header>
        <div>
          <span>${report.outcome === 'success' ? '历练结算' : '历练折损'}</span>
          <strong>${report.missionName}</strong>
          <small>${report.summary}</small>
        </div>
        <button data-dismiss-mission-report aria-label="关闭历练结算">收起</button>
      </header>
      <div class="mission-report-grid">
        <div><span>去处</span><strong>${report.mapName}</strong></div>
        <div><span>声望</span><strong>${report.reputationGained ? `+${report.reputationGained}` : '-'}</strong></div>
        ${report.mapProgress ? `<div><span>地势</span><strong>${report.mapProgress.label}</strong></div>` : ''}
        ${report.challenge ? `<div><span>道行</span><strong>${report.challenge.label}</strong></div>` : ''}
        <div><span>产出</span><strong>${report.rewardText || '-'}</strong></div>
        ${report.approach ? `<div><span>路线</span><strong>${report.approach.name}${report.approachRewardText ? ` · ${report.approachRewardText}` : ''}</strong></div>` : ''}
        ${report.specialDropText ? `<div><span>路线收获</span><strong>${report.specialDrop.name} · ${report.specialDropText}</strong></div>` : ''}
        ${report.rareRewardText ? `<div><span>稀有</span><strong>${report.rareRewardText}</strong></div>` : ''}
        ${report.event ? `<div><span>奇遇</span><strong>${report.event.name}${report.event.equipmentName ? ` · ${report.event.equipmentName}` : ''}</strong></div>` : ''}
      </div>
      ${history.length ? `
        <div class="mission-report-history">
          <span>近几次行游</span>
          ${history.map((item) => `<small>${item.outcome === 'success' ? '成' : '折'} · ${item.missionName} · ${item.rewardText || item.summary}</small>`).join('')}
        </div>
      ` : ''}
    `;
    renderCache.missionReport = signature;
    if (isMobileLayout() && activeTab === 'missions' && scrolledMissionReportId !== report.id) {
      scrolledMissionReportId = report.id;
      requestAnimationFrame(() => refs.missionReport.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }

  function renderMapGroup(map) {
    const routeList = map.routes.map((id) => missions[id]).filter(Boolean);
    return `
      <section class="map-group ${map.unlocked ? '' : 'locked'}">
        <div class="map-heading">
          <span class="map-icon">${map.icon}</span>
          <div>
            <h3>${map.name}</h3>
            <small>${map.description}</small>
          </div>
          <strong>${map.mastery.name}</strong>
        </div>
        <div class="map-progress">
          <span style="width:${Math.round(map.exploration.percent * 100)}%"></span>
        </div>
        <div class="map-meta">
          <small>${map.exploration.label}</small>
          <small>声望 ${Math.floor(map.reputation)}</small>
          <small>${map.unlocked ? `${map.readiness.label} ${map.readiness.name}` : `${realms[map.unlockRealmIndex]?.name || '更高境界'}解锁`}</small>
        </div>
        ${renderApproachSelector(map)}
        ${renderDepthCard(map)}
        ${renderBossCard(map)}
        <div class="mission-list">
          ${routeList.map((mission) => renderMissionCard(mission)).join('')}
        </div>
      </section>
    `;
  }

  function renderApproachSelector(map) {
    if (!map.approachOptions?.length) {
      return '';
    }
    return `
      <div class="approach-selector" aria-label="${map.name}历练路线">
        ${map.approachOptions.map((approach) => `
          <button data-select-approach="${map.id}:${approach.id}" class="${approach.selected ? 'active' : ''}" ${approach.locked || !map.unlocked ? 'disabled' : ''} type="button">
            <strong>${approach.name}</strong>
            <span>${approach.detail}</span>
            <small>${formatApproachComparison(approach)}</small>
            <small>${approach.specialDrop ? `专属 ${approach.specialDrop.name} · ${approach.dropProgress?.label || '0 / 2'} · ${formatReward(approach.specialDrop.reward)}` : '保持原收益'}</small>
          </button>
        `).join('')}
      </div>
    `;
  }

  function renderMapSelector(mapStatuses) {
    return `
      <div class="mission-map-selector" role="tablist" aria-label="历练地图">
        ${mapStatuses.map((map) => renderMapSelectButton(map)).join('')}
      </div>
    `;
  }

  function renderMapSelectButton(map) {
    const active = map.id === activeMissionMapId;
    const progress = Math.round(map.exploration.percent * 100);
    const statusText = map.unlocked ? `${map.readiness.label} ${map.readiness.name}` : `${realms[map.unlockRealmIndex]?.name || '更高境界'}解锁`;
    return `
      <button class="map-select-button ${active ? 'active' : ''} ${map.unlocked ? '' : 'locked'}" data-select-mission-map="${map.id}" role="tab" aria-selected="${active}">
        <span class="map-select-icon">${map.icon}</span>
        <span>
          <strong>${map.name}</strong>
          <small>${statusText}</small>
        </span>
        <em>${progress}%</em>
      </button>
    `;
  }

  function renderDepthCard(map) {
    const depth = map.depth;
    if (!depth) {
      return '';
    }
    return `
      <div class="depth-card ${depth.maxed ? 'maxed' : ''}">
        <div>
          <strong>秘境层数 <small>${depth.clearedLayer} / ${depth.maxLayer}</small></strong>
          <span>${depth.maxed ? '此地秘境已尽数打通。' : `${depth.omen.label} ${depth.omen.name} · 第 ${depth.nextLayer} 层`}</span>
          <small>${depth.maxed ? '可转往更高地图继续推进。' : `${formatDuration(depth.duration)} · 道行 ${calculatePower(state)} / 劫象 ${depth.danger} · 首通 ${formatReward(depth.reward)}`}</small>
        </div>
        <button data-start-depth="${map.id}" ${depth.maxed || !depth.unlocked || state.activeMission ? 'disabled' : ''}>${depth.maxed ? '已圆满' : '深入'}</button>
      </div>
    `;
  }

  function renderBossCard(map) {
    const statusText = {
      locked: '未解锁',
      hidden: '探索不足',
      ready: '可挑战',
      defeated: '已镇压',
    }[map.boss.status] || '未发现';
    const disabled = map.boss.status !== 'ready' || Boolean(state.activeMission);
    return `
      <div class="boss-card ${map.boss.status}">
        <div class="boss-mark">${map.icon}</div>
        <div>
          <strong>${map.boss.name} <small>${map.boss.title}</small></strong>
          <span>${map.boss.omen.detail} · ${map.boss.omen.counsel}</span>
          <span>探索 ${map.exploration.cappedCompleted} / ${map.exploration.target} · 道行 ${calculatePower(state)} / ${map.boss.power}</span>
          <span>馈赠 ${formatReward(map.boss.reward)}</span>
        </div>
        <button data-challenge-boss="${map.id}" ${disabled ? 'disabled' : ''}>${statusText}</button>
      </div>
    `;
  }

  function renderMissionCard(mission) {
    const status = getMissionStatus(state, mission.id);
    const active = state.autoMissionId === mission.id;
    const running = Boolean(state.activeMission);
    const lockedText = status.unlocked ? '' : `${realms[status.unlockRealmIndex]?.name || '更高境界'}解锁`;
    const rareText = mission.rareReward ? `稀有 ${status.rareProgress} · ${formatReward(mission.rareReward)}` : '无稀有奖励';
    const eventText = mission.events?.length ? `奇遇 ${mission.events.map((id) => missionEvents[id]?.name).filter(Boolean).join(' / ')}` : '无奇遇';
    const approachText = `${status.approach.name}${status.approachReward && formatReward(status.approachReward) ? ` · 路线 ${formatReward(status.approachReward)}` : ''}`;
    const specialText = status.specialDrop ? `专属 ${status.specialDrop.name} · ${formatReward(status.specialDrop.reward)}` : '无专属掉落';
    const failureText = status.failurePreview?.penaltyText ? `失利 ${status.failurePreview.penaltyText}${status.failurePreview.scoutingReputation ? ` · 摸清地势 +${status.failurePreview.scoutingReputation}` : ''}` : '失利无额外折损';
    return `
      <div class="mission-card ${status.unlocked ? '' : 'locked'}">
        <button data-start-mission="${mission.id}" ${running || !status.unlocked ? 'disabled' : ''}>
          <strong>${mission.name}</strong>
          <span>${status.unlocked ? `${formatDuration(getMissionDuration(mission, status.approach.id))} · ${status.omen.label} ${status.omen.name} · ${approachText}` : lockedText}</span>
          <small>产出 ${formatReward(status.rewardPreview)}</small>
        </button>
        <button data-auto-mission="${mission.id}" class="mini-button ${active ? 'active' : ''}" ${!status.unlocked ? 'disabled' : ''}>${active ? '自动中' : '自动'}</button>
        <details class="mission-card-details">
          <summary>展开详情</summary>
          <small>${status.unlocked ? `${status.omen.detail} · ${status.omen.counsel}` : '缘机未至'} · ${failureText} · ${rareText} · ${specialText} · ${eventText}</small>
        </details>
      </div>
    `;
  }

  function claimDailyTask(state, taskId, dateKey = getDateKey(), now = Date.now()) {
    const task = dailyTasks[taskId];
    if (!task) {
      return { ok: false, reason: 'unknownTask' };
    }
    if (!isDailyTaskUnlocked(state, task)) {
      return { ok: false, reason: 'locked' };
    }
    const progress = getDailyProgress(state, dateKey);
    if ((progress[task.progressKey] || 0) < task.target) {
      return { ok: false, reason: 'notComplete' };
    }
    state.dailyClaims[dateKey] ||= {};
    if (state.dailyClaims[dateKey][taskId]) {
      return { ok: false, reason: 'alreadyClaimed' };
    }
    applyResources(state, task.reward);
    state.dailyClaims[dateKey][taskId] = true;
    addLog(state, now, `完成日常「${task.title}」，获得${formatReward(task.reward)}。`);
    return { ok: true, reward: task.reward };
  }

  function getMarketStock(state, dateKey = getDateKey()) {
    state.marketStock = normalizeMarketStock(state.marketStock, state, dateKey);
    if (!state.marketStock || state.marketStock.dateKey !== dateKey) {
      state.marketStock = createMarketStock(state, dateKey, state.marketRefreshes?.[dateKey] || 0);
    }
    const purchases = state.marketPurchases?.[dateKey] || {};
    return {
      dateKey,
      refreshIndex: state.marketStock.refreshIndex,
      refreshCost: getMarketRefreshCost(state, dateKey),
      items: state.marketStock.items.map((itemId) => {
        const item = marketItems[itemId];
        const bought = purchases[itemId] || 0;
        return {
          ...item,
          bought,
          remaining: Math.max(0, (item.limit || 1) - bought),
          soldOut: bought >= (item.limit || 1),
        };
      }).filter(Boolean),
    };
  }

  function refreshMarketStock(state, dateOrNow = getDateKey(), now = Date.now()) {
    const dateKey = typeof dateOrNow === 'string' ? dateOrNow : getDateKey(dateOrNow);
    const actionTime = typeof dateOrNow === 'string' ? now : dateOrNow;
    const cost = getMarketRefreshCost(state, dateKey);
    if (!canAfford(state, cost)) {
      addLog(state, actionTime, `刷新坊市货架需要${formatReward(cost)}。`);
      return { ok: false, reason: 'notEnoughResources', cost };
    }
    payResources(state, cost);
    state.marketRefreshes ||= {};
    state.marketRefreshes[dateKey] = (state.marketRefreshes[dateKey] || 0) + 1;
    state.marketStock = createMarketStock(state, dateKey, state.marketRefreshes[dateKey]);
    addLog(state, actionTime, '坊市货架已换新。');
    return { ok: true, stock: getMarketStock(state, dateKey), cost };
  }

  function buyMarketItem(state, itemId, dateOrNow = Date.now(), now = Date.now()) {
    const dateKey = typeof dateOrNow === 'string' ? dateOrNow : getDateKey(dateOrNow);
    const actionTime = typeof dateOrNow === 'string' ? now : dateOrNow;
    const item = marketItems[itemId];
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
      showToast('灵石不足', `购买${item.name}需要${formatReward(item.cost)}。`, 'warning');
      return { ok: false, reason: 'notEnoughResources' };
    }
    payResources(state, item.cost);
    applyResources(state, item.reward);
    addDailyProgress(state, 'marketBuys', 1, actionTime);
    state.marketPurchases[dateKey] ||= {};
    state.marketPurchases[dateKey][itemId] = (state.marketPurchases[dateKey][itemId] || 0) + 1;
    addLog(state, actionTime, `坊市购得${item.name}，获得${formatReward(item.reward)}。`);
    return { ok: true, reward: item.reward };
  }

  function getSectStatus(state) {
    const unlocked = isSectUnlocked(state);
    const disciples = state.sectDisciples || 0;
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
      reputation: Math.floor(state.sectReputation || 0),
      commissionBonus: sectLevel.commissionBonus,
      roster: roster.map((disciple) => hydrateDisciple(disciple)),
      recruitCost: disciples >= capacity ? null : getRecruitCost(disciples + 1),
      commissions: Object.values(sectCommissions).map((commission) => ({
        ...commission,
        assigned: assignments[commission.id] || 0,
        outputMultiplier: round(getCommissionMultiplier(state, commission.id)),
      })),
    };
  }

  function recruitDisciple(state, now = Date.now()) {
    if (!isSectUnlocked(state)) {
      return { ok: false, reason: 'locked' };
    }
    const capacity = getSectCapacity(state);
    const current = state.sectDisciples || 0;
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

  function assignSectDisciple(state, commissionId, delta = 1, now = Date.now()) {
    if (!isSectUnlocked(state)) {
      return { ok: false, reason: 'locked' };
    }
    const commission = sectCommissions[commissionId];
    if (!commission) {
      return { ok: false, reason: 'unknownCommission' };
    }
    state.sectAssignments = normalizeSectAssignments(state.sectAssignments, state.sectDisciples || 0);
    const current = state.sectAssignments[commissionId] || 0;
    const assigned = Object.values(state.sectAssignments).reduce((total, count) => total + count, 0);
    const safeDelta = Math.trunc(Number(delta) || 0);
    if (safeDelta > 0 && assigned >= (state.sectDisciples || 0)) {
      return { ok: false, reason: 'noIdleDisciple' };
    }
    if (safeDelta < 0 && current <= 0) {
      return { ok: false, reason: 'noneAssigned' };
    }
    const next = Math.max(0, current + safeDelta);
    state.sectAssignments[commissionId] = next;
    state.sectRoster = normalizeSectRoster(state.sectRoster, state.sectDisciples || 0);
    syncSectRosterJobs(state);
    addLog(state, now, `${commission.name}现有 ${next} 名弟子。`);
    return { ok: true, assigned: next };
  }

  function resolveOpportunity(state, choiceId, now = Date.now(), random = Math.random) {
    const active = normalizeOpportunity(state.activeOpportunity);
    if (!active) {
      return { ok: false, reason: 'noOpportunity' };
    }
    const opportunity = opportunities[active.id];
    const choice = opportunity?.choices.find((candidate) => candidate.id === choiceId);
    if (!opportunity || !choice) {
      return { ok: false, reason: 'unknownChoice' };
    }
    if (!canAfford(state, choice.cost || {})) {
      addLog(state, now, `处理${opportunity.name}需要${formatReward(choice.cost)}。`);
      return { ok: false, reason: 'notEnoughResources', opportunity, choice, cost: choice.cost || {} };
    }

    payResources(state, choice.cost || {});
    const chance = choice.successChance ?? 1;
    if (random() > chance) {
      applyResources(state, choice.failurePenalty || {});
      state.activeOpportunity = null;
      addResolvedOpportunity(state, opportunity.id);
      addLog(state, now, `机缘「${opportunity.name}」处理失手，承受${formatReward(choice.failurePenalty || {}) || '些许反噬'}。`);
      return { ok: false, reason: 'failed', chance, opportunity, choice };
    }

    applyResources(state, choice.reward || {});
    state.activeOpportunity = null;
    addResolvedOpportunity(state, opportunity.id);
    addLog(state, now, `机缘「${opportunity.name}」选择「${choice.title}」，获得${formatReward(choice.reward || {})}。`);
    return { ok: true, reward: choice.reward || {}, opportunity, choice };
  }

  function upgradeTreasure(state, treasureId, now = Date.now()) {
    const treasure = treasures[treasureId];
    if (!treasure) {
      return { ok: false, reason: 'unknownTreasure' };
    }
    state.treasures = normalizeLevels(state.treasures, treasures);
    const currentLevel = state.treasures[treasureId] || 0;
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

  function trainSpiritBeast(state, beastId, now = Date.now()) {
    const beast = spiritBeasts[beastId];
    if (!beast) {
      return { ok: false, reason: 'unknownSpiritBeast' };
    }
    state.spiritBeasts = normalizeLevels(state.spiritBeasts, spiritBeasts);
    const currentLevel = state.spiritBeasts[beastId] || 0;
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

  function renderAlchemy(force = false) {
    if (!refs.alchemyList) {
      return;
    }
    const furnaceLevel = state.buildings.alchemyFurnace || 0;
    const signature = Object.values(pillRecipes)
      .map((recipe) => `${recipe.id}:${furnaceLevel}:${state.inventoryPills[recipe.id] || 0}:${Boolean(state.activeAlchemy)}:${state.activeAlchemy?.recipeId || ''}`)
      .join('|');
    if (!force && renderCache.alchemy === signature) {
      return;
    }
    refs.alchemyList.innerHTML = Object.values(pillRecipes)
      .map((recipe) => {
        const locked = furnaceLevel < recipe.unlockLevel;
        const count = state.inventoryPills[recipe.id] || 0;
        return `
          <div class="system-row">
            <div>
              <strong>${recipe.name} <small>${count} 枚</small></strong>
              <span>${getRecipeEffectText(recipe.id)}</span>
              <small>${locked ? `${recipe.unlockLevel} 级炼丹炉解锁` : `炼制 ${formatDuration(getAlchemyDuration(state, recipe))} · ${formatReward(recipe.cost)}`}</small>
            </div>
            <div class="row-actions">
              <button data-craft-recipe="${recipe.id}" ${locked || state.activeAlchemy ? 'disabled' : ''}>炼制</button>
              <button data-consume-recipe="${recipe.id}" ${count <= 0 ? 'disabled' : ''}>服用</button>
            </div>
          </div>
        `;
      })
      .join('');
    renderCache.alchemy = signature;
  }

  function renderGear(force = false) {
    if (!refs.gearList) {
      return;
    }
    const signature = `${getRealmUpgradeLimit(state)}|${Object.keys(gear).map((id) => `${id}:${state.gear[id] || 0}:${state.gearQuality[id] || 0}:${state.gearAffixes[id] || ''}`).join('|')}`;
    if (!force && renderCache.gear === signature) {
      return;
    }
    const details = getEquipmentDetails(state);
    refs.gearList.innerHTML = details.gear
      .map((item) => renderGearRow(item))
      .join('');
    renderCache.gear = signature;
  }

  function renderAttributes(force = false) {
    if (!refs.attributeList) {
      return;
    }
    const profile = getCharacterProfile(state, Date.now());
    const signature = JSON.stringify(profile);
    if (!force && renderCache.attributes === signature) {
      return;
    }
    if (refs.profileRealm) {
      refs.profileRealm.textContent = profile.realmName;
    }
    refs.attributeList.innerHTML = profile.attributes
      .map((attribute) => `
        <details class="attribute-row">
          <summary>
            <strong>${attribute.label}<span>${formatAttributeValue(attribute)}</span></strong>
            <small>展开查看气机来源</small>
          </summary>
          <div class="source-list">
            ${attribute.sources.length ? attribute.sources.map((source) => `<span>${formatSourceValue(source)}</span>`).join('') : '<span>暂无额外来源</span>'}
          </div>
        </details>
      `)
      .join('');
    renderCache.attributes = signature;
  }

  function renderDaoHeart(force = false) {
    if (!refs.daoHeartList) {
      return;
    }
    const choices = getDaoHeartChoices(state);
    const claimed = Object.values(state.claimedDaoHeartRealms || {}).filter(Boolean);
    const signature = `${JSON.stringify(state.daoHearts || {})}|${state.pendingDaoHeartChoice?.realmIndex || ''}|${claimed.join('|')}`;
    if (!force && renderCache.daoHeart === signature) {
      return;
    }
    const owned = Object.values(daoHearts)
      .filter((heart) => (state.daoHearts?.[heart.id] || 0) > 0)
      .map((heart) => {
        const level = state.daoHearts[heart.id] || 0;
        return `<li><strong>${heart.name} ${level} / ${heart.maxLevel}</strong><span>${formatEffects(effectsFromBonusObject(scaleBonusObject(heart.bonuses, level)))}</span></li>`;
      })
      .join('');
    refs.daoHeartList.innerHTML = `
      <header>
        <h3>${choices.length ? '命格择定' : '命格道心'}</h3>
        <span>${claimed.length ? `${claimed.length} 道` : '未凝命格'}</span>
      </header>
      ${choices.length ? `
        <p>破境后道心浮现，择其一凝入命格。</p>
        <div class="dao-choice-grid">
          ${choices.map((choice) => `
            <button data-choose-dao-heart="${choice.id}" type="button">
              <strong>${choice.name}</strong>
              <span>${choice.detail}</span>
              <small>${formatEffects(choice.effects)}</small>
            </button>
          `).join('')}
        </div>
      ` : `
        <ul class="dao-heart-list">
          ${owned || '<li><strong>道心未显</strong><span>筑基、金丹、元婴大关后会出现命格选择。</span></li>'}
        </ul>
      `}
    `;
    renderCache.daoHeart = signature;
  }

  function renderBreakthroughPreparation(force = false) {
    if (!refs.breakthroughPrep) {
      return;
    }
    const preparation = getBreakthroughPreparation(state, Date.now());
    const signature = JSON.stringify(preparation);
    if (!force && renderCache.breakthroughPrep === signature) {
      return;
    }
    refs.breakthroughPrep.innerHTML = `
      <header>
        <h3>${preparation.title}</h3>
        <span>${Math.round(preparation.readyScore * 100)}%</span>
      </header>
      <div class="tribulation-meter"><i style="width:${Math.round(preparation.readyScore * 100)}%"></i></div>
      <p>${preparation.counsel}</p>
      <div class="tribulation-grid">
        ${preparation.items.map((item) => `
          <span class="${item.ready ? 'ready' : ''}">
            <strong>${item.name}</strong>
            <small>${item.detail}</small>
          </span>
        `).join('')}
      </div>
      <small>失手保留 ${Math.round(preparation.qiRetention * 100)}% 灵气${preparation.demonGuard ? ' · 魔息可缓' : ''}</small>
    `;
    renderCache.breakthroughPrep = signature;
  }

  function renderLoot(force = false) {
    if (!refs.lootList) {
      return;
    }
    renderLootFilters();
    const details = getEquipmentDetails(state).loot;
    updateLootOrganizeButton();
    const signature = `${activeLootFilter}|${details.map((item) => `${item.uid}:${item.level || 0}:${item.locked ? 1 : 0}`).join('|')}|${Object.entries(state.equippedLoot).map(([slot, uid]) => `${slot}:${uid || ''}`).join('|')}`;
    if (!force && renderCache.loot === signature) {
      return;
    }
    if (!details.length) {
      refs.lootList.innerHTML = '<div class="system-row muted-row"><div><strong>暂无战利品</strong><span>完成历练奇遇后，可能获得青锋剑、玄木护符、云纹法袍等装备。</span></div></div>';
      renderCache.loot = signature;
      return;
    }
    const visibleLoot = activeLootFilter === 'all' ? details : details.filter((item) => item.slot === activeLootFilter);
    if (!visibleLoot.length) {
      refs.lootList.innerHTML = '<div class="system-row muted-row"><div><strong>当前筛选暂无战利品</strong><span>切换筛选或继续历练获取对应装备。</span></div></div>';
      renderCache.loot = signature;
      return;
    }
    refs.lootList.innerHTML = visibleLoot
      .map((item) => {
        const maxed = item.empower.maxed;
        return `
          <details class="equipment-detail-card detail-row" data-loot-detail="${item.uid}" ${openLootDetails.has(item.uid) ? 'open' : ''}>
            <summary>
              <strong>${item.locked ? '锁 ' : ''}${item.name} <small>${item.intent.name} · ${getSlotName(item.slot)} · ${item.tier.name} · +${item.level || 0}</small></strong>
              <span>${formatEffects(item.effects) || '尚未激活'}${item.equipped ? ' · 已穿戴' : ''}</span>
              <small>${item.comparison.summary} · 展开查看器象、对比和下阶变化</small>
            </summary>
            <div class="detail-stack">
              <small>当前：${formatEffects(item.effects) || '尚未激活'}</small>
              <small>下阶：${maxed ? '已至圆满' : formatEffects(item.nextEffects)}</small>
              <details class="nested-detail">
                <summary>器象、成本与对照</summary>
                <small>器象：${item.intent.detail}</small>
                <small>阶位：${item.tier.name} · ${item.level || 0} / ${item.maxLevel}</small>
                <small>${maxed ? '强化已满' : `强化需 ${formatReward(item.empower.cost)}`}</small>
                ${renderLootComparison(item.comparison)}
              </details>
            </div>
            <div class="row-actions">
              <button data-equip-loot="${item.uid}" ${item.equipped ? 'disabled' : ''}>${item.equipped ? '已穿戴' : '穿戴'}</button>
              <button data-empower-loot="${item.uid}" ${maxed ? 'disabled' : ''}>强化</button>
              <button data-toggle-loot-lock="${item.uid}">${item.locked ? '解锁' : '锁定'}</button>
              <button data-disassemble-loot="${item.uid}" ${item.equipped || item.locked ? 'disabled' : ''}>分解</button>
            </div>
          </details>
        `;
      })
      .join('');
    renderCache.loot = signature;
  }

  function renderLootFilters() {
    document.querySelectorAll('[data-loot-filter]').forEach((button) => {
      const active = button.dataset.lootFilter === activeLootFilter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function updateLootOrganizeButton() {
    const button = document.querySelector('[data-organize-loot]');
    if (!button) {
      return;
    }
    const count = getOrganizableLootCount(state);
    button.disabled = count <= 0;
    button.textContent = count > 0 ? `整理 ${count}` : '暂无可整理';
  }

  function renderLootComparison(comparison) {
    if (!comparison) {
      return '';
    }
    if (!comparison.deltas.length) {
      return `<div class="comparison-list"><small>对照 ${comparison.againstName}：${comparison.summary}</small></div>`;
    }
    return `
      <div class="comparison-list">
        <small>对照 ${comparison.againstName}</small>
        ${comparison.deltas.map((effect) => `<span class="${effect.value >= 0 ? 'gain' : 'loss'}">${formatEffectDelta(effect)}</span>`).join('')}
      </div>
    `;
  }

  function renderFormations(force = false) {
    if (!refs.formationList) {
      return;
    }
    const signature = `${getRealmUpgradeLimit(state)}|${Object.keys(formations).map((id) => `${id}:${state.formations[id] || 0}`).join('|')}`;
    if (!force && renderCache.formations === signature) {
      return;
    }
    refs.formationList.innerHTML = Object.values(formations)
      .map((formation) => renderUpgradeRow(formation, state.formations[formation.id] || 0, 'data-upgrade-formation'))
      .join('');
    renderCache.formations = signature;
  }

  function renderTreasures(force = false) {
    if (!refs.treasureList) {
      return;
    }
    const signature = `${state.spiritStones}|${state.artifacts}|${state.forgingEssence}|${state.beastCores}|${state.arrayFlags}|${Object.entries(state.treasures || {}).map(([id, level]) => `${id}:${level}`).join('|')}`;
    if (!force && renderCache.treasures === signature) {
      return;
    }
    refs.treasureList.innerHTML = getEquipmentDetails(state).treasures
      .map((item) => renderLongTermRow(item, 'data-upgrade-treasure'))
      .join('');
    renderCache.treasures = signature;
  }

  function renderSpiritBeasts(force = false) {
    if (!refs.beastList) {
      return;
    }
    const signature = `${state.spiritStones}|${state.herbs}|${state.beastCores}|${Object.entries(state.spiritBeasts || {}).map(([id, level]) => `${id}:${level}`).join('|')}`;
    if (!force && renderCache.beasts === signature) {
      return;
    }
    refs.beastList.innerHTML = getEquipmentDetails(state).spiritBeasts
      .map((item) => renderLongTermRow(item, 'data-train-beast'))
      .join('');
    renderCache.beasts = signature;
  }

  function renderCultivation(force = false) {
    if (!refs.cultivationList) {
      return;
    }
    const signature = `${getRealmUpgradeLimit(state)}|${Object.keys(cultivationPaths).map((id) => `${id}:${state.cultivationPaths[id] || 0}`).join('|')}`;
    if (!force && renderCache.cultivation === signature) {
      return;
    }
    refs.cultivationList.innerHTML = Object.values(cultivationPaths)
      .map((path) => renderPathRow(path))
      .join('');
    renderCache.cultivation = signature;
  }

  function renderCave(force = false) {
    if (!refs.caveList) {
      return;
    }
    const cave = getCaveStatus(state);
    if (!buildings[activeBuildingId]) {
      activeBuildingId = cave.buildings[0]?.id || 'meditationSeat';
    }
    const selected = cave.buildings.find((building) => building.id === activeBuildingId) || cave.buildings[0];
    const signature = `${cave.stage.level}:${cave.upgradeLimit}:${activeBuildingId}:${state.realmIndex}:${state.spiritStones}:${state.herbs}:${state.beastCores}:${state.artifacts}:${state.arrayFlags}:${state.forgingEssence}:${state.insight}:${cave.buildings.map((building) => `${building.id}:${building.level}`).join('|')}`;
    if (!force && renderCache.cave === signature) {
      return;
    }
    refs.caveList.innerHTML = `
      <section class="cave-stage-card">
        <div>
          <span>洞府格局</span>
          <strong>${cave.stage.name}</strong>
          <small>总营建 ${cave.stage.totalLevel} / ${cave.stage.maxLevel * cave.buildings.length} · 当前可升至 ${cave.upgradeLimit} 级</small>
        </div>
        <div class="cave-progress"><i style="width:${Math.round(cave.nextStageProgress * 100)}%"></i></div>
      </section>
      <div class="cave-summary-grid">
        ${cave.summary.map((metric) => `
          <div>
            <span>${metric.label}</span>
            <strong>${formatCaveMetric(metric)}</strong>
          </div>
        `).join('')}
      </div>
      <div class="building-grid">
        ${cave.buildings.map((building) => `
          <button data-select-building="${building.id}" class="building-card ${building.id === selected.id ? 'active' : ''}" type="button">
            <span>${building.tier.name}</span>
            <strong>${building.name}</strong>
            <small>${building.level} / ${building.maxLevel} 级</small>
            <em>${formatEffects(building.effects) || '尚未营建'}</em>
          </button>
        `).join('')}
      </div>
      ${renderBuildingDetail(selected)}
    `;
    renderCache.cave = signature;
  }

  function renderBuildingDetail(building) {
    if (!building) {
      return '';
    }
    const upgrade = building.upgrade;
    const costText = upgrade.maxed ? '已达二十级' : upgrade.realmLocked ? `${building.tier.name}需${realms[building.tier.realmIndex]?.name || '更高境界'}` : formatReward(upgrade.cost);
    return `
      <section class="building-detail-card">
        <header>
          <div>
            <span>${building.tier.name}</span>
            <h3>${building.name}</h3>
          </div>
          <button data-upgrade-building="${building.id}" ${upgrade.maxed || upgrade.realmLocked ? 'disabled' : ''}>${upgrade.maxed ? '圆满' : '升级'}</button>
        </header>
        <p>${building.detail}</p>
        <div class="building-effect-grid">
          <div><span>当前</span><strong>${formatEffects(building.effects) || '尚未营建'}</strong></div>
          <div><span>下级</span><strong>${upgrade.maxed ? '已至圆满' : formatEffects(building.nextEffects)}</strong></div>
          <div><span>消耗</span><strong>${costText}</strong></div>
        </div>
      </section>
    `;
  }

  function renderSect(force = false) {
    if (!refs.sectList || !refs.sectStatus) {
      return;
    }
    const sect = getSectStatus(state);
    refs.sectStatus.textContent = sect.unlocked ? `${sect.levelName} · ${sect.disciples} / ${sect.capacity} 弟子` : '炼气三层后解锁';
    const recommendation = getSectRecommendation(state);
    const signature = `${sect.unlocked}:${sect.levelName}:${sect.disciples}:${sect.capacity}:${sect.assigned}:${sect.reputation}:${state.spiritStones}:${state.herbs}:${state.beastCores}:${state.artifacts}:${state.forgingEssence}:${recommendation.id}:${sect.roster.map((disciple) => `${disciple.id}:${disciple.level}:${Math.floor(disciple.experience)}:${disciple.job}`).join('|')}:${Object.entries(state.sectAssignments).map(([id, count]) => `${id}:${count}`).join('|')}`;
    if (!force && renderCache.sect === signature) {
      return;
    }
    if (!sect.unlocked) {
      refs.sectList.innerHTML = '<div class="system-row muted-row"><div><strong>宗门未立</strong><span>达到炼气三层，或镇压青岚山首领后，可招收弟子执行委托。</span></div></div>';
      renderCache.sect = signature;
      return;
    }
    refs.sectList.innerHTML = `
      <div class="sect-summary">
        <div><span>宗门品阶</span><strong>${sect.levelName}</strong></div>
        <div><span>宗门声望</span><strong>${sect.reputation}${sect.nextReputation ? ` / ${sect.nextReputation}` : ''}</strong></div>
        <div><span>空闲弟子</span><strong>${sect.idle}</strong></div>
        <button data-recruit-disciple ${sect.recruitCost ? '' : 'disabled'}>${sect.recruitCost ? `招募 ${formatReward(sect.recruitCost)}` : '弟子已满'}</button>
      </div>
      <div class="system-row muted-row">
        <div>
          <strong>委托建议 <small>${recommendation.title}</small></strong>
          <span>${recommendation.detail}</span>
        </div>
      </div>
      <div class="disciple-roster">
        ${sect.roster.length ? sect.roster.map((disciple) => `
          <div>
            <strong>${disciple.name}<small>${disciple.grade} · ${disciple.element}灵根 · ${disciple.jobName}</small></strong>
            <span>资质 ${disciple.aptitude} · 根骨 ${disciple.root} · 悟性 ${disciple.comprehension}</span>
            <small>修为 ${disciple.level} 级 · 历练 ${Math.floor(disciple.experience)} / ${disciple.nextExperience}</small>
          </div>
        `).join('') : '<div><strong>暂无弟子</strong><span>招募弟子后可派往委托。</span></div>'}
      </div>
      ${sect.commissions.map((commission) => `
        <div class="system-row">
          <div>
            <strong>${commission.name} <small>${commission.assigned} 人</small></strong>
            <span>${commission.detail}</span>
            <small>${formatCommissionRates(commission.rates)} · 效率 x${commission.outputMultiplier}</small>
          </div>
          <div class="row-actions">
            <button data-assign-sect="${commission.id}" data-delta="-1" ${commission.assigned <= 0 ? 'disabled' : ''}>-</button>
            <button data-assign-sect="${commission.id}" data-delta="1" ${sect.idle <= 0 ? 'disabled' : ''}>+</button>
          </div>
        </div>
      `).join('')}
    `;
    renderCache.sect = signature;
  }

  function getSectRecommendation(state) {
    if ((state.forgingEssence || 0) < 6 || (state.artifacts || 0) < 4) {
      return {
        id: 'forge',
        title: '炼器委托',
        detail: '炼器精魄或法器偏少时，优先派弟子整理残器，支撑战利品强化和洞府炼器阁。',
      };
    }
    if ((state.beastCores || 0) < 8) {
      return {
        id: 'patrol',
        title: '护山委托',
        detail: '妖核不足会卡住武器、法袍、剑阵和护脉丹，适合派弟子巡守山门。',
      };
    }
    if ((state.herbs || 0) < 60) {
      return {
        id: 'herbGarden',
        title: '采药委托',
        detail: '灵草偏少会拖慢炼丹炉、灵田和日常丹药补给，适合先补采药。',
      };
    }
    return {
      id: 'mine',
      title: '采矿委托',
      detail: '当前材料较均衡，可让弟子采矿补灵石，用于洞府、装备和坊市刷新。',
    };
  }

  function renderPathRow(path) {
    const level = state.cultivationPaths[path.id] || 0;
    const maxed = level >= path.maxLevel;
    const nextLevel = level + 1;
    const realmLocked = nextLevel > getRealmUpgradeLimit(state);
    const tier = getUpgradeTier(Math.max(1, maxed ? level : nextLevel));
    const cost = maxed || realmLocked ? null : path.cost(nextLevel);
    return `
      <div class="system-row">
        <div>
          <strong>${path.name} <small>${tier.name} ${level} / ${path.maxLevel}</small></strong>
          <span>${getPathEffectText(path.id)}</span>
          <small>${maxed ? '已达上限' : realmLocked ? `${getUpgradeTier(nextLevel).name}需更高境界` : `参悟需 ${formatReward(cost)}`}</small>
        </div>
        <button data-upgrade-path="${path.id}" ${maxed || realmLocked ? 'disabled' : ''}>参悟</button>
      </div>
    `;
  }

  function renderUpgradeRow(item, level, actionAttribute) {
    const maxed = level >= item.maxLevel;
    const nextLevel = level + 1;
    const realmLocked = nextLevel > getRealmUpgradeLimit(state);
    const tier = getUpgradeTier(Math.max(1, maxed ? level : nextLevel));
    const cost = maxed || realmLocked ? null : item.cost(nextLevel);
    return `
      <div class="system-row">
        <div>
          <strong>${item.name} <small>${tier.name} ${level} / ${item.maxLevel}</small></strong>
          <span>${getUpgradeEffectText(item.id)}</span>
          <small>${maxed ? '已达上限' : realmLocked ? `${getUpgradeTier(nextLevel).name}需更高境界` : `升级需 ${formatReward(cost)}`}</small>
        </div>
        <button ${actionAttribute}="${item.id}" ${maxed || realmLocked ? 'disabled' : ''}>升级</button>
      </div>
    `;
  }

  function renderGearRow(item) {
    const definition = gear[item.id];
    const level = item.level;
    const maxed = level >= definition.maxLevel;
    const nextLevel = level + 1;
    const realmLocked = nextLevel > getRealmUpgradeLimit(state);
    const nextQuality = item.qualityIndex + 1;
    const qualityMaxed = item.qualityIndex >= gearQualities.length - 1;
    const upgradeCost = maxed || realmLocked ? null : definition.cost(nextLevel);
    const refineCost = qualityMaxed || level <= 0 ? null : getRefineCost(nextQuality);
    return `
      <details class="equipment-detail-card detail-row">
        <summary>
          <strong>${item.name} <small>${item.intent.name} · ${item.tier.name} ${level} / ${item.maxLevel} · ${item.qualityName}</small></strong>
          <span>${formatEffects(item.effects) || '尚未激活'}${item.affix.id ? ` · ${item.affix.name}` : ''}</span>
          <small>展开查看器象、词条和下阶变化</small>
        </summary>
        <div class="detail-stack">
          <small>当前：${formatEffects(item.effects) || '尚未激活'}</small>
          <small>下阶：${maxed ? '已至圆满' : formatEffects(item.nextEffects)}</small>
          <details class="nested-detail">
            <summary>器象、词条与成本</summary>
            <small>器象：${item.intent.detail}</small>
            <small>${item.affix.id ? `词条：${item.affix.name}（${formatEffects(item.affix.effects)}）` : '词条：无'}</small>
            <small>${maxed ? '已达上限' : realmLocked ? `${getUpgradeTier(nextLevel).name}需更高境界` : `升级需 ${formatReward(upgradeCost)}`}</small>
            <small>${qualityMaxed ? '品质已满' : level <= 0 ? '先升级后可淬炼' : `淬炼 ${gearQualities[nextQuality]?.name || ''} · 火候 ${Math.round((item.refinement?.chance ?? gearQualities[item.qualityIndex]?.refineChance ?? 0) * 100)}% · ${formatReward(refineCost)}`}</small>
          </details>
        </div>
        <div class="row-actions">
          <button data-upgrade-gear="${item.id}" ${maxed || realmLocked ? 'disabled' : ''}>升级</button>
          <button data-refine-gear="${item.id}" ${qualityMaxed || level <= 0 ? 'disabled' : ''}>淬炼</button>
        </div>
      </details>
    `;
  }

  function renderLongTermRow(item, actionAttribute) {
    const definition = treasures[item.id] || spiritBeasts[item.id];
    const maxed = item.level >= item.maxLevel;
    const nextLevel = item.level + 1;
    const cost = maxed ? null : definition.cost(nextLevel);
    return `
      <div class="system-row">
        <div>
          <strong>${item.name} <small>${item.level} / ${item.maxLevel}</small></strong>
          <span>${item.detail}</span>
          <small>当前 ${formatEffects(item.effects) || '尚未激活'}${maxed ? '' : ` · 下级 ${formatEffects(item.nextEffects)}`}</small>
          <small>${maxed ? '已达上限' : `升级需 ${formatReward(cost)}`}</small>
        </div>
        <button ${actionAttribute}="${item.id}" ${maxed ? 'disabled' : ''}>培养</button>
      </div>
    `;
  }

  function getRecipeEffectText(recipeId) {
    const effects = {
      gatherQiPill: '立即补充灵气，并提升灵息 2 分钟',
      clearHeartPill: '降低 1 点心魔',
      meridianPill: '提高破境天机 3 分钟',
    };
    return effects[recipeId] || '丹药效果';
  }

  function getUpgradeEffectText(id) {
    const effects = {
      weapon: '凝练兵刃道威',
      amulet: '牵引破境天机',
      robe: '增强行游护持',
      spiritGathering: '提升灵息周天',
      mountainGuard: '提高突破稳定度',
      swordArray: '强化剑阵道威',
    };
    return effects[id] || '强化修行能力';
  }

  function getSlotName(slot) {
    return { weapon: '武器', amulet: '护符', robe: '法袍' }[slot] || '装备';
  }

  function formatLootBonuses(bonuses) {
    const names = {
      power: '道威',
      dangerReduction: '劫象消解',
      breakthrough: '破境天机',
      qiRate: '灵息',
    };
    return Object.entries(bonuses)
      .map(([key, value]) => {
        if (key === 'dangerReduction') {
          return `${names[key]} -${value}`;
        }
        if (key === 'breakthrough' || key === 'qiRate') {
          return `${names[key]} +${Math.round(value * 100)}%`;
        }
        return `${names[key] || key} +${value}`;
      })
      .join(' · ');
  }

  function formatCommissionRates(rates) {
    const labels = {
      herbs: '灵草',
      spiritStones: '灵石',
      beastCores: '妖核',
      artifacts: '法器',
      reputation: '声望',
    };
    return Object.entries(rates)
      .map(([key, value]) => `${labels[key] || key} +${Math.round(value * 60 * 10) / 10} / 分`)
      .join(' · ');
  }

  function getPathEffectText(id) {
    const effects = {
      sword: '凝练道威，并平息行游劫象',
      alchemy: '缩短炼丹时间，强化丹药收益',
      formation: '提升灵息周天，强化挂机成长',
    };
    return effects[id] || '长期修行方向';
  }

  function formatDailyProgress(task) {
    if (task.progressKey === 'cultivationSeconds') {
      return `${formatDuration(task.progress)} / ${formatDuration(task.target)}`;
    }
    return `${task.progress} / ${task.target}`;
  }

  function renderGoals(force = false) {
    if (!refs.goals || !refs.goalCount) {
      return;
    }

    const chapters = getMainlineChapters(state);
    const activeChapter = getActiveMainlineChapter(state);
    refs.goalCount.textContent = `${activeChapter.completedCount} / ${activeChapter.objectives.length}`;
    const signature = chapters
      .map((chapter) => `${chapter.id}:${chapter.locked}:${chapter.completedCount}:${chapter.allObjectivesClaimed}:${chapter.rewardClaimed}:${chapter.objectives.map((goal) => `${goal.id}:${goal.completed}:${goal.claimed}`).join(',')}`)
      .join('|');
    if (!force && renderCache.goals === signature) {
      return;
    }

    renderMainlineHeader(activeChapter);
    renderMainlineTrack(chapters, activeChapter.id);
    refs.goals.innerHTML = activeChapter.objectives
      .map((goal) => `
        <li class="${goal.completed ? 'completed' : ''} ${goal.claimed ? 'claimed' : ''}">
          <span>${goal.claimed ? '领' : goal.completed ? '✓' : ''}</span>
          <div>
            <strong>${goal.title}</strong>
            <small>${goal.detail} · 奖励 ${formatReward(goal.reward)}</small>
          </div>
          ${goal.completed ? `<button data-claim-goal="${goal.id}" ${goal.claimed ? 'disabled' : ''}>${goal.claimed ? '已领' : '领取'}</button>` : '<em>进行中</em>'}
        </li>
      `)
      .join('');
    renderCache.goals = signature;
  }

  function renderMainlineHeader(chapter) {
    if (!refs.mainlineHeader) {
      return;
    }
    const readyForReward = chapter.completed && chapter.allObjectivesClaimed && !chapter.rewardClaimed;
    refs.mainlineHeader.innerHTML = `
      <div>
        <span>当前篇章</span>
        <strong>${chapter.title}</strong>
        <small>${chapter.subtitle}</small>
      </div>
      <div class="chapter-reward">
        <small>篇章奖励 ${formatReward(chapter.reward)}</small>
        <button data-claim-chapter="${chapter.id}" ${readyForReward ? '' : 'disabled'}>${chapter.rewardClaimed ? '已完成' : readyForReward ? '领取篇章' : '待完成'}</button>
      </div>
    `;
  }

  function renderMainlineTrack(chapters, activeChapterId) {
    if (!refs.mainlineChapters) {
      return;
    }
    refs.mainlineChapters.innerHTML = chapters
      .map((chapter, index) => `
        <div class="${chapter.id === activeChapterId ? 'active' : ''} ${chapter.rewardClaimed ? 'done' : ''} ${chapter.locked ? 'locked' : ''}">
          <span>${index + 1}</span>
          <strong>${chapter.title}</strong>
          <small>${chapter.locked ? '未解锁' : chapter.rewardClaimed ? '已完成' : `${chapter.completedCount}/${chapter.objectives.length}`}</small>
        </div>
      `)
      .join('');
  }

  function claimGoalReward(state, goalId, now = Date.now()) {
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
    if (state.claimedGoals[goalId]) {
      return { ok: false, reason: 'alreadyClaimed' };
    }

    applyResources(state, goal.reward);
    state.claimedGoals[goalId] = true;
    addLog(state, now, `领取「${goal.title}」奖励：${formatReward(goal.reward)}。`);
    return { ok: true, reward: goal.reward };
  }

  function claimChapterReward(state, chapterId, now = Date.now()) {
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

  function toggleAutoMission(state, missionId, now = Date.now()) {
    if (!missions[missionId]) {
      return;
    }

    state.autoMissionId = state.autoMissionId === missionId ? null : missionId;
    addLog(state, now, state.autoMissionId ? `已设为自动历练：${missions[missionId].name}。` : '已停止自动历练。');
  }

  function applyOfflineProgress(state, seconds, now = Date.now()) {
    const before = snapshotResources(state);
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
      forgingEssence: Math.max(0, round((after.forgingEssence || 0) - (before.forgingEssence || 0))),
    };
  }

  function showOfflineSummary() {
    if (!pendingOfflineSummary || !refs.offlineDialog?.showModal) {
      return;
    }

    const summary = pendingOfflineSummary;
    const rows = [
      ['离线时间', formatDuration(summary.seconds)],
      ['灵气', `+${Math.floor(summary.qi)}`],
      ['灵石', `+${Math.floor(summary.spiritStones)}`],
      ['灵草', `+${Math.floor(summary.herbs)}`],
      ['妖核', `+${Math.floor(summary.beastCores)}`],
      ['法器', `+${Math.floor(summary.artifacts)}`],
      ['阵旗', `+${Math.floor(summary.arrayFlags || 0)}`],
      ['精魄', `+${Math.floor(summary.forgingEssence || 0)}`],
    ].filter((row, index) => index === 0 || row[1] !== '+0');

    refs.offlineSummary.innerHTML = rows
      .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
      .join('');
    refs.offlineDialog.showModal();
    pendingOfflineSummary = null;
  }

  function calculateQiRate(state, now = Date.now()) {
    const realm = getCurrentRealm(state);
    const buildingBonus = 1 + ((state.buildings.meditationSeat || 1) - 1) * buildings.meditationSeat.qiBonusPerLevel;
    const formationBonus = 1 + (state.formations.spiritGathering || 0) * formations.spiritGathering.qiBonusPerLevel;
    const affixBonus = 1 + getGearAffixBonus(state, 'qiBonus');
    const pathBonus = 1 + (state.cultivationPaths.formation || 0) * cultivationPaths.formation.qiBonusPerLevel;
    const permanentBonus = 1 + (state.permanentBonuses.qiRate || 0);
    const lootBonus = 1 + getEquippedLootBonus(state, 'qiRate');
    const masteryBonus = 1 + getMapMasteryBonus(state, 'qiRate');
    const treasureBonus = 1 + getTreasureBonus(state, 'qiRate');
    const beastBonus = 1 + getSpiritBeastBonus(state, 'qiRate');
    const daoHeartBonus = 1 + getDaoHeartBonus(state, 'qiRate');
    const pillBoost = state.pillBoostUntil && state.pillBoostUntil > now ? 1.4 : 1;
    const injuryPenalty = state.injuryUntil && state.injuryUntil > now ? 0.75 : 1;
    return round(realm.qiRate * buildingBonus * formationBonus * affixBonus * pathBonus * permanentBonus * lootBonus * masteryBonus * treasureBonus * beastBonus * daoHeartBonus * pillBoost * injuryPenalty);
  }

  function calculateBreakthroughChance(state, now = Date.now()) {
    const realm = getCurrentRealm(state);
    const overfill = Math.max(0, state.qi - realm.requiredQi);
    const preparation = Math.min(0.2, overfill / realm.requiredQi / 2);
    const insightBonus = Math.min(0.15, state.insight * 0.03);
    const gearBonus = Math.min(0.18, getTieredLevelValue(state.gear.amulet || 0, gear.amulet.breakthroughPerLevel));
    const affixBonus = Math.min(0.08, getGearAffixBonus(state, 'breakthrough'));
    const lootBonus = Math.min(0.1, getEquippedLootBonus(state, 'breakthrough'));
    const formationBonus = Math.min(0.12, (state.formations.mountainGuard || 0) * formations.mountainGuard.stabilityPerLevel);
    const treasureBonus = Math.min(0.12, getTreasureBonus(state, 'breakthrough'));
    const beastBonus = Math.min(0.08, getSpiritBeastBonus(state, 'breakthrough'));
    const daoHeartBonus = Math.min(0.1, getDaoHeartBonus(state, 'breakthrough'));
    const scriptureBonus = Math.min(0.12, (state.buildings.scriptureLibrary || 0) * buildings.scriptureLibrary.breakthroughPerLevel);
    const pillBonus = state.breakthroughBoostUntil && state.breakthroughBoostUntil > now ? 0.12 : 0;
    const foundationBonus = Math.min(0.15, (state.foundationStability || 0) * 0.05);
    const heartDemonPenalty = Math.min(0.35, state.heartDemon * 0.15);
    return round(Math.max(0.25, Math.min(0.95, 0.75 + preparation + insightBonus + gearBonus + affixBonus + lootBonus + formationBonus + treasureBonus + beastBonus + daoHeartBonus + scriptureBonus + pillBonus + foundationBonus - heartDemonPenalty)));
  }

  function calculatePower(state) {
    const realmPower = getRealmPower(state);
    const pathPower = (state.cultivationPaths.sword || 0) * cultivationPaths.sword.powerPerLevel;
    const swordPower = (state.buildings.swordArray || 0) * buildings.swordArray.powerPerLevel;
    const gearPower = getTieredLevelValue(state.gear.weapon || 0, gear.weapon.powerPerLevel);
    const gearQualityPower = Object.values(state.gearQuality || {}).reduce((total, qualityIndex) => total + (gearQualities[qualityIndex]?.powerBonus || 0), 0);
    const affixPower = getGearAffixBonus(state, 'powerBonus');
    const formationPower = (state.formations.swordArray || 0) * formations.swordArray.powerPerLevel;
    const permanentPower = state.permanentBonuses.power || 0;
    const lootPower = getEquippedLootBonus(state, 'power');
    const masteryPower = getMapMasteryBonus(state, 'power');
    const treasurePower = getTreasureBonus(state, 'power');
    const beastPower = getSpiritBeastBonus(state, 'power');
    const daoHeartPower = getDaoHeartBonus(state, 'power');
    const sectPower = Math.floor((state.sectReputation || 0) / 20) * 4;
    const qiPower = Math.min(90, Math.floor((state.qi || 0) * 0.5));
    const demonPenalty = (state.heartDemon || 0) * 8;
    return Math.max(10, Math.floor(realmPower + pathPower + swordPower + gearPower + gearQualityPower + affixPower + formationPower + permanentPower + lootPower + masteryPower + treasurePower + beastPower + daoHeartPower + sectPower + qiPower - demonPenalty));
  }

  function getRealmPower(state) {
    return Math.round(((state.realmIndex || 0) + 1) * 22);
  }

  function calculateBreakthroughCarryQi(state, realm = getCurrentRealm(state)) {
    const overflowQi = Math.max(0, (state.qi || 0) - realm.requiredQi);
    return round(overflowQi * 0.5);
  }

  function normalizeBuildings(savedBuildings) {
    const normalized = { alchemyFurnace: 0, meditationSeat: 1, spiritField: 0, swordArray: 0 };
    Object.keys(buildings).forEach((id) => {
      const level = Number(savedBuildings && savedBuildings[id]);
      normalized[id] = Math.min(buildings[id].maxLevel, Math.max(0, Math.floor(Number.isFinite(level) ? level : normalized[id])));
    });
    return normalized;
  }

  function normalizeCompletedMissions(savedMissions) {
    const normalized = {};
    Object.keys(missions).forEach((id) => {
      normalized[id] = Math.max(0, Number(savedMissions && savedMissions[id]) || 0);
    });
    return normalized;
  }

  function normalizeMapValues(values) {
    const normalized = {};
    Object.keys(missionMaps).forEach((id) => {
      normalized[id] = Math.max(0, Number(values && values[id]) || 0);
    });
    return normalized;
  }

  function normalizeMapDepths(values) {
    const normalized = {};
    Object.keys(missionMaps).forEach((id) => {
      normalized[id] = clampInteger(values?.[id] || 0, 0, mapDepthMaxLayer);
    });
    return normalized;
  }

  function normalizeMissionApproaches(values) {
    if (!values || typeof values !== 'object') {
      return {};
    }
    return Object.fromEntries(
      Object.entries(values).filter(([mapId, approachId]) => missionMaps[mapId] && missionApproaches[approachId]),
    );
  }

  function normalizeMapApproachCompletions(values) {
    if (!values || typeof values !== 'object') {
      return {};
    }
    const normalized = {};
    Object.entries(values).forEach(([mapId, approaches]) => {
      if (!missionMaps[mapId] || !approaches || typeof approaches !== 'object') {
        return;
      }
      const valid = Object.fromEntries(
        Object.entries(approaches)
          .filter(([approachId]) => missionApproaches[approachId])
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
      if (!missionMaps[mapId] || !drops || typeof drops !== 'object') {
        return;
      }
      const valid = Object.fromEntries(
        Object.entries(drops)
          .filter(([approachId]) => missionApproaches[approachId])
          .map(([approachId, count]) => [approachId, Math.max(0, Math.floor(Number(count) || 0))]),
      );
      if (Object.keys(valid).length) {
        normalized[mapId] = valid;
      }
    });
    return normalized;
  }

  function normalizeMission(mission) {
    if (!mission) {
      return null;
    }
    if (mission.type === 'mapDepth') {
      const mapId = mission.mapId;
      if (!missionMaps[mapId]) {
        return null;
      }
      const layer = clampInteger(mission.layer || 1, 1, mapDepthMaxLayer);
      return {
        type: 'mapDepth',
        id: `depth:${mapId}:${layer}`,
        mapId,
        layer,
        startedAt: Number(mission.startedAt) || Date.now(),
        endsAt: Number(mission.endsAt) || Date.now(),
      };
    }
    if (!missions[mission.id]) {
      return null;
    }
    return {
      id: mission.id,
      approachId: missionApproaches[mission.approachId] ? mission.approachId : null,
      startedAt: Number(mission.startedAt) || Date.now(),
      endsAt: Number(mission.endsAt) || Date.now(),
    };
  }

  function normalizeDefeatedBosses(defeatedBosses) {
    if (!defeatedBosses || typeof defeatedBosses !== 'object') {
      return {};
    }
    return Object.fromEntries(Object.entries(defeatedBosses).filter(([id, defeated]) => missionMaps[id] && Boolean(defeated)));
  }

  function normalizeClaimedGoals(savedGoals) {
    if (!savedGoals || typeof savedGoals !== 'object') {
      return {};
    }

    return Object.fromEntries(Object.entries(savedGoals).filter(([, claimed]) => Boolean(claimed)));
  }

  function normalizePermanentBonuses(bonuses) {
    return {
      qiRate: Math.max(0, Number(bonuses?.qiRate) || 0),
      power: Math.max(0, Number(bonuses?.power) || 0),
    };
  }

  function normalizeOpportunity(opportunity) {
    if (!opportunity || !opportunities[opportunity.id]) {
      return null;
    }
    return {
      id: opportunity.id,
      missionId: missions[opportunity.missionId] ? opportunity.missionId : null,
      createdAt: Number(opportunity.createdAt) || Date.now(),
    };
  }

  function normalizeResolvedOpportunities(resolved) {
    if (!resolved || typeof resolved !== 'object') {
      return {};
    }
    return Object.fromEntries(
      Object.entries(resolved)
        .filter(([id]) => opportunities[id])
        .map(([id, value]) => [id, Math.max(0, Number(value) || 0)]),
    );
  }

  function normalizeSectRoster(roster, disciples = 0) {
    const normalized = Array.isArray(roster)
      ? roster.map((disciple, index) => normalizeDisciple(disciple, index)).filter(Boolean).slice(0, disciples)
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
    const job = disciple.job && (disciple.job === 'idle' || sectCommissions[disciple.job]) ? disciple.job : 'idle';
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
      jobName: disciple.job === 'idle' ? '空闲' : sectCommissions[disciple.job]?.name || '空闲',
      nextExperience: getDiscipleNextExperience(disciple.level),
      grade: getDiscipleGrade(disciple),
    };
  }

  function normalizeLootEquipment(items) {
    if (!Array.isArray(items)) {
      return [];
    }
    return items
      .map((item, index) => {
        const template = lootEquipment[item?.templateId] || lootEquipment[item?.id];
        if (!template) {
          return null;
        }
        return createLootItem(template.id, item.uid || `${template.id}-${index + 1}`, clampInteger(item.level || 0, 0, getLootMaxLevel(template)));
      })
      .filter(Boolean)
      .slice(0, 40);
  }

  function normalizeEquippedLoot(equippedLoot, lootItems) {
    const slots = { weapon: null, amulet: null, robe: null };
    Object.keys(slots).forEach((slot) => {
      const uid = equippedLoot?.[slot] || null;
      const item = lootItems.find((candidate) => candidate.uid === uid && candidate.slot === slot);
      slots[slot] = item ? item.uid : null;
    });
    return slots;
  }

  function normalizeLockedLoot(lockedLoot, lootItems) {
    if (!lockedLoot || typeof lockedLoot !== 'object') {
      return {};
    }
    const validUids = new Set((lootItems || []).map((item) => item.uid));
    return Object.fromEntries(
      Object.entries(lockedLoot).filter(([uid, locked]) => validUids.has(uid) && Boolean(locked)),
    );
  }

  function normalizeMissionEvent(event) {
    if (!event || !missionEvents[event.id]) {
      return null;
    }
    return {
      id: event.id,
      name: missionEvents[event.id].name,
      missionId: missions[event.missionId] ? event.missionId : null,
      reward: event.reward && typeof event.reward === 'object' ? { ...event.reward } : {},
      equipmentName: event.equipmentName || null,
      time: Number(event.time) || Date.now(),
    };
  }

  function normalizeMissionReport(report) {
    if (!report || typeof report !== 'object' || !missions[report.missionId]) {
      return null;
    }
    const mission = missions[report.missionId];
    const mapId = missionMaps[report.mapId] ? report.mapId : getMissionMapId(mission);
    const outcome = report.outcome === 'failure' ? 'failure' : 'success';
    const reward = report.reward && typeof report.reward === 'object' ? { ...report.reward } : {};
    const rareReward = report.rareReward && typeof report.rareReward === 'object' ? { ...report.rareReward } : null;
    const event = report.event && missionEvents[report.event.id] ? {
      id: report.event.id,
      name: missionEvents[report.event.id].name,
      reward: report.event.reward && typeof report.event.reward === 'object' ? { ...report.event.reward } : {},
      rewardText: formatReward(report.event.reward || {}),
      equipmentName: report.event.equipmentName || null,
    } : null;

    return {
      id: String(report.id || `${mission.id}-${Number(report.time) || Date.now()}`),
      missionId: mission.id,
      missionName: mission.name,
      mapId,
      mapName: missionMaps[mapId]?.name || mission.map || mission.name,
      outcome,
      approach: report.approach && missionApproaches[report.approach.id] ? { id: report.approach.id, name: missionApproaches[report.approach.id].name } : null,
      reward,
      rewardText: formatReward(reward),
      approachReward: report.approachReward && typeof report.approachReward === 'object' ? { ...report.approachReward } : {},
      approachRewardText: formatReward(report.approachReward || {}),
      specialDrop: report.specialDrop?.name ? { name: report.specialDrop.name, reward: report.specialDrop.reward || {}, approachId: report.specialDrop.approachId || null } : null,
      specialDropText: report.specialDrop?.reward ? formatReward(report.specialDrop.reward) : '',
      rareReward,
      rareRewardText: rareReward ? formatReward(rareReward) : '',
      reputationGained: Math.max(0, Number(report.reputationGained) || 0),
      completedCount: Math.max(0, Number(report.completedCount) || 0),
      event,
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

  function migrateLegacyRealmIndex(realmIndex) {
    const legacyIndex = clampInteger(realmIndex, 0, legacyRealmIndexMap.length - 1);
    return legacyRealmIndexMap[legacyIndex] || 0;
  }

  function normalizeAlchemy(alchemy) {
    if (!alchemy) {
      return null;
    }
    return {
      recipeId: pillRecipes[alchemy.recipeId] ? alchemy.recipeId : 'gatherQiPill',
      startedAt: Number(alchemy.startedAt) || Date.now(),
      endsAt: Number(alchemy.endsAt) || Date.now(),
    };
  }

  function normalizeLevels(savedLevels, definitions) {
    const normalized = {};
    Object.keys(definitions).forEach((id) => {
      const level = Number(savedLevels && savedLevels[id]);
      normalized[id] = Math.min(definitions[id].maxLevel, Math.max(0, Math.floor(Number.isFinite(level) ? level : 0)));
    });
    return normalized;
  }

  function normalizeDaoHeartClaims(claims) {
    if (!claims || typeof claims !== 'object') {
      return {};
    }
    return Object.fromEntries(
      Object.entries(claims).filter(([realmIndex, heartId]) => daoHeartRealmIndices.includes(Number(realmIndex)) && daoHearts[heartId]),
    );
  }

  function normalizePendingDaoHeartChoice(choice, state) {
    if (!choice || typeof choice !== 'object') {
      return null;
    }
    const realmIndex = clampInteger(choice.realmIndex ?? -1, -1, realms.length - 1);
    if (!daoHeartRealmIndices.includes(realmIndex) || state.claimedDaoHeartRealms?.[String(realmIndex)]) {
      return null;
    }
    const choices = Array.isArray(choice.choices) ? choice.choices.filter((id) => daoHearts[id]) : daoHeartChoices;
    return {
      realmIndex,
      choices: choices.length ? [...new Set(choices)] : daoHeartChoices,
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
        realmIndex: clampInteger(record?.realmIndex ?? 0, 0, realms.length - 1),
        result: record?.result === 'success' ? 'success' : 'failed',
        readyScore: Math.max(0, Math.min(1, Number(record?.readyScore) || 0)),
      }))
      .slice(0, 8);
  }

  function normalizeGearQuality(savedQuality) {
    const normalized = {};
    Object.keys(gear).forEach((id) => {
      const quality = Number(savedQuality && savedQuality[id]);
      normalized[id] = Math.min(gearQualities.length - 1, Math.max(0, Math.floor(Number.isFinite(quality) ? quality : 0)));
    });
    return normalized;
  }

  function normalizeGearAffixes(savedAffixes) {
    const normalized = {};
    Object.keys(gear).forEach((id) => {
      const affixId = savedAffixes && savedAffixes[id];
      normalized[id] = affixId && gearAffixes[affixId]?.slot === id ? affixId : null;
    });
    return normalized;
  }

  function normalizeInventoryPills(inventoryPills, legacyPills = 0) {
    const normalized = {};
    Object.keys(pillRecipes).forEach((id) => {
      normalized[id] = Math.max(0, Math.floor(Number(inventoryPills && inventoryPills[id]) || 0));
    });
    if (!inventoryPills && legacyPills > 0) {
      normalized.gatherQiPill = Math.max(0, Math.floor(Number(legacyPills) || 0));
    }
    return normalized;
  }

  function normalizeSectAssignments(assignments, disciples = 0) {
    const normalized = {};
    let assigned = 0;
    Object.keys(sectCommissions).forEach((id) => {
      const count = Math.max(0, Math.floor(Number(assignments && assignments[id]) || 0));
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
      reputation: Math.max(0, Number(carry?.reputation) || 0),
    };
  }

  function normalizeNestedClaims(savedClaims) {
    if (!savedClaims || typeof savedClaims !== 'object') {
      return {};
    }
    return Object.fromEntries(
      Object.entries(savedClaims)
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

  function normalizeMarketStock(stock, state, fallbackDateKey = getDateKey()) {
    if (!stock || typeof stock !== 'object' || !Array.isArray(stock.items)) {
      return createMarketStock(state, fallbackDateKey, state.marketRefreshes?.[fallbackDateKey] || 0);
    }
    const dateKey = typeof stock.dateKey === 'string' ? stock.dateKey : fallbackDateKey;
    const refreshIndex = Math.max(0, Math.floor(Number(stock.refreshIndex) || 0));
    const validItems = stock.items.filter((itemId) => marketItems[itemId] && (state.realmIndex || 0) >= (marketItems[itemId].unlockRealmIndex || 0));
    if (!validItems.length) {
      return createMarketStock(state, dateKey, refreshIndex);
    }
    return {
      dateKey,
      refreshIndex,
      items: [...new Set(validItems)].slice(0, 6),
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
    state.dailyProgress[dateKey] ||= { cultivationSeconds: 0, missions: 0, marketBuys: 0, depthTrials: 0 };
    return state.dailyProgress[dateKey];
  }

  function addDailyProgress(state, key, amount, now = Date.now()) {
    const progress = getDailyProgress(state, getDateKey(now));
    progress[key] = (progress[key] || 0) + amount;
  }

  function getAlchemyDuration(state, recipe) {
    const furnaceLevel = state.buildings.alchemyFurnace || 0;
    const pathLevel = state.cultivationPaths.alchemy || 0;
    const speedMultiplier = Math.max(0.35, 1 - furnaceLevel * buildings.alchemyFurnace.speedBonusPerLevel - pathLevel * cultivationPaths.alchemy.alchemySpeedPerLevel - getDaoHeartBonus(state, 'alchemySpeed'));
    return Math.max(10, Math.round(recipe.duration * speedMultiplier));
  }

  function createMarketStock(state, dateKey, refreshIndex = 0) {
    const realmIndex = state.realmIndex || 0;
    const pool = Object.values(marketItems)
      .filter((item) => realmIndex >= (item.unlockRealmIndex || 0));
    const guaranteed = ['herbBundle', 'beastCoreShard', 'spiritSword', 'arrayManual']
      .filter((itemId) => pool.some((item) => item.id === itemId));
    const rotating = pool
      .filter((item) => !guaranteed.includes(item.id))
      .sort((a, b) => hashString(`${dateKey}:${refreshIndex}:${realmIndex}:${a.id}`) - hashString(`${dateKey}:${refreshIndex}:${realmIndex}:${b.id}`))
      .map((item) => item.id);
    const shiftedGuaranteed = guaranteed
      .map((itemId, index) => ({ itemId, rank: hashString(`${dateKey}:${refreshIndex}:base:${index}:${itemId}`) }))
      .sort((a, b) => a.rank - b.rank)
      .map((entry) => entry.itemId);
    return {
      dateKey,
      refreshIndex,
      items: [...shiftedGuaranteed, ...rotating].slice(0, Math.min(6, pool.length)),
    };
  }

  function getMarketRefreshCost(state, dateKey = getDateKey()) {
    const refreshCount = state.marketRefreshes?.[dateKey] || 0;
    return {
      spiritStones: Math.round(35 + refreshCount * 45 + (state.realmIndex || 0) * 4),
    };
  }

  function restartAutoMission(state, completedMissionId, now) {
    const missionId = state.autoMissionId;
    if (!missionId || missionId !== completedMissionId || !missions[missionId]) {
      return;
    }

    const mission = missions[missionId];
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
    const mission = missions[failedMissionId];
    state.autoMissionId = null;
    addLog(state, now, `自动历练已停：${mission.name}劫象过重，需提升道行后再行游。`);
    return true;
  }

  function snapshotResources(state) {
    return {
      qi: state.qi || 0,
      spiritStones: state.spiritStones || 0,
      herbs: state.herbs || 0,
      beastCores: state.beastCores || 0,
      artifacts: state.artifacts || 0,
      arrayFlags: state.arrayFlags || 0,
      forgingEssence: state.forgingEssence || 0,
    };
  }

  function canAfford(state, cost) {
    return Object.entries(cost).every(([resource, amount]) => getResourceAmount(state, resource) >= amount);
  }

  function collectResourceNeeds(state) {
    const needs = {};
    const addCost = (label, cost, weight = 1) => {
      if (!cost || !Object.keys(cost).length || canAfford(state, cost)) return;
      Object.entries(cost).forEach(([resource, amount]) => {
        const guide = resourceGuides[resource];
        if (!guide || amount <= 0) return;
        const shortfall = Math.max(0, amount - getResourceAmount(state, resource));
        if (shortfall <= 0) return;
        needs[resource] ||= { resource, label: guide.label, shortfall: 0, maxShortfall: 0, score: 0, demandLabels: new Set() };
        needs[resource].shortfall += shortfall;
        needs[resource].maxShortfall = Math.max(needs[resource].maxShortfall, shortfall);
        needs[resource].score += shortfall * weight * guide.priority;
        needs[resource].demandLabels.add(label);
      });
    };

    Object.values(buildings).forEach((building) => {
      const level = state.buildings?.[building.id] || 0;
      const nextLevel = level + 1;
      if (nextLevel <= building.maxLevel && nextLevel <= getCaveUpgradeLimit(state)) {
        addCost(`洞府·${building.name}`, building.cost(nextLevel), building.id === 'meditationSeat' || building.id === 'swordArray' ? 1.15 : 1);
      }
    });
    Object.values(gear).forEach((item) => {
      const level = state.gear?.[item.id] || 0;
      const nextLevel = level + 1;
      if (nextLevel <= item.maxLevel && nextLevel <= getRealmUpgradeLimit(state)) {
        addCost(`装备·${item.name}`, item.cost(nextLevel), 1.25);
      }
    });
    Object.values(formations).forEach((formation) => {
      const level = state.formations?.[formation.id] || 0;
      const nextLevel = level + 1;
      if (nextLevel <= formation.maxLevel && nextLevel <= getRealmUpgradeLimit(state)) {
        addCost(`阵法·${formation.name}`, formation.cost(nextLevel), 1.2);
      }
    });
    Object.values(cultivationPaths).forEach((path) => {
      const level = state.cultivationPaths?.[path.id] || 0;
      const nextLevel = level + 1;
      if (nextLevel <= path.maxLevel && nextLevel <= getRealmUpgradeLimit(state)) {
        addCost(`功法·${path.name}`, path.cost(nextLevel), 1.05);
      }
    });
    (state.lootEquipment || [])
      .filter((item) => (item.level || 0) < getLootMaxLevel(item))
      .slice(0, 4)
      .forEach((item) => addCost(`战利品·${item.name}`, getLootEmpowerCost((item.level || 0) + 1), 1.35));
    Object.values(treasures).forEach((treasure) => {
      const level = state.treasures?.[treasure.id] || 0;
      if (level < treasure.maxLevel) addCost(`法宝·${treasure.name}`, treasure.cost(level + 1), 0.95);
    });
    Object.values(spiritBeasts).forEach((beast) => {
      const level = state.spiritBeasts?.[beast.id] || 0;
      if (level < beast.maxLevel) addCost(`灵兽·${beast.name}`, beast.cost(level + 1), 0.9);
    });
    if (!state.activeAlchemy) {
      const recipe = Object.values(pillRecipes).find((candidate) => (state.buildings?.alchemyFurnace || 0) >= candidate.unlockLevel);
      if (recipe) addCost(`丹房·${recipe.name}`, recipe.cost, 0.75);
    }

    const realm = getCurrentRealm(state);
    const qiShortfall = Math.max(0, realm.requiredQi - (state.qi || 0));
    if (qiShortfall > Math.max(120, calculateQiRate(state) * 30)) {
      const qiWeight = Object.keys(needs).length ? 0.05 : resourceGuides.qi.priority;
      needs.qi ||= { resource: 'qi', label: resourceGuides.qi.label, shortfall: 0, maxShortfall: 0, score: 0, demandLabels: new Set() };
      needs.qi.shortfall += qiShortfall;
      needs.qi.maxShortfall = Math.max(needs.qi.maxShortfall, qiShortfall);
      needs.qi.score += Math.sqrt(qiShortfall) * qiWeight;
      needs.qi.demandLabels.add(`破境·${realm.name}`);
    }
    return needs;
  }

  function hydrateResourceNeed(state, need) {
    const guide = resourceGuides[need.resource];
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
    const guide = resourceGuides[resource] || resourceGuides.spiritStones;
    const mapId = guide.mapIds.find((candidate) => (state.realmIndex || 0) >= (missionMaps[candidate]?.unlockRealmIndex || 0)) || guide.mapIds[guide.mapIds.length - 1] || 'qinglanMountain';
    const map = missionMaps[mapId] || missionMaps.qinglanMountain;
    const mission = getResourceMission(mapId, guide.missionId);
    const approach = missionApproaches[guide.approachId] || missionApproaches.balanced;
    const unlocked = (state.realmIndex || 0) >= (map.unlockRealmIndex || 0);
    const unlockRealm = realms[map.unlockRealmIndex]?.name || '更高境界';
    return {
      mapId: map.id,
      mapName: map.name,
      missionId: mission?.id || null,
      missionName: mission?.name || map.name,
      approachId: approach.id,
      approachName: approach.name,
      unlocked,
      unlockRealmName: unlockRealm,
      detail: unlocked ? `去${map.name}走「${approach.name}」路线` : `${unlockRealm}后可去${map.name}走「${approach.name}」路线`,
    };
  }

  function getResourceMission(mapId, preferredMissionId) {
    if (preferredMissionId && missions[preferredMissionId] && getMissionMapId(missions[preferredMissionId]) === mapId) {
      return missions[preferredMissionId];
    }
    return Object.values(missions).find((mission) => getMissionMapId(mission) === mapId) || null;
  }

  function getResourceCommission(state, commissionId) {
    const commission = commissionId ? sectCommissions[commissionId] : null;
    if (!commission) return null;
    return { id: commission.id, name: commission.name, detail: commission.detail, unlocked: isSectUnlocked(state) };
  }

  function getResourceMarketItem(state, marketItemId) {
    const item = marketItemId ? marketItems[marketItemId] : null;
    if (!item) return null;
    return { id: item.id, name: item.name, unlocked: (state.realmIndex || 0) >= (item.unlockRealmIndex || 0), unlockRealmName: realms[item.unlockRealmIndex]?.name || '更高境界' };
  }

  function getRefineCost(nextQuality) {
    return {
      spiritStones: scaleCost(50, nextQuality),
      artifacts: nextQuality,
    };
  }

  function getRefineChance(state, qualityIndex) {
    const baseChance = gearQualities[qualityIndex]?.refineChance || 0;
    const forgeBonus = Math.min(0.12, (state.buildings.forgingHall || 0) * buildings.forgingHall.refineChancePerLevel);
    return round(Math.min(0.95, baseChance + forgeBonus));
  }

  function getDefaultAffixForGear(gearId) {
    const defaults = {
      weapon: 'swordIntent',
      amulet: 'spiritVein',
      robe: 'cloudStep',
    };
    return defaults[gearId] || null;
  }

  function rollAffixForGear(gearId, random = Math.random) {
    const pool = gearAffixPools[gearId] || [getDefaultAffixForGear(gearId)].filter(Boolean);
    if (!pool.length) {
      return null;
    }
    const index = Math.min(pool.length - 1, Math.floor(random() * pool.length));
    return pool[index] || getDefaultAffixForGear(gearId);
  }

  function getGearAffixBonus(state, key) {
    return Object.values(state.gearAffixes || {}).reduce((total, affixId) => total + (gearAffixes[affixId]?.[key] || 0), 0);
  }

  function getEquippedLootBonus(state, key) {
    return Object.values(state.equippedLoot || {}).reduce((total, uid) => {
      const item = state.lootEquipment?.find((candidate) => candidate.uid === uid);
      return total + (item?.bonuses?.[key] || 0);
    }, 0);
  }

  function compareLootEquipment(state, item) {
    const equipped = getEquippedLoot(state, item.slot);
    const baseline = equipped && equipped.uid !== item.uid ? equipped : null;
    const keys = new Set([
      ...Object.keys(item.bonuses || {}),
      ...Object.keys(baseline?.bonuses || {}),
    ]);
    const deltaBonuses = {};
    keys.forEach((key) => {
      const value = round((item.bonuses?.[key] || 0) - (baseline?.bonuses?.[key] || 0));
      if (value !== 0) {
        deltaBonuses[key] = value;
      }
    });
    const deltas = effectsFromBonusObject(deltaBonuses);
    return {
      againstUid: baseline?.uid || null,
      againstName: baseline?.name || (equipped?.uid === item.uid ? item.name : '空位'),
      deltas,
      scoreDelta: round(getLootScore(item) - (baseline ? getLootScore(baseline) : 0)),
      summary: deltas.length ? deltas.map(formatEffectDelta).join('、') : (equipped?.uid === item.uid ? '已穿戴' : '无明显变化'),
    };
  }

  function getLootScore(item) {
    return Object.entries(item?.bonuses || {}).reduce((total, [key, value]) => {
      const weight = key === 'qiRate' || key === 'breakthrough' || key === 'herbRate' ? 1000 : 1;
      return total + value * weight;
    }, 0) + (item?.level || 0) * 2 + (item?.quality || 0) * 4;
  }

  function formatEffectDelta(effect) {
    const sign = effect.value > 0 ? '+' : '';
    if (effect.mode === 'percent') {
      return `${effect.label} ${sign}${Math.round(effect.value * 100)}%`;
    }
    return `${effect.label} ${sign}${effect.value}`;
  }

  function getTreasureBonus(state, key) {
    return Object.entries(state.treasures || {}).reduce((total, [treasureId, level]) => total + (treasures[treasureId]?.bonuses?.[key] || 0) * (level || 0), 0);
  }

  function getSpiritBeastBonus(state, key) {
    return Object.entries(state.spiritBeasts || {}).reduce((total, [beastId, level]) => total + (spiritBeasts[beastId]?.bonuses?.[key] || 0) * (level || 0), 0);
  }

  function getDaoHeartBonus(state, key) {
    return Object.entries(state.daoHearts || {}).reduce((total, [heartId, level]) => total + (daoHearts[heartId]?.bonuses?.[key] || 0) * (level || 0), 0);
  }

  function getGearEffects(gearId, level, qualityIndex, affix) {
    const item = gear[gearId];
    const effects = [];
    if (item.powerPerLevel) effects.push({ id: 'power', label: '道威', value: getTieredLevelValue(level, item.powerPerLevel), mode: 'flat' });
    if (item.breakthroughPerLevel) effects.push({ id: 'breakthrough', label: '破境天机', value: getTieredLevelValue(level, item.breakthroughPerLevel), mode: 'percent' });
    if (item.dangerReductionPerLevel) effects.push({ id: 'dangerReduction', label: '劫象消解', value: getTieredLevelValue(level, item.dangerReductionPerLevel), mode: 'reduction' });
    const qualityPower = gearQualities[qualityIndex]?.powerBonus || 0;
    if (qualityPower) effects.push({ id: 'qualityPower', label: '炼器道威', value: qualityPower, mode: 'flat' });
    if (affix) effects.push(...effectsFromBonusObject(affix, '词条'));
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
      alchemySpeed: '丹火缩时',
    };
    return Object.entries(bonuses)
      .filter(([key, value]) => typeof value === 'number' && labels[key] && value !== 0)
      .map(([key, value]) => ({
        id: key,
        label: `${prefix}${labels[key]}`,
        value,
        mode: key === 'qiRate' || key === 'qiBonus' || key === 'breakthrough' || key === 'herbRate' || key === 'alchemySpeed' ? 'percent' : key === 'dangerReduction' ? 'reduction' : 'flat',
      }));
  }

  function scaleBonusObject(bonuses, level) {
    return Object.fromEntries(Object.entries(bonuses || {}).map(([key, value]) => [key, round(value * level)]));
  }

  function compactSources(sources, keepNegative = false) {
    return sources
      .filter((source) => (keepNegative ? source.value !== 0 : source.value > 0))
      .map((source) => ({ label: source.label, value: round(source.value), mode: source.mode || 'flat' }));
  }

  function getMissionMapId(mission) {
    if (mission.mapId && missionMaps[mission.mapId]) {
      return mission.mapId;
    }
    const found = Object.values(missionMaps).find((map) => map.name === mission.map);
    return found?.id || 'qinglanMountain';
  }

  function getMapExplorationInfo(state, mapId) {
    const map = missionMaps[mapId];
    if (!map) {
      return { completed: 0, cappedCompleted: 0, target: 0, percent: 1, label: '探索 0 / 0' };
    }
    const completed = Object.values(missions)
      .filter((mission) => getMissionMapId(mission) === mapId)
      .reduce((total, mission) => total + (state.completedMissions?.[mission.id] || 0), 0);
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
    if (!missionMaps[mapId] || amount <= 0) {
      return;
    }
    state.mapReputation ||= {};
    state.mapReputation[mapId] = round((state.mapReputation[mapId] || 0) + amount);
  }

  function getMapMastery(state, mapId) {
    const reputation = state.mapReputation[mapId] || 0;
    const tier = mapMasteryTiers.reduce((best, current) => (reputation >= current.reputation ? current : best), mapMasteryTiers[0]);
    const next = mapMasteryTiers.find((candidate) => candidate.level === tier.level + 1) || null;
    return {
      level: tier.level,
      name: tier.name,
      reputation,
      nextReputation: next?.reputation || null,
    };
  }

  function getMapMasteryBonus(state, key) {
    return Object.values(missionMaps).reduce((total, map) => {
      const level = getMapMastery(state, map.id).level;
      return total + (map.masteryBonus?.[key] || 0) * level;
    }, 0);
  }

  function isSectUnlocked(state) {
    return (state.realmIndex || 0) >= 2 || Boolean(state.defeatedBosses?.qinglanMountain);
  }

  function getSectCapacity(state) {
    if (!isSectUnlocked(state)) {
      return 0;
    }
    const bossBonus = Object.values(state.defeatedBosses || {}).filter(Boolean).length;
    return 3 + Math.floor((state.realmIndex || 0) / 2) + bossBonus + getSectLevel(state).capacityBonus;
  }

  function getSectLevel(state) {
    const reputation = Math.floor(Number(state.sectReputation) || 0);
    return sectLevels.reduce((best, level) => (reputation >= level.reputation ? level : best), sectLevels[0]);
  }

  function getNextSectReputation(state) {
    const current = getSectLevel(state);
    const next = sectLevels.find((level) => level.level === current.level + 1);
    return next?.reputation || null;
  }

  function getRecruitCost(nextDisciple) {
    return { spiritStones: 60 + nextDisciple * 60, herbs: 5 + nextDisciple * 5 };
  }

  function updateSectCommissions(state, seconds) {
    if (!isSectUnlocked(state) || seconds <= 0) {
      return;
    }
    state.sectAssignments = normalizeSectAssignments(state.sectAssignments, state.sectDisciples || 0);
    state.sectCarry = normalizeSectCarry(state.sectCarry);
    state.sectRoster = normalizeSectRoster(state.sectRoster, state.sectDisciples || 0);
    syncSectRosterJobs(state);
    Object.entries(state.sectAssignments).forEach(([commissionId, count]) => {
      const commission = sectCommissions[commissionId];
      if (!commission || count <= 0) {
        return;
      }
      const multiplier = getCommissionMultiplier(state, commissionId);
      Object.entries(commission.rates).forEach(([resource, rate]) => {
        const key = resource === 'reputation' ? 'reputation' : resource;
        state.sectCarry[key] = (state.sectCarry[key] || 0) + rate * count * multiplier * seconds;
      });
      trainAssignedDisciples(state, commissionId, seconds);
    });
    ['spiritStones', 'herbs', 'beastCores', 'artifacts', 'forgingEssence'].forEach((resource) => {
      const gained = Math.floor(state.sectCarry[resource] || 0);
      if (gained > 0) {
        state[resource] = (state[resource] || 0) + gained;
        state.sectCarry[resource] = round(state.sectCarry[resource] - gained);
      }
    });
    const reputationGained = Math.floor(state.sectCarry.reputation || 0);
    if (reputationGained > 0) {
      state.sectReputation = (state.sectReputation || 0) + reputationGained;
      state.sectCarry.reputation = round(state.sectCarry.reputation - reputationGained);
    }
  }

  function syncSectRosterJobs(state) {
    const roster = normalizeSectRoster(state.sectRoster, state.sectDisciples || 0);
    roster.forEach((disciple) => {
      disciple.job = 'idle';
    });
    Object.keys(sectCommissions).forEach((commissionId) => {
      const count = state.sectAssignments?.[commissionId] || 0;
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
    const roster = normalizeSectRoster(state.sectRoster, state.sectDisciples || 0);
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
    if (total >= 13) return '上佳';
    if (total >= 10) return '中正';
    return '平平';
  }

  function resolveMissionEvent(mission, completedCount) {
    const eventIds = mission.events || [];
    if (!eventIds.length || completedCount <= 0) {
      return null;
    }
    return missionEvents[eventIds[(completedCount - 1) % eventIds.length]] || null;
  }

  function maybeCreateOpportunity(state, mission, now) {
    if (state.activeOpportunity) {
      return;
    }
    const opportunityId = missionOpportunities[mission.id];
    if (!opportunityId || !opportunities[opportunityId]) {
      return;
    }
    const completed = state.completedMissions?.[mission.id] || 0;
    if (completed <= 0 || completed % 2 === 0) {
      return;
    }
    state.activeOpportunity = { id: opportunityId, missionId: mission.id, createdAt: now };
    addLog(state, now, `发现机缘「${opportunities[opportunityId].name}」，可在历练中抉择。`);
  }

  function addResolvedOpportunity(state, opportunityId) {
    state.resolvedOpportunities ||= {};
    state.resolvedOpportunities[opportunityId] = (state.resolvedOpportunities[opportunityId] || 0) + 1;
  }

  function applyMissionEvent(state, mission, event, now) {
    applyResources(state, event.reward || {});
    const item = event.equipment ? addLootEquipment(state, event.equipment) : null;
    state.lastMissionEvent = {
      id: event.id,
      name: event.name,
      missionId: mission.id,
      reward: event.reward || {},
      equipmentName: item?.name || null,
      time: now,
    };

    const rewardText = formatReward(event.reward || {});
    const equipmentText = item ? `，并获得${item.name}` : '';
    addLog(state, now, `奇遇「${event.name}」：${event.detail}${rewardText ? ` 获得${rewardText}` : ''}${equipmentText}。`);
    return { event, item };
  }

  function addLootEquipment(state, templateId) {
    const template = lootEquipment[templateId];
    if (!template) {
      return null;
    }
    state.lootEquipment ||= [];
    const uid = `${template.id}-${state.lootEquipment.length + 1}`;
    const item = createLootItem(template.id, uid);
    state.lootEquipment.unshift(item);
    state.lootEquipment = state.lootEquipment.slice(0, 40);
    return item;
  }

  function createLootItem(templateId, uid, level = 0) {
    const template = lootEquipment[templateId];
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

  function getEquippedLoot(state, slot) {
    const uid = state.equippedLoot?.[slot] || null;
    return state.lootEquipment?.find((item) => item.uid === uid) || null;
  }

  function equipLootEquipment(state, uid, now = Date.now()) {
    const item = state.lootEquipment?.find((candidate) => candidate.uid === uid);
    if (!item) {
      return { ok: false, reason: 'unknownLoot' };
    }
    state.equippedLoot[item.slot] = item.uid;
    addLog(state, now, `换上${item.name}，${gear[item.slot]?.name || '装备'}气象一新。`);
    return { ok: true, item };
  }

  function toggleLootLock(state, uid, now = Date.now()) {
    const item = state.lootEquipment?.find((candidate) => candidate.uid === uid);
    if (!item) {
      return { ok: false, reason: 'unknownLoot' };
    }
    state.lockedLoot ||= {};
    const locked = !state.lockedLoot[uid];
    if (locked) {
      state.lockedLoot[uid] = true;
    } else {
      delete state.lockedLoot[uid];
    }
    addLog(state, now, locked ? `已锁定${item.name}，整理时会保留。` : `已解除${item.name}锁定。`);
    return { ok: true, item, locked };
  }

  function disassembleLootEquipment(state, uid, now = Date.now()) {
    const itemIndex = state.lootEquipment?.findIndex((candidate) => candidate.uid === uid) ?? -1;
    if (itemIndex < 0) {
      return { ok: false, reason: 'unknownLoot' };
    }
    const item = state.lootEquipment[itemIndex];
    if (state.equippedLoot[item.slot] === item.uid) {
      return { ok: false, reason: 'equipped' };
    }
    if (state.lockedLoot?.[item.uid]) {
      return { ok: false, reason: 'locked' };
    }
    state.lootEquipment.splice(itemIndex, 1);
    if (state.lockedLoot) {
      delete state.lockedLoot[item.uid];
    }
    const dismantleMultiplier = 1 + (state.buildings.forgingHall || 0) * buildings.forgingHall.dismantleBonusPerLevel;
    const reward = { forgingEssence: Math.floor((2 + (item.level || 0)) * dismantleMultiplier), artifacts: 1 };
    applyResources(state, reward);
    addLog(state, now, `分解${item.name}，获得${formatReward(reward)}。`);
    return { ok: true, reward, item };
  }

  function organizeLootEquipment(state, now = Date.now()) {
    const items = state.lootEquipment || [];
    if (!items.length) {
      return { ok: true, removed: 0, reward: {}, items: [] };
    }

    const keepUids = new Set(Object.values(state.equippedLoot || {}).filter(Boolean));
    Object.entries(state.lockedLoot || {}).forEach(([uid, locked]) => {
      if (locked) {
        keepUids.add(uid);
      }
    });

    Object.values(gear).forEach((gearItem) => {
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

    const dismantleMultiplier = 1 + (state.buildings.forgingHall || 0) * buildings.forgingHall.dismantleBonusPerLevel;
    const reward = removedItems.reduce((total, item) => ({
      forgingEssence: total.forgingEssence + Math.floor((2 + (item.level || 0)) * dismantleMultiplier),
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

  function getOrganizableLootCount(state) {
    const items = state.lootEquipment || [];
    if (!items.length) {
      return 0;
    }
    const keepUids = new Set(Object.values(state.equippedLoot || {}).filter(Boolean));
    Object.entries(state.lockedLoot || {}).forEach(([uid, locked]) => {
      if (locked) {
        keepUids.add(uid);
      }
    });
    Object.values(gear).forEach((gearItem) => {
      const candidate = items
        .filter((item) => item.slot === gearItem.id && !keepUids.has(item.uid))
        .sort((a, b) => getLootScore(b) - getLootScore(a))[0];
      if (candidate) {
        keepUids.add(candidate.uid);
      }
    });
    return items.filter((item) => !keepUids.has(item.uid)).length;
  }

  function empowerLootEquipment(state, uid, now = Date.now()) {
    const item = state.lootEquipment?.find((candidate) => candidate.uid === uid);
    if (!item) {
      return { ok: false, reason: 'unknownLoot' };
    }
    const level = item.level || 0;
    if (level >= getLootMaxLevel(item)) {
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

  function getLootEmpowerCost(nextLevel) {
    const cost = {
      spiritStones: tieredLinearCost(90, nextLevel),
      forgingEssence: tieredMaterialCost(2, nextLevel),
    };
    if (nextLevel >= 4) cost.artifacts = Math.ceil((nextLevel - 3) / 2);
    if (nextLevel >= 7) cost.beastCores = Math.ceil((nextLevel - 6) / 2);
    if (nextLevel >= 10) cost.arrayFlags = Math.ceil((nextLevel - 9) / 2);
    return cost;
  }

  function createLootBonuses(templateId, level = 0) {
    const template = lootEquipment[templateId];
    const multiplier = 1 + getTieredLootBonus(level);
    const percentBonus = getTieredPercentBonus(level);
    return Object.fromEntries(
      Object.entries(template.bonuses).map(([key, value]) => [key, key === 'breakthrough' || key === 'qiRate' ? round(value + percentBonus) : Math.round(value * multiplier)]),
    );
  }

  function getLootMaxLevel(itemOrTemplate) {
    return Math.min(12, Math.max(3, 3 + (itemOrTemplate?.quality || 0) * 3));
  }

  function getResourceAmount(state, resource) {
    if (resource === 'pills') {
      return state.inventoryPills.gatherQiPill || state.pills || 0;
    }
    if (pillRecipes[resource]) {
      return state.inventoryPills[resource] || 0;
    }
    return state[resource] || 0;
  }

  function payResources(state, cost) {
    Object.entries(cost).forEach(([resource, amount]) => {
      if (resource === 'pills') {
        state.inventoryPills.gatherQiPill = round((state.inventoryPills.gatherQiPill || 0) - amount);
        state.pills = state.inventoryPills.gatherQiPill;
        return;
      }
      if (pillRecipes[resource]) {
        state.inventoryPills[resource] = round((state.inventoryPills[resource] || 0) - amount);
        state.pills = state.inventoryPills.gatherQiPill;
        return;
      }
      state[resource] = round((state[resource] || 0) - amount);
    });
  }

  function applyResources(state, reward) {
    Object.entries(reward).forEach(([resource, amount]) => {
      if (resource === 'qiRateBonus') {
        state.permanentBonuses ||= { qiRate: 0, power: 0 };
        state.permanentBonuses.qiRate = round((state.permanentBonuses.qiRate || 0) + amount);
        return;
      }
      if (resource === 'powerBonus') {
        state.permanentBonuses ||= { qiRate: 0, power: 0 };
        state.permanentBonuses.power = round((state.permanentBonuses.power || 0) + amount);
        return;
      }
      if (resource === 'pills') {
        state.inventoryPills.gatherQiPill = Math.max(0, round((state.inventoryPills.gatherQiPill || 0) + amount));
        state.pills = state.inventoryPills.gatherQiPill;
        return;
      }
      if (pillRecipes[resource]) {
        state.inventoryPills[resource] = Math.max(0, round((state.inventoryPills[resource] || 0) + amount));
        state.pills = state.inventoryPills.gatherQiPill;
        return;
      }
      state[resource] = Math.max(0, round((state[resource] || 0) + amount));
    });
  }

  function showToast(title, message, tone = '') {
    if (!refs.toastStack) {
      return;
    }

    const toast = document.createElement('div');
    toast.className = `toast ${tone}`.trim();
    toast.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
    refs.toastStack.prepend(toast);

    while (refs.toastStack.children.length > 3) {
      refs.toastStack.lastElementChild.remove();
    }

    setTimeout(() => toast.remove(), 4200);
  }

  function triggerBattleFeedback(tone = 'pulse') {
    document.body.classList.remove('battle-pulse', 'battle-victory', 'battle-danger');
    const className = tone === 'victory' ? 'battle-victory' : tone === 'danger' ? 'battle-danger' : 'battle-pulse';
    requestAnimationFrame(() => {
      document.body.classList.add(className);
      setTimeout(() => document.body.classList.remove(className), 650);
    });
  }

  function renderTabs() {
    const activeGroup = getTabGroup(activeTab);
    document.body.dataset.activeTab = activeTab;
    document.body.dataset.activeGroup = activeGroup;
    syncMobileOverviewDrawers();
    document.querySelectorAll('[data-tab-group]').forEach((button) => {
      button.classList.toggle('active', button.dataset.tabGroup === activeGroup);
    });
    renderSubTabs(activeGroup);
    document.querySelectorAll('[data-panel]').forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.panel === activeTab);
    });
    renderGearSections();
  }

  function syncMobileOverviewDrawers() {
    const layoutSignature = `${activeTab}:${isMobileLayout() ? 'mobile' : 'desktop'}`;
    if (renderCache.mobileOverviewDrawers === layoutSignature) {
      return;
    }
    renderCache.mobileOverviewDrawers = layoutSignature;
    document.querySelectorAll('.stats-panel > .resource-drawer').forEach((drawer) => {
      drawer.open = !isMobileLayout();
    });
  }

  function getTabGroup(tabId) {
    return Object.entries(tabGroups).find(([, group]) => group.tabs.includes(tabId))?.[0] || 'practice';
  }

  function renderSubTabs(groupId = getTabGroup(activeTab)) {
    if (!refs.subTabs) {
      return;
    }
    const signature = `${groupId}:${activeTab}`;
    if (renderCache.subTabs === signature) {
      return;
    }
    const group = tabGroups[groupId] || tabGroups.practice;
    refs.subTabs.innerHTML = group.tabs
      .map((tabId) => `<button data-tab="${tabId}" class="${tabId === activeTab ? 'active' : ''}">${tabLabels[tabId]}</button>`)
      .join('');
    renderCache.subTabs = signature;
  }

  function renderGearSections() {
    document.querySelectorAll('[data-gear-section]').forEach((button) => {
      button.classList.toggle('active', button.dataset.gearSection === activeGearSection);
    });
    document.querySelectorAll('[data-gear-section-panel]').forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.gearSectionPanel === activeGearSection);
    });
  }

  function addLog(state, time, text) {
    state.log.unshift({ time, text });
    state.log = state.log.slice(0, 20);
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

    const names = { qi: '灵气', herbs: '灵草', spiritStones: '灵石', pills: '聚气丹', gatherQiPill: '聚气丹', clearHeartPill: '清心丹', meridianPill: '护脉丹', beastCores: '妖核', artifacts: '法器', arrayFlags: '阵旗', forgingEssence: '炼器精魄', heartDemon: '心魔', insight: '悟道' };
    return `${amount} ${names[key] || key}`;
  }

  function formatAttributeValue(attribute) {
    if (attribute.unit === '%') {
      return `${Math.round(attribute.value * 100)}%`;
    }
    if (attribute.unit) {
      return `${formatRate(attribute.value)} ${attribute.unit}`;
    }
    return Math.floor(attribute.value);
  }

  function formatRate(value) {
    const numeric = Number(value) || 0;
    const fixed = numeric < 10 ? numeric.toFixed(1) : numeric.toFixed(0);
    return fixed.replace(/\.0$/, '');
  }

  function formatSourceValue(source) {
    if (source.mode === 'percent') {
      return `${source.label} ${source.value >= 0 ? '+' : ''}${Math.round(source.value * 100)}%`;
    }
    if (source.mode === 'base') {
      return `${source.label} ${formatRate(source.value)}/分钟`;
    }
    return `${source.label} ${source.value >= 0 ? '+' : ''}${source.value}`;
  }

  function formatEffects(effects) {
    return (effects || []).map(formatEffect).filter(Boolean).join(' · ');
  }

  function formatCaveMetric(metric) {
    if (metric.mode === 'percent') {
      return `${Math.round(metric.value * 100)}%`;
    }
    return `${formatRate(metric.value)}${metric.suffix || ''}`;
  }

  function formatEffect(effect) {
    if (!effect) return '';
    if (effect.mode === 'percent') {
      return `${effect.label} +${Math.round(effect.value * 100)}%`;
    }
    if (effect.mode === 'reduction') {
      return `${effect.label} -${effect.value}`;
    }
    if (effect.suffix) {
      return `${effect.label} +${formatRate(effect.value)}${effect.suffix}`;
    }
    return `${effect.label} +${effect.value}`;
  }

  function formatChoiceCostReward(choice) {
    const cost = formatReward(choice.cost || {});
    const reward = formatReward(choice.reward || {});
    const risk = choice.successChance && choice.successChance < 1 ? ` · 成功率 ${Math.round(choice.successChance * 100)}%` : '';
    return `${cost ? `消耗 ${cost} · ` : ''}获得 ${reward || '机缘'}${risk}`;
  }

  function formatApproachComparison(approach) {
    const duration = approach.comparison?.durationDeltaPct || 0;
    const danger = approach.comparison?.dangerDeltaPct || 0;
    return `时长 ${formatSignedPercent(duration)} · 劫象 ${formatSignedPercent(danger)}`;
  }

  function formatSignedPercent(value) {
    const safeValue = Math.round(Number(value) || 0);
    if (safeValue === 0) {
      return '持平';
    }
    return `${safeValue > 0 ? '+' : ''}${safeValue}%`;
  }

  function formatDuration(seconds) {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(safeSeconds / 60);
    const rest = safeSeconds % 60;
    return `${minutes}:${String(rest).padStart(2, '0')}`;
  }

  function round(value) {
    return Math.round(value * 100) / 100;
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

  function getDateKey(now = Date.now()) {
    return new Date(now).toISOString().slice(0, 10);
  }
})();
