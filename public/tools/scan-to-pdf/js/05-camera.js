// ── CAMERA ────────────────────────────────────────────────
async function startCamera(){
  if(cameraStream)return;
  try{
    cameraStream=await navigator.mediaDevices.getUserMedia({
      video:{facingMode,width:{ideal:1920},height:{ideal:1080}}
    });
    document.getElementById('video').srcObject=cameraStream;
    document.getElementById('cam-counter').style.display='block';
    updateCamCounter();
    toast('Camera ready — position document and capture');
  }catch(e){
    toast('Camera not available — switching to upload');
    document.getElementById('mtab-upload').click();
  }
}

function stopCamera(){
  if(cameraStream){cameraStream.getTracks().forEach(t=>t.stop());cameraStream=null;}
  document.getElementById('cam-counter').style.display='none';
}

function updateCamCounter(){
  document.getElementById('cam-counter').textContent=pages.length+' page'+(pages.length!==1?'s':'');
}

document.getElementById('cam-flip').addEventListener('click',async()=>{
  facingMode=facingMode==='environment'?'user':'environment';
  if(cameraStream){cameraStream.getTracks().forEach(t=>t.stop());cameraStream=null;}
  await startCamera();
  toast('Camera flipped');
});

document.getElementById('cam-stop').addEventListener('click',()=>{
  stopCamera();
  document.getElementById('mtab-upload').click();
});

document.getElementById('cam-capture').addEventListener('click',capturePhoto);

async function capturePhoto(){
  const video=document.getElementById('video');
  if(!video.videoWidth){toast('Camera not ready yet');return;}
  // Flash animation
  const flash=document.getElementById('cam-flash');
  flash.classList.add('flash');
  setTimeout(()=>flash.classList.remove('flash'),200);
  const c=document.createElement('canvas');
  c.width=video.videoWidth;c.height=video.videoHeight;
  c.getContext('2d').drawImage(video,0,0);
  const rawUrl=c.toDataURL('image/jpeg',0.95);
  const croppedUrl=await openCameraCrop(rawUrl);
  if(!croppedUrl){toast('Retake when ready');return;}
  const processedUrl=await applyFilter(croppedUrl);
  addPage(croppedUrl,processedUrl);
  updateCamCounter();
  toast(`Page ${pages.length} captured ✓`);
}
