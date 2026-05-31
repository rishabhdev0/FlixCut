// ── STATE ─────────────────────────────────────────────────
let pages=[];         // {id, rawUrl, processedUrl, byteSize}
const MAX_FILES = 60;
const MAX_SINGLE_FILE_BYTES = 60 * 1024 * 1024;
const MAX_BATCH_BYTES = 500 * 1024 * 1024;
let activeTab='upload';
let cameraStream=null;
let facingMode='environment';
let cropState=null;
let scanFilter='original';
let brightness=100,contrast=120,sharpness=20;
let applyToAll=true;
let pageSize='A4',orientation='portrait',quality=0.88;
let addPageNums=false;
const PAGE_SIZES={'A4':[595.28,841.89],'Letter':[612,792]};
