'use strict';
if('scrollRestoration' in history) history.scrollRestoration='manual';
function resetPageScroll(){window.scrollTo(0,0);document.querySelector('.page')?.scrollTo(0,0)}
window.addEventListener('pageshow',()=>{[0,80,250,600].forEach(t=>setTimeout(resetPageScroll,t));});
pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let files=[];
let level='ebook';
let stripMeta=true,removeAnn=false,recompImages=true,useObjStreams=true;
let imgQuality=0.72;

const LEVEL_CFG={
  screen: {imgQ:.42,maxDim:800,dpi:72},
  ebook:  {imgQ:.72,maxDim:1200,dpi:150},
  printer:{imgQ:.88,maxDim:2000,dpi:200},
  lossless:{imgQ:1,maxDim:9999,dpi:300}
};

let toastT;
function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>el.classList.remove('show'),2800);}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const MAX_FILES = 50;
const MAX_SINGLE_FILE_BYTES = 200 * 1024 * 1024;
const MAX_BATCH_BYTES = 700 * 1024 * 1024;
