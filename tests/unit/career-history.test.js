'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'lib/utils.js', // clamp, shuffleArr
  'data/teams.js',
  'lib/eligibility.js', // currentTeam
  'data/races.js', // RACE_DEFS()
  'lib/race-data.js', // RACES_DATA()
  'data/legacy-title-fr.js',
  'lib/career-legacy.js', // legacyTitleKey, careerScore
  'lib/career-history.js',
], {
  CAREER_HISTORY: [], // état module normalement déclaré dans index.html
  window: {_creation: {}}, // window._creation, lu par recordCareer
});

function makeRider(overrides){
  return Object.assign({
    name: 'Julien Test', countryCode: 'FR', styleId: 'grimpeur',
    season: 5, age: 27, palmares: [], stageWins: 0,
    peakWorldRank: 120, worldRank: 150, reputation: 60,
    teamId: ctx.TEAMS[0].id, rareTrophiesAtStart: [],
  }, overrides || {});
}

describe('recordCareer', () => {
  test('ajoute une entrée à CAREER_HISTORY avec les bons compteurs', () => {
    ctx.CAREER_HISTORY = [];
    const rider = makeRider({palmares: [
      {tier: 'victoire', raceId: 'tdf'},
      {tier: 'podium', raceId: 'tdf'},
    ]});
    ctx.recordCareer(rider);
    assert.equal(Array.from(ctx.CAREER_HISTORY).length, 1);
    const entry = ctx.CAREER_HISTORY[0];
    assert.equal(entry.wins, 1);
    assert.equal(entry.podiums, 1);
    assert.equal(entry.name, 'Julien Test');
  });
  test('utilise le meilleur classement mondial jamais atteint (peakWorldRank), pas le classement final', () => {
    ctx.CAREER_HISTORY = [];
    const rider = makeRider({worldRank: 300, peakWorldRank: 12});
    ctx.recordCareer(rider);
    assert.equal(ctx.CAREER_HISTORY[0].bestRank, 12);
  });
});

describe('topCareers', () => {
  test('exclut les carrières en mode défi du classement', () => {
    ctx.CAREER_HISTORY = [
      {wins: 100, podiums: 0, winsByType: {}, podiumsByType: {}, finalReputation: 90, bestRank: 1, challengeMode: true},
      {wins: 1, podiums: 0, winsByType: {}, podiumsByType: {}, finalReputation: 20, bestRank: 300, challengeMode: false},
    ];
    const top = ctx.topCareers(5);
    assert.equal(top.length, 1);
    assert.equal(top[0].challengeMode, false);
  });
  test('trie par score de carrière décroissant et respecte la limite n', () => {
    ctx.CAREER_HISTORY = [
      {wins: 1, podiums: 0, winsByType: {}, podiumsByType: {}, finalReputation: 10, bestRank: 400, challengeMode: false},
      {wins: 20, podiums: 5, winsByType: {grandtour: 3}, podiumsByType: {}, finalReputation: 95, bestRank: 1, challengeMode: false},
      {wins: 5, podiums: 2, winsByType: {}, podiumsByType: {}, finalReputation: 50, bestRank: 100, challengeMode: false},
    ];
    const top = ctx.topCareers(2);
    assert.equal(top.length, 2);
    assert.equal(top[0].finalReputation, 95); // la meilleure carrière en tête
  });
});
