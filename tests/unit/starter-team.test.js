'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'data/teams.js',
  'data/style-team-specialty.js',
  'lib/starter-team.js',
], {
  CAREER_HISTORY: [], // état module normalement déclaré dans index.html
});

describe('totalCareerWins', () => {
  test('somme les victoires de toutes les carrières de l\'historique', () => {
    ctx.CAREER_HISTORY = [{wins: 3}, {wins: 5}, {}];
    assert.equal(ctx.totalCareerWins(), 8);
  });
});

describe('starterTeamFor', () => {
  test('sans historique de victoires, l\'équipe de départ est toujours Continentale', () => {
    ctx.CAREER_HISTORY = [];
    const team = ctx.starterTeamFor('grimpeur');
    assert.equal(team.id, 'velo-passion');
  });
  test('25 victoires cumulées ou plus débloque une ProTeam de départ', () => {
    ctx.CAREER_HISTORY = [{wins: 25}];
    const team = ctx.starterTeamFor('grimpeur');
    assert.equal(team.tier, 'ProTeam');
  });
  test('60 victoires cumulées ou plus débloque une équipe WorldTour de départ', () => {
    ctx.CAREER_HISTORY = [{wins: 60}];
    const team = ctx.starterTeamFor('grimpeur');
    assert.equal(team.tier, 'WorldTour');
  });
});
