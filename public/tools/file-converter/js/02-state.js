// ─── STATE ─────────────────────────────────
let files=[];
let dragSrcIdx=null;
let convMode='img-to-img';
let outputFmt='png';
let pdfPageSize='A4',pdfOrient='portrait',pdfImgFmt='png',pdfScale=2;
let onePdfPerImg=false;
let quality=0.92;
let doResize=false,keepAspect=true,maxW=0,maxH=0;
let activeFilter='normal';
let brightness=100,contrast=100,saturation=100,sharpness=0;
let rotation=0,flipH=false;
let stripExif=true;
let addWm=false,wmText='CONFIDENTIAL',wmOpacity=.2,wmSize=.14,wmPos='cc';
let doRename=false,rnPrefix='',rnSuffix='',rnNum=true;
let totalOutputSize=0;
const PAGE_SIZES={'A4':[595.28,841.89],'Letter':[612,792],'A3':[841.89,1190.55],'fit':null};
