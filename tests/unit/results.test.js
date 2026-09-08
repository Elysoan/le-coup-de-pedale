'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'data/tier-narrative.js',
  'data/injury-reasons.js',
  'lib/utils.js', // clamp, utilisé par placementNumber
  'lib/results.js',
]);
// tierNarrative/injuryReason lisent TIER_NARRATIVE/INJURY_REASONS (des Proxy FR/EN
// définis inline dans index.html) — on simule ici la résolution FR par défaut.
ctx.TIER_NARRATIVE = ctx.TIER_NARRATIVE_FR;
ctx.INJURY_REASONS = ctx.INJURY_REASONS_FR;

describe('placementNumber', () => {
  test('une victoire est toujours la 1ère place', () => {
    assert.equal(ctx.placementNumber('victoire', 99), 1);
  });
  test('abandon et forfait n\'ont pas de position (non classé)', () => {
    assert.equal(ctx.placementNumber('abandon', 10), null);
    assert.equal(ctx.placementNumber('forfait', 10), null);
  });
  test('un podium tombe entre la 2e et la 3e place', () => {
    for (let i = 0; i < 20; i++) {
      const pos = ctx.placementNumber('podium', 80);
      assert.ok(pos >= 2 && pos <= 3, `position ${pos} hors de [2,3]`);
    }
  });
  test('un top10 tombe entre la 4e et la 10e place', () => {
    for (let i = 0; i < 20; i++) {
      const pos = ctx.placementNumber('top10', 63);
      assert.ok(pos >= 4 && pos <= 10, `position ${pos} hors de [4,10]`);
    }
  });
});

describe('estimatePlacement', () => {
  test('affiche un texte dédié pour abandon/forfait', () => {
    assert.match(ctx.estimatePlacement('abandon', 0), /abandon/);
    assert.match(ctx.estimatePlacement('forfait', 0), /partant/);
  });
  test('affiche "1er" pour une victoire', () => {
    assert.equal(ctx.estimatePlacement('victoire', 99), '1er');
  });
});

describe('tierNarrative / injuryReason', () => {
  test('retourne toujours une phrase existante pour chaque tier connu', () => {
    for (const tier of Object.keys(ctx.TIER_NARRATIVE_FR)) {
      const phrase = ctx.tierNarrative(tier);
      assert.equal(typeof phrase, 'string');
      assert.ok(ctx.TIER_NARRATIVE_FR[tier].includes(phrase));
    }
  });
  test('retourne toujours une raison existante pour chaque cause connue', () => {
    for (const cause of Object.keys(ctx.INJURY_REASONS_FR)) {
      const reason = ctx.injuryReason(cause);
      assert.equal(typeof reason, 'string');
      assert.ok(ctx.INJURY_REASONS_FR[cause].includes(reason));
    }
  });
});
