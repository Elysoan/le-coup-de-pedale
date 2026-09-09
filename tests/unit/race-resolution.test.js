'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'lib/utils.js', // clamp
  'data/styles.js',
  'lib/style-helpers.js', // raceMatchesStyle
  'lib/season-prep.js', // statFocusAverage (assignSeasonBuzz/pickRaceOffers non utilisés ici)
  'data/weather-types.js',
  'lib/weather.js', // weatherPerfModifier
  'data/tier-value.js',
  'lib/race-resolution.js',
]);

function baseRider(overrides){
  return Object.assign({
    stats: {montagne: 60, sprint: 60, clm: 60, classiques: 60, resistance: 60, recuperation: 60, mental: 60},
    fatigue: 20, age: 28, season: 5, styleId: 'polyvalent', trajectory: null,
    careerFlags: {}, palmares: [],
  }, overrides || {});
}
const EVENT = {focus: ['montagne', 'resistance']};

describe('resolveEvent', () => {
  test('retourne toujours un tier connu et une perf entre 0 et 118', () => {
    const validTiers = new Set(['victoire', 'podium', 'top10', 'peloton', 'jourssans', 'abandon']);
    for (let i = 0; i < 30; i++) {
      const result = ctx.resolveEvent(baseRider(), EVENT, {risk: 'equilibre'}, null, 3, false, false, false, 'semitour');
      assert.ok(validTiers.has(result.tier), `tier inconnu: ${result.tier}`);
      assert.ok(result.perf >= 0 && result.perf <= 118);
    }
  });
  test('de meilleures stats donnent en moyenne un meilleur résultat', () => {
    ctx.__mockRandom = 0.5; // neutralise l'aléatoire (forme du jour, spread, tirages secondaires)
    try {
      const weak = baseRider({stats: {montagne: 20, sprint: 20, clm: 20, classiques: 20, resistance: 20, recuperation: 20, mental: 20}});
      const strong = baseRider({stats: {montagne: 90, sprint: 90, clm: 90, classiques: 90, resistance: 90, recuperation: 90, mental: 90}});
      const weakResult = ctx.resolveEvent(weak, EVENT, {risk: 'equilibre'}, null, 3, false, false, false, 'semitour');
      const strongResult = ctx.resolveEvent(strong, EVENT, {risk: 'equilibre'}, null, 3, false, false, false, 'semitour');
      assert.ok(strongResult.perf > weakResult.perf);
    } finally {
      ctx.__mockRandom = undefined;
    }
  });
  test('un choix "sûr" donne une performance plus prévisible (spread réduit) qu\'un choix "loufoque"', () => {
    const sample = (risk) => {
      const perfs = [];
      for (let i = 0; i < 40; i++) {
        perfs.push(ctx.resolveEvent(baseRider(), EVENT, {risk}, null, 3, false, false, false, 'semitour').perf);
      }
      const mean = perfs.reduce((a, b) => a + b, 0) / perfs.length;
      const variance = perfs.reduce((a, b) => a + (b - mean) ** 2, 0) / perfs.length;
      return Math.sqrt(variance);
    };
    assert.ok(sample('sur') < sample('loufoque'));
  });
  test('un coureur très jeune sur une course de prestige élevé est pénalisé', () => {
    ctx.__mockRandom = 0.5;
    try {
      const young = baseRider({age: 20});
      const veteran = baseRider({age: 28});
      const youngResult = ctx.resolveEvent(young, EVENT, {risk: 'equilibre'}, null, 5, false, false, false, 'monument');
      const veteranResult = ctx.resolveEvent(veteran, EVENT, {risk: 'equilibre'}, null, 5, false, false, false, 'monument');
      assert.ok(veteranResult.perf > youngResult.perf);
    } finally {
      ctx.__mockRandom = undefined;
    }
  });
  test('un grand tour pénalise un coureur sans expérience de grand tour, moins un habitué', () => {
    ctx.__mockRandom = 0.5;
    try {
      const rookie = baseRider({palmares: []});
      const veteran = baseRider({palmares: [
        {type: 'grandtour'}, {type: 'grandtour'}, {type: 'grandtour'},
      ]});
      const rookieResult = ctx.resolveEvent(rookie, EVENT, {risk: 'equilibre'}, null, 4, true, false, false, 'grandtour');
      const veteranResult = ctx.resolveEvent(veteran, EVENT, {risk: 'equilibre'}, null, 4, true, false, false, 'grandtour');
      assert.ok(veteranResult.perf > rookieResult.perf);
    } finally {
      ctx.__mockRandom = undefined;
    }
  });
  test('un coureur débutant (S1) est pénalisé par rapport à un coureur expérimenté (S4+)', () => {
    ctx.__mockRandom = 0.5;
    try {
      const s1 = baseRider({season: 1});
      const s4 = baseRider({season: 4});
      const s1Result = ctx.resolveEvent(s1, EVENT, {risk: 'equilibre'}, null, 3, false, false, false, 'semitour');
      const s4Result = ctx.resolveEvent(s4, EVENT, {risk: 'equilibre'}, null, 3, false, false, false, 'semitour');
      assert.ok(s4Result.perf > s1Result.perf);
    } finally {
      ctx.__mockRandom = undefined;
    }
  });
  test('une victoire ou un podium peut faire progresser une stat visée (trained)', () => {
    ctx.__mockRandom = 0; // force le tirage de progression à réussir dès qu'il est atteignable
    try {
      const rider = baseRider({age: 22, stats: {montagne: 99, sprint: 99, clm: 99, classiques: 99, resistance: 99, recuperation: 99, mental: 99}});
      const result = ctx.resolveEvent(rider, EVENT, {risk: 'sur'}, null, 1, false, false, false, 'semitour');
      // Avec __mockRandom=0, le spread favorise fortement la victoire et le tirage de
      // progression (< trainProba) réussit systématiquement.
      if (['victoire', 'podium', 'top10'].includes(result.tier)) {
        assert.ok(EVENT.focus.includes(result.trained));
      }
    } finally {
      ctx.__mockRandom = undefined;
    }
  });
});
