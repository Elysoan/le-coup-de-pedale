'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'data/tier-value.js',
  'lib/race-records.js',
], {
  RACE_RECORDS: {}, // état module normalement déclaré dans index.html
});

describe('recordGlobalRaceResult', () => {
  test('enregistre un premier résultat pour une course encore vierge', () => {
    ctx.RACE_RECORDS = {};
    ctx.recordGlobalRaceResult({id: 'tdf'}, 'podium', {name: 'A', season: 2});
    assert.equal(ctx.RACE_RECORDS.tdf.tier, 'podium');
    assert.equal(ctx.RACE_RECORDS.tdf.riderName, 'A');
  });
  test('un meilleur résultat remplace l\'ancien', () => {
    ctx.RACE_RECORDS = {tdf: {tier: 'podium', riderName: 'A', season: 2}};
    ctx.recordGlobalRaceResult({id: 'tdf'}, 'victoire', {name: 'B', season: 3});
    assert.equal(ctx.RACE_RECORDS.tdf.tier, 'victoire');
    assert.equal(ctx.RACE_RECORDS.tdf.riderName, 'B');
  });
  test('un moins bon résultat ne remplace pas le record existant', () => {
    ctx.RACE_RECORDS = {tdf: {tier: 'victoire', riderName: 'B', season: 3}};
    ctx.recordGlobalRaceResult({id: 'tdf'}, 'podium', {name: 'C', season: 4});
    assert.equal(ctx.RACE_RECORDS.tdf.riderName, 'B'); // inchangé
  });
});
