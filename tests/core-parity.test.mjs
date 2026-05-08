import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const core = readFileSync(new URL('../src/gameCore.mjs', import.meta.url), 'utf8');
const browser = readFileSync(new URL('../browserGame.js', import.meta.url), 'utf8');

function numberValue(source, pattern) {
  const match = source.match(pattern);
  assert.ok(match, `missing pattern ${pattern}`);
  return Number(match[1]);
}

function objectKeys(source, declaration) {
  const start = source.indexOf(declaration);
  assert.notEqual(start, -1, `missing declaration ${declaration}`);
  const braceStart = source.indexOf('{', start);
  let depth = 0;
  let end = braceStart;
  for (; end < source.length; end += 1) {
    if (source[end] === '{') depth += 1;
    if (source[end] === '}') depth -= 1;
    if (depth === 0) break;
  }
  const body = source.slice(braceStart + 1, end);
  const matches = [...body.matchAll(/^(\s+)([a-zA-Z]\w+):/gm)];
  if (!matches.length) {
    return [];
  }
  const topIndent = Math.min(...matches.map((match) => match[1].length));
  return matches
    .filter((match) => match[1].length === topIndent)
    .map((match) => match[2])
    .sort();
}

const coreVersion = numberValue(core, /CURRENT_BALANCE_VERSION\s*=\s*(\d+)/);
const browserVersion = numberValue(browser, /currentBalanceVersion\s*=\s*(\d+)/);
assert.equal(browserVersion, coreVersion);

const mirroredObjects = [
  ['DAO_HEARTS', 'daoHearts'],
  ['MISSION_APPROACHES', 'missionApproaches'],
  ['MAP_SPECIAL_DROPS', 'mapSpecialDrops'],
  ['BUILDINGS', 'buildings'],
  ['GEAR', 'gear'],
  ['FORMATIONS', 'formations'],
  ['CULTIVATION_PATHS', 'cultivationPaths'],
  ['PILL_RECIPES', 'pillRecipes'],
  ['TREASURES', 'treasures'],
  ['SPIRIT_BEASTS', 'spiritBeasts'],
  ['MISSIONS', 'missions'],
  ['MISSION_MAPS', 'missionMaps'],
];

for (const [coreName, browserName] of mirroredObjects) {
  assert.deepEqual(
    objectKeys(core, `export const ${coreName} = {`),
    objectKeys(browser, `const ${browserName} = {`),
    `${coreName} and ${browserName} keys differ`,
  );
}

console.log('ok - browser runtime mirrors core rule tables');
