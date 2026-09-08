'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'data/teams.js',
  'data/role-salary-mult.js',
  'data/tier-value.js',
  'lib/eligibility.js', // currentTeam(), utilisé par salaryForSeason
  'lib/economy.js',
]);

describe('salaryForSeason', () => {
  test('un coureur en équipe Continentale sans réputation touche le salaire de base', () => {
    const rider = {teamId: ctx.TEAMS.find(t => t.tier === 'Continentale').id, reputation: 0, role: null};
    const salary = ctx.salaryForSeason(rider);
    assert.equal(salary, 8000);
  });
  test('la réputation augmente le salaire', () => {
    const team = ctx.TEAMS.find(t => t.tier === 'Continentale').id;
    const low = ctx.salaryForSeason({teamId: team, reputation: 5, role: null});
    const high = ctx.salaryForSeason({teamId: team, reputation: 80, role: null});
    assert.ok(high > low);
  });
  test('un rôle mieux payé augmente le salaire à réputation égale', () => {
    const team = ctx.TEAMS.find(t => t.tier === 'Continentale').id;
    const base = ctx.salaryForSeason({teamId: team, reputation: 30, role: null});
    const leader = ctx.salaryForSeason({teamId: team, reputation: 30, role: 'leader-gc'});
    assert.ok(leader > base);
  });
});

describe('prizeForResult', () => {
  test('aucune prime pour un abandon ou un forfait', () => {
    const race = {prestige: 5};
    assert.equal(ctx.prizeForResult(race, 'abandon'), 0);
    assert.equal(ctx.prizeForResult(race, 'forfait'), 0);
  });
  test('la prime augmente avec le prestige de la course', () => {
    const low = ctx.prizeForResult({prestige: 1}, 'victoire');
    const high = ctx.prizeForResult({prestige: 5}, 'victoire');
    assert.ok(high > low);
  });
  test('une victoire rapporte plus qu\'un podium sur la même course', () => {
    const race = {prestige: 3};
    const win = ctx.prizeForResult(race, 'victoire');
    const podium = ctx.prizeForResult(race, 'podium');
    assert.ok(win > podium);
  });
});

describe('checkTeamVictory', () => {
  test('aucune prime d\'équipe sur un abandon', () => {
    ctx.STATE = {rider: {teamConfidence: 100, money: 0}};
    assert.equal(ctx.checkTeamVictory({type: 'grandtour'}, 'abandon'), 0);
  });
  test('aucune prime d\'équipe sur un monument (course d\'un jour)', () => {
    ctx.STATE = {rider: {teamConfidence: 100, money: 0}};
    assert.equal(ctx.checkTeamVictory({type: 'monument'}, 'victoire'), 0);
  });
  test('quand elle est versée, la prime augmente aussi STATE.rider.money d\'autant', () => {
    // Confiance d'équipe maximale + on force le tirage à toujours réussir.
    ctx.STATE = {rider: {teamConfidence: 100, money: 1000}};
    ctx.__mockRandom = 0; // toujours en-dessous du seuil -> prime versée
    try {
      const bonus = ctx.checkTeamVictory({type: 'semitour'}, 'victoire');
      assert.ok(bonus > 0);
      assert.equal(ctx.STATE.rider.money, 1000 + bonus);
    } finally {
      ctx.__mockRandom = undefined;
    }
  });
});
