'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox(['lib/sparkline.js']);

describe('sparklineSVG', () => {
  test('affiche un message d\'attente avec moins de 2 valeurs', () => {
    assert.match(ctx.sparklineSVG([]), /<text/);
    assert.match(ctx.sparklineSVG([3]), /<text/);
  });
  test('trace une polyline avec un point par valeur, à partir de 2 valeurs', () => {
    const svg = ctx.sparklineSVG([1, 4, 2, 8]);
    assert.match(svg, /<polyline/);
    const dotCount = (svg.match(/<circle/g) || []).length;
    assert.equal(dotCount, 4);
  });
  test('reste valide même si toutes les valeurs sont à 0', () => {
    assert.doesNotThrow(() => ctx.sparklineSVG([0, 0, 0]));
  });
});
