'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

const ctx = createSandbox([
  'lib/utils.js', // clamp
  'data/weather-types.js',
  'lib/weather.js',
]);

describe('rollWeather', () => {
  test('retourne toujours un type de météo connu', () => {
    const ids = new Set(ctx.WEATHER_TYPES.map(w => w.id));
    for (let month = 1; month <= 12; month++) {
      const w = ctx.rollWeather(month, false);
      assert.ok(ids.has(w.id), `mois ${month} a produit un id inconnu: ${w.id}`);
    }
  });
  test('fonctionne aussi pour l\'hémisphère sud sans planter', () => {
    for (let month = 1; month <= 12; month++) {
      assert.doesNotThrow(() => ctx.rollWeather(month, true));
    }
  });
});

describe('weatherPerfModifier', () => {
  test('la pluie avantage les classiques et pénalise le reste', () => {
    assert.equal(ctx.weatherPerfModifier('pluie', ['classiques']), 3);
    assert.equal(ctx.weatherPerfModifier('pluie', ['sprint']), -2);
  });
  test('le vent avantage le CLM/résistance et pénalise le reste', () => {
    assert.equal(ctx.weatherPerfModifier('vent', ['clm']), 3);
    assert.equal(ctx.weatherPerfModifier('vent', ['resistance']), 3);
    assert.equal(ctx.weatherPerfModifier('vent', ['sprint']), -2);
  });
  test('une météo neutre ne modifie rien', () => {
    assert.equal(ctx.weatherPerfModifier('soleil', ['sprint']), 0);
  });
});

describe('weatherFatigueMult / weatherCrashMult', () => {
  test('la canicule fatigue plus que le froid, qui fatigue plus que le reste', () => {
    assert.ok(ctx.weatherFatigueMult('canicule') > ctx.weatherFatigueMult('froid'));
    assert.ok(ctx.weatherFatigueMult('froid') > ctx.weatherFatigueMult('soleil'));
  });
  test('seule la pluie augmente le risque de chute', () => {
    assert.equal(ctx.weatherCrashMult('pluie'), 1.5);
    assert.equal(ctx.weatherCrashMult('soleil'), 1);
    assert.equal(ctx.weatherCrashMult('canicule'), 1);
  });
});
