'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'data/season-objectives.js',
  'lib/season-objectives-logic.js',
]);

describe('availableObjectives', () => {
  test('"aucun" est toujours proposé, quelle que soit la réputation', () => {
    for (const rep of [0, 50, 100]) {
      const objs = ctx.availableObjectives({reputation: rep, season: 1, palmares: []});
      assert.ok(objs.some(o => o.id === 'aucun'));
    }
  });
  test('respecte la fourchette de réputation minRep/maxRep de chaque objectif', () => {
    const objs = ctx.availableObjectives({reputation: 5, season: 1, palmares: []});
    for (const o of objs) {
      assert.ok(5 >= o.minRep && 5 <= o.maxRep, `${o.id} ne devrait pas apparaître à réputation 5`);
    }
  });
  test('respecte la saison minimale requise', () => {
    const objs = ctx.availableObjectives({reputation: 50, season: 1, palmares: []});
    for (const o of objs) {
      assert.ok((o.minSeason || 1) <= 1, `${o.id} exige une saison minimale > 1`);
    }
  });
  test('ne reproduit pas "monument" si déjà remporté récemment', () => {
    const rider = {
      reputation: 90, season: 3,
      palmares: [{season: 2, prestige: 4, tier: 'victoire', type: 'monument'}],
    };
    const objs = ctx.availableObjectives(rider);
    assert.ok(!objs.some(o => o.id === 'monument'));
  });
});
