function loadSettings(){
  try{
    const raw = localStorage.getItem(SETTINGS_KEY);
    if(raw) SETTINGS = Object.assign(SETTINGS, JSON.parse(raw));
  } catch(e){ /* pas grave, on garde les reglages par defaut */ }
}

function saveSettings(){
  try{ localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS)); SAVE_FAILED = false; } catch(e){ SAVE_FAILED = true; }
}

function applySettings(){
  const sizes = {normal:'100%', large:'115%', xlarge:'130%'};
  document.documentElement.style.fontSize = sizes[SETTINGS.fontSize] || '100%';
  document.documentElement.classList.toggle('high-contrast', !!SETTINGS.highContrast);
  document.documentElement.classList.toggle('reduce-motion', !!SETTINGS.reduceMotion);
  if(document.documentElement.setAttribute) document.documentElement.setAttribute('lang', SETTINGS.lang==='en' ? 'en' : 'fr');
  if(SETTINGS.theme==='dark' || SETTINGS.theme==='light') document.documentElement.setAttribute('data-theme', SETTINGS.theme);
  else document.documentElement.removeAttribute('data-theme');
}

function setFontSize(size){ SETTINGS.fontSize = size; applySettings(); saveSettings(); renderSettingsScreen(true); }
function toggleHighContrast(){ SETTINGS.highContrast = !SETTINGS.highContrast; applySettings(); saveSettings(); renderSettingsScreen(true); }
function toggleReduceMotion(){ SETTINGS.reduceMotion = !SETTINGS.reduceMotion; applySettings(); saveSettings(); renderSettingsScreen(true); }
function setTheme(mode){ SETTINGS.theme = mode; applySettings(); saveSettings(); renderSettingsScreen(true); }

function renderSettingsScreen(keepScroll){
  /* Nom d'écran dédié quand ouvert en cours de run (NAV_RETURN_TO==='inrun') : sinon
     STATE._screen resterait bloqué sur le nom de l'écran de jeu réel pendant tout le
     temps où Réglages est affiché, masquant qu'un vrai changement d'écran a eu lieu. */
  if(STATE && NAV_RETURN_TO==='inrun') STATE._screen = 'settings';
  setHTML(`
    ${heroHTML(tf('accessibility','♿ Accessibilité'))}
    <div class="card">
      <h3>🌐 ${tf('languageTitle','Langue')}</h3>
      <div class="grid2">
        <button class="btn ${(SETTINGS.lang||'fr')==='fr'?'':'ghost'}" onclick="setLangFromSettings('fr')">🇫🇷 Français</button>
        <button class="btn ${SETTINGS.lang==='en'?'':'ghost'}" onclick="setLangFromSettings('en')">🇬🇧 English</button>
      </div>
    </div>
    <div class="card">
      <h3>🔠 ${tf('textSize','Taille du texte')}</h3>
      <div class="grid3">
        <button class="btn ${SETTINGS.fontSize==='normal'?'':'ghost'}" onclick="setFontSize('normal')">${tf('normal','Normal')}</button>
        <button class="btn ${SETTINGS.fontSize==='large'?'':'ghost'}" onclick="setFontSize('large')">${tf('large','Grand')}</button>
        <button class="btn ${SETTINGS.fontSize==='xlarge'?'':'ghost'}" onclick="setFontSize('xlarge')">${tf('xlarge','Très grand')}</button>
      </div>
    </div>
    <div class="card">
      <h3>🎨 ${tf('themeTitle','Thème')}</h3>
      <p class="small">${tf('themeDesc',"Choisis l'apparence du jeu, ou laisse-le suivre le réglage de ton téléphone/ordinateur.")}</p>
      <div class="grid3">
        <button class="btn ${SETTINGS.theme==='auto'?'':'ghost'}" onclick="setTheme('auto')">${tf('themeAuto','Auto')}</button>
        <button class="btn ${SETTINGS.theme==='light'?'':'ghost'}" onclick="setTheme('light')">☀️ ${tf('themeLight','Clair')}</button>
        <button class="btn ${SETTINGS.theme==='dark'?'':'ghost'}" onclick="setTheme('dark')">🌙 ${tf('themeDark','Sombre')}</button>
      </div>
    </div>
    <div class="card">
      <h3>🌓 ${tf('highContrast','Contraste renforcé')}</h3>
      <p class="small">${tf('highContrastDesc','Texte plus foncé et bordures plus marquées, pour une meilleure lisibilité.')}</p>
      <button class="btn ${SETTINGS.highContrast?'':'ghost'}" onclick="toggleHighContrast()">${SETTINGS.highContrast?tf('enabled','✅ Activé'):tf('disabled','Désactivé')}</button>
    </div>
    <div class="card">
      <h3>🎬 ${tf('reduceMotion','Réduire les animations')}</h3>
      <p class="small">${tf('reduceMotionDesc',"Désactive les transitions, confettis et effets d'apparition, en plus du réglage de ton système d'exploitation s'il est déjà activé.")}</p>
      <button class="btn ${SETTINGS.reduceMotion?'':'ghost'}" onclick="toggleReduceMotion()">${SETTINGS.reduceMotion?tf('enabled','✅ Activé'):tf('disabled','Désactivé')}</button>
    </div>
    <button class="btn" onclick="${NAV_RETURN_TO==='creation'?'renderCreationScreen()':(NAV_RETURN_TO==='inrun'?'restoreNavReturnScreen()':'renderMainMenu()')}">${tf('back','← Retour')}</button>
  `, keepScroll);
}
