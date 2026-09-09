'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'lib/utils.js', // shuffleArr
  'data/races.js', // RACE_DEFS()
  'lib/race-data.js',
]);

describe('pickVariant', () => {
  test('produit un évènement avec un titre, une description et des choix', () => {
    const def = ctx.RACE_DEFS()[0].eventDefs[0];
    const event = ctx.pickVariant(def);
    assert.equal(typeof event.title, 'string');
    assert.equal(typeof event.desc, 'string');
    assert.ok(Array.isArray(event.choices) || event.choices.length !== undefined);
    assert.ok(event.choices.length > 0);
    assert.deepEqual(event.focus, def.focus);
  });
});

describe('RACES_DATA', () => {
  test('produit autant de courses que RACE_DEFS()', () => {
    const races = ctx.RACES_DATA();
    assert.equal(races.length, ctx.RACE_DEFS().length);
  });
  test('chaque course a un nom résolu et au moins un évènement', () => {
    for (const race of ctx.RACES_DATA()) {
      assert.equal(typeof race.name, 'string');
      assert.ok(race.name.length > 0);
      assert.ok(race.events.length > 0);
    }
  });
  test('échantillonne au maximum sampleWeeks évènements quand c\'est défini', () => {
    const races = ctx.RACES_DATA();
    for (const race of races) {
      const def = ctx.RACE_DEFS().find(r => r.id === race.id);
      if (def.sampleWeeks) assert.ok(race.events.length <= def.sampleWeeks);
    }
  });
});
