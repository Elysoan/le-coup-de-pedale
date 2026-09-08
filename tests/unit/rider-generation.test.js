'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'lib/utils.js', // clamp
  'data/name-pools.js',
  'data/countries.js',
  'data/teammate-archetypes.js',
  'data/styles.js',
  'data/stat-keys.js',
  'data/teams.js',
  'data/style-team-specialty.js',
  'data/achievements.js',
  'lib/starter-team.js', // starterTeamFor (dépend de CAREER_HISTORY, ci-dessous)
  'lib/rider-generation.js',
], {
  CAREER_HISTORY: [], // état module normalement déclaré dans index.html
  UNLOCKED: new Set(),
});

describe('generateRiderName', () => {
  test('produit "Prénom Nom" à partir du pool du pays', () => {
    const name = ctx.generateRiderName('FR');
    assert.match(name, /^\S+ \S+$/);
  });
  test('retombe sur le pool FR pour un pays sans pool dédié', () => {
    assert.doesNotThrow(() => ctx.generateRiderName('XX'));
  });
});

describe('generateTeammate', () => {
  test('produit un coéquipier avec un archétype connu et un lien (bond) de départ à 50', () => {
    const mate = ctx.generateTeammate();
    assert.ok(ctx.TEAMMATE_ARCHETYPES.includes(mate.archetype));
    assert.equal(mate.bond, 50);
    assert.equal(typeof mate.name, 'string');
  });
});

describe('computeBaseStats', () => {
  test('applique les bonus du style par-dessus la base commune', () => {
    const style = ctx.STYLES.find(s => s.id === 'grimpeur');
    const stats = ctx.computeBaseStats('grimpeur');
    const expectedMontagne = Math.max(15, Math.min(90, 40 + (style.bonus.montagne || 0)));
    assert.equal(stats.montagne, expectedMontagne);
  });
  test('toutes les stats restent dans [15, 90]', () => {
    for (const style of ctx.STYLES) {
      const stats = ctx.computeBaseStats(style.id);
      for (const k of ctx.STAT_KEYS) {
        assert.ok(stats[k] >= 15 && stats[k] <= 90, `${style.id}.${k} = ${stats[k]} hors bornes`);
      }
    }
  });
  test('produit exactement les clés de STAT_KEYS, ni plus ni moins', () => {
    const stats = ctx.computeBaseStats('polyvalent');
    // Array.from() re-matérialise le tableau (issu du contexte vm) dans le realm hôte,
    // pour une comparaison deepEqual qui ne trébuche pas sur l'identité du prototype.
    assert.deepEqual(Object.keys(stats).sort(), Array.from(ctx.STAT_KEYS).sort());
  });
});

describe('newRider', () => {
  test('crée un coureur avec les valeurs de départ attendues', () => {
    const rider = ctx.newRider('Test Coureur', 'FR', 'grimpeur');
    assert.equal(rider.name, 'Test Coureur');
    assert.equal(rider.countryCode, 'FR');
    assert.equal(rider.styleId, 'grimpeur');
    assert.equal(rider.reputation, 8);
    assert.equal(rider.season, 1);
    assert.equal(rider.money, 1500);
    assert.equal(rider.fatigue, 0);
    assert.equal(rider.palmares.length, 0); // tableau créé dans le realm vm : comparer la longueur, pas deepEqual([])
    assert.equal(rider.retired, false);
  });
  test('utilise un nom par défaut si aucun n\'est fourni', () => {
    const rider = ctx.newRider('', 'FR', 'grimpeur');
    assert.equal(rider.name, 'Coureur inconnu');
  });
  test('l\'âge de départ est toujours entre 19 et 21 ans', () => {
    for (let i = 0; i < 30; i++) {
      const rider = ctx.newRider('X', 'FR', 'polyvalent');
      assert.ok(rider.age >= 19 && rider.age <= 21, `âge ${rider.age} hors de [19,21]`);
    }
  });
  test('démarre toujours dans une équipe Continentale sans historique de victoires', () => {
    const rider = ctx.newRider('X', 'FR', 'grimpeur');
    const team = ctx.TEAMS.find(t => t.id === rider.teamId);
    assert.equal(team.tier, 'Continentale');
  });
});
