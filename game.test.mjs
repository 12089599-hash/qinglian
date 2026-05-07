import assert from 'node:assert/strict';
import {
  calculateBreakthroughChance,
  calculatePower,
  createGameState,
  getRealmProgress,
  performBreakthrough,
  startMission,
  updateGame,
  upgradeBuilding,
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

test('cultivation accumulates resources over time', () => {
  const state = createGameState(1000);

  updateGame(state, 10, 11_000);

  assert.equal(state.qi, 18);
  assert.equal(state.spiritStones, 1);
  assert.equal(state.totalCultivationSeconds, 10);
});

test('breakthrough advances realm and consumes qi on a successful attempt', () => {
  const state = createGameState(1000);
  state.qi = 120;

  const result = performBreakthrough(state, 1000, () => 0.1);

  assert.equal(result.ok, true);
  assert.equal(state.realmIndex, 1);
  assert.equal(state.qi, 0);
  assert.equal(getRealmProgress(state), 0);
});

test('failed breakthrough creates heart demon pressure', () => {
  const state = createGameState(1000);
  state.qi = 120;

  const result = performBreakthrough(state, 1000, () => 0.99);

  assert.equal(result.ok, false);
  assert.equal(result.reason, 'failed');
  assert.equal(state.realmIndex, 0);
  assert.equal(state.heartDemon, 1);
  assert.equal(state.qi, 60);
  assert.equal(calculateBreakthroughChance(state), 0.6);
});

test('cave upgrades improve passive cultivation', () => {
  const state = createGameState(1000);
  state.spiritStones = 40;
  state.herbs = 4;

  const result = upgradeBuilding(state, 'meditationSeat', 1000);
  updateGame(state, 10, 11_000);

  assert.equal(result.ok, true);
  assert.equal(state.buildings.meditationSeat, 2);
  assert.equal(state.qi, 21.6);
});

test('spirit field upgrades grow herbs over time', () => {
  const state = createGameState(1000);
  state.spiritStones = 35;

  upgradeBuilding(state, 'spiritField', 1000);
  updateGame(state, 100, 101_000);

  assert.equal(state.herbs, 2);
});

test('combat missions compare power against danger', () => {
  const state = createGameState(1000);
  state.qi = 140;
  state.spiritStones = 30;

  startMission(state, 'mistyValley', 1000);
  updateGame(state, 120, 121_000);

  assert.equal(state.activeMission, null);
  assert.equal(state.beastCores, 1);
  assert.equal(state.artifacts, 1);
  assert.equal(calculatePower(state) > 0, true);
});

test('missions finish after their duration and grant rewards', () => {
  const state = createGameState(1000);

  const started = startMission(state, 'herbGathering', 1000);
  updateGame(state, 30, 31_000);

  assert.equal(started.ok, true);
  assert.equal(state.activeMission, null);
  assert.equal(state.herbs, 5);
  assert.equal(state.spiritStones, 9);
});
