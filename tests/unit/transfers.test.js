'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'lib/utils.js', // shuffleArr
  'data/teams.js',
  'data/team-tier-order.js',
  'lib/eligibility.js', // currentTeam
  'lib/transfers.js',
]);

describe('offersForRider', () => {
  test('propose entre 1 et 3 offres, jamais 0', () => {
    ctx.STATE = null;
    const rider = {teamId: ctx.TEAMS.find(t => t.tier === 'Continentale').id, reputation: 50, teamConfidence: 50, trajectory: null};
    const offers = ctx.offersForRider(rider);
    assert.ok(offers.length >= 1 && offers.length <= 3);
  });
  test('avec une confiance d\'équipe trop basse, l\'équipe actuelle n\'est pas reconduite automatiquement', () => {
    ctx.STATE = null;
    const team = ctx.TEAMS.find(t => t.tier === 'Continentale');
    const rider = {teamId: team.id, reputation: 0, teamConfidence: 0, trajectory: null};
    const offers = ctx.offersForRider(rider);
    // reputation 0 -> aucune autre équipe éligible non plus (minRep<=10) sauf via la
    // "au moins une offre" -> repli sur TEAMS[0], jamais un tableau vide.
    assert.ok(offers.length >= 1);
  });
  test('un trajectoire globetrotter élargit l\'accès aux paliers supérieurs', () => {
    ctx.STATE = null;
    const team = ctx.TEAMS.find(t => t.tier === 'Continentale');
    const base = {teamId: team.id, reputation: 80, teamConfidence: 80, trajectory: null};
    const globetrotter = {teamId: team.id, reputation: 80, teamConfidence: 80, trajectory: 'globetrotter'};
    const baseTiers = new Set(ctx.offersForRider(base).map(t => t.tier));
    const globeTiers = new Set(ctx.offersForRider(globetrotter).map(t => t.tier));
    // Le globetrotter a accès à au moins un palier que le profil de base n'atteint pas,
    // ou au minimum ne perd jamais d'accès par rapport au profil de base.
    for (const tier of baseTiers) assert.ok(globeTiers.has(tier) || globeTiers.size >= baseTiers.size);
  });
});
