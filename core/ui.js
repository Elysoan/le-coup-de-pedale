function heroHTML(title, subtitle, kicker){
  return `<div class="screen-hero">
    ${kicker ? `<p class="kicker">${kicker}</p>` : ''}
    <h1>${title}</h1>
    ${subtitle ? `<p>${subtitle}</p>` : ''}
  </div>`;
}
function app(){ return document.getElementById('app'); }
function setHTML(html, keepScroll){
  app().innerHTML = html;
  if(STATE && STATE.rider){
    app().insertAdjacentHTML('beforeend', `<button class="footer-link" style="display:block;margin:18px auto 0;text-align:center;" onclick="renderMainMenu()">${tf('mainMenu','🏠 Menu principal')}</button>`);
    app().insertAdjacentHTML('beforeend', `<button class="footer-link" style="display:block;margin:6px auto 0;text-align:center;" onclick="renderRaceAlmanac()">${tf('raceAlmanac','📖 Almanach des courses')}</button>`);
    /* Réglages jusqu'ici seulement accessibles hors course (menu principal/création) —
       un joueur en pleine saison qui veut passer en thème sombre devait tout quitter. */
    app().insertAdjacentHTML('beforeend', `<button class="footer-link" style="display:block;margin:6px auto 0;text-align:center;" onclick="NAV_RETURN_TO='inrun';STATE._navReturnScreen=STATE._screen;renderSettingsScreen()">${tf('accessibility','♿ Accessibilité')}</button>`);
  }
  app().insertAdjacentHTML('beforeend', `<a href="https://x.com/lecoupdepedale" target="_blank" rel="noopener" style="display:block;text-align:center;margin:14px auto 6px;font-size:0.72rem;color:var(--text-soft);text-decoration:none;opacity:0.75;">𝕏 @lecoupdepedale</a>`);
  /* Accessibilité clavier : les éléments cliquables non-natifs (div/span avec onclick,
     utilisés pour les cartes de sélection) doivent être atteignables au Tab et activables
     au clavier — voir le listener keydown délégué posé une seule fois au démarrage. */
  app().querySelectorAll('[onclick]').forEach(el=>{
    const tag = el.tagName;
    if(tag==='BUTTON'||tag==='A'||tag==='SELECT'||tag==='INPUT') return;
    if(el.hasAttribute('disabled')) return;
    if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex','0');
    if(!el.hasAttribute('role')) el.setAttribute('role','button');
    /* Contrôles de sélection personnalisés (row-item/chip/opt-card/team-card) : leur état
       "choisi" n'était jusqu'ici signalé que par une couleur de bordure/fond (classe
       active/selected/picked), invisible pour une technologie d'assistance. On expose
       cet état via aria-pressed pour tous ces éléments, sans toucher aux gabarits HTML
       un par un — sauf là où un aria-pressed explicite existe déjà dans le code. */
    if(!el.hasAttribute('aria-pressed') && (el.classList.contains('row-item') || el.classList.contains('chip') || el.classList.contains('opt-card') || el.classList.contains('team-card'))){
      const isOn = el.classList.contains('active') || el.classList.contains('selected') || el.classList.contains('picked');
      el.setAttribute('aria-pressed', String(isOn));
    }
  });
  if(!keepScroll) window.scrollTo(0,0);
  /* Gestion du focus au changement d'écran : setHTML() remplace tout le contenu de #app
     à chaque navigation, ce qui laisse le focus clavier sur un nœud détruit (retombe
     silencieusement sur <body>) et ne prévient jamais un lecteur d'écran qu'un nouvel
     écran s'est affiché. On déplace le focus sur le titre du nouvel écran et on
     l'annonce via une région aria-live permanente, hors de #app pour survivre au
     remplacement. Uniquement sur une vraie navigation (!keepScroll) : les mises à jour
     en place du même écran (ex. cocher une course au calendrier, qui passe keepScroll)
     ne doivent pas renvoyer le focus clavier tout en haut à chaque coche. */
  if(!keepScroll){
    /* h1 en priorité (le vrai titre de l'écran) : riderHeaderHTML() place un <h2> avec
       le nom du coureur en tête de nombreux écrans, avant le titre spécifique de
       l'écran — chercher "h1, h2" sans distinction ramènerait presque toujours ce nom
       plutôt que le titre réel. */
    const _heading = app().querySelector('h1') || app().querySelector('h2');
    if(_heading){
      if(!_heading.hasAttribute('tabindex')) _heading.setAttribute('tabindex','-1');
      _heading.focus({preventScroll:true});
      const _announcer = document.getElementById('sr-announcer');
      if(_announcer) _announcer.textContent = _heading.textContent;
    }
  }
  saveGame();
  const bars = app().querySelectorAll('.stat-fill.animated-fill');
  if(bars.length){
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{
        bars.forEach(el=>{ el.style.width = el.getAttribute('data-w') + '%'; });
      });
    });
  }
}
