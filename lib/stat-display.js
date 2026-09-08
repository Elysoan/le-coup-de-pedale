function badgeHTML(type){ return `<span class="badge ${type}">${TYPE_LABEL[type]}</span>`; }

function tierClass(tier){ return 'tier-'+tier; }

function gaugeLevelColor(v){
  if(v>=70) return 'var(--green-dark)';
  if(v>=45) return 'var(--yellow-dark)';
  return 'var(--red)';
}
function statBarsHTML(stats, beforeStats){
  return `<div class="gauge-grid">${STAT_KEYS.map(k=>{
    const v = Math.round(stats[k]);
    const deg = clamp(v,0,100)*3.6;
    const delta = beforeStats ? v - Math.round(beforeStats[k]) : 0;
    const deltaHTML = delta!==0 ? `<span class="gauge-delta" style="background:${delta>0?'var(--green-dark)':'var(--red)'};">${delta>0?'+':''}${delta}</span>` : '';
    return `<div class="gauge-cell">
      <div class="gauge" style="background:conic-gradient(${gaugeLevelColor(v)} ${deg}deg, var(--surface-alt) 0deg);">
        <div class="gauge-hole"><span class="gauge-num">${v}</span></div>
        ${deltaHTML}
      </div>
      <span class="gauge-cap">${STAT_ICONS[k]} ${STAT_LABELS[k]}</span>
    </div>`;
  }).join('')}</div>`;
}

function globalRiderRating(stats){
  let sum = 0;
  STAT_KEYS.forEach(k=>{ sum += stats[k] * (GLOBAL_RATING_WEIGHTS[k]||0); });
  return Math.round(sum);
}

function raceFocusIcons(race){
  const stats = new Set();
  race.events.forEach(e=>{ e.focus.forEach(f=>stats.add(f)); });
  return [...stats].map(k=>STAT_ICONS[k]||'').join(' ');
}
