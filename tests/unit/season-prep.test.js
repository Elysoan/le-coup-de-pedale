'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'lib/utils.js', // clamp, shuffleArr
  'data/teams.js',
  'lib/eligibility.js', // currentTeam, raceAccessCheck, isOlympicSeason, olympicSelectionChance
  'data/races.js', // RACE_DEFS()
  'lib/race-data.js', // RACES_DATA()
  'data/buzz-chance-by-prestige.js',
  'lib/season-prep.js',
]);

describe('pickRaceOffers', () => {
  test('propose bien un mélange de courses fixes et tournantes', () => {
    ctx.STATE = {rider: {teamId: ctx.TEAMS.find(t => t.tier === 'WorldTour').id, teamConfidence: 100, reputation: 80, season: 1, olympicSelections: 0}};
    const offers = ctx.pickRaceOffers();
    assert.ok(offers.length > 10);
    assert.ok(offers.every(r => typeof r.month === 'number'));
  });
  test('verrouille les grands tours/monuments pour une équipe Continentale', () => {
    ctx.STATE = {rider: {teamId: ctx.TEAMS.find(t => t.tier === 'Continentale').id, teamConfidence: 100, reputation: 80, season: 1, olympicSelections: 0}};
    const offers = ctx.pickRaceOffers();
    const grandTours = offers.filter(r => r.type === 'grandtour');
    assert.ok(grandTours.length > 0);
    assert.ok(grandTours.every(r => r.locked === true));
  });
  test('trie les courses proposées par mois croissant', () => {
    ctx.STATE = {rider: {teamId: ctx.TEAMS.find(t => t.tier === 'WorldTour').id, teamConfidence: 100, reputation: 80, season: 1, olympicSelections: 0}};
    const offers = ctx.pickRaceOffers();
    for (let i = 1; i < offers.length; i++) assert.ok(offers[i].month >= offers[i - 1].month);
  });
});

describe('assignSeasonBuzz', () => {
  test('marque au maximum 3 courses en "buzz", jamais une course verrouillée', () => {
    ctx.__mockRandom = 0; // toujours en-dessous du seuil de chance -> maximise les candidats
    try {
      const pool = Array.from({length: 10}, (_, i) => ({prestige: 5, locked: i % 2 === 0}));
      ctx.assignSeasonBuzz(pool);
      const buzzed = pool.filter(r => r.buzz);
      assert.ok(buzzed.length <= 3);
      assert.ok(buzzed.every(r => !r.locked));
    } finally {
      ctx.__mockRandom = undefined;
    }
  });
  test('ne marque jamais rien quand le hasard tombe toujours au-dessus du seuil', () => {
    ctx.__mockRandom = 0.99;
    try {
      const pool = Array.from({length: 5}, () => ({prestige: 1, locked: false}));
      ctx.assignSeasonBuzz(pool);
      assert.ok(pool.every(r => r.buzz === false));
    } finally {
      ctx.__mockRandom = undefined;
    }
  });
});

describe('statFocusAverage', () => {
  test('calcule la moyenne des stats visées', () => {
    const rider = {stats: {montagne: 60, sprint: 40}};
    assert.equal(ctx.statFocusAverage(rider, ['montagne', 'sprint']), 50);
  });
});
