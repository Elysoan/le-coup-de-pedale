/* Vérifications statiques rapides sur index.html, sans navigateur — pensées comme un
   filet anti-régression direct sur des bugs réellement rencontrés pendant le
   développement (pas des règles de style théoriques) :
   - un menu déroulant natif s'ouvre en plein écran, au style du système, sur mobile
     (Android notamment) plutôt que dans le style du jeu ;
   - les boîtes de dialogue natives bloquantes bloquent le rendu de la page, ce qui coince
     à la fois l'automatisation (voir simulate.js) et l'expérience réelle sur certains
     navigateurs mobiles.
   Le jeu n'utilise plus ni l'un ni l'autre depuis la session qui a ajouté ce script —
   toute réapparition est donc un vrai regret, pas un faux positif à ignorer. */
const fs = require('fs');
const path = require('path');

const INDEX_PATH = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(INDEX_PATH, 'utf8');

let failures = 0;
function fail(msg){
  failures++;
  console.error('✗ ' + msg);
}
function pass(msg){
  console.log('✓ ' + msg);
}

/* Tout le HTML du jeu est généré depuis les blocs <script> (setHTML() côté JS) — il n'y a
   pas de balise statique en dehors. On isole donc ces blocs et on retire les commentaires
   (/* *​/ et //) avant de chercher quoi que ce soit : sinon un commentaire qui EXPLIQUE
   pourquoi on évite tel ou tel élément (il y en a, volontairement, dans ce fichier même)
   se ferait à tort repérer comme une régression. */
const scriptBlocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const allScripts = scriptBlocks.join('\n');
const withoutComments = allScripts
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/(^|[^:])\/\/.*$/gm, '$1');

// ---- 1. Aucun <select> natif nulle part dans le code généré ----
{
  const matches = withoutComments.match(/<select\b/gi) || [];
  if(matches.length === 0){
    pass('Aucun <select> natif trouvé.');
  } else {
    fail(`${matches.length} occurrence(s) de <select> trouvée(s) — remplacer par le pattern de panneau dépliable inline (voir renderGlobalLeaderboard/toggleLeaderboardStylePanel pour un exemple existant).`);
  }
}

// ---- 2. Aucun confirm()/alert()/prompt() natif dans le code JS ----
['confirm', 'alert', 'prompt'].forEach(fn => {
  const re = new RegExp(`(?:^|[^A-Za-z0-9_.])${fn}\\s*\\(`, 'g');
  const matches = withoutComments.match(re) || [];
  if(matches.length === 0){
    pass(`Aucun appel à ${fn}() natif trouvé.`);
  } else {
    fail(`${matches.length} appel(s) à ${fn}() natif trouvé(s) — bloque le rendu de la page (automatisation ET joueurs mobiles). Utiliser un composant de confirmation inline dans le style du jeu (voir confirmSeasonSetup/autoSelectCalendar pour un exemple existant).`);
  }
});

console.log('');
if(failures > 0){
  console.error(`Lint échoué : ${failures} problème(s).`);
  process.exit(1);
} else {
  console.log('Lint OK.');
}
