// ── METHOD TABS ───────────────────────────────────────────
document.querySelectorAll('.mtab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.mtab').forEach(t=>t.classList.remove('on'));
    tab.classList.add('on');
    activeTab=tab.dataset.tab;
    if(activeTab==='camera'){
      document.getElementById('camera-section').style.display='block';
      document.getElementById('upload-section').style.display='none';
      startCamera();
    } else {
      document.getElementById('camera-section').style.display='none';
      document.getElementById('upload-section').style.display='block';
      stopCamera();
    }
  });
});
