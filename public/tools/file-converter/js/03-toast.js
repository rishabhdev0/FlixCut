// ─── TOAST ─────────────────────────────────
let toastT;
function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('show'),2800);}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const MAX_FILES = 50;
const MAX_SINGLE_FILE_BYTES = 150 * 1024 * 1024;
const MAX_BATCH_BYTES = 600 * 1024 * 1024;
