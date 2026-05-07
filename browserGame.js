(function () {
  const realms = [
    { name: '炼气一层', requiredQi: 100, qiRate: 1.8, stoneRate: 0.12 },
    { name: '炼气二层', requiredQi: 260, qiRate: 2.8, stoneRate: 0.18 },
    { name: '炼气三层', requiredQi: 520, qiRate: 4.2, stoneRate: 0.26 },
    { name: '筑基初期', requiredQi: 1100, qiRate: 6.4, stoneRate: 0.38 },
    { name: '筑基中期', requiredQi: 2200, qiRate: 9.2, stoneRate: 0.54 },
    { name: '金丹初成', requiredQi: 4800, qiRate: 14, stoneRate: 0.82 },
    { name: '金丹圆满', requiredQi: 9200, qiRate: 22, stoneRate: 1.25 },
    { name: '元婴初期', requiredQi: 18000, qiRate: 34, stoneRate: 1.85 },
  ];

  const upgradeTiers = [
    { name: '凡阶', minLevel: 1, maxLevel: 3, realmIndex: 0 },
    { name: '灵阶', minLevel: 4, maxLevel: 6, realmIndex: 3 },
    { name: '玄阶', minLevel: 7, maxLevel: 9, realmIndex: 5 },
    { name: '地阶', minLevel: 10, maxLevel: 12, realmIndex: 7 },
  ];

  const missions = {
    herbGathering: {
      id: 'herbGathering',
      name: '采集灵草',
      duration: 30,
      reward: { herbs: 5, spiritStones: 6 },
    },
    cavePatrol: {
      id: 'cavePatrol',
      name: '巡守洞府',
      duration: 55,
      reward: { spiritStones: 18, qi: 35 },
    },
    marketTrade: {
      id: 'marketTrade',
      name: '坊市交易',
      duration: 90,
      reward: { spiritStones: 48 },
    },
    mistyValley: {
      id: 'mistyValley',
      name: '雾隐秘境',
      duration: 120,
      danger: 115,
      reward: { spiritStones: 35, qi: 90, beastCores: 1, artifacts: 1 },
      failurePenalty: { qi: -45, heartDemon: 1 },
    },
    herbValley: {
      id: 'herbValley',
      name: '灵草谷',
      duration: 70,
      danger: 80,
      reward: { herbs: 14, spiritStones: 14, qi: 45 },
      failurePenalty: { qi: -20 },
    },
    ancientSwordTomb: {
      id: 'ancientSwordTomb',
      name: '古剑冢',
      duration: 140,
      danger: 145,
      reward: { artifacts: 2, spiritStones: 50, beastCores: 1 },
      failurePenalty: { qi: -60, heartDemon: 1 },
    },
    demonRift: {
      id: 'demonRift',
      name: '魔气裂隙',
      duration: 180,
      danger: 180,
      reward: { beastCores: 3, spiritStones: 90, qi: 120, heartDemon: 1 },
      failurePenalty: { qi: -90, heartDemon: 2 },
    },
  };

  const buildings = {
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
      cost: (level) => ({ spiritStones: scaleCost(80, level), beastCores: scaleCost(1, level) }),
      powerPerLevel: 35,
    },
    amulet: {
      id: 'amulet',
      name: '护符',
      maxLevel: 12,
      cost: (level) => ({ spiritStones: scaleCost(70, level), beastCores: scaleCost(1, level) }),
      breakthroughPerLevel: 0.03,
    },
    robe: {
      id: 'robe',
      name: '法袍',
      maxLevel: 12,
      cost: (level) => ({ spiritStones: scaleCost(60, level), beastCores: scaleCost(1, level) }),
      dangerReductionPerLevel: 10,
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
  };

  const marketItems = {
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
    heartDemon: document.querySelector('[data-heart-demon]'),
    power: document.querySelector('[data-power]'),
    breakthroughChance: document.querySelector('[data-breakthrough-chance]'),
    upgradeLimit: document.querySelector('[data-upgrade-limit]'),
    progress: document.querySelector('[data-progress]'),
    progressText: document.querySelector('[data-progress-text]'),
    mission: document.querySelector('[data-mission]'),
    missionTime: document.querySelector('[data-mission-time]'),
    pillBoost: document.querySelector('[data-pill-boost]'),
    goals: document.querySelector('[data-goals]'),
    goalCount: document.querySelector('[data-goal-count]'),
    alchemyList: document.querySelector('[data-alchemy-list]'),
    gearList: document.querySelector('[data-gear-list]'),
    formationList: document.querySelector('[data-formation-list]'),
    foundation: document.querySelector('[data-foundation]'),
    dailyList: document.querySelector('[data-daily-list]'),
    dailyStatus: document.querySelector('[data-daily-status]'),
    marketList: document.querySelector('[data-market-list]'),
    offlineDialog: document.querySelector('[data-offline-dialog]'),
    offlineSummary: document.querySelector('[data-offline-summary]'),
    toastStack: document.querySelector('[data-toast-stack]'),
    log: document.querySelector('[data-log]'),
    canvas: document.querySelector('[data-world]'),
  };

  const ctx = refs.canvas.getContext('2d');
  const renderCache = {};
  const panelTabs = ['goals', 'daily', 'market', 'alchemy', 'gear', 'cave', 'missions', 'log'];
  let activeTab = localStorage.getItem('idle-xianxia-active-tab') || 'goals';
  if (!panelTabs.includes(activeTab)) {
    activeTab = 'goals';
  }
  let pendingOfflineSummary = null;
  let state = loadState();
  let lastFrameAt = performance.now();
  let animationTime = 0;

  document.querySelector('[data-breakthrough]').addEventListener('click', () => {
    performBreakthrough(state);
    saveState();
    render();
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

  refs.gearList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-upgrade-gear]');
    if (!button) return;
    upgradeGear(state, button.dataset.upgradeGear);
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

  document.querySelectorAll('[data-upgrade-building]').forEach((button) => {
    button.addEventListener('click', () => {
      upgradeBuilding(state, button.dataset.upgradeBuilding);
      saveState();
      render();
    });
  });

  refs.goals?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-claim-goal]');
    if (!button) return;
    const result = claimGoalReward(state, button.dataset.claimGoal);
    if (result.ok) {
      showToast('目标奖励', `获得${formatReward(result.reward)}。`);
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
    const button = event.target.closest('[data-buy-market]');
    if (!button) return;
    const result = buyMarketItem(state, button.dataset.buyMarket);
    if (result.ok) {
      showToast('坊市交易', `获得${formatReward(result.reward)}。`);
    }
    saveState();
    render(true);
  });

  document.querySelectorAll('[data-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      activeTab = button.dataset.tab;
      localStorage.setItem('idle-xianxia-active-tab', activeTab);
      renderTabs();
    });
  });

  document.querySelector('[data-reset]').addEventListener('click', () => {
    localStorage.removeItem(saveKey);
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
      qi: 0,
      spiritStones: 0,
      herbs: 0,
      pills: 0,
      beastCores: 0,
      artifacts: 0,
      arrayFlags: 0,
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
      claimedGoals: {},
      autoMissionId: null,
      dailyClaims: {},
      dailyProgress: {},
      marketPurchases: {},
      gear: {
        weapon: 0,
        amulet: 0,
        robe: 0,
      },
      formations: {
        spiritGathering: 0,
        mountainGuard: 0,
        swordArray: 0,
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
      log: [{ time: now, text: '你在青岚山开辟洞府，开始吐纳灵气。' }],
    };
  }

  function reviveGameState(saved, now = Date.now()) {
    const state = Object.assign(createGameState(now), saved);
    state.realmIndex = Math.min(realms.length - 1, Math.max(0, Math.floor(Number(state.realmIndex) || 0)));
    state.heartDemon = Math.max(0, Number(state.heartDemon) || 0);
    state.insight = Math.max(0, Number(state.insight) || 0);
    state.pillBoostUntil = Math.max(0, Number(state.pillBoostUntil) || 0);
    state.breakthroughBoostUntil = Math.max(0, Number(state.breakthroughBoostUntil) || 0);
    state.foundationStability = Math.max(0, Number(state.foundationStability) || 0);
    state.activeAlchemy = normalizeAlchemy(state.activeAlchemy);
    state.inventoryPills = normalizeInventoryPills(state.inventoryPills, state.pills);
    state.craftedPills = Math.max(0, Number(state.craftedPills) || 0);
    state.completedMissions = normalizeCompletedMissions(state.completedMissions);
    state.claimedGoals = normalizeClaimedGoals(state.claimedGoals);
    state.autoMissionId = missions[state.autoMissionId] ? state.autoMissionId : null;
    state.arrayFlags = Math.max(0, Number(state.arrayFlags) || 0);
    state.dailyClaims = normalizeNestedClaims(state.dailyClaims);
    state.dailyProgress = normalizeDailyProgress(state.dailyProgress);
    state.marketPurchases = normalizeNestedClaims(state.marketPurchases);
    state.gear = normalizeLevels(state.gear, gear);
    state.formations = normalizeLevels(state.formations, formations);
    state.buildings = normalizeBuildings(state.buildings);
    state.pills = state.inventoryPills.gatherQiPill;
    state.log = Array.isArray(state.log) ? state.log.slice(0, 20) : [];
    state.activeMission = state.activeMission && missions[state.activeMission.id] ? state.activeMission : null;
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
    state.qi = round(state.qi + calculateQiRate(state, now) * seconds);
    state.stoneCarry += realm.stoneRate * seconds;
    state.herbCarry += (state.buildings.spiritField || 0) * buildings.spiritField.herbRatePerLevel * seconds;

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
    state.lastUpdatedAt = now;
  }

  function performBreakthrough(state, now = Date.now()) {
    const realm = getCurrentRealm(state);
    if (state.realmIndex >= realms.length - 1) {
      addLog(state, now, '此界修行已至尽头，静待新的机缘。');
      return;
    }
    if (state.qi < realm.requiredQi) {
      addLog(state, now, '灵气尚未圆满，突破会伤及根基。');
      return;
    }
    const chance = calculateBreakthroughChance(state, now);
    if (Math.random() > chance) {
      state.qi = round(state.qi * 0.5);
      if ((state.foundationStability || 0) > 0) {
        state.foundationStability = Math.max(0, state.foundationStability - 1);
      } else {
        state.heartDemon += 1;
      }
      addLog(state, now, '突破时心魔骤起，灵气逆行，修为折损。');
      return;
    }
    const carriedQi = calculateBreakthroughCarryQi(state, realm);
    state.realmIndex += 1;
    state.qi = Math.min(carriedQi, round(getCurrentRealm(state).requiredQi * 0.4));
    state.heartDemon = Math.max(0, state.heartDemon - 1);
    state.insight += 1;
    state.foundationStability = 0;
    state.breakthroughBoostUntil = 0;
    state.breakthroughCount += 1;
    addLog(state, now, `灵气贯通周天，突破至${getCurrentRealm(state).name}。`);
  }

  function startMission(state, missionId, now = Date.now()) {
    if (state.activeMission || !missions[missionId]) {
      return;
    }
    const mission = missions[missionId];
    state.activeMission = {
      id: mission.id,
      startedAt: now,
      endsAt: now + mission.duration * 1000,
    };
    addLog(state, now, `外出执行「${mission.name}」。`);
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
    if (nextLevel > getRealmUpgradeLimit(state)) {
      addLog(state, now, `${getUpgradeTier(nextLevel).name}升级需要更高境界。`);
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
      state.qi = round(state.qi + 65 + state.realmIndex * 30);
      state.pillBoostUntil = Math.max(state.pillBoostUntil || 0, now) + 120 * 1000;
      state.pills = state.inventoryPills.gatherQiPill;
      addLog(state, now, '服下一枚聚气丹，吐纳速度暂时提升。');
    } else if (recipeId === 'clearHeartPill') {
      state.heartDemon = Math.max(0, state.heartDemon - 1);
      addLog(state, now, '服下一枚清心丹，心魔压力减轻。');
    } else if (recipeId === 'meridianPill') {
      state.breakthroughBoostUntil = Math.max(state.breakthroughBoostUntil || 0, now) + 180 * 1000;
      addLog(state, now, '服下一枚护脉丹，突破把握暂时提高。');
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

  function completeMissionIfReady(state, now) {
    const active = state.activeMission;
    if (!active || now < active.endsAt) {
      return;
    }
    const mission = missions[active.id];
    state.activeMission = null;
    if (!mission) {
      return;
    }
    const danger = Math.max(0, (mission.danger || 0) - (state.gear.robe || 0) * gear.robe.dangerReductionPerLevel);
    if (danger && calculatePower(state) < danger) {
      applyResources(state, mission.failurePenalty);
      state.injuryUntil = now + 90 * 1000;
      addLog(state, now, `挑战「${mission.name}」失利，负伤退回洞府。`);
      showToast('历练失利', `${mission.name} 战力不足，负伤并滋生心魔。`, 'warning');
      restartAutoMission(state, mission.id, now);
      return;
    }
    applyResources(state, mission.reward);
    state.completedMissions[mission.id] = (state.completedMissions[mission.id] || 0) + 1;
    addDailyProgress(state, 'missions', 1, now);
    addLog(state, now, `完成「${mission.name}」，收获${formatReward(mission.reward)}。`);
    showToast('历练完成', `${mission.name} 收获${formatReward(mission.reward)}。`);
    restartAutoMission(state, mission.id, now);
  }

  function render(forceLists = false) {
    const realm = getCurrentRealm(state);
    const progress = Math.max(0, Math.min(1, state.qi / realm.requiredQi));
    const remainingQi = Math.max(0, realm.requiredQi - state.qi);
    const activeMission = state.activeMission ? missions[state.activeMission.id] : null;

    refs.realm.textContent = realm.name;
    refs.qi.textContent = `${Math.floor(state.qi)} / ${realm.requiredQi}`;
    refs.qiRate.textContent = `${calculateQiRate(state, Date.now()).toFixed(1)} / 秒`;
    refs.stones.textContent = Math.floor(state.spiritStones);
    refs.herbs.textContent = Math.floor(state.herbs);
    refs.pills.textContent = Math.floor(state.pills);
    if (refs.clearHeartPills) refs.clearHeartPills.textContent = Math.floor(state.inventoryPills.clearHeartPill || 0);
    if (refs.meridianPills) refs.meridianPills.textContent = Math.floor(state.inventoryPills.meridianPill || 0);
    refs.beastCores.textContent = Math.floor(state.beastCores);
    refs.artifacts.textContent = Math.floor(state.artifacts);
    if (refs.arrayFlags) refs.arrayFlags.textContent = Math.floor(state.arrayFlags);
    refs.heartDemon.textContent = Math.floor(state.heartDemon);
    refs.power.textContent = calculatePower(state);
    refs.breakthroughChance.textContent = `${Math.round(calculateBreakthroughChance(state, Date.now()) * 100)}%`;
    refs.progress.style.width = `${progress * 100}%`;
    refs.progressText.textContent = remainingQi > 0 ? `距突破还差 ${Math.ceil(remainingQi)} 灵气` : '灵气圆满，可以尝试突破';

    if (activeMission) {
      refs.mission.textContent = activeMission.name;
      refs.missionTime.textContent = formatDuration((state.activeMission.endsAt - Date.now()) / 1000);
    } else if (state.activeAlchemy) {
      refs.mission.textContent = `炼制${(pillRecipes[state.activeAlchemy.recipeId] || pillRecipes.gatherQiPill).name}`;
      refs.missionTime.textContent = formatDuration((state.activeAlchemy.endsAt - Date.now()) / 1000);
    } else {
      refs.mission.textContent = '闭关修炼';
      refs.missionTime.textContent = '待命';
    }

    if (refs.pillBoost) {
      const secondsLeft = Math.max(0, Math.ceil(((state.pillBoostUntil || 0) - Date.now()) / 1000));
      const meridianLeft = Math.max(0, Math.ceil(((state.breakthroughBoostUntil || 0) - Date.now()) / 1000));
      refs.pillBoost.textContent = secondsLeft > 0 ? `吐纳 ${formatDuration(secondsLeft)}` : meridianLeft > 0 ? `护脉 ${formatDuration(meridianLeft)}` : '未服丹';
    }
    if (refs.foundation) {
      refs.foundation.textContent = `${state.foundationStability || 0} / 3`;
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
    renderGear(forceLists);
    renderFormations(forceLists);
    renderTabs();

    document.querySelectorAll('[data-start-mission]').forEach((button) => {
      button.disabled = Boolean(state.activeMission);
    });

    document.querySelectorAll('[data-auto-mission]').forEach((button) => {
      const active = state.autoMissionId === button.dataset.autoMission;
      button.classList.toggle('active', active);
      button.textContent = active ? '自动中' : '自动';
    });

    document.querySelectorAll('[data-building-level]').forEach((level) => {
      level.textContent = state.buildings[level.dataset.buildingLevel] || 0;
    });

    document.querySelectorAll('[data-building-cost]').forEach((costLabel) => {
      const building = buildings[costLabel.dataset.buildingCost];
      const currentLevel = state.buildings[building.id] || 0;
      const nextLevel = currentLevel + 1;
      if (currentLevel >= building.maxLevel) {
        costLabel.textContent = '已达上限';
        return;
      }
      if (nextLevel > getRealmUpgradeLimit(state)) {
        costLabel.textContent = `${getUpgradeTier(nextLevel).name}需更高境界`;
        return;
      }
      costLabel.textContent = `${getUpgradeTier(nextLevel).name}升级需${formatReward(building.cost(nextLevel))}`;
    });

    document.querySelectorAll('[data-upgrade-building]').forEach((button) => {
      const building = buildings[button.dataset.upgradeBuilding];
      const nextLevel = (state.buildings[building.id] || 0) + 1;
      button.disabled = nextLevel > building.maxLevel || nextLevel > getRealmUpgradeLimit(state);
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

  function getGoals(state) {
    return [
      {
        id: 'realmThree',
        title: '突破至炼气三层',
        detail: '提高吐纳效率，开启更稳定的秘境收益',
        completed: state.realmIndex >= 2,
        claimed: Boolean(state.claimedGoals.realmThree),
        reward: { spiritStones: 80, pills: 1 },
      },
      {
        id: 'spiritField',
        title: '建成一阶灵田',
        detail: '让洞府开始自动生长灵草',
        completed: (state.buildings.spiritField || 0) >= 1,
        claimed: Boolean(state.claimedGoals.spiritField),
        reward: { herbs: 10, spiritStones: 30 },
      },
      {
        id: 'mistyValley',
        title: '完成一次雾隐秘境',
        detail: '获得妖核或法器，准备强化剑阵',
        completed: (state.completedMissions.mistyValley || 0) >= 1,
        claimed: Boolean(state.claimedGoals.mistyValley),
        reward: { beastCores: 1, spiritStones: 60 },
      },
      {
        id: 'firstPill',
        title: '炼成一枚聚气丹',
        detail: '突破前用丹药快速补足灵气',
        completed: (state.craftedPills || 0) >= 1,
        claimed: Boolean(state.claimedGoals.firstPill),
        reward: { qi: 120, spiritStones: 25 },
      },
    ];
  }

  function isDailyUnlocked(state) {
    return getGoals(state).filter((goal) => goal.completed).length >= 3;
  }

  function getDailyTasks(state, dateKey = getDateKey()) {
    const unlocked = isDailyUnlocked(state);
    const claims = state.dailyClaims[dateKey] || {};
    const progress = getDailyProgress(state, dateKey);
    return Object.values(dailyTasks).map((task) => ({
      ...task,
      unlocked,
      progress: Math.min(task.target, Math.floor(progress[task.progressKey] || 0)),
      completed: (progress[task.progressKey] || 0) >= task.target,
      claimed: Boolean(claims[task.id]),
    }));
  }

  function renderDailyTasks(force = false) {
    if (!refs.dailyList || !refs.dailyStatus) {
      return;
    }

    const tasks = getDailyTasks(state);
    const unlocked = tasks.every((task) => task.unlocked);
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
          <small>${task.claimed ? '已领取' : task.completed ? `可领取 ${formatReward(task.reward)}` : `奖励 ${formatReward(task.reward)}`}</small>
        </button>
      `)
      .join('');
    renderCache.daily = signature;
  }

  function renderMarket(force = false) {
    if (!refs.marketList) {
      return;
    }

    const signature = Object.keys(marketItems).join('|');
    if (!force && renderCache.market === signature) {
      return;
    }

    refs.marketList.innerHTML = Object.values(marketItems)
      .map((item) => `
        <button data-buy-market="${item.id}">
          <strong>${item.name} · ${item.type}</strong>
          <span>获得 ${formatReward(item.reward)}</span>
          <small>价格 ${formatReward(item.cost)}</small>
        </button>
      `)
      .join('');
    renderCache.market = signature;
  }

  function claimDailyTask(state, taskId, dateKey = getDateKey(), now = Date.now()) {
    const task = dailyTasks[taskId];
    if (!task) {
      return { ok: false, reason: 'unknownTask' };
    }
    if (!isDailyUnlocked(state)) {
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

  function buyMarketItem(state, itemId, now = Date.now()) {
    const item = marketItems[itemId];
    if (!item) {
      return { ok: false, reason: 'unknownItem' };
    }
    if (!canAfford(state, item.cost)) {
      addLog(state, now, `购买${item.name}需要${formatReward(item.cost)}。`);
      showToast('灵石不足', `购买${item.name}需要${formatReward(item.cost)}。`, 'warning');
      return { ok: false, reason: 'notEnoughResources' };
    }
    payResources(state, item.cost);
    applyResources(state, item.reward);
    addDailyProgress(state, 'marketBuys', 1, now);
    const dateKey = getDateKey(now);
    state.marketPurchases[dateKey] ||= {};
    state.marketPurchases[dateKey][itemId] = (state.marketPurchases[dateKey][itemId] || 0) + 1;
    addLog(state, now, `坊市购得${item.name}，获得${formatReward(item.reward)}。`);
    return { ok: true, reward: item.reward };
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
    const signature = `${getRealmUpgradeLimit(state)}|${Object.keys(gear).map((id) => `${id}:${state.gear[id] || 0}`).join('|')}`;
    if (!force && renderCache.gear === signature) {
      return;
    }
    refs.gearList.innerHTML = Object.values(gear)
      .map((item) => renderUpgradeRow(item, state.gear[item.id] || 0, 'data-upgrade-gear'))
      .join('');
    renderCache.gear = signature;
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

  function getRecipeEffectText(recipeId) {
    const effects = {
      gatherQiPill: '立即补充灵气，并提升吐纳 2 分钟',
      clearHeartPill: '降低 1 点心魔',
      meridianPill: '提高突破把握 3 分钟',
    };
    return effects[recipeId] || '丹药效果';
  }

  function getUpgradeEffectText(id) {
    const effects = {
      weapon: '提高秘境战力',
      amulet: '提高突破成功率',
      robe: '降低秘境危险',
      spiritGathering: '提高吐纳速度',
      mountainGuard: '提高突破稳定度',
      swordArray: '提高秘境战力',
    };
    return effects[id] || '强化修行能力';
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

    const goals = getGoals(state);
    const completed = goals.filter((goal) => goal.completed).length;
    refs.goalCount.textContent = `${completed} / ${goals.length}`;
    const signature = goals.map((goal) => `${goal.id}:${goal.completed}:${goal.claimed}`).join('|');
    if (!force && renderCache.goals === signature) {
      return;
    }

    refs.goals.innerHTML = goals
      .map((goal) => `
        <li class="${goal.completed ? 'completed' : ''}">
          <span>${goal.completed ? '✓' : ''}</span>
          <div>
            <strong>${goal.title}</strong>
            <small>${goal.detail}</small>
          </div>
          ${goal.completed ? `<button data-claim-goal="${goal.id}" ${goal.claimed ? 'disabled' : ''}>${goal.claimed ? '已领' : '领取'}</button>` : ''}
        </li>
      `)
      .join('');
    renderCache.goals = signature;
  }

  function claimGoalReward(state, goalId, now = Date.now()) {
    const goal = getGoals(state).find((candidate) => candidate.id === goalId);
    if (!goal) {
      return { ok: false, reason: 'unknownGoal' };
    }
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
    const pillBoost = state.pillBoostUntil && state.pillBoostUntil > now ? 1.4 : 1;
    const injuryPenalty = state.injuryUntil && state.injuryUntil > now ? 0.75 : 1;
    return round(realm.qiRate * buildingBonus * formationBonus * pillBoost * injuryPenalty);
  }

  function calculateBreakthroughChance(state, now = Date.now()) {
    const realm = getCurrentRealm(state);
    const overfill = Math.max(0, state.qi - realm.requiredQi);
    const preparation = Math.min(0.2, overfill / realm.requiredQi / 2);
    const insightBonus = Math.min(0.15, state.insight * 0.03);
    const gearBonus = Math.min(0.12, (state.gear.amulet || 0) * gear.amulet.breakthroughPerLevel);
    const formationBonus = Math.min(0.12, (state.formations.mountainGuard || 0) * formations.mountainGuard.stabilityPerLevel);
    const pillBonus = state.breakthroughBoostUntil && state.breakthroughBoostUntil > now ? 0.12 : 0;
    const foundationBonus = Math.min(0.15, (state.foundationStability || 0) * 0.05);
    const heartDemonPenalty = Math.min(0.35, state.heartDemon * 0.15);
    return round(Math.max(0.25, Math.min(0.95, 0.75 + preparation + insightBonus + gearBonus + formationBonus + pillBonus + foundationBonus - heartDemonPenalty)));
  }

  function calculatePower(state) {
    const realmPower = (state.realmIndex + 1) * 55;
    const swordPower = (state.buildings.swordArray || 0) * buildings.swordArray.powerPerLevel;
    const gearPower = (state.gear.weapon || 0) * gear.weapon.powerPerLevel;
    const formationPower = (state.formations.swordArray || 0) * formations.swordArray.powerPerLevel;
    const qiPower = Math.min(90, Math.floor((state.qi || 0) * 0.5));
    const demonPenalty = (state.heartDemon || 0) * 8;
    return Math.max(10, Math.floor(realmPower + swordPower + gearPower + formationPower + qiPower - demonPenalty));
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

  function normalizeClaimedGoals(savedGoals) {
    if (!savedGoals || typeof savedGoals !== 'object') {
      return {};
    }

    return Object.fromEntries(Object.entries(savedGoals).filter(([, claimed]) => Boolean(claimed)));
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
    state.dailyProgress[dateKey] ||= { cultivationSeconds: 0, missions: 0, marketBuys: 0 };
    return state.dailyProgress[dateKey];
  }

  function addDailyProgress(state, key, amount, now = Date.now()) {
    const progress = getDailyProgress(state, getDateKey(now));
    progress[key] = (progress[key] || 0) + amount;
  }

  function getAlchemyDuration(state, recipe) {
    const furnaceLevel = state.buildings.alchemyFurnace || 0;
    const speedMultiplier = Math.max(0.5, 1 - furnaceLevel * buildings.alchemyFurnace.speedBonusPerLevel);
    return Math.max(10, Math.round(recipe.duration * speedMultiplier));
  }

  function restartAutoMission(state, completedMissionId, now) {
    const missionId = state.autoMissionId;
    if (!missionId || missionId !== completedMissionId || !missions[missionId]) {
      return;
    }

    const mission = missions[missionId];
    state.activeMission = {
      id: mission.id,
      startedAt: now,
      endsAt: now + mission.duration * 1000,
    };
    addLog(state, now, `自动继续「${mission.name}」。`);
  }

  function snapshotResources(state) {
    return {
      qi: state.qi || 0,
      spiritStones: state.spiritStones || 0,
      herbs: state.herbs || 0,
      beastCores: state.beastCores || 0,
      artifacts: state.artifacts || 0,
      arrayFlags: state.arrayFlags || 0,
    };
  }

  function canAfford(state, cost) {
    return Object.entries(cost).every(([resource, amount]) => (state[resource] || 0) >= amount);
  }

  function payResources(state, cost) {
    Object.entries(cost).forEach(([resource, amount]) => {
      state[resource] = round((state[resource] || 0) - amount);
    });
  }

  function applyResources(state, reward) {
    Object.entries(reward).forEach(([resource, amount]) => {
      if (resource === 'pills') {
        state.inventoryPills.gatherQiPill = Math.max(0, round((state.inventoryPills.gatherQiPill || 0) + amount));
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

  function renderTabs() {
    document.querySelectorAll('[data-tab]').forEach((button) => {
      button.classList.toggle('active', button.dataset.tab === activeTab);
    });
    document.querySelectorAll('[data-panel]').forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.panel === activeTab);
    });
  }

  function addLog(state, time, text) {
    state.log.unshift({ time, text });
    state.log = state.log.slice(0, 20);
  }

  function formatReward(reward) {
    const names = { qi: '灵气', herbs: '灵草', spiritStones: '灵石', pills: '聚气丹', gatherQiPill: '聚气丹', clearHeartPill: '清心丹', meridianPill: '护脉丹', beastCores: '妖核', artifacts: '法器', arrayFlags: '阵旗', heartDemon: '心魔' };
    return Object.entries(reward)
      .map(([key, amount]) => `${amount} ${names[key] || key}`)
      .join('、');
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

  function scaleCost(base, level) {
    if (level <= 0) {
      return 0;
    }
    const tierMultiplier = 1 + Math.floor((level - 1) / 3) * 1.5;
    return Math.ceil(base * level * tierMultiplier);
  }

  function getDateKey(now = Date.now()) {
    return new Date(now).toISOString().slice(0, 10);
  }
})();
