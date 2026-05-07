import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../browserGame.js', import.meta.url), 'utf8');

function element() {
  return {
    addEventListener() {},
    appendChild() {},
    children: [],
    dataset: {},
    disabled: false,
    getContext: () => ({
      arc() {},
      beginPath() {},
      clearRect() {},
      closePath() {},
      createLinearGradient: () => ({ addColorStop() {} }),
      ellipse() {},
      fill() {},
      fillRect() {},
      lineTo() {},
      moveTo() {},
      quadraticCurveTo() {},
      restore() {},
      save() {},
      stroke() {},
      translate() {},
    }),
    innerHTML: '',
    lastElementChild: { remove() {} },
    prepend() {},
    remove() {},
    style: {},
    textContent: '',
  };
}

function documentWithoutOptionalPanels() {
  const required = new Map([
    ['[data-realm]', element()],
    ['[data-qi]', element()],
    ['[data-qi-rate]', element()],
    ['[data-stones]', element()],
    ['[data-herbs]', element()],
    ['[data-pills]', element()],
    ['[data-beast-cores]', element()],
    ['[data-artifacts]', element()],
    ['[data-heart-demon]', element()],
    ['[data-power]', element()],
    ['[data-breakthrough-chance]', element()],
    ['[data-progress]', element()],
    ['[data-progress-text]', element()],
    ['[data-mission]', element()],
    ['[data-mission-time]', element()],
    ['[data-log]', element()],
    ['[data-world]', element()],
    ['[data-breakthrough]', element()],
    ['[data-craft-pill]', element()],
    ['[data-consume-pill]', element()],
    ['[data-reset]', element()],
  ]);

  return {
    createElement() {
      return element();
    },
    querySelector(selector) {
      return required.get(selector) ?? null;
    },
    querySelectorAll(selector) {
      if (selector === '[data-start-mission]' || selector === '[data-upgrade-building]' || selector === '[data-building-level]' || selector === '[data-building-cost]') {
        return [];
      }
      return [];
    },
  };
}

const context = {
  Date,
  Math,
  localStorage: {
    getItem: () => null,
    removeItem() {},
    setItem() {},
  },
  document: documentWithoutOptionalPanels(),
  performance: { now: () => 0 },
  requestAnimationFrame() {},
  setInterval() {},
};

vm.createContext(context);
assert.doesNotThrow(() => vm.runInContext(source, context));
