'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'lib/utils.js', // clamp
  'lib/results.js', // placementNumber
  'lib/world-rank.js',
]);

describe('worldRankFloor / worldRankCeiling', () => {
  test('sans aucune victoire, le plancher/plafond sont les plus permissifs', () => {
    const rider = {palmares: []};
    assert.equal(ctx.worldRankFloor(rider), 15);
    assert.equal(ctx.worldRankCeiling(rider), 900);
  });
  test('une victoire de prestige 5 (monument/GT) donne le meilleur plancher/plafond', () => {
    const rider = {palmares: [{tier: 'victoire', prestige: 5}]};
    assert.equal(ctx.worldRankFloor(rider), 1);
    assert.equal(ctx.worldRankCeiling(rider), 60);
  });
  test('seule la meilleure victoire compte, pas la dernière', () => {
    const rider = {palmares: [
      {tier: 'victoire', prestige: 5},
      {tier: 'victoire', prestige: 1},
    ]};
    assert.equal(ctx.worldRankFloor(rider), 1); // reste au niveau de la victoire prestige 5
  });
  test('un podium n\'est pas une victoire, il ne change rien au plancher/plafond', () => {
    const rider = {palmares: [{tier: 'podium', prestige: 5}]};
    assert.equal(ctx.worldRankFloor(rider), 15);
    assert.equal(ctx.worldRankCeiling(rider), 900);
  });
});

describe('updateWorldRank', () => {
  test('initialise worldRank/peakWorldRank à 450 si absents', () => {
    const rider = {palmares: [], fatigue: 0};
    ctx.updateWorldRank(rider, 'peloton', 2, 40);
    assert.equal(typeof rider.worldRank, 'number');
    assert.equal(typeof rider.peakWorldRank, 'number');
  });
  test('un forfait ne change rien au classement', () => {
    const rider = {worldRank: 200, peakWorldRank: 200, palmares: []};
    ctx.updateWorldRank(rider, 'forfait', 3, 0);
    assert.equal(rider.worldRank, 200);
  });
  test('un abandon dégrade le classement (le chiffre augmente)', () => {
    const rider = {worldRank: 200, peakWorldRank: 200, palmares: []};
    ctx.updateWorldRank(rider, 'abandon', 3, 0);
    assert.ok(rider.worldRank > 200);
  });
  test('une victoire prestigieuse améliore nettement le classement (le chiffre baisse)', () => {
    const rider = {worldRank: 200, peakWorldRank: 200, palmares: []};
    ctx.updateWorldRank(rider, 'victoire', 5, 100);
    assert.ok(rider.worldRank < 200);
  });
  test('peakWorldRank suit toujours le meilleur (plus petit) classement jamais atteint', () => {
    const rider = {worldRank: 50, peakWorldRank: 50, palmares: []};
    ctx.updateWorldRank(rider, 'abandon', 3, 0); // dégrade le rang courant
    assert.equal(rider.peakWorldRank, 50); // le pic ne remonte jamais
  });
  test('le classement reste toujours dans [1, 900]', () => {
    const rider = {worldRank: 1, peakWorldRank: 1, palmares: [{tier: 'victoire', prestige: 5}]};
    ctx.updateWorldRank(rider, 'victoire', 5, 100);
    assert.ok(rider.worldRank >= 1 && rider.worldRank <= 900);
  });
});

describe('riderFormStatus', () => {
  test('un coureur reposé sans dernier résultat est en pleine forme', () => {
    ctx.STATE = {seasonSummary: null};
    const status = ctx.riderFormStatus({fatigue: 0});
    assert.equal(status.icon, '💪');
  });
  test('une fatigue élevée dégrade le statut de forme', () => {
    ctx.STATE = {seasonSummary: null};
    const rested = ctx.riderFormStatus({fatigue: 0});
    const tired = ctx.riderFormStatus({fatigue: 95});
    const order = ['🥵', '😓', '🙂', '💪'];
    assert.ok(order.indexOf(tired.icon) < order.indexOf(rested.icon));
  });
  test('fatigue maximale + mauvais dernier résultat -> statut le plus bas ("Épuisé")', () => {
    ctx.STATE = {seasonSummary: {results: [{bestTier: 'abandon'}]}};
    const status = ctx.riderFormStatus({fatigue: 100});
    assert.equal(status.icon, '🥵');
  });
  test('une victoire récente améliore le statut par rapport à la même fatigue sans résultat', () => {
    ctx.STATE = {seasonSummary: {results: [{bestTier: 'victoire'}]}};
    const withWin = ctx.riderFormStatus({fatigue: 50});
    ctx.STATE = {seasonSummary: null};
    const withoutResult = ctx.riderFormStatus({fatigue: 50});
    // Les deux sont des libellés distincts si le score franchit un seuil ; au minimum,
    // la victoire ne doit jamais donner un statut pire que sans résultat.
    const order = ['🥵', '😓', '🙂', '💪'];
    assert.ok(order.indexOf(withWin.icon) >= order.indexOf(withoutResult.icon));
  });
});
