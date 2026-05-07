import {
  MISSIONS,
  craftPill,
  consumePill,
  createGameState,
  formatDuration,
  getCurrentRealm,
  getRealmProgress,
  performBreakthrough,
  reviveGameState,
  startMission,
  updateGame,
} from './gameCore.mjs';

const saveKey = 'idle-xianxia-save-v1';
const refs = {
  realm: document.querySelector('[data-realm]'),
  qi: document.querySelector('[data-qi]'),
  qiRate: document.querySelector('[data-qi-rate]'),
  stones: document.querySelector('[data-stones]'),
  herbs: document.querySelector('[data-herbs]'),
  pills: document.querySelector('[data-pills]'),
  progress: document.querySelector('[data-progress]'),
  progressText: document.querySelector('[data-progress-text]'),
  mission: document.querySelector('[data-mission]'),
  missionTime: document.querySelector('[data-mission-time]'),
  log: document.querySelector('[data-log]'),
  canvas: document.querySelector('[data-world]'),
};

const ctx = refs.canvas.getContext('2d');
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

document.querySelector('[data-reset]').addEventListener('click', () => {
  localStorage.removeItem(saveKey);
  state = createGameState();
  saveState();
  render();
});

render();
requestAnimationFrame(loop);
setInterval(saveState, 5000);

function loop(now) {
  const delta = Math.min((now - lastFrameAt) / 1000, 4);
  lastFrameAt = now;
  animationTime += delta;

  updateGame(state, delta, Date.now());
  render();
  drawWorld();
  requestAnimationFrame(loop);
}

function render() {
  const realm = getCurrentRealm(state);
  const progress = getRealmProgress(state);
  const remainingQi = Math.max(0, realm.requiredQi - state.qi);
  const activeMission = state.activeMission ? MISSIONS[state.activeMission.id] : null;

  refs.realm.textContent = realm.name;
  refs.qi.textContent = `${Math.floor(state.qi)} / ${realm.requiredQi}`;
  refs.qiRate.textContent = `${realm.qiRate.toFixed(1)} / 秒`;
  refs.stones.textContent = Math.floor(state.spiritStones);
  refs.herbs.textContent = Math.floor(state.herbs);
  refs.pills.textContent = Math.floor(state.pills);
  refs.progress.style.width = `${progress * 100}%`;
  refs.progressText.textContent = remainingQi > 0 ? `距突破还差 ${Math.ceil(remainingQi)} 灵气` : '灵气圆满，可以尝试突破';

  if (activeMission) {
    const secondsLeft = (state.activeMission.endsAt - Date.now()) / 1000;
    refs.mission.textContent = activeMission.name;
    refs.missionTime.textContent = formatDuration(secondsLeft);
  } else {
    refs.mission.textContent = '闭关修炼';
    refs.missionTime.textContent = '待命';
  }

  refs.log.innerHTML = state.log
    .map((entry) => `<li><time>${new Date(entry.time).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</time>${entry.text}</li>`)
    .join('');

  document.querySelectorAll('[data-start-mission]').forEach((button) => {
    button.disabled = Boolean(state.activeMission);
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
  const ridges = [
    { y: height - 86, color: '#17262a', points: [0, 120, 250, 85, 420, 130, 610, 70, width, 120] },
    { y: height - 54, color: '#20372f', points: [0, 92, 180, 50, 330, 96, 510, 42, width, 80] },
  ];

  ridges.forEach((ridge) => {
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

function drawQiStreams(width, height) {
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
      updateGame(revived, offlineSeconds, now);
      revived.log.unshift({ time: now, text: `闭关离线 ${formatDuration(offlineSeconds)}，灵气仍在缓慢增长。` });
    }
    return revived;
  } catch {
    return createGameState(now);
  }
}
