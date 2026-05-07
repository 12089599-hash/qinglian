export const REALMS = [
  { name: '炼气一层', requiredQi: 100, qiRate: 1.8, stoneRate: 0.12 },
  { name: '炼气二层', requiredQi: 260, qiRate: 2.8, stoneRate: 0.18 },
  { name: '炼气三层', requiredQi: 520, qiRate: 4.2, stoneRate: 0.26 },
  { name: '筑基初期', requiredQi: 1100, qiRate: 6.4, stoneRate: 0.38 },
  { name: '筑基中期', requiredQi: 2200, qiRate: 9.2, stoneRate: 0.54 },
  { name: '金丹初成', requiredQi: 4800, qiRate: 14, stoneRate: 0.82 },
  { name: '金丹圆满', requiredQi: 9200, qiRate: 22, stoneRate: 1.25 },
  { name: '元婴初期', requiredQi: 18000, qiRate: 34, stoneRate: 1.85 },
];

export const MISSIONS = {
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

export const BUILDINGS = {
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

export function createGameState(now = Date.now()) {
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
    log: [
      { time: now, text: '你在青岚山开辟洞府，开始吐纳灵气。' },
    ],
  };
}

export function reviveGameState(saved, now = Date.now()) {
  const state = { ...createGameState(now), ...saved };
  state.realmIndex = clampInteger(state.realmIndex, 0, REALMS.length - 1);
  state.heartDemon = Math.max(0, Number(state.heartDemon) || 0);
  state.insight = Math.max(0, Number(state.insight) || 0);
  state.buildings = normalizeBuildings(state.buildings);
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

export function calculateQiRate(state) {
  const realm = getCurrentRealm(state);
  const buildingBonus = 1 + ((state.buildings?.meditationSeat ?? 1) - 1) * BUILDINGS.meditationSeat.qiBonusPerLevel;
  const pillBoost = state.pills > 0 ? 1.15 : 1;
  const injuryPenalty = state.injuryUntil && state.injuryUntil > Date.now() ? 0.75 : 1;
  return round(realm.qiRate * buildingBonus * pillBoost * injuryPenalty);
}

export function calculateBreakthroughChance(state) {
  const realm = getCurrentRealm(state);
  const overfill = Math.max(0, state.qi - realm.requiredQi);
  const preparation = Math.min(0.2, overfill / realm.requiredQi / 2);
  const insightBonus = Math.min(0.15, (state.insight ?? 0) * 0.03);
  const heartDemonPenalty = Math.min(0.35, (state.heartDemon ?? 0) * 0.15);
  return round(Math.max(0.25, Math.min(0.95, 0.75 + preparation + insightBonus - heartDemonPenalty)));
}

export function calculatePower(state) {
  const realmPower = (state.realmIndex + 1) * 55;
  const swordPower = (state.buildings?.swordArray ?? 0) * BUILDINGS.swordArray.powerPerLevel;
  const artifactPower = (state.artifacts ?? 0) * 22;
  const qiPower = Math.min(90, Math.floor((state.qi ?? 0) * 0.5));
  const demonPenalty = (state.heartDemon ?? 0) * 8;
  return Math.max(10, Math.floor(realmPower + swordPower + artifactPower + qiPower - demonPenalty));
}

export function updateGame(state, deltaSeconds, now = Date.now()) {
  const seconds = Math.max(0, Math.min(deltaSeconds, 60 * 60 * 12));

  const realm = getCurrentRealm(state);
  state.qi = round(state.qi + calculateQiRate(state) * seconds);
  state.stoneCarry += realm.stoneRate * seconds;
  state.herbCarry += (state.buildings?.spiritField ?? 0) * BUILDINGS.spiritField.herbRatePerLevel * seconds;

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

  const chance = calculateBreakthroughChance(state);
  if (random() > chance) {
    state.qi = round(state.qi * 0.5);
    state.heartDemon = (state.heartDemon ?? 0) + 1;
    addLog(state, now, '突破时心魔骤起，灵气逆行，修为折损。');
    return { ok: false, reason: 'failed', chance };
  }

  state.qi = 0;
  state.realmIndex += 1;
  state.heartDemon = Math.max(0, (state.heartDemon ?? 0) - 1);
  state.insight = (state.insight ?? 0) + 1;
  state.breakthroughCount += 1;
  addLog(state, now, `灵气贯通周天，突破至${getCurrentRealm(state).name}。`);
  return { ok: true, chance };
}

export function startMission(state, missionId, now = Date.now()) {
  if (state.activeMission) {
    return { ok: false, reason: 'busy' };
  }

  const mission = MISSIONS[missionId];
  if (!mission) {
    return { ok: false, reason: 'unknownMission' };
  }

  state.activeMission = {
    id: mission.id,
    startedAt: now,
    endsAt: now + mission.duration * 1000,
  };
  addLog(state, now, `外出执行「${mission.name}」。`);
  return { ok: true };
}

export function craftPill(state, now = Date.now()) {
  if (state.herbs < 8 || state.spiritStones < 12) {
    addLog(state, now, '炼制聚气丹需要 8 株灵草和 12 枚灵石。');
    return { ok: false };
  }

  state.herbs -= 8;
  state.spiritStones -= 12;
  state.pills += 1;
  addLog(state, now, '丹炉火候正好，炼成一枚聚气丹。');
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

export function consumePill(state, now = Date.now()) {
  if (state.pills <= 0) {
    addLog(state, now, '丹瓶已空。');
    return { ok: false };
  }

  state.pills -= 1;
  state.qi = round(state.qi + 65 + state.realmIndex * 30);
  addLog(state, now, '服下一枚聚气丹，灵气在经脉中散开。');
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

  if (mission.danger && calculatePower(state) < mission.danger) {
    applyResources(state, mission.failurePenalty);
    state.injuryUntil = now + 90 * 1000;
    addLog(state, now, `挑战「${mission.name}」失利，负伤退回洞府。`);
    return;
  }

  applyResources(state, mission.reward);
  addLog(state, now, `完成「${mission.name}」，收获${formatReward(mission.reward)}。`);
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

function normalizeBuildings(buildings) {
  const normalized = createGameState().buildings;
  Object.keys(BUILDINGS).forEach((id) => {
    normalized[id] = clampInteger(buildings?.[id] ?? normalized[id] ?? 0, 0, BUILDINGS[id].maxLevel);
  });
  return normalized;
}

function canAfford(state, cost) {
  return Object.entries(cost).every(([resource, amount]) => (state[resource] ?? 0) >= amount);
}

function payResources(state, cost) {
  Object.entries(cost).forEach(([resource, amount]) => {
    state[resource] = round((state[resource] ?? 0) - amount);
  });
}

function applyResources(state, reward) {
  Object.entries(reward).forEach(([resource, amount]) => {
    state[resource] = Math.max(0, round((state[resource] ?? 0) + amount));
  });
}

function formatReward(reward) {
  const names = {
    qi: '灵气',
    herbs: '灵草',
    spiritStones: '灵石',
    pills: '丹药',
    beastCores: '妖核',
    artifacts: '法器',
    heartDemon: '心魔',
  };
  return Object.entries(reward)
    .map(([key, amount]) => `${amount} ${names[key] ?? key}`)
    .join('、');
}

function clampInteger(value, min, max) {
  const integer = Number.isFinite(value) ? Math.floor(value) : min;
  return Math.min(max, Math.max(min, integer));
}

function round(value) {
  return Math.round(value * 100) / 100;
}
