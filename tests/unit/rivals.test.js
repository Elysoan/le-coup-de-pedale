'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'lib/utils.js', // clamp, shuffleArr
  'data/name-pools.js',
  'lib/rider-generation.js', // generateRiderName (utilisé par makeRival)
  'data/countries.js',
  'data/styles.js',
  'data/races.js', // RACE_DEFS()
  'lib/rivals.js',
]);

describe('makeRival', () => {
  test('produit un rival avec une force dans [25, 90] par défaut', () => {
    for (let i = 0; i < 20; i++) {
      const rival = ctx.makeRival('FR', new Set());
      assert.ok(rival.strength >= 25 && rival.strength <= 90, `force ${rival.strength} hors bornes`);
    }
  });
  test('évite les doublons de nom déjà utilisés quand c\'est possible', () => {
    const used = new Set();
    const names = new Set();
    for (let i = 0; i < 10; i++) {
      const rival = ctx.makeRival('FR', used);
      names.add(rival.name);
    }
    assert.equal(names.size, 10);
  });
  test('respecte l\'âge fourni en option', () => {
    const rival = ctx.makeRival('FR', new Set(), {age: 30});
    assert.equal(rival.age, 30);
  });
});

describe('generateRivals', () => {
  test('génère exactement 3 rivaux, jamais du même pays que le coureur', () => {
    const rider = {name: 'Joueur', countryCode: 'FR'};
    const rivals = ctx.generateRivals(rider);
    assert.equal(rivals.length, 3);
    for (const r of rivals) assert.notEqual(r.countryCode, 'FR');
  });
});

describe('rivalTierLabel', () => {
  test('classe la force du plus faible au plus fort', () => {
    assert.equal(ctx.rivalTierLabel(10), ctx.tf('rivalNewcomerTier', 'débutant prometteur'));
    assert.equal(ctx.rivalTierLabel(80), ctx.tf('rivalEliteTier', 'élite mondiale'));
  });
});

describe('pickReactiveRival', () => {
  test('retourne null pour une liste vide', () => {
    assert.equal(ctx.pickReactiveRival([]), null);
    assert.equal(ctx.pickReactiveRival(null), null);
  });
  test('retourne l\'unique candidat s\'il n\'y en a qu\'un', () => {
    const rival = {name: 'Solo', strength: 50};
    assert.equal(ctx.pickReactiveRival([rival]), rival);
  });
  test('retourne toujours un candidat de la liste fournie', () => {
    const candidates = [{name: 'A', strength: 30}, {name: 'B', strength: 90}];
    for (let i = 0; i < 20; i++) {
      assert.ok(candidates.includes(ctx.pickReactiveRival(candidates)));
    }
  });
});

describe('rivalDuelThreshold', () => {
  test('reste toujours dans [38, 68]', () => {
    for (const strength of [0, 30, 50, 85, 200]) {
      const threshold = ctx.rivalDuelThreshold(strength);
      assert.ok(threshold >= 38 && threshold <= 68);
    }
  });
  test('un rival plus fort exige un seuil de victoire plus élevé', () => {
    assert.ok(ctx.rivalDuelThreshold(85) > ctx.rivalDuelThreshold(30));
  });
});

describe('mostRivaledName', () => {
  test('retourne le rival avec le plus de confrontations cumulées (victoires + défaites)', () => {
    const records = {
      Alice: {wins: 2, losses: 1},
      Bob: {wins: 5, losses: 4},
    };
    const result = ctx.mostRivaledName(records);
    assert.equal(result.name, 'Bob');
    assert.equal(result.total, 9);
  });
  test('retourne un nom nul sans aucun historique', () => {
    assert.equal(ctx.mostRivaledName({}).name, null);
  });
});
