'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'lib/utils.js', // clamp
  'data/stat-keys.js',
  'data/stat-icons.js',
  'data/stat-labels.js',
  'data/global-rating-weights.js',
  'data/type-label.js',
  'lib/stat-display.js',
], {
  // TYPE_LABEL/STAT_LABELS sont normalement des Proxy FR/EN assemblés inline dans
  // index.html — on simule ici la résolution FR par défaut à partir des data/*.js.
});
ctx.TYPE_LABEL = ctx.TYPE_LABEL_FR;
ctx.STAT_LABELS = ctx.STAT_LABELS_FR;

describe('badgeHTML', () => {
  test('inclut le libellé du type de course', () => {
    const html = ctx.badgeHTML('grandtour');
    assert.match(html, /Grand Tour/);
    assert.match(html, /badge grandtour/);
  });
});

describe('tierClass', () => {
  test('préfixe toujours "tier-"', () => {
    assert.equal(ctx.tierClass('victoire'), 'tier-victoire');
  });
});

describe('gaugeLevelColor', () => {
  test('vert au-dessus de 70, jaune entre 45 et 69, rouge en-dessous', () => {
    assert.equal(ctx.gaugeLevelColor(80), 'var(--green-dark)');
    assert.equal(ctx.gaugeLevelColor(50), 'var(--yellow-dark)');
    assert.equal(ctx.gaugeLevelColor(20), 'var(--red)');
  });
});

describe('statBarsHTML', () => {
  test('produit une jauge par stat de STAT_KEYS', () => {
    const stats = {montagne: 50, sprint: 50, clm: 50, classiques: 50, resistance: 50, recuperation: 50, mental: 50};
    const html = ctx.statBarsHTML(stats);
    const cellCount = (html.match(/gauge-cell/g) || []).length;
    assert.equal(cellCount, Array.from(ctx.STAT_KEYS).length);
  });
  test('affiche un delta quand des stats "avant" sont fournies', () => {
    const stats = {montagne: 55, sprint: 50, clm: 50, classiques: 50, resistance: 50, recuperation: 50, mental: 50};
    const before = {montagne: 50, sprint: 50, clm: 50, classiques: 50, resistance: 50, recuperation: 50, mental: 50};
    const html = ctx.statBarsHTML(stats, before);
    assert.match(html, /gauge-delta/);
    assert.match(html, />\+5</);
  });
});

describe('globalRiderRating', () => {
  test('une même valeur sur toutes les stats donne cette valeur (poids qui somment à 1)', () => {
    const stats = {montagne: 60, sprint: 60, clm: 60, classiques: 60, resistance: 60, recuperation: 60, mental: 60};
    assert.equal(ctx.globalRiderRating(stats), 60);
  });
});

describe('raceFocusIcons', () => {
  test('rassemble les icônes des stats visées, sans doublon', () => {
    const race = {events: [{focus: ['montagne', 'sprint']}, {focus: ['montagne']}]};
    const icons = ctx.raceFocusIcons(race);
    assert.equal(icons, `${ctx.STAT_ICONS.montagne} ${ctx.STAT_ICONS.sprint}`);
  });
});
