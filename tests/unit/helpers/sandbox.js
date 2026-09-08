'use strict';
// Charge de vrais fichiers du jeu (data/*.js, lib/*.js) dans un contexte vm isolé,
// pour tester les fonctions telles qu'elles tournent réellement dans le navigateur
// (portée globale partagée, chargement via <script src> classique — voir index.html).
// N'importe pas via require() : ces fichiers ne sont pas des modules CommonJS/ES,
// ils déclarent leurs fonctions/consts directement dans la portée globale.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..', '..', '..');

// Petits stubs pour les dépendances transverses que la plupart des fichiers lib/
// attendent en portée globale (i18n, réglages, état de partie). Un test peut
// écraser ctx.STATE / ctx.SETTINGS avant d'appeler une fonction si besoin.
function defaultGlobals(){
  return {
    tf(key, frText){ return frText; },
    t(){ return null; },
    SETTINGS: {lang:'fr', fontSize:'normal', highContrast:false, reduceMotion:false, theme:'auto'},
    STATE: null,
  };
}

// Un script chargé avec vm.runInContext() partage sa portée lexicale de haut niveau
// avec les scripts suivants exécutés dans le même contexte — exactement comme des
// <script> classiques successifs dans un navigateur. Mais comme dans un navigateur,
// un `const`/`let` de haut niveau ne devient PAS une propriété de l'objet global : le
// code interne au sandbox (une fonction de lib/) le voit très bien, alors que notre
// code de test, qui lit depuis l'extérieur via `context.NOM`, ne le verrait pas. On
// réécrit donc les déclarations `const `/`let ` en tout début de ligne (convention de
// ce projet pour l'état de module, cf. index.html) en `var `, qui elle s'attache bien
// à l'objet global — uniquement pour ce besoin de test, le fichier source réel n'est
// pas modifié.
function exposeTopLevelDeclarations(code){
  return code.replace(/^(const|let)(\s+)/gm, 'var$2');
}

// files : chemins relatifs à la racine du repo, chargés dans l'ordre donné.
// extraGlobals : propriétés ajoutées/écrasées sur le contexte avant le chargement.
// Math (comme tout intrinsèque du contexte vm) n'est pas reflété comme propriété sur
// l'objet JS renvoyé par vm.createContext — `context.Math` est undefined même si le
// code qui s'exécute DANS le contexte voit très bien `Math`. On installe donc un
// Math.random substituable en écrivant `context.__mockRandom` (nombre ou fonction)
// depuis un test ; laisser à `undefined` restaure le hasard réel.
const INSTALL_MOCK_RANDOM = `
  (function(){
    const real = Math.random.bind(Math);
    Math.random = function(){
      const m = globalThis.__mockRandom;
      if(typeof m === 'function') return m();
      if(typeof m === 'number') return m;
      return real();
    };
  })();
`;

// files : chemins relatifs à la racine du repo, chargés dans l'ordre donné.
// extraGlobals : propriétés ajoutées/écrasées sur le contexte avant le chargement.
function createSandbox(files, extraGlobals){
  const context = vm.createContext(Object.assign(defaultGlobals(), extraGlobals || {}));
  vm.runInContext(INSTALL_MOCK_RANDOM, context, {filename: 'mock-random-setup'});
  for(const rel of files){
    const code = fs.readFileSync(path.join(ROOT, rel), 'utf8');
    vm.runInContext(exposeTopLevelDeclarations(code), context, {filename: rel});
  }
  return context;
}

module.exports = { createSandbox, ROOT };
