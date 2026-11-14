import fs from 'fs';

const appPath = 'assets/app-7UAGS7H2.js';
let appCode = fs.readFileSync(appPath, 'utf8');

// Find the target in Owt()
const needle = 'if(v.checkBlank=k,v.present=m,fxt(x),Awt(x),Cwt(x),Twt(x),Lwt(x),Fwt(x),_wt(x),Dwt(x),window.FotoretoFiles)try{localStorage.getItem("ftr.probe")==="1"&&u.enableEarlyProbe()}catch{}return{root:v.root,autoCard:v.autoCard,tools:v.toolbar,gpuReady:v.gpuReady,toolCards:[v.heal.card,v.brush.card,v.legs.card,v.crop.card]}';

console.log('App needle found:', appCode.includes(needle));

if (appCode.includes(needle)) {
  const replacement = `if(v.checkBlank=k,v.present=m,fxt(x),Awt(x),Cwt(x),Twt(x),Lwt(x),Fwt(x),_wt(x),Dwt(x),window.FotoretoFiles)try{localStorage.getItem("ftr.probe")==="1"&&u.enableEarlyProbe()}catch{}
window._devstuStageInternal = v;
window._devstuViewer = u;
window._devstuReloadPhoto = async function(P) {
  P = P || (window._devstuA ? window._devstuA.current : null);
  if (!P) return;
  if (u) {
    try { u.forget(); } catch(err) {}
    try { if (u.pre) u.pre.delete(P.id); } catch(err) {}
  }
  if (v && typeof v.loadPhoto === 'function') {
    try { v.loadPhoto(P); } catch(err) { console.warn('[DEVSTU] stage.loadPhoto error:', err); }
    try { if (typeof v.requestRender === 'function') v.requestRender(); } catch(err) {}
    try { if (typeof v.layout === 'function') v.layout(); } catch(err) {}
  }
  if (window._devstuA) {
    try { window._devstuA.emit('photos'); } catch(err) {}
    try { window._devstuA.emit('current'); } catch(err) {}
    try { window._devstuA.emit('state'); } catch(err) {}
    try { window._devstuA.emit('thumbs'); } catch(err) {}
  }
};
return{
  root:v.root,
  autoCard:v.autoCard,
  tools:v.toolbar,
  gpuReady:v.gpuReady,
  toolCards:[v.heal.card,v.brush.card,v.legs.card,v.crop.card],
  loadPhoto:function(P){return window._devstuReloadPhoto(P);},
  requestRender:function(){if(v&&typeof v.requestRender==='function')v.requestRender();},
  layout:function(){if(v&&typeof v.layout==='function')v.layout();},
  stageInternal:v,
  viewerInternal:u
}`;

  appCode = appCode.replace(needle, replacement);
  fs.writeFileSync(appPath, appCode, 'utf8');
  console.log('Successfully updated assets/app-7UAGS7H2.js with window._devstuReloadPhoto and loadPhoto!');
} else {
  console.error('Needle not found in assets/app-7UAGS7H2.js');
}
