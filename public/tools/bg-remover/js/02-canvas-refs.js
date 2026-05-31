/* ── Canvas refs ── */
const bgCvs   = document.getElementById('bg-cvs');
const origCvs = document.getElementById('orig-cvs');
const resCvs  = document.getElementById('result-cvs');
const cropCvs = document.getElementById('crop-cvs');
const hitCvs  = document.getElementById('hit-cvs');
const bgCtx   = bgCvs.getContext('2d');
const origCtx = origCvs.getContext('2d');
const resCtx  = resCvs.getContext('2d', {willReadFrequently:true});
const cropCtx = cropCvs.getContext('2d');
const CC      = document.getElementById('c-container');
const CS      = document.getElementById('c-stack');
