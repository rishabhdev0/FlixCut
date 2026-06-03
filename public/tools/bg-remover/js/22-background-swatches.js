/* ── Background swatches ── */
document.querySelectorAll('.sw').forEach(s=>{
  s.addEventListener('click',()=>{
    document.querySelectorAll('.sw').forEach(x=>x.classList.remove('on'));
    s.classList.add('on');
    bgImg=null; bgColor=s.dataset.bg;
    drawBg(); renderResult();
  });
});
document.getElementById('bg-img-btn').addEventListener('click',()=>document.getElementById('bg-img-input').click());
document.getElementById('bg-img-input').addEventListener('change',function(){
  const f=this.files[0];if(!f)return;
  const result=window.PixCutSecurity.validateFiles([f],{kinds:['image'],maxFiles:1});
  if(!result.allowed.length){window.PixCutSecurity.showValidationResult(result,{fallback:'Background image too large or unsupported.'});return;}
  const img=new Image();
  const url=URL.createObjectURL(f);
  img.onload=()=>{URL.revokeObjectURL(url);bgImg=img;bgColor='custom';document.querySelectorAll('.sw').forEach(x=>x.classList.remove('on'));drawBg();renderResult();};
  img.onerror=()=>{URL.revokeObjectURL(url);toast('Could not load background image');};
  img.src=url;
});
