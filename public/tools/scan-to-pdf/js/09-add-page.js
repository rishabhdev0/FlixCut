// ── ADD PAGE ──────────────────────────────────────────────
function addPage(rawUrl,processedUrl,byteSize=0){
  if(pages.length >= MAX_FILES){toast('Page limit reached. Max 60 pages.');return;}
  pages.push({id:Date.now()+Math.random(),rawUrl,processedUrl,byteSize});
  renderPages();
}
