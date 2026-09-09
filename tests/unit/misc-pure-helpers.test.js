'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'data/interview-reactions.js',
  'lib/misc-pure-helpers.js',
], {
  LEADERBOARD_API_URL: '', // non configuré par défaut, comme dans index.html tant que le Worker n'est pas déployé
});

describe('leaderboardConfigured', () => {
  test('faux tant que l\'URL n\'est pas une URL http(s)', () => {
    assert.equal(ctx.leaderboardConfigured(), false);
  });
  test('vrai une fois une vraie URL renseignée', () => {
    ctx.LEADERBOARD_API_URL = 'https://example.com';
    try {
      assert.equal(ctx.leaderboardConfigured(), true);
    } finally {
      ctx.LEADERBOARD_API_URL = '';
    }
  });
});

describe('detectRiderProfile', () => {
  test('retourne null avec moins de 2 résultats récents (pas assez de données)', () => {
    const rider = {season: 3, palmares: [{season: 3}], stats: {montagne: 90, sprint: 10, clm: 10, classiques: 10, resistance: 10}};
    assert.equal(ctx.detectRiderProfile(rider), null);
  });
  test('détecte un profil grimpeur pour un coureur dominant en montagne', () => {
    const rider = {
      season: 3, styleId: 'polyvalent',
      palmares: [{season: 2}, {season: 3}],
      stats: {montagne: 95, sprint: 20, clm: 20, classiques: 20, resistance: 20},
    };
    assert.equal(ctx.detectRiderProfile(rider), 'grimpeur');
  });
  test('ne propose rien si le profil détecté est déjà le style actuel', () => {
    const rider = {
      season: 3, styleId: 'grimpeur',
      palmares: [{season: 2}, {season: 3}],
      stats: {montagne: 95, sprint: 20, clm: 20, classiques: 20, resistance: 20},
    };
    assert.equal(ctx.detectRiderProfile(rider), 'grimpeur');
  });
});

describe('interviewReaction', () => {
  test('retourne toujours une phrase issue du pool FR pour un choix connu', () => {
    for (const choice of Object.keys(ctx.INTERVIEW_REACTIONS_FR)) {
      const reaction = ctx.interviewReaction(choice);
      assert.ok(ctx.INTERVIEW_REACTIONS_FR[choice].includes(reaction));
    }
  });
  test('retourne une chaîne vide pour un choix inconnu', () => {
    assert.equal(ctx.interviewReaction('inexistant'), '');
  });
});
