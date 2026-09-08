'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'data/rider-roles.js',
  'lib/role-assignment.js',
]);

describe('palmaresPrestigeScore', () => {
  test('un palmarès vide a un score de 0', () => {
    assert.equal(ctx.palmaresPrestigeScore({palmares: []}), 0);
  });
  test('une victoire de grand tour rapporte plus qu\'une victoire de critérium', () => {
    const gt = ctx.palmaresPrestigeScore({palmares: [{tier: 'victoire', type: 'grandtour'}]});
    const crit = ctx.palmaresPrestigeScore({palmares: [{tier: 'victoire', type: 'crit'}]});
    assert.ok(gt > crit);
  });
  test('une victoire rapporte plus qu\'un podium sur le même type de course', () => {
    const win = ctx.palmaresPrestigeScore({palmares: [{tier: 'victoire', type: 'monument'}]});
    const podium = ctx.palmaresPrestigeScore({palmares: [{tier: 'podium', type: 'monument'}]});
    assert.ok(win > podium);
  });
});

describe('palmaresPrestigeLabel', () => {
  test('un score de 0 ne produit aucune étiquette', () => {
    assert.equal(ctx.palmaresPrestigeLabel(0, false), null);
  });
  test('un score très élevé donne le libellé "palmarès de Grand Tour"', () => {
    const label = ctx.palmaresPrestigeLabel(35, false);
    assert.match(label.label, /Grand Tour/);
  });
});

describe('computeOfferedRole', () => {
  test('sous le seuil de réputation de l\'équipe, le coureur est toujours équipier', () => {
    const team = {tier: 'WorldTour', specialty: null};
    const rider = {reputation: 5, palmares: [], styleId: 'grimpeur'};
    const role = ctx.computeOfferedRole(rider, team);
    assert.match(role.id, /^equip-/);
  });
  test('un grimpeur réputé dans une équipe montagne devient leader GC', () => {
    const team = {tier: 'Continentale', specialty: 'montagne'};
    const rider = {reputation: 90, palmares: [], styleId: 'grimpeur'};
    const role = ctx.computeOfferedRole(rider, team);
    assert.equal(role.id, 'leader-gc');
  });
  test('un sprinteur réputé devient toujours leader sprint, quelle que soit l\'équipe', () => {
    const team = {tier: 'Continentale', specialty: 'montagne'};
    const rider = {reputation: 90, palmares: [], styleId: 'sprinteur'};
    const role = ctx.computeOfferedRole(rider, team);
    assert.equal(role.id, 'leader-spr');
  });
  test('un palmarès prestigieux (grands tours/monuments) abaisse le seuil de leadership', () => {
    const team = {tier: 'Équipe de légende', specialty: null};
    const lowRep = {reputation: 60, styleId: 'grimpeur',
      palmares: Array.from({length: 4}, () => ({tier: 'victoire', type: 'grandtour'}))};
    const role = ctx.computeOfferedRole(lowRep, team);
    assert.equal(role.id, 'leader-gc'); // sans le bonus de pedigree, 60 < seuil légende (70) -> équipier
  });
});
