'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'lib/utils.js', // clamp, utilisé par olympicSelectionThreshold
  'data/teams.js',
  'lib/eligibility.js',
]);

describe('currentTeam', () => {
  test('retrouve l\'équipe par id', () => {
    const team = ctx.TEAMS[2];
    assert.equal(ctx.currentTeam({teamId: team.id}), team);
  });
  test('retombe sur la première équipe si l\'id est inconnu', () => {
    assert.equal(ctx.currentTeam({teamId: 'inexistant'}), ctx.TEAMS[0]);
  });
});

describe('riderRole', () => {
  test('la réputation détermine le rôle, du domestique à la superstar', () => {
    assert.equal(ctx.riderRole({reputation: 0}), ctx.tf('roleDomestique', 'Équipier / jeune espoir'));
    assert.equal(ctx.riderRole({reputation: 90}), ctx.tf('roleSuperstar', 'Superstar mondiale'));
  });
  test('le rôle est monotone croissant avec la réputation (jamais un rôle "moindre" à réputation plus haute)', () => {
    const order = ['roleDomestique', 'roleDeluxe', 'roleCoLeader', 'roleLeader', 'roleSuperstar']
      .map(k => ctx.tf(k, k));
    const reps = [0, 20, 40, 65, 85];
    let lastIdx = -1;
    for (const rep of reps) {
      const role = ctx.riderRole({reputation: rep});
      const idx = order.indexOf(role);
      assert.ok(idx >= lastIdx, `rôle à réputation ${rep} a régressé`);
      lastIdx = idx;
    }
  });
});

describe('isOlympicSeason', () => {
  test('vrai uniquement tous les 4 ans de carrière', () => {
    assert.equal(ctx.isOlympicSeason({season: 4}), true);
    assert.equal(ctx.isOlympicSeason({season: 8}), true);
    assert.equal(ctx.isOlympicSeason({season: 1}), false);
    assert.equal(ctx.isOlympicSeason({season: 5}), false);
  });
});

describe('olympicSelectionChance', () => {
  test('aucune chance sous le seuil de réputation', () => {
    const rider = {reputation: 0, olympicSelections: 0};
    assert.equal(ctx.olympicSelectionChance(rider), 0);
  });
  test('une sélection antérieure abaisse le seuil requis', () => {
    const first = ctx.olympicSelectionThreshold({olympicSelections: 0});
    const second = ctx.olympicSelectionThreshold({olympicSelections: 1});
    assert.ok(second < first);
  });
  test('la chance de sélection reste toujours dans [0, 1]', () => {
    for (const rep of [0, 30, 50, 68, 90, 100]) {
      const chance = ctx.olympicSelectionChance({reputation: rep, olympicSelections: 0});
      assert.ok(chance >= 0 && chance <= 1);
    }
  });
});

describe('raceAccessCheck', () => {
  test('les courses hors grand tour/monument sont toujours accessibles', () => {
    const rider = {teamId: ctx.TEAMS.find(t => t.tier === 'Continentale').id, teamConfidence: 0};
    assert.equal(ctx.raceAccessCheck({type: 'classique'}, rider).allowed, true);
  });
  test('une équipe Continentale n\'a jamais accès aux grands tours', () => {
    const rider = {teamId: ctx.TEAMS.find(t => t.tier === 'Continentale').id, teamConfidence: 100};
    const access = ctx.raceAccessCheck({type: 'grandtour'}, rider);
    assert.equal(access.allowed, false);
    assert.equal(access.reason, 'continental');
  });
  test('une équipe WorldTour a toujours accès aux grands tours', () => {
    const rider = {teamId: ctx.TEAMS.find(t => t.tier === 'WorldTour').id, teamConfidence: 0};
    assert.equal(ctx.raceAccessCheck({type: 'grandtour'}, rider).allowed, true);
  });
  test('une ProTeam dépend de la confiance d\'équipe', () => {
    const teamId = ctx.TEAMS.find(t => t.tier === 'ProTeam').id;
    assert.equal(ctx.raceAccessCheck({type: 'monument'}, {teamId, teamConfidence: 80}).allowed, true);
    const denied = ctx.raceAccessCheck({type: 'monument'}, {teamId, teamConfidence: 10});
    assert.equal(denied.allowed, false);
    assert.equal(denied.reason, 'confidence');
  });
});
