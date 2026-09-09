'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'lib/utils.js', // clamp
  'data/weather-types.js',
  'lib/weather.js', // weatherCrashMult
  'lib/injury-risk.js',
]);

describe('crashChanceFor', () => {
  test('un choix audacieux est plus risqué qu\'un choix prudent, toutes choses égales', () => {
    const rider = {fatigue: 0};
    const race = {type: 'classique'};
    const sur = ctx.crashChanceFor(rider, race, {risk: 'sur'}, null);
    const audacieux = ctx.crashChanceFor(rider, race, {risk: 'audacieux'}, null);
    assert.ok(audacieux > sur);
  });
  test('un monument est plus risqué qu\'une course équivalente hors monument', () => {
    const rider = {fatigue: 0};
    const choice = {risk: 'equilibre'};
    const monument = ctx.crashChanceFor(rider, {type: 'monument'}, choice, null);
    const classique = ctx.crashChanceFor(rider, {type: 'classique'}, choice, null);
    assert.ok(monument > classique);
  });
  test('la fatigue augmente le risque au-delà de 40', () => {
    const race = {type: 'classique'};
    const choice = {risk: 'equilibre'};
    const low = ctx.crashChanceFor({fatigue: 20}, race, choice, null);
    const high = ctx.crashChanceFor({fatigue: 90}, race, choice, null);
    assert.ok(high > low);
  });
  test('le risque de chute reste toujours dans [0, 0.35]', () => {
    const race = {type: 'monument'};
    const choice = {risk: 'loufoque'};
    const chance = ctx.crashChanceFor({fatigue: 100}, race, choice, 'pluie');
    assert.ok(chance >= 0 && chance <= 0.35);
  });
});

describe('injurySeverity', () => {
  test('retourne toujours une gravité connue', () => {
    const valid = new Set(['legere', 'moderee', 'grave']);
    for (let i = 0; i < 50; i++) {
      assert.ok(valid.has(ctx.injurySeverity({fatigue: Math.random() * 100}, 'chute')));
    }
  });
  test('le surmenage a une gravité "grave" bien plus rare qu\'une chute (mêmes conditions)', () => {
    // On force le tirage aléatoire au plus bas : la 1ère branche (grave) est prise
    // seulement si son seuil de probabilité est atteint.
    ctx.__mockRandom = 0.02; // juste au-dessus des seuils "grave" typiques
    try {
      const chuteSeverity = ctx.injurySeverity({fatigue: 90}, 'chute');
      const surmenageSeverity = ctx.injurySeverity({fatigue: 90}, 'surmenage');
      // Le surmenage réduit la probabilité "grave" d'un facteur 0.3 : à roll identique,
      // il ne peut jamais être "grave" si la chute ne l'est déjà pas de justesse,
      // et l'inverse (chute grave, surmenage non) est possible.
      if (surmenageSeverity === 'grave') {
        assert.equal(chuteSeverity, 'grave');
      }
    } finally {
      ctx.__mockRandom = undefined;
    }
  });
});

describe('difficultyForRace', () => {
  test('une course de faible prestige face à un coureur réputé est "Facile"', () => {
    const d = ctx.difficultyForRace({prestige: 1}, {reputation: 90});
    assert.equal(d.cls, 'diff-1');
  });
  test('une course de prestige maximal face à un débutant est "Extrême"', () => {
    const d = ctx.difficultyForRace({prestige: 5}, {reputation: 0});
    assert.equal(d.cls, 'diff-5');
  });
});
