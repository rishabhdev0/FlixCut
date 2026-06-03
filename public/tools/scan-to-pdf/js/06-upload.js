// ── UPLOAD ────────────────────────────────────────────────
function openCameraCrop(rawUrl){
  return new Promise(resolve=>{
    const modal=document.getElementById('crop-modal');
    const canvas=document.getElementById('crop-canvas');
    const ctx=canvas.getContext('2d');
    const img=new Image();
    let done=false;

    function finish(value){
      if(done)return;
      done=true;
      modal.classList.remove('show');
      cropState=null;
      window.removeEventListener('resize',layoutCrop);
      window.removeEventListener('pointermove',onMove);
      resolve(value);
    }

    function layoutCrop(){
      if(!cropState?.img)return;
      const maxW=Math.min(900,Math.max(280,window.innerWidth-64));
      const maxH=Math.min(Math.max(260,window.innerHeight*.62),680);
      const scale=Math.min(maxW/img.naturalWidth,maxH/img.naturalHeight,1);
      canvas.width=Math.round(img.naturalWidth*scale);
      canvas.height=Math.round(img.naturalHeight*scale);
      const pad=Math.round(Math.min(canvas.width,canvas.height)*.08);
      cropState.crop={x:pad,y:pad,w:canvas.width-pad*2,h:canvas.height-pad*2};
      drawCrop();
    }

    function drawCrop(){
      const s=cropState;if(!s)return;
      const c=s.crop;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(s.img,0,0,canvas.width,canvas.height);
      ctx.fillStyle='rgba(0,0,0,.48)';
      ctx.fillRect(0,0,canvas.width,c.y);
      ctx.fillRect(0,c.y,c.x,c.h);
      ctx.fillRect(c.x+c.w,c.y,canvas.width-c.x-c.w,c.h);
      ctx.fillRect(0,c.y+c.h,canvas.width,canvas.height-c.y-c.h);
      ctx.strokeStyle='#50c7e8';
      ctx.lineWidth=4;
      ctx.setLineDash([]);
      ctx.strokeRect(c.x,c.y,c.w,c.h);
      ctx.strokeStyle='#fffef9';
      ctx.lineWidth=1.5;
      ctx.setLineDash([8,6]);
      ctx.strokeRect(c.x+7,c.y+7,Math.max(0,c.w-14),Math.max(0,c.h-14));
      ctx.setLineDash([]);
      ctx.fillStyle='#ffde59';
      [[c.x,c.y],[c.x+c.w,c.y],[c.x,c.y+c.h],[c.x+c.w,c.y+c.h]].forEach(([x,y])=>{
        ctx.beginPath();ctx.arc(x,y,8,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='#181818';ctx.lineWidth=2;ctx.stroke();
      });
    }

    function hitCrop(x,y){
      const c=cropState.crop,tol=18;
      const left=Math.abs(x-c.x)<tol,right=Math.abs(x-(c.x+c.w))<tol;
      const top=Math.abs(y-c.y)<tol,bottom=Math.abs(y-(c.y+c.h))<tol;
      if(left&&top)return'nw';if(right&&top)return'ne';if(left&&bottom)return'sw';if(right&&bottom)return'se';
      if(top&&x>c.x&&x<c.x+c.w)return'n';if(bottom&&x>c.x&&x<c.x+c.w)return's';
      if(left&&y>c.y&&y<c.y+c.h)return'w';if(right&&y>c.y&&y<c.y+c.h)return'e';
      if(x>c.x&&x<c.x+c.w&&y>c.y&&y<c.y+c.h)return'move';
      return'new';
    }

    function point(e){
      const r=canvas.getBoundingClientRect();
      return{x:(e.clientX-r.left)*(canvas.width/r.width),y:(e.clientY-r.top)*(canvas.height/r.height)};
    }

    function onDown(e){
      e.preventDefault();
      const p=point(e);
      cropState.drag={mode:hitCrop(p.x,p.y),sx:p.x,sy:p.y,start:{...cropState.crop}};
      if(cropState.drag.mode==='new'){
        cropState.crop={x:p.x,y:p.y,w:1,h:1};
        cropState.drag={mode:'se',sx:p.x,sy:p.y,start:{...cropState.crop}};
      }
      window.addEventListener('pointermove',onMove);
      window.addEventListener('pointerup',onUp,{once:true});
    }

    function onMove(e){
      if(!cropState?.drag)return;
      e.preventDefault();
      const p=point(e),d=cropState.drag,st=d.start;
      let{x,y,w,h}=st;
      const dx=p.x-d.sx,dy=p.y-d.sy,min=50;
      if(d.mode==='move'){x=st.x+dx;y=st.y+dy;}
      if(d.mode.includes('e'))w=st.w+dx;
      if(d.mode.includes('s'))h=st.h+dy;
      if(d.mode.includes('w')){x=st.x+dx;w=st.w-dx;}
      if(d.mode.includes('n')){y=st.y+dy;h=st.h-dy;}
      if(w<min){if(d.mode.includes('w'))x=x+w-min;w=min;}
      if(h<min){if(d.mode.includes('n'))y=y+h-min;h=min;}
      x=Math.max(0,Math.min(canvas.width-min,x));
      y=Math.max(0,Math.min(canvas.height-min,y));
      w=Math.min(w,canvas.width-x);
      h=Math.min(h,canvas.height-y);
      cropState.crop={x,y,w,h};
      drawCrop();
    }

    function onUp(){
      window.removeEventListener('pointermove',onMove);
      if(cropState)cropState.drag=null;
    }

    function makeCroppedUrl(){
      const s=cropState,c=s.crop;
      const sx=Math.round(c.x*(s.img.naturalWidth/canvas.width));
      const sy=Math.round(c.y*(s.img.naturalHeight/canvas.height));
      const sw=Math.round(c.w*(s.img.naturalWidth/canvas.width));
      const sh=Math.round(c.h*(s.img.naturalHeight/canvas.height));
      const out=document.createElement('canvas');
      out.width=Math.max(1,sw);out.height=Math.max(1,sh);
      out.getContext('2d').drawImage(s.img,sx,sy,sw,sh,0,0,out.width,out.height);
      return out.toDataURL('image/jpeg',0.95);
    }

    img.onload=()=>{
      cropState={img,ctx,canvas,crop:null,drag:null};
      modal.classList.add('show');
      layoutCrop();
      window.addEventListener('resize',layoutCrop);
    };
    img.onerror=()=>finish(rawUrl);
    img.src=rawUrl;

    canvas.onpointerdown=onDown;
    document.getElementById('crop-apply').onclick=()=>finish(makeCroppedUrl());
    document.getElementById('crop-full').onclick=()=>finish(rawUrl);
    document.getElementById('crop-cancel').onclick=()=>finish(null);
    document.getElementById('crop-retake').onclick=()=>finish(null);
  });
}

const dz=document.getElementById('drop-zone');
document.getElementById('file-input').addEventListener('change',e=>handleFiles(e.target.files));
document.getElementById('add-more-input').addEventListener('change',e=>handleFiles(e.target.files));
dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('dov');});
dz.addEventListener('dragleave',()=>dz.classList.remove('dov'));
dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('dov');handleFiles(e.dataTransfer.files);});

document.getElementById('btn-add-more').addEventListener('click',()=>{
  const inp=document.createElement('input');
  inp.type='file';inp.accept='image/jpeg,image/png,image/webp,image/gif,image/bmp,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.gif,.bmp,.heic,.heif';inp.multiple=true;
  inp.onchange=e=>handleFiles(e.target.files);inp.click();
});
