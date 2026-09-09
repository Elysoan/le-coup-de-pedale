'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createSandbox } = require('./helpers/sandbox');

let finalizeRaceCalls = 0;
const ctx = createSandbox([
  'lib/utils.js', // clamp
  'lib/injury-risk.js', // injurySeverity
  'lib/injury.js',
], {
  // finalizeRace() est une fonction d'écran (screens/race-result.js) hors du périmètre
  // de lib/ : on la remplace par un espion pour vérifier qu'elle est bien appelée en
  // fin de traitement, sans dépendre de tout le pipeline de rendu.
  finalizeRace(){ finalizeRaceCalls++; },
});

describe('causeLabelFor', () => {
  test('distingue chute et surmenage', () => {
    assert.match(ctx.causeLabelFor('chute'), /Chute/);
    assert.match(ctx.causeLabelFor('surmenage'), /Surmenage/);
  });
});

describe('handleInjury', () => {
  test('marque la saison comme ayant eu une blessure et ajoute un évènement au récap', () => {
    finalizeRaceCalls = 0;
    ctx.STATE = {
      rider: {fatigue: 20},
      runRaceAccum: [],
      hadInjuryThisSeason: false,
    };
    ctx.handleInjury('chute', {}, null);
    assert.equal(ctx.STATE.hadInjuryThisSeason, true);
    assert.equal(ctx.STATE.runRaceAccum.length, 1);
    assert.equal(ctx.STATE.runRaceAccum[0].tier, 'abandon');
  });
  test('une chute augmente plus la fatigue qu\'un surmenage', () => {
    ctx.STATE = {rider: {fatigue: 20}, runRaceAccum: [], hadInjuryThisSeason: false};
    ctx.handleInjury('chute', {}, null);
    const afterChute = ctx.STATE.rider.fatigue;

    ctx.STATE = {rider: {fatigue: 20}, runRaceAccum: [], hadInjuryThisSeason: false};
    ctx.handleInjury('surmenage', {}, null);
    const afterSurmenage = ctx.STATE.rider.fatigue;

    assert.ok(afterChute > afterSurmenage);
  });
  test('utilise l\'entrée pré-calculée si elle est fournie, plutôt que d\'en créer une par défaut', () => {
    ctx.STATE = {rider: {fatigue: 20}, runRaceAccum: [], hadInjuryThisSeason: false};
    const custom = {title: 'Titre personnalisé', choiceLabel: '', risk: 'sur', tier: 'abandon', perf: 0, trained: null};
    ctx.handleInjury('chute', {}, custom);
    assert.equal(ctx.STATE.runRaceAccum[0].title, 'Titre personnalisé');
  });
  test('appelle finalizeRace() une fois le traitement terminé', () => {
    finalizeRaceCalls = 0;
    ctx.STATE = {rider: {fatigue: 20}, runRaceAccum: [], hadInjuryThisSeason: false};
    ctx.handleInjury('chute', {}, null);
    assert.equal(finalizeRaceCalls, 1);
  });
  test('renseigne STATE.pendingInjury avec la cause et une gravité valide', () => {
    ctx.STATE = {rider: {fatigue: 20}, runRaceAccum: [], hadInjuryThisSeason: false};
    ctx.handleInjury('surmenage', {}, null);
    assert.equal(ctx.STATE.pendingInjury.cause, 'surmenage');
    assert.ok(['legere', 'moderee', 'grave'].includes(ctx.STATE.pendingInjury.severity));
  });
});
