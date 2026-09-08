'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'lib/utils.js', // clamp
  'data/risk-fatigue-mult.js',
  'data/weather-types.js',
  'lib/weather.js', // weatherFatigueMult
  'lib/fatigue.js',
]);

function baseRider(overrides){
  return Object.assign({stats: {recuperation: 50, resistance: 50}, fatigue: 0, trajectory: null}, overrides || {});
}
function baseRace(overrides){
  return Object.assign({days: 5, prestige: 2, fatCost: 20, month: 6, type: 'semitour'}, overrides || {});
}

describe('applyFatigue', () => {
  test('augmente toujours la fatigue du coureur pour une course normale', () => {
    ctx.STATE = {cumulativeDaysRaced: 0, runQueue: [], runRaceIdx: 0};
    const rider = baseRider();
    ctx.applyFatigue(rider, baseRace(), {risk: 'equilibre'}, null);
    assert.ok(rider.fatigue > 0);
  });
  test('un choix "audacieux" fatigue plus qu\'un choix "sur", toutes choses égales', () => {
    ctx.STATE = {cumulativeDaysRaced: 0, runQueue: [], runRaceIdx: 0};
    const sur = baseRider();
    const audacieux = baseRider();
    ctx.applyFatigue(sur, baseRace(), {risk: 'sur'}, null);
    ctx.applyFatigue(audacieux, baseRace(), {risk: 'audacieux'}, null);
    assert.ok(audacieux.fatigue > sur.fatigue);
  });
  test('une meilleure récupération réduit le coût en fatigue', () => {
    ctx.STATE = {cumulativeDaysRaced: 0, runQueue: [], runRaceIdx: 0};
    const low = baseRider({stats: {recuperation: 20, resistance: 50}});
    const high = baseRider({stats: {recuperation: 90, resistance: 50}});
    ctx.applyFatigue(low, baseRace(), {risk: 'equilibre'}, null);
    ctx.applyFatigue(high, baseRace(), {risk: 'equilibre'}, null);
    assert.ok(high.fatigue < low.fatigue);
  });
  test('une surcharge calendaire (>45 jours cumulés) alourdit le coût', () => {
    const rested = baseRider();
    ctx.STATE = {cumulativeDaysRaced: 0, runQueue: [], runRaceIdx: 0};
    ctx.applyFatigue(rested, baseRace(), {risk: 'equilibre'}, null);

    const overloaded = baseRider();
    ctx.STATE = {cumulativeDaysRaced: 60, runQueue: [], runRaceIdx: 0};
    ctx.applyFatigue(overloaded, baseRace(), {risk: 'equilibre'}, null);

    assert.ok(overloaded.fatigue > rested.fatigue);
  });
  test('la fatigue reste toujours dans [0, 100]', () => {
    ctx.STATE = {cumulativeDaysRaced: 200, runQueue: [], runRaceIdx: 0};
    const rider = baseRider({fatigue: 95});
    ctx.applyFatigue(rider, baseRace({days: 21, prestige: 5}), {risk: 'audacieux'}, 'canicule');
    assert.ok(rider.fatigue <= 100);
  });
  test('met à jour le pic de fatigue saisonnière (_seasonMaxFatigue)', () => {
    ctx.STATE = {cumulativeDaysRaced: 0, runQueue: [], runRaceIdx: 0, _seasonMaxFatigue: 0};
    const rider = baseRider();
    ctx.applyFatigue(rider, baseRace(), {risk: 'equilibre'}, null);
    assert.equal(ctx.STATE._seasonMaxFatigue, rider.fatigue);
  });
});

describe('applyInterRaceRecovery', () => {
  test('ne fait rien sans course précédente', () => {
    ctx.STATE = {cumulativeDaysRaced: 0};
    const rider = baseRider({fatigue: 50});
    ctx.applyInterRaceRecovery(rider, null, baseRace({month: 6}));
    assert.equal(rider.fatigue, 50);
  });
  test('récupère d\'autant plus que l\'écart entre les courses est grand', () => {
    ctx.STATE = {cumulativeDaysRaced: 0};
    const shortGap = baseRider({fatigue: 80});
    ctx.applyInterRaceRecovery(shortGap, baseRace({month: 1, days: 5}), baseRace({month: 2, days: 5}));

    const longGap = baseRider({fatigue: 80});
    ctx.applyInterRaceRecovery(longGap, baseRace({month: 1, days: 5}), baseRace({month: 5, days: 5}));

    assert.ok(longGap.fatigue < shortGap.fatigue);
  });
  test('la fatigue ne descend jamais sous le plancher saisonnier', () => {
    ctx.STATE = {cumulativeDaysRaced: 40}; // plancher = min(45, 40) = 40
    const rider = baseRider({fatigue: 41});
    ctx.applyInterRaceRecovery(rider, baseRace({month: 1}), baseRace({month: 11})); // écart énorme
    assert.ok(rider.fatigue >= 40);
  });
});
