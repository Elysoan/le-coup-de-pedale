'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'data/legacy-title-fr.js',
  'lib/career-legacy.js',
]);

describe('careerScore', () => {
  test('une carrière vide a un score de base (uniquement la réputation/classement)', () => {
    const score = ctx.careerScore({});
    assert.equal(typeof score, 'number');
    assert.ok(score >= 0);
  });
  test('une victoire de grand tour rapporte plus qu\'un critérium', () => {
    const gt = ctx.careerScore({winsByType: {grandtour: 1}});
    const crit = ctx.careerScore({winsByType: {crit: 1}});
    assert.ok(gt > crit);
  });
  test('un meilleur classement mondial (chiffre plus bas) augmente le score', () => {
    const best = ctx.careerScore({bestRank: 1});
    const worst = ctx.careerScore({bestRank: 450});
    assert.ok(best > worst);
  });
});

describe('legacyTitleKey', () => {
  test('un coureur sans aucun résultat notable est "modeste équipier"', () => {
    const rider = {palmares: [], reputation: 10, rareTrophiesAtStart: []};
    assert.equal(ctx.legacyTitleKey(rider), 'legacyModestDomestique');
  });
  test('3 victoires en grand tour donne le titre de légende des grands tours', () => {
    const rider = {
      palmares: Array.from({length: 3}, () => ({tier: 'victoire', type: 'grandtour'})),
      reputation: 50, rareTrophiesAtStart: [],
    };
    assert.equal(ctx.legacyTitleKey(rider), 'legacyGrandTourLegend');
  });
  test('des trophées rares au départ + réputation élevée priment sur tout le reste', () => {
    const rider = {
      palmares: Array.from({length: 3}, () => ({tier: 'victoire', type: 'grandtour'})),
      reputation: 55, rareTrophiesAtStart: ['a', 'b', 'c', 'd'],
    };
    assert.equal(ctx.legacyTitleKey(rider), 'legacyLivingLegend');
  });
});

describe('legacyTitleText / legacyTitle', () => {
  test('résout une clé connue via LEGACY_TITLE_FR', () => {
    assert.equal(ctx.legacyTitleText('legacyModestDomestique'), ctx.LEGACY_TITLE_FR.legacyModestDomestique);
  });
  test('une clé inconnue (ancien format déjà résolu) est retournée telle quelle', () => {
    assert.equal(ctx.legacyTitleText('Un texte déjà en clair'), 'Un texte déjà en clair');
  });
  test('legacyTitle compose legacyTitleKey + legacyTitleText', () => {
    const rider = {palmares: [], reputation: 10, rareTrophiesAtStart: []};
    assert.equal(ctx.legacyTitle(rider), ctx.LEGACY_TITLE_FR.legacyModestDomestique);
  });
});
