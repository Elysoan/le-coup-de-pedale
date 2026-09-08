function renderTutorialScreen(){
  setHTML(`
    ${heroHTML('📖 '+tf('howToPlayTitle','Comment jouer'))}
    <div class="card">
      <h3>🚴 ${tf('theConcept','Le principe')}</h3>
      <p>${tf('theConceptDesc',"Tu incarnes un coureur cycliste professionnel, saison après saison. Choisis ton calendrier, dispute tes courses, gère ta fatigue et fais progresser ta carrière jusqu'à 15 saisons ou 41 ans.")}</p>
    </div>
    <div class="card">
      <h3>📅 ${tf('calendarBudget','Le calendrier et le budget de jours')}</h3>
      <p>${tf('calendarBudgetDesc',"Chaque saison, ton équipe t'impose 3 courses et tu choisis le reste toi-même. Chaque course dure un certain nombre de jours (une classique = 1 jour, un grand tour = 21 jours) : tu as")} <strong>${tf('max65days','65 jours max')}</strong> ${tf('perSeasonEtc',"par saison. Au-delà de 45 jours cumulés, la fatigue s'accumule nettement plus vite sur le reste de la saison — vise l'équilibre plutôt que le remplissage.")}</p>
    </div>
    <div class="card">
      <h3>🎯 ${tf('raceChoices','Les choix en course')}</h3>
      <p>${tf('raceChoicesDesc1','Sur chaque course, un évènement te propose plusieurs approches')} : 🛡️ <strong>${tf('safeWord','Sûr')}</strong> ${tf('safeDesc','limite les dégâts')}, ⚖️ <strong>${tf('balancedWord','Équilibré')}</strong> ${tf('balancedDesc','est la voie classique')}, 🎲 <strong>${tf('boldWord','Audacieux')}</strong> ${tf('boldDesc','vise plus haut mais fatigue et expose davantage à la chute.')} ${tf('raceChoicesDesc2',"De temps en temps, un 4e choix")} 🤪 <strong>${tf('wildWord','Loufoque')}</strong> ${tf('wildDesc',"apparaît — son résultat est presque entièrement dicté par la chance, pour le meilleur ou pour le pire.")}</p>
    </div>
    <div class="card">
      <h3>🔥 ${tf('fatigueTitle','La fatigue')}</h3>
      <p>${tf('fatigueDesc',"Elle dépend du cumul réel de jours courus (pas seulement du calendrier prévu), de la durée de chaque course, et du risque pris. Une fatigue trop élevée augmente le risque de blessure et plombe tes performances — pense à laisser des périodes de récupération entre les courses.")}</p>
    </div>
    <div class="card">
      <h3>⭐ ${tf('reputationTitle','La réputation')}</h3>
      <p>${tf('reputationDesc',"Elle influence ton salaire, la qualité des équipes qui te font des offres, la durée de tes contrats, et ta sélection éventuelle aux Jeux Panhelléniques (réputation ≥68 la première fois, un peu moins ensuite — jamais garantie).")}</p>
    </div>
    <div class="card">
      <h3>🏆 ${tf('trophiesTitle','Les trophées et le palmarès')}</h3>
      <p>${tf('trophiesDesc','37 trophées à débloquer au fil de tes carrières (certains "légendaires" bien plus difficiles), et un Hall of Fame qui conserve tes 5 meilleures carrières pour toute la session.')}</p>
    </div>
    <div class="card">
      <h3>🎯 ${tf('challengeTutoTitle','Le mode défi')}</h3>
      <p>${tf('challengeTutoDesc',"Une fois ta première carrière terminée, débloque le mode défi : nationalité, style, équipe de départ et objectif sont tirés au sort pour toi — un vrai test de polyvalence, avec un succès ou un échec évalué à la fin de la carrière.")}</p>
    </div>
    <div class="card">
      <h3>🔓 ${tf('unlocksTutoTitle','Le déblocage entre carrières')}</h3>
      <p>${tf('unlocksTutoDesc',"Ta progression ne s'arrête jamais à la fin d'une carrière. Les styles et nationalités déjà joués sont marqués ✓ à la création. L'équipe de départ s'améliore avec le cumul de victoires de toutes tes carrières (25 victoires : équipe ProTeam, 60 victoires : équipe WorldTour). Et des titres de légende exclusifs récompensent les joueurs qui possèdent déjà des trophées rares issus de carrières précédentes.")}</p>
    </div>
    <div class="card">
      <h3>📖 ${tf('almanacTutoTitle','Almanach des courses')}</h3>
      <p>${tf('almanacTutoDesc',"Consulte ton meilleur résultat sur chacune des 63 courses du jeu, avec un bouton pour basculer entre « Cette carrière » et « Almanach de légende » (ton meilleur résultat jamais obtenu sur chaque course, toutes carrières confondues).")}</p>
    </div>
    <div class="card">
      <h3>📊 ${tf('comparatorTutoTitle','Le comparateur de carrières')}</h3>
      <p>${tf('comparatorTutoDesc',"Retrouve toutes tes carrières terminées : tri par victoires, réputation ou date, filtres par style et par pays, statistiques moyennes détaillées par style, comparaison tête-à-tête entre deux carrières au choix, et un mini-graphique de progression de tes victoires au fil du temps.")}</p>
    </div>
    <div class="card">
      <h3>🌍 ${tf('leaderboardTutoTitle','Le classement mondial')}</h3>
      <p>${tf('leaderboardTutoDesc',"À la fin d'une carrière, publie (facultativement) ton score pour te comparer à tous les joueurs. Seul le top 50 est affiché, mais ton rang exact t'est toujours indiqué, même au-delà.")}</p>
      <p class="small" style="margin:10px 0 4px;"><strong>${tf('scoringTitle','Comment ton score de carrière est calculé')}</strong></p>
      <div class="race-item" style="cursor:default;"><span>${tf('scoringGrandTour','Grand Tour')}</span><span class="pill mono">${tf('scoringWinLabel','victoire')} 150 · ${tf('scoringPodiumLabel','podium')} 40</span></div>
      <div class="race-item" style="cursor:default;"><span>${tf('scoringMonument','Monument')}</span><span class="pill mono">${tf('scoringWinLabel','victoire')} 100 · ${tf('scoringPodiumLabel','podium')} 30</span></div>
      <div class="race-item" style="cursor:default;"><span>${tf('scoringChamp','Championnat')}</span><span class="pill mono">${tf('scoringWinLabel','victoire')} 80 · ${tf('scoringPodiumLabel','podium')} 25</span></div>
      <div class="race-item" style="cursor:default;"><span>${tf('scoringSemitour','Course par étapes')}</span><span class="pill mono">${tf('scoringWinLabel','victoire')} 40 · ${tf('scoringPodiumLabel','podium')} 12</span></div>
      <div class="race-item" style="cursor:default;"><span>${tf('scoringClassique','Classique')}</span><span class="pill mono">${tf('scoringWinLabel','victoire')} 25 · ${tf('scoringPodiumLabel','podium')} 8</span></div>
      <div class="race-item" style="cursor:default;"><span>${tf('scoringCrit','Critérium (et autres)')}</span><span class="pill mono">${tf('scoringWinLabel','victoire')} 10 · ${tf('scoringPodiumLabel','podium')} 3</span></div>
      <p class="small" style="margin:8px 0 0;">${tf('scoringExtras',"+ 15 pts par victoire d'étape, + 1 pt par point de réputation finale, et un bonus jusqu'à 60 pts selon ton meilleur classement mondial atteint en carrière.")}</p>
    </div>
    <button class="btn ghost" onclick="${NAV_RETURN_TO==='creation'?'renderCreationScreen()':'renderMainMenu()'}">${tf('back','← Retour')}</button>
  `);
}
