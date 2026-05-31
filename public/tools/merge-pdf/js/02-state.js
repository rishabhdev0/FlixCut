// ── STATE ─────────────────────────────────────────────────
let files=[];
let selectedIdx=null;
let dragSrcIdx=null;
let pageSize='A4',orientation='portrait',margin=0;
let addBlank=false,compress=true;
let addPgNums=false,pgNumPos='bottom-center';
let addWm=false,wmText='CONFIDENTIAL',wmOpacity=0.15,wmRotation=-30,wmSize=40;
let addPass=false;
const PAGE_SIZES={'A4':[595.28,841.89],'Letter':[612,792],'A3':[841.89,1190.55]};

let toastT;
function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('show'),2800);}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const MAX_FILES = 75;
const MAX_SINGLE_FILE_BYTES = 200 * 1024 * 1024;
const MAX_BATCH_BYTES = 800 * 1024 * 1024;
