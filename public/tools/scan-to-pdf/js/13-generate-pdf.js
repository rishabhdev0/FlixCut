// ── GENERATE PDF ──────────────────────────────────────────
document.getElementById('btn-generate').addEventListener('click',generatePdf);

async function generatePdf(){
  if(!pages.length)return;
  const overlay=document.getElementById('proc-overlay');
  const msg=document.getElementById('proc-msg');
  const bar=document.getElementById('proc-bar');
  overlay.classList.add('show');bar.style.width='0%';

  try{
    const{PDFDocument,StandardFonts,rgb}=PDFLib;
    const doc=await PDFDocument.create();
    const font=addPageNums?await doc.embedFont(StandardFonts.Helvetica):null;

    for(let i=0;i<pages.length;i++){
      const pg=pages[i];
      msg.textContent=`Processing page ${i+1} of ${pages.length}...`;
      bar.style.width=Math.round(((i+0.5)/pages.length)*90)+'%';

      // Get image dimensions
      const dims=await getImgDims(pg.processedUrl);

      // Calculate page size
      let[pgW,pgH]=pageSize==='fit'?[dims.w*.75,dims.h*.75]:(PAGE_SIZES[pageSize]||PAGE_SIZES['A4']);
      const autoL=orientation==='auto'&&dims.w>dims.h;
      if(orientation==='landscape'||autoL)[pgW,pgH]=[pgH,pgW];

      const pdfPage=doc.addPage([pgW,pgH]);

      // Embed image
      const ab=await imageUrlToJpegAb(pg.processedUrl,quality);
      const embed=await doc.embedJpg(ab);

      const scale=Math.min(pgW/embed.width,pgH/embed.height);
      const w=embed.width*scale,h=embed.height*scale;
      pdfPage.drawImage(embed,{x:(pgW-w)/2,y:(pgH-h)/2,width:w,height:h});

      // Page numbers
      if(addPageNums&&font){
        const txt=`${i+1} / ${pages.length}`;
        const tw=font.widthOfTextAtSize(txt,9);
        pdfPage.drawText(txt,{x:(pgW-tw)/2,y:14,size:9,font,color:rgb(.5,.5,.5),opacity:.7});
      }
    }

    doc.setTitle(document.getElementById('out-name').value.trim()||'PixCut Scan');
    doc.setCreator('PixCut');doc.setProducer('PixCut Scanner');doc.setCreationDate(new Date());
    bar.style.width='95%';msg.textContent='Saving PDF...';
    const bytes=await doc.save({useObjectStreams:true});
    bar.style.width='100%';

    const fname=(document.getElementById('out-name').value.trim()||'pixcut-scan')+'.pdf';
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
    a.download=fname;a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),8000);
    toast(`PDF saved — ${pages.length} page${pages.length!==1?'s':''} ✓`);
  }catch(err){
    console.error(err);
    msg.textContent='Error: '+err.message;
    toast('Error: '+err.message);
    setTimeout(()=>overlay.classList.remove('show'),3000);
    return;
  }
  overlay.classList.remove('show');
}

function getImgDims(url){
  return new Promise(res=>{const i=new Image();i.onload=()=>res({w:i.naturalWidth,h:i.naturalHeight});i.src=url;});
}
function imageUrlToJpegAb(url,q){
  return new Promise((res,rej)=>{
    const img=new Image();
    img.onload=()=>{
      const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
      c.getContext('2d').drawImage(img,0,0);
      c.toBlob(b=>b?b.arrayBuffer().then(res):rej(new Error('Image encode failed')),'image/jpeg',q);
    };
    img.onerror=rej;img.src=url;
  });
}
function applySharpness(ctx,w,h,amount){
  if(!amount||amount<=0||w<3||h<3)return;
  const strength=Math.min(1,amount/100);
  const src=ctx.getImageData(0,0,w,h),dst=ctx.createImageData(w,h);
  const s=src.data,d=dst.data,center=1+strength*4,side=-strength;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const i=(y*w+x)*4;
    if(x===0||y===0||x===w-1||y===h-1){d[i]=s[i];d[i+1]=s[i+1];d[i+2]=s[i+2];d[i+3]=s[i+3];continue;}
    const up=i-w*4,down=i+w*4,left=i-4,right=i+4;
    for(let c=0;c<3;c++)d[i+c]=Math.max(0,Math.min(255,s[i+c]*center+s[up+c]*side+s[down+c]*side+s[left+c]*side+s[right+c]*side));
    d[i+3]=s[i+3];
  }
  ctx.putImageData(dst,0,0);
}
function base64ToAb(b64){
  const bin=atob(b64);const ab=new ArrayBuffer(bin.length);const view=new Uint8Array(ab);
  for(let i=0;i<bin.length;i++)view[i]=bin.charCodeAt(i);return ab;
}
