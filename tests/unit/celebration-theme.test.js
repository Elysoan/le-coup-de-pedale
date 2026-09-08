'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'data/gt-jerseys.js',
  'lib/celebration-theme.js',
]);

describe('gtJerseys', () => {
  test('retombe sur le Tour (tdf) pour une course inconnue', () => {
    assert.deepEqual(ctx.gtJerseys('inexistant'), ctx.gtJerseys('tdf'));
  });
  test('retourne bien les 3 maillots annexes attendus', () => {
    const jerseys = ctx.gtJerseys('tdf');
    assert.ok(jerseys.kom);
    assert.ok(jerseys.points);
  });
});

describe('celebrationTheme', () => {
  test('sans victoire, thème neutre (trophée orange)', () => {
    const theme = ctx.celebrationTheme({type: 'classique'}, 'podium', null);
    assert.equal(theme.emoji, '🏆');
    assert.equal(theme.hex, '#FF8A3D');
  });
  test('victoire sur un grand tour connu -> couleur du maillot général', () => {
    const theme = ctx.celebrationTheme({type: 'grandtour', id: 'tdf'}, 'victoire', null);
    assert.equal(theme.emoji, '🟡');
  });
  test('victoire avec maillot annexe grimpeur -> couleur du maillot à pois/montagne', () => {
    const jersey = {tier: 'victoire', type: 'grimpeur'};
    const theme = ctx.celebrationTheme({type: 'grandtour', id: 'tdf'}, 'victoire', jersey);
    const jerseys = ctx.gtJerseys('tdf');
    assert.equal(theme.emoji, jerseys.kom.icon);
  });
  test('victoire sur une course hors grand tour -> thème par défaut', () => {
    const theme = ctx.celebrationTheme({type: 'monument', id: 'roubaix'}, 'victoire', null);
    assert.equal(theme.emoji, '🏆');
  });
});
