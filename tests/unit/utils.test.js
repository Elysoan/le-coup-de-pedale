'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox(['lib/utils.js']);

describe('clamp', () => {
  test('laisse passer une valeur dans la plage', () => {
    assert.equal(ctx.clamp(5, 0, 10), 5);
  });
  test('plafonne au maximum', () => {
    assert.equal(ctx.clamp(15, 0, 10), 10);
  });
  test('plafonne au minimum', () => {
    assert.equal(ctx.clamp(-5, 0, 10), 0);
  });
  test('accepte les bornes elles-mêmes', () => {
    assert.equal(ctx.clamp(0, 0, 10), 0);
    assert.equal(ctx.clamp(10, 0, 10), 10);
  });
});

describe('shuffleArr', () => {
  test('ne modifie pas le tableau d\'origine', () => {
    const original = [1, 2, 3, 4, 5];
    const copy = original.slice();
    ctx.shuffleArr(original);
    assert.deepEqual(original, copy);
  });
  test('conserve tous les éléments (même multiset)', () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = ctx.shuffleArr(original);
    assert.deepEqual(shuffled.slice().sort(), original.slice().sort());
  });
  test('gère un tableau vide', () => {
    assert.deepEqual(ctx.shuffleArr([]), []);
  });
});

describe('escapeHtml', () => {
  test('échappe les caractères spéciaux HTML', () => {
    assert.equal(ctx.escapeHtml('<script>&"\'</script>'),
      '&lt;script&gt;&amp;&quot;&#39;&lt;/script&gt;');
  });
  test('laisse intact un texte sans caractère spécial', () => {
    assert.equal(ctx.escapeHtml('Julien Vasseur'), 'Julien Vasseur');
  });
  test('convertit les valeurs non-string', () => {
    assert.equal(ctx.escapeHtml(42), '42');
  });
});
