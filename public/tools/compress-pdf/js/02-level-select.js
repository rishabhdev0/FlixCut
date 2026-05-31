// Level select
document.querySelectorAll('.lv').forEach(c=>{
  c.addEventListener('click',()=>{
    document.querySelectorAll('.lv').forEach(x=>x.classList.remove('on'));
    c.classList.add('on');level=c.dataset.lv;
    const cfg=LEVEL_CFG[level];
    imgQuality=cfg.imgQ;
    document.getElementById('sl-iq').value=Math.round(cfg.imgQ*100);
    document.getElementById('iq-v').textContent=Math.round(cfg.imgQ*100)+'%';
    document.getElementById('img-qual-row').style.opacity=level==='lossless'?.4:1;
  });
});
