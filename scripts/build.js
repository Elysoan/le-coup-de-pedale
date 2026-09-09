#!/usr/bin/env node
'use strict';
/* Assemble un index.html unique, prêt pour le déploiement GitHub Pages : chaque
   <script src="data|lib|core|screens/...jsjs"></script> (référence locale) est
   remplacé par son contenu inliné, dans l'ordre du document — même sémantique
   d'exécution que le chargement séquentiel actuel, mais sans les ~108 requêtes
   HTTP correspondantes.

   Les fichiers sources (index.html, data/, lib/, core/, screens/) ne sont PAS
   modifiés : ce script lit le repo tel quel et écrit uniquement dans dist/. Le
   développement (édition des fichiers, tests/simulate.js, tests/lint-source.js)
   continue de fonctionner exactement comme avant, sur l'arborescence modulaire —
   dist/ n'est qu'un artefact de build pour la mise en ligne.

   Usage : node scripts/build.js */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

const LOCAL_SCRIPT_RE = /<script src="((?:data|lib|core|screens)\/[^"]+\.js)"><\/script>/g;

function build(){
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

  let inlinedCount = 0;
  const out = html.replace(LOCAL_SCRIPT_RE, (match, relPath) => {
    const code = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
    /* Un navigateur ferme un <script> dès qu'il rencontre "</script" en texte brut,
       même à l'intérieur d'une chaîne ou d'un template literal JS — un fichier qui
       contiendrait ce texte casserait silencieusement le HTML une fois inliné. */
    if(/<\/script/i.test(code)){
      throw new Error(`${relPath} contient la séquence "</script" — ne peut pas être inliné tel quel (échapper en "<\\/script" dans le fichier source).`);
    }
    inlinedCount++;
    return `<script>\n${code}</script>`;
  });

  fs.mkdirSync(DIST, { recursive: true });
  fs.writeFileSync(path.join(DIST, 'index.html'), out);

  const cnamePath = path.join(ROOT, 'CNAME');
  if(fs.existsSync(cnamePath)) fs.copyFileSync(cnamePath, path.join(DIST, 'CNAME'));

  console.log(`Build OK : ${inlinedCount} <script src> inlinés -> dist/index.html`);
}

build();
