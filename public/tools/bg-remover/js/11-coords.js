/* ── Coords ── */
function getImgCoords(e) {
  const r=hitCvs.getBoundingClientRect();
  const cx=(e.touches?e.touches[0].clientX:e.clientX)-r.left;
  const cy=(e.touches?e.touches[0].clientY:e.clientY)-r.top;
  return{x:Math.max(0,Math.min(imgW-1,Math.round(cx/zoom))),y:Math.max(0,Math.min(imgH-1,Math.round(cy/zoom)))};
}
