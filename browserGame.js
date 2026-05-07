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
  };

  const buildings = {
    meditationSeat: {
      id: 'meditationSeat',
      name: '蒲团',
      maxLevel: 5,
      cost: (level) => ({ spiritStones: level * 20, herbs: Math.max(0, (level - 1) * 4) }),
      qiBonusPerLevel: 0.2,
    },
    spiritField: {
      id: 'spiritField',
      name: '灵田',
      maxLevel: 5,
      cost: (level) => ({ spiritStones: level * 30 }),
      herbRatePerLevel: 0.02,
    },
    swordArray: {
      id: 'swordArray',
      name: '剑阵',
      maxLevel: 5,
      cost: (level) => ({ spiritStones: level * 45, beastCores: Math.max(0, level - 1) }),
      powerPerLevel: 28,
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
    beastCores: document.querySelector('[data-beast-cores]'),
    artifacts: document.querySelector('[data-artifacts]'),
    heartDemon: document.querySelector('[data-heart-demon]'),
    power: document.querySelector('[data-power]'),
    breakthroughChance: document.querySelector('[data-breakthrough-chance]'),
    progress: document.querySelector('[data-progress]'),
    progressText: document.querySelector('[data-progress-text]'),
    mission: document.querySelector('[data-mission]'),
    missionTime: document.querySelector('[data-mission-time]'),
    goals: document.querySelector('[data-goals]'),
    goalCount: document.querySelector('[data-goal-count]'),
    offlineDialog: document.querySelector('[data-offline-dialog]'),
    offlineSummary: document.querySelector('[data-offline-summary]'),
    toastStack: document.querySelector('[data-toast-stack]'),
    log: document.querySelector('[data-log]'),
    canvas: document.querySelector('[data-world]'),
  };

  const ctx = refs.canvas.getContext('2d');
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

  document.querySelectorAll('[data-start-mission]').forEach((button) => {
    button.addEventListener('click', () => {
      startMission(state, button.dataset.startMission);
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

  document.querySelector('[data-reset]').addEventListener('click', () => {
    localStorage.removeItem(saveKey);
    state = createGameState();
    saveState();
    render();
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
      realmIndex: 0,
      heartDemon: 0,
      insight: 0,
      injuryUntil: 0,
      craftedPills: 0,
      completedMissions: {},
      buildings: {
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
    state.craftedPills = Math.max(0, Number(state.craftedPills) || 0);
    state.completedMissions = normalizeCompletedMissions(state.completedMissions);
    state.buildings = normalizeBuildings(state.buildings);
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
    state.qi = round(state.qi + calculateQiRate(state) * seconds);
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
    const chance = calculateBreakthroughChance(state);
    if (Math.random() > chance) {
      state.qi = round(state.qi * 0.5);
      state.heartDemon += 1;
      addLog(state, now, '突破时心魔骤起，灵气逆行，修为折损。');
      return;
    }
    const carriedQi = calculateBreakthroughCarryQi(state, realm);
    state.realmIndex += 1;
    state.qi = Math.min(carriedQi, round(getCurrentRealm(state).requiredQi * 0.4));
    state.heartDemon = Math.max(0, state.heartDemon - 1);
    state.insight += 1;
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

  function craftPill(state, now = Date.now()) {
    if (state.herbs < 8 || state.spiritStones < 12) {
      addLog(state, now, '炼制聚气丹需要 8 株灵草和 12 枚灵石。');
      return;
    }
    state.herbs -= 8;
    state.spiritStones -= 12;
    state.pills += 1;
    state.craftedPills += 1;
    addLog(state, now, '丹炉火候正好，炼成一枚聚气丹。');
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
    const cost = building.cost(nextLevel);
    if (!canAfford(state, cost)) {
      addLog(state, now, `升级${building.name}需要${formatReward(cost)}。`);
      return;
    }
    Object.entries(cost).forEach(([resource, amount]) => {
      state[resource] = round((state[resource] || 0) - amount);
    });
    state.buildings[buildingId] = nextLevel;
    addLog(state, now, `${building.name}升至 ${nextLevel} 级。`);
  }

  function consumePill(state, now = Date.now()) {
    if (state.pills <= 0) {
      addLog(state, now, '丹瓶已空。');
      return;
    }
    state.pills -= 1;
    state.qi = round(state.qi + 65 + state.realmIndex * 30);
    addLog(state, now, '服下一枚聚气丹，灵气在经脉中散开。');
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
    if (mission.danger && calculatePower(state) < mission.danger) {
      applyResources(state, mission.failurePenalty);
      state.injuryUntil = now + 90 * 1000;
      addLog(state, now, `挑战「${mission.name}」失利，负伤退回洞府。`);
      showToast('历练失利', `${mission.name} 战力不足，负伤并滋生心魔。`, 'warning');
      return;
    }
    applyResources(state, mission.reward);
    state.completedMissions[mission.id] = (state.completedMissions[mission.id] || 0) + 1;
    addLog(state, now, `完成「${mission.name}」，收获${formatReward(mission.reward)}。`);
    showToast('历练完成', `${mission.name} 收获${formatReward(mission.reward)}。`);
  }

  function render() {
    const realm = getCurrentRealm(state);
    const progress = Math.max(0, Math.min(1, state.qi / realm.requiredQi));
    const remainingQi = Math.max(0, realm.requiredQi - state.qi);
    const activeMission = state.activeMission ? missions[state.activeMission.id] : null;

    refs.realm.textContent = realm.name;
    refs.qi.textContent = `${Math.floor(state.qi)} / ${realm.requiredQi}`;
    refs.qiRate.textContent = `${calculateQiRate(state).toFixed(1)} / 秒`;
    refs.stones.textContent = Math.floor(state.spiritStones);
    refs.herbs.textContent = Math.floor(state.herbs);
    refs.pills.textContent = Math.floor(state.pills);
    refs.beastCores.textContent = Math.floor(state.beastCores);
    refs.artifacts.textContent = Math.floor(state.artifacts);
    refs.heartDemon.textContent = Math.floor(state.heartDemon);
    refs.power.textContent = calculatePower(state);
    refs.breakthroughChance.textContent = `${Math.round(calculateBreakthroughChance(state) * 100)}%`;
    refs.progress.style.width = `${progress * 100}%`;
    refs.progressText.textContent = remainingQi > 0 ? `距突破还差 ${Math.ceil(remainingQi)} 灵气` : '灵气圆满，可以尝试突破';

    if (activeMission) {
      refs.mission.textContent = activeMission.name;
      refs.missionTime.textContent = formatDuration((state.activeMission.endsAt - Date.now()) / 1000);
    } else {
      refs.mission.textContent = '闭关修炼';
      refs.missionTime.textContent = '待命';
    }

    refs.log.innerHTML = state.log
      .map((entry) => `<li><time>${new Date(entry.time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</time>${entry.text}</li>`)
      .join('');

    renderGoals();

    document.querySelectorAll('[data-start-mission]').forEach((button) => {
      button.disabled = Boolean(state.activeMission);
    });

    document.querySelectorAll('[data-building-level]').forEach((level) => {
      level.textContent = state.buildings[level.dataset.buildingLevel] || 0;
    });

    document.querySelectorAll('[data-building-cost]').forEach((costLabel) => {
      const building = buildings[costLabel.dataset.buildingCost];
      const currentLevel = state.buildings[building.id] || 0;
      if (currentLevel >= building.maxLevel) {
        costLabel.textContent = '已达上限';
        return;
      }
      costLabel.textContent = `升级需${formatReward(building.cost(currentLevel + 1))}`;
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

  function getGoals(state) {
    return [
      {
        id: 'realmThree',
        title: '突破至炼气三层',
        detail: '提高吐纳效率，开启更稳定的秘境收益',
        completed: state.realmIndex >= 2,
      },
      {
        id: 'spiritField',
        title: '建成一阶灵田',
        detail: '让洞府开始自动生长灵草',
        completed: (state.buildings.spiritField || 0) >= 1,
      },
      {
        id: 'mistyValley',
        title: '完成一次雾隐秘境',
        detail: '获得妖核或法器，准备强化剑阵',
        completed: (state.completedMissions.mistyValley || 0) >= 1,
      },
      {
        id: 'firstPill',
        title: '炼成一枚聚气丹',
        detail: '突破前用丹药快速补足灵气',
        completed: (state.craftedPills || 0) >= 1,
      },
    ];
  }

  function renderGoals() {
    if (!refs.goals || !refs.goalCount) {
      return;
    }

    const goals = getGoals(state);
    const completed = goals.filter((goal) => goal.completed).length;
    refs.goalCount.textContent = `${completed} / ${goals.length}`;
    refs.goals.innerHTML = goals
      .map((goal) => `
        <li class="${goal.completed ? 'completed' : ''}">
          <span>${goal.completed ? '✓' : ''}</span>
          <div>
            <strong>${goal.title}</strong>
            <small>${goal.detail}</small>
          </div>
        </li>
      `)
      .join('');
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

  function calculateQiRate(state) {
    const realm = getCurrentRealm(state);
    const buildingBonus = 1 + ((state.buildings.meditationSeat || 1) - 1) * buildings.meditationSeat.qiBonusPerLevel;
    const pillBoost = state.pills > 0 ? 1.15 : 1;
    const injuryPenalty = state.injuryUntil && state.injuryUntil > Date.now() ? 0.75 : 1;
    return round(realm.qiRate * buildingBonus * pillBoost * injuryPenalty);
  }

  function calculateBreakthroughChance(state) {
    const realm = getCurrentRealm(state);
    const overfill = Math.max(0, state.qi - realm.requiredQi);
    const preparation = Math.min(0.2, overfill / realm.requiredQi / 2);
    const insightBonus = Math.min(0.15, state.insight * 0.03);
    const heartDemonPenalty = Math.min(0.35, state.heartDemon * 0.15);
    return round(Math.max(0.25, Math.min(0.95, 0.75 + preparation + insightBonus - heartDemonPenalty)));
  }

  function calculatePower(state) {
    const realmPower = (state.realmIndex + 1) * 55;
    const swordPower = (state.buildings.swordArray || 0) * buildings.swordArray.powerPerLevel;
    const artifactPower = (state.artifacts || 0) * 22;
    const qiPower = Math.min(90, Math.floor((state.qi || 0) * 0.5));
    const demonPenalty = (state.heartDemon || 0) * 8;
    return Math.max(10, Math.floor(realmPower + swordPower + artifactPower + qiPower - demonPenalty));
  }

  function calculateBreakthroughCarryQi(state, realm = getCurrentRealm(state)) {
    const overflowQi = Math.max(0, (state.qi || 0) - realm.requiredQi);
    return round(overflowQi * 0.5);
  }

  function normalizeBuildings(savedBuildings) {
    const normalized = { meditationSeat: 1, spiritField: 0, swordArray: 0 };
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

  function snapshotResources(state) {
    return {
      qi: state.qi || 0,
      spiritStones: state.spiritStones || 0,
      herbs: state.herbs || 0,
      beastCores: state.beastCores || 0,
      artifacts: state.artifacts || 0,
    };
  }

  function canAfford(state, cost) {
    return Object.entries(cost).every(([resource, amount]) => (state[resource] || 0) >= amount);
  }

  function applyResources(state, reward) {
    Object.entries(reward).forEach(([resource, amount]) => {
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

  function addLog(state, time, text) {
    state.log.unshift({ time, text });
    state.log = state.log.slice(0, 20);
  }

  function formatReward(reward) {
    const names = { qi: '灵气', herbs: '灵草', spiritStones: '灵石', pills: '丹药', beastCores: '妖核', artifacts: '法器', heartDemon: '心魔' };
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
})();
