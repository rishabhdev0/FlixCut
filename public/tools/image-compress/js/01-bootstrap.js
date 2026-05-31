'use strict';
if('scrollRestoration' in history) history.scrollRestoration='manual';
function resetPageScroll(){window.scrollTo(0,0);document.querySelector('.page')?.scrollTo(0,0)}
window.addEventListener('pageshow',()=>{[0,80,250,600].forEach(t=>setTimeout(resetPageScroll,t));});
let files=[];
let targetKB=200;
let compressMode='exact';
let outputFmt='same';
let minQFloor=10;

let toastT;
function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('show'),2800);}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const MAX_FILES = 75;
const MAX_SINGLE_FILE_BYTES = 60 * 1024 * 1024;
const MAX_BATCH_BYTES = 500 * 1024 * 1024;
