/* ---------- CARTE DE PARTAGE (fin de carrière) ---------- */

function openShareCard(){
  if(STATE) STATE._screen = 'sharecard';
  setHTML(`
    ${heroHTML(tf('shareCareer','📤 Partager ma carrière'))}
    <div class="card center">
      <canvas id="shareCanvas" width="1080" height="1080" style="width:100%;max-width:420px;border-radius:18px;box-shadow:0 6px 24px rgba(43,36,24,0.18);"></canvas>
      <p class="small" style="margin-top:12px;">${tf('shareCardDesc',"Image prête à partager sur les réseaux — aucune donnée envoyée nulle part, tout se génère dans ton navigateur.")}</p>
      <p id="shareCardError" class="small" style="color:var(--red);display:none;">${tf('shareCardExportError',"Échec de l'export de l'image — réessaie, ou fais une capture d'écran de la carte ci-dessus.")}</p>
      <button class="btn" onclick="downloadShareCard()">${tf('download',"⬇️ Télécharger l'image")}</button>
      <button class="btn ghost" id="shareNativeBtn" style="display:none;" onclick="nativeShareCard()">${tf('shareNative','📤 Partager directement')}</button>
      <button class="btn ghost" onclick="renderCareerEnd()">${tf('backToRecap','← Retour au bilan')}</button>
    </div>
  `);
  drawShareCard(STATE.rider);
  if(navigator.share && navigator.canShare){
    const btn = document.getElementById('shareNativeBtn');
    if(btn) btn.style.display = 'block';
  }
}

function drawShareCard(r){
  const canvas = document.getElementById('shareCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const logo = new Image();
  logo.onload = () => {
    const paint = () => paintShareCard(ctx, canvas, r, logo);
    if(document.fonts && document.fonts.ready){ document.fonts.ready.then(paint); }
    else { paint(); }
  };
  logo.src = LOGO_B64;
}

function paintShareCard(ctx, canvas, r, logo){
  const W = canvas.width, H = canvas.height;
  const country = COUNTRIES.find(c=>c.code===r.countryCode);
  const style = STYLES.find(s=>s.id===r.styleId);
  const wins = r.palmares.filter(p=>p.tier==='victoire');
  const title = legacyTitle(r);

  const grad = ctx.createLinearGradient(0,0,0,H);
  grad.addColorStop(0, '#FBF7EF');
  grad.addColorStop(1, '#FFEBDD');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,W,H);

  ctx.textAlign = 'center';

  /* Réduit la taille de police jusqu'à ce que le texte tienne dans la largeur
     disponible — évite tout débordement sur les noms/titres les plus longs. */
  function fitFontSize(text, maxWidth, maxSize, minSize, weight){
    let size = maxSize;
    do {
      ctx.font = `${weight} ${size}px 'Nunito', sans-serif`;
      if(ctx.measureText(text).width <= maxWidth) break;
      size -= 3;
    } while(size > minSize);
    return size;
  }

  const safeWidth = W - 140;

  const logoW = 130, logoH = logoW * (logo.height/logo.width || 180/160);
  ctx.drawImage(logo, W/2 - logoW/2, 56, logoW, logoH);

  ctx.fillStyle = '#FF8A3D';
  ctx.font = "900 40px 'Nunito', sans-serif";
  ctx.fillText('LE COUP DE PÉDALE', W/2, logoH + 130);

  ctx.fillStyle = '#2B2418';
  fitFontSize(r.name, safeWidth, 68, 28, 900);
  ctx.fillText(r.name, W/2, logoH + 235);

  const subLine = `${country?country.flag:''} ${country?country.name:''} · ${style?style.name:''}`;
  ctx.fillStyle = '#8A7F68';
  fitFontSize(subLine, safeWidth, 32, 18, 700);
  ctx.fillText(subLine, W/2, logoH + 285);

  ctx.fillStyle = '#D4881B';
  fitFontSize(title, safeWidth, 42, 22, 800);
  ctx.fillText(title, W/2, logoH + 360);

  const stats = [
    [String(r.season-1), 'saisons'],
    [String(wins.length), 'victoires'],
    [String(UNLOCKED.size), 'trophées'],
  ];
  const statY = H - 300;
  stats.forEach((s,i)=>{
    const x = (W/3)*i + (W/3)/2;
    ctx.fillStyle = '#3CB878';
    ctx.font = "900 74px 'Nunito', sans-serif";
    ctx.fillText(s[0], x, statY);
    ctx.fillStyle = '#8A7F68';
    ctx.font = "700 28px 'Nunito', sans-serif";
    ctx.fillText(s[1], x, statY + 44);
  });

  ctx.strokeStyle = '#ECE4D2';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(80, H-140);
  ctx.lineTo(W-80, H-140);
  ctx.stroke();

  ctx.fillStyle = '#FF5C8A';
  ctx.font = "800 38px 'Nunito', sans-serif";
  ctx.fillText('lecoupdepedale.com', W/2, H-70);
}

function downloadShareCard(){
  trackEvent('share_card', { seasons: STATE.rider ? STATE.rider.season : undefined });
  const canvas = document.getElementById('shareCanvas');
  if(!canvas) return;
  canvas.toBlob(blob=>{
    if(!blob){ showShareCardError(); return; }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ma-carriere-le-coup-de-pedale.png';
    a.click();
    setTimeout(()=>URL.revokeObjectURL(url), 3000);
  }, 'image/png');
}

function nativeShareCard(){
  const canvas = document.getElementById('shareCanvas');
  if(!canvas) return;
  canvas.toBlob(blob=>{
    if(!blob){ showShareCardError(); return; }
    const file = new File([blob], 'ma-carriere-le-coup-de-pedale.png', {type:'image/png'});
    if(navigator.canShare && navigator.canShare({files:[file]})){
      navigator.share({files:[file], title:'Le coup de pédale', text:tf('shareNativeText','Ma carrière de coureur cycliste — lecoupdepedale.com')}).catch(()=>{});
    }
  }, 'image/png');
}

/* Silencieux jusqu'ici : si toBlob() échoue (canvas non supporté/vidé), un clic sur
   Télécharger ou Partager ne produisait rien du tout, sans le moindre message. */
function showShareCardError(){
  const el = document.getElementById('shareCardError');
  if(el) el.style.display = 'block';
}

/* Quelques moments forts choisis dans la carrière, pour donner un vrai résumé plutôt
   qu'une simple liste de résultats — la première victoire, le plus grand succès, les
   titres marquants, la plus belle rivalité. */
function careerHighlights(r){
  const highlights = [];
  const wins = r.palmares.filter(p=>p.tier==='victoire');

  if(wins.length){
    const first = wins[0];
    highlights.push(`🎉 ${tf('season','Saison')} ${first.season} — ${tf('firstProWin','première victoire professionnelle, sur')} ${first.raceName}. ${tf('neverForget',"Un moment qu'on n'oublie jamais.")}`);
    const bigWins = wins.filter(w=>w.type==='monument' || w.type==='grandtour');
    if(bigWins.length){
      const bw = bigWins[bigWins.length-1];
      if(bw !== first) highlights.push(`🏆 ${tf('season','Saison')} ${bw.season} — ${tf('winOn','victoire sur')} ${bw.raceName}, ${tf('careerPeak',"l'un des sommets de la carrière.")}`);
    }
  } else {
    highlights.push(`${tf('noNotableWin','Une carrière sans victoire marquante, mais')} ${r.palmares.length} ${tf(r.palmares.length>1?'racesRunP':'racesRun','course'+(r.palmares.length>1?'s':'')+' disputée'+(r.palmares.length>1?'s':''))} ${tf('withConsistency','avec constance.')}`);
  }

  const podiums = r.palmares.filter(p=>p.tier==='podium');
  if(podiums.length){
    highlights.push(`🥈 ${podiums.length} ${tf(podiums.length>1?'podiumsWonP':'podiumWon','podium'+(podiums.length>1?'s':'')+' décroché'+(podiums.length>1?'s':''))} ${tf('throughoutCareer','au fil de la carrière, en plus des victoires.')}`);
  }

  if(r.nationalTitles) highlights.push(`🏅 ${r.nationalTitles} ${tf(r.nationalTitles>1?'nationalTitleWonP':'nationalTitleWon','titre'+(r.nationalTitles>1?'s':'')+' de champion national décroché'+(r.nationalTitles>1?'s':''))} ${tf('duringCareer','en cours de carrière.')}`);
  if(r.olympicGold) highlights.push(`🥇 ${tf('olympicChampion','Champion olympique')} — ${tf('rareAchievement','un accomplissement rarissime, gravé pour toujours dans la carrière.')}`);
  else if(r.olympicSilver || r.olympicBronze) highlights.push(`🎽 ${tf('olympicMedalWon','Une médaille olympique décrochée en cours de carrière — un souvenir impérissable.')}`);

  if(STATE.rivalRecords){
    // Parcourt tous les rivaux jamais affrontés (y compris ceux déjà partis à la
    // retraite en cours de carrière), pas seulement le trio encore actif à la fin.
    let best = null;
    Object.keys(STATE.rivalRecords).forEach(name=>{
      const rec = STATE.rivalRecords[name] || {wins:0, losses:0};
      if(rec.wins>=3 && (!best || (rec.wins-rec.losses) > (best.rec.wins-best.rec.losses))) best = {name, rec};
    });
    if(best) highlights.push(`⚔️ ${tf('notableRivalry','Une rivalité marquante avec')} ${best.name} — ${best.rec.wins} ${tf(best.rec.wins>1?'winsAgainstP':'winAgainst','victoire'+(best.rec.wins>1?'s':''))} ${tf('againstHim','contre lui au fil des saisons.')}`);
  }

  if(r.season-1 >= 10) highlights.push(`⏳ ${tf('rareLongevity','Une longévité rare')} : ${r.season-1} ${tf('proSeasonsCompleted',"saisons professionnelles menées jusqu'au bout.")}`);

  return highlights;
}

function showSplash(){
  setHTML(`
    <div class="splash-screen" style="background-image:url(${SPLASH_BG_B64});">
    </div>
  `);
  setTimeout(afterSplash, 3000);
}

function afterSplash(){
  migrateOldSaveIfNeeded();
  const global = loadGlobalData();
  restoreGlobalData(global);
  SLOTS = loadSlotsData();
  SLOTS.forEach(s=>{ if(s && s.state && s.state.rider) backfillRiderFields(s.state.rider); });
  SUPPRESS_SAVE = false;
  renderMainMenu();
}
