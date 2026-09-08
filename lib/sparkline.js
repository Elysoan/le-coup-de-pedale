/* Petit sparkline SVG inline, sans dépendance — trace les victoires carrière par
   carrière, dans l'ordre chronologique, pour visualiser la progression méta. */
function sparklineSVG(values){
  const w = 280, h = 46, pad = 4;
  if(values.length<2){
    return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;"><text x="${w/2}" y="${h/2}" text-anchor="middle" font-size="11" fill="var(--text-soft)">${tf('sparklineNeedMore','Encore quelques carrières pour voir une tendance…')}</text></svg>`;
  }
  const max = Math.max(1, ...values);
  const stepX = (w - pad*2) / (values.length - 1);
  const points = values.map((v,i)=>{
    const x = pad + i*stepX;
    const y = h - pad - (v/max)*(h - pad*2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const dots = values.map((v,i)=>{
    const x = pad + i*stepX;
    const y = h - pad - (v/max)*(h - pad*2);
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.5" fill="var(--green-dark)"/>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:${h}px;">
    <polyline points="${points.join(' ')}" fill="none" stroke="var(--green-dark)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    ${dots}
  </svg>`;
}
