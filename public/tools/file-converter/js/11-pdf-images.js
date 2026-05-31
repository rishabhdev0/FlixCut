// ─── PDF → IMAGES ────────────────────────────
async function doPdfToImg(i){
  const item=files[i];
  const ab=await item.file.arrayBuffer();
  const pdfJsDoc=await pdfjsLib.getDocument({data:new Uint8Array(ab),verbosity:0}).promise;
  const total=pdfJsDoc.numPages;
  const fromPg=parseInt(document.getElementById('pdf-pg-from').value)||1;
  const toPg=Math.min(parseInt(document.getElementById('pdf-pg-to').value)||total,total);
  const converted=[];let totalOut=0;
  for(let p=fromPg;p<=toPg;p++){
    const page=await pdfJsDoc.getPage(p);
    const vp=page.getViewport({scale:pdfScale});
    const c=document.createElement('canvas');c.width=Math.round(vp.width);c.height=Math.round(vp.height);
    await page.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;
    const outCanvas=processCanvas(c,pdfImgFmt==='jpeg');
    const mime=pdfImgFmt==='jpeg'?'image/jpeg':'image/png';
    const blob=await c2Blob(outCanvas,mime,quality);
    totalOut+=blob.size;
    const ext=pdfImgFmt==='jpeg'?'jpg':'png';
    converted.push({blob,name:buildName(item,p-1,`_p${String(p).padStart(3,'0')}`,ext)});
  }
  item.converted=converted;item.outSize=totalOut;
}
