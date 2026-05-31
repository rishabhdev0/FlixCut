/* ── State ── */
let imgW=0, imgH=0, originalPixels=null, mask=null;
let bgColor='transparent', bgImg=null;
let currentTool='ai', viewMode='result', zoom=1;
let undoStack=[], redoStack=[];
let painting=false, panning=false;
let panStart={x:0,y:0}, scrollStart={x:0,y:0};
let rafId=null, pendingBrushPoints=[];
let brushSize=24, brushHardness=75, brushOpacity=100;
let wandTolerance=35, wandFeather=1;
let bwMode=false, brightness=100, contrastAdj=100, saturation=100, sharpness=0, subjectOpacity=100;
let currentRatio='original', selectedSize='original', selectedFmt='png';
let canvasW=0, canvasH=0, imageX=0, imageY=0;
let cropRect={x:0,y:0,w:0,h:0}, cropDragging=false, cropHandle=null, cropStart={};
let cancelled=false;
let compareActive=false, comparePct=50, cmpDragging=false;

const compHandle = document.getElementById('compare-handle');
const lblBefore  = document.getElementById('lbl-before');
const lblAfter   = document.getElementById('lbl-after');
