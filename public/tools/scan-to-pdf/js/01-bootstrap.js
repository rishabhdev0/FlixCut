'use strict';
if('scrollRestoration' in history) history.scrollRestoration='manual';
function resetPageScroll(){window.scrollTo(0,0);document.querySelector('.page')?.scrollTo(0,0)}
window.addEventListener('pageshow',()=>{[0,80,250,600].forEach(t=>setTimeout(resetPageScroll,t));});
if(window.lucide)lucide.createIcons();
