/* ── Screen ── */
function showScreen(n) {
  document.getElementById('upload-screen').style.display  = n==='upload'  ? 'flex'   : 'none';
  document.getElementById('loading-screen').style.display = n==='loading' ? 'flex'   : 'none';
  document.getElementById('editor-screen').style.display  = n==='editor'  ? 'flex'   : 'none';
}
