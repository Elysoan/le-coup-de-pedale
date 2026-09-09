'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'lib/utils.js', // clamp
  'data/tier-value.js',
  'data/role-recommended-types.js',
  'data/styles.js',
  'lib/style-helpers.js', // raceMatchesStyle
  'data/countries.js',
  'data/stat-peak-age.js',
  'data/stat-keys.js',
  'lib/progression.js',
]);

describe('repGainFor', () => {
  test('un abandon coûte toujours de la réputation', () => {
    const delta = ctx.repGainFor({prestige: 3, buzz: false}, 'abandon', 50, null);
    assert.ok(delta < 0);
  });
  test('un forfait coûte moins cher qu\'un abandon, à prestige égal', () => {
    const race = {prestige: 3, buzz: false};
    const abandon = ctx.repGainFor(race, 'abandon', 50, null);
    const forfait = ctx.repGainFor(race, 'forfait', 50, null);
    assert.ok(forfait > abandon);
  });
  test('une victoire rapporte plus de réputation qu\'un peloton, à prestige égal', () => {
    const race = {prestige: 3, buzz: false};
    const win = ctx.repGainFor(race, 'victoire', 50, null);
    const peloton = ctx.repGainFor(race, 'peloton', 50, null);
    assert.ok(win > peloton);
  });
  test('les gains se réduisent à l\'approche de 100 de réputation (rendements décroissants)', () => {
    const race = {prestige: 3, buzz: false};
    const lowRep = ctx.repGainFor(race, 'victoire', 20, null);
    const highRep = ctx.repGainFor(race, 'victoire', 95, null);
    assert.ok(lowRep > highRep);
  });
  test('une course "buzz" amplifie le gain d\'une victoire', () => {
    const noBuzz = ctx.repGainFor({prestige: 3, buzz: false}, 'victoire', 50, null);
    const buzz = ctx.repGainFor({prestige: 3, buzz: true}, 'victoire', 50, null);
    assert.ok(buzz > noBuzz);
  });
});

describe('confidenceDeltaFor', () => {
  test('positif pour une victoire, négatif pour un abandon/forfait', () => {
    assert.ok(ctx.confidenceDeltaFor('victoire') > 0);
    assert.ok(ctx.confidenceDeltaFor('abandon') < 0);
    assert.ok(ctx.confidenceDeltaFor('forfait') < 0);
  });
  test('neutre (zéro) pour un résultat peloton (valeur de référence)', () => {
    assert.equal(ctx.confidenceDeltaFor('peloton'), 0);
  });
});

describe('statAgeDelta', () => {
  test('avant le pic, les stats physiques progressent', () => {
    const peak = ctx.STAT_PEAK_AGE.sprint;
    assert.ok(ctx.statAgeDelta('sprint', peak - 5) > 0);
  });
  test('longtemps après le pic, les stats physiques déclinent', () => {
    const peak = ctx.STAT_PEAK_AGE.sprint;
    assert.ok(ctx.statAgeDelta('sprint', peak + 6) < 0);
  });
  test('le mental ne décline jamais après son pic (au pire stagne)', () => {
    const peak = ctx.STAT_PEAK_AGE.mental;
    assert.ok(ctx.statAgeDelta('mental', peak + 10) >= -0.15);
  });
});

describe('endSeasonAging', () => {
  test('incrémente l\'âge d\'une saison', () => {
    const rider = {age: 25, stats: {montagne: 50, sprint: 50, clm: 50, classiques: 50, resistance: 50, recuperation: 50, mental: 50}, fatigue: 80, teamConfidence: 55};
    ctx.endSeasonAging(rider, null);
    assert.equal(rider.age, 26);
  });
  test('réduit la fatigue résiduelle après la trêve hivernale', () => {
    const rider = {age: 25, stats: {montagne: 50, sprint: 50, clm: 50, classiques: 50, resistance: 50, recuperation: 50, mental: 50}, fatigue: 80, teamConfidence: 55};
    ctx.endSeasonAging(rider, null);
    assert.ok(rider.fatigue < 80);
  });
  test('les stats restent dans des bornes raisonnables [8, 99]', () => {
    const rider = {age: 40, stats: {montagne: 95, sprint: 95, clm: 95, classiques: 95, resistance: 95, recuperation: 95, mental: 95}, fatigue: 50, teamConfidence: 55};
    for (let i = 0; i < 10; i++) ctx.endSeasonAging(rider, null);
    for (const k of Array.from(ctx.STAT_KEYS)) {
      assert.ok(rider.stats[k] >= 8 && rider.stats[k] <= 99, `${k}=${rider.stats[k]} hors bornes`);
    }
  });
  test('la confiance d\'équipe se recentre vers 55 d\'une saison à l\'autre', () => {
    const rider = {age: 25, stats: {montagne: 50, sprint: 50, clm: 50, classiques: 50, resistance: 50, recuperation: 50, mental: 50}, fatigue: 0, teamConfidence: 100};
    ctx.endSeasonAging(rider, null);
    assert.ok(rider.teamConfidence < 100 && rider.teamConfidence >= 55);
  });
});
