'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'data/styles.js',
  'data/style-badge-colors.js',
  'data/style-badge-icons.js',
  'lib/style-helpers.js',
]);

describe('styleBadgeHTML', () => {
  test('inclut le dégradé et l\'icône du style demandé', () => {
    const html = ctx.styleBadgeHTML('grimpeur');
    assert.match(html, /style-badge/);
    assert.match(html, /linear-gradient/);
    assert.match(html, /<svg/);
  });
  test('retombe sur des couleurs par défaut pour un style inconnu', () => {
    const html = ctx.styleBadgeHTML('inexistant');
    assert.match(html, /var\(--text-soft\)/);
  });
});

describe('raceMatchesStyle', () => {
  test('le polyvalent ne matche jamais (pas de bonus ciblé)', () => {
    const race = {type: 'grandtour', events: [{focus: ['montagne']}]};
    assert.equal(ctx.raceMatchesStyle(race, 'polyvalent'), false);
  });
  test('retourne false pour un style inconnu', () => {
    assert.equal(ctx.raceMatchesStyle({type: 'grandtour', events: []}, 'inexistant'), false);
  });
  test('le sprinteur matche uniquement sur le type de course', () => {
    const style = ctx.STYLES.find(s => s.id === 'sprinteur');
    const matchingType = style.raceTypes[0];
    const race = {type: matchingType, events: [{focus: ['montagne']}]}; // focus hors-sujet, sans importance pour ce style
    assert.equal(ctx.raceMatchesStyle(race, 'sprinteur'), true);
  });
  test('un grimpeur ne matche pas un type de course hors de son domaine', () => {
    const style = ctx.STYLES.find(s => s.id === 'grimpeur');
    const race = {type: 'crit', events: []}; // un critérium n'est jamais dans les raceTypes d'un grimpeur
    assert.equal(style.raceTypes.includes('crit'), false, 'précondition du test invalide si crit devient un type grimpeur');
    assert.equal(ctx.raceMatchesStyle(race, 'grimpeur'), false);
  });
});
