'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox(['lib/career-caps.js']);

describe('checkCareerCapCondition', () => {
  test('grandtour : vrai seulement avec une victoire de type grandtour au palmarès', () => {
    const withWin = {palmares: [{type: 'grandtour', tier: 'victoire'}]};
    const withoutWin = {palmares: [{type: 'grandtour', tier: 'podium'}]};
    assert.equal(ctx.checkCareerCapCondition(withWin, 'grandtour'), true);
    assert.equal(ctx.checkCareerCapCondition(withoutWin, 'grandtour'), false);
  });
  test('top20 : vrai si le classement mondial est <= 20', () => {
    assert.equal(ctx.checkCareerCapCondition({worldRank: 20}, 'top20'), true);
    assert.equal(ctx.checkCareerCapCondition({worldRank: 21}, 'top20'), false);
  });
  test('reputation70 : vrai si la réputation est >= 70', () => {
    assert.equal(ctx.checkCareerCapCondition({reputation: 70}, 'reputation70'), true);
    assert.equal(ctx.checkCareerCapCondition({reputation: 69}, 'reputation70'), false);
  });
  test('cinq-victoires : vrai avec au moins 5 victoires au palmarès', () => {
    const rider = {palmares: Array.from({length: 5}, () => ({tier: 'victoire'}))};
    assert.equal(ctx.checkCareerCapCondition(rider, 'cinq-victoires'), true);
    rider.palmares.pop();
    assert.equal(ctx.checkCareerCapCondition(rider, 'cinq-victoires'), false);
  });
  test('fidelite-equipe : vrai seulement sans changement d\'équipe depuis la prise du cap', () => {
    const rider = {teamChanges: 2, careerCap: {startTeamChanges: 2}};
    assert.equal(ctx.checkCareerCapCondition(rider, 'fidelite-equipe'), true);
    rider.teamChanges = 3;
    assert.equal(ctx.checkCareerCapCondition(rider, 'fidelite-equipe'), false);
  });
  test('un type de cap inconnu retourne toujours faux', () => {
    assert.equal(ctx.checkCareerCapCondition({palmares: []}, 'inexistant'), false);
  });
});
