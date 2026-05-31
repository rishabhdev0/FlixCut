/* ── Toast ── */
let toastT;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(()=>el.classList.remove('show'), 2800);
}
const MAX_IMAGE_FILE_BYTES = 60 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 50 * 1000 * 1000;
