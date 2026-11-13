import fs from 'fs';
import { execSync } from 'child_process';

const orig = fs.readFileSync('scripts/pristine_app.js', 'utf8');

console.log('Original pristine app size:', orig.length);

// 1. Language fix
const oldAy = 'async function Ay(t){if(await Dbt(t)){Vb();const u=new URL(location.href);u.searchParams.set("lang",t);location.href=u.toString();return!0}return!1}';
const newAy = 'async function Ay(t){if(await Dbt(t)){Vb();const u=new URL(location.href);u.searchParams.set("lang",t);location.href=u.toString();setTimeout(()=>location.reload(),10);return!0}return!1}';

let code = orig.replace(oldAy, newAy);
if (code === orig) throw new Error('Could not find Ay in pristine file');
console.log('1. Language fix applied.');

// 2. oHt bridge
const oHtHookTarget = 'function oHt(){let t={stage:void 0,afterPick:null},e={},n={S:t,A:e},o=document.getElementById("app");';
const oHtHookRepl = `function oHt(){let t={stage:void 0,afterPick:null},e={},n={S:t,A:e},o=document.getElementById("app");
  window._devstuApp = e;
  window._devstuAddFiles = async function(files, select) { return await e.addFiles(files, select !== false); };
  window._devstuA = A;
  window._devstuSelectPhoto = function(id) { A.select(id); };
  window._devstuGetBitmap = _T;`;
code = code.replace(oHtHookTarget, oHtHookRepl);
console.log('2. oHt bridge attached.');

// 3. pl tabs
const plTarget = '{id:"retouch",label:a("tab::Retouch"),icon:D.face},{id:"matna",label:a("Mặt nạ"),icon:D.stack}';
const plRepl = '{id:"retouch",label:a("tab::Retouch"),icon:D.face},{id:"phongnen",label:a("Phông nền"),icon:D.image},{id:"crop",label:a("Cắt & Xoay"),icon:D.crop},{id:"matna",label:a("Mặt nạ"),icon:D.stack}';
code = code.replace(plTarget, plRepl);
console.log('3. pl tabs added (phongnen, crop).');

// 4. Hair card
const hairCardTarget = 'g.id==="hair"&&A.current&&b.append(e.hairTools(A.current)),';
const hairCardRepl = 'g.id==="hair"&&A.current&&b.append(e.hairTools(A.current), createProHairTools(e)),';
code = code.replace(hairCardTarget, hairCardRepl);
console.log('4. createProHairTools hooked into hair card.');

// 5. Mount Collabs tabs
const rebuildMountTarget = 'A.mode==="simple"?t.buildSimple():t.buildFull(),t.applyTabs(),e.append(r)';
const rebuildMountRepl = 'A.mode==="simple"?t.buildSimple():t.buildFull(),(function(){ try { var bg=createCollabsBgTab(t); bg.dataset.mt="phongnen"; e.append(bg); var cr=createCollabsCropTab(t); cr.dataset.mt="crop"; e.append(cr); } catch(err){console.error("Collabs mount error:", err);} })(),t.applyTabs(),e.append(r)';
code = code.replace(rebuildMountTarget, rebuildMountRepl);
console.log('5. Collabs tabs mounted inside panel.');

// 6. Tab isolation click handler
const qutClickTarget = 'onclick:()=>{Wu()?it("rail-jump",i.id):i.id===_p&&Dc&&!or()?Ip(!1):as(i.id)}';
const qutClickRepl = 'onclick:()=>{if(i.id==="crop"||i.id==="phongnen"){if(A.mode==="simple")A.setMode("full");as(i.id);return;}if(_p==="crop"||_p==="phongnen"){as(i.id);return;}Wu()?it("rail-jump",i.id):i.id===_p&&Dc&&!or()?Ip(!1):as(i.id)}';
code = code.replace(qutClickTarget, qutClickRepl);
console.log('6. Qut rail click handler updated for strict tab isolation.');

// 7. Scroll spy M()
const mSpyTarget = 'y=null,k=null,M=()=>{if(!Wu()||A.mode==="simple")return;let x=y??"goiy";if(!y){let S=e.getBoundingClientRect().top+60,w=-1/0;for(let P of pl){let C=P.id==="matna"?null:b(P.id)?.getBoundingClientRect().top;C!=null&&C<=S&&C>w&&(w=C,x=P.id)}}x!==k&&(k=x,it("rail-at",x))};';
const mSpyRepl = 'y=null,k=null,M=()=>{if(!Wu()||A.mode==="simple")return;if(_p==="phongnen"||_p==="crop"){it("rail-at",_p);return;}let x=y??"goiy";if(!y){let S=e.getBoundingClientRect().top+60,w=-1/0;for(let P of pl){if(P.id==="phongnen"||P.id==="crop")continue;let C=P.id==="matna"?null:b(P.id)?.getBoundingClientRect().top;C!=null&&C<=S&&C>w&&(w=C,x=P.id)}}x!==k&&(k=x,it("rail-at",x))};';
code = code.replace(mSpyTarget, mSpyRepl);
console.log('7. Scroll spy M() patched to prevent unwanted tab drifting.');

// 8. Mount Left Rail and Library Grid View in oHt()
const bodyMountTarget = 'let u=rmt(),m=d("main",{class:"body"},imt(),t.stage.root,u.el,u.panelEdge,l,h);e.body=m;';
const bodyMountRepl = 'let u=rmt(),m=d("main",{class:"body"},createCollabsLeftRail(e),imt(),t.stage.root,createCollabsLibraryGrid(e),u.el,u.panelEdge,l,h);e.body=m;';
code = code.replace(bodyMountTarget, bodyMountRepl);
console.log('8. createCollabsLeftRail and createCollabsLibraryGrid mounted in main.body.');

// 9. Mount Top Header "Thư viện ảnh" / "Tinh chỉnh" in X2t()
const headerMountTarget = 'b=d("header",{class:"hdr"},d("div",{class:"brand"},d("img",{class:"brand-ic",src:"icons/fr-logo-64.png",alt:"",width:"24",height:"24"}),d("b",null,"DEVSTU")),...[M0t()],l,o,d("span",{class:"spacer"})';
const headerMountRepl = 'b=d("header",{class:"hdr"},d("div",{class:"brand"},d("img",{class:"brand-ic",src:"icons/fr-logo-64.png",alt:"",width:"24",height:"24"}),d("b",null,"DEVSTU")),...[M0t()],l,createCollabsModeTabs(),o,d("span",{class:"spacer"})';
code = code.replace(headerMountTarget, headerMountRepl);
console.log('9. createCollabsModeTabs mounted in header.hdr.');

// 10. Load and insert complete bundle from scripts/collabs_complete_bundle.js
const collabsHelpersCode = fs.readFileSync('scripts/collabs_complete_bundle.js', 'utf8');

const hxtIdx = code.indexOf('function hxt(');
if (hxtIdx === -1) throw new Error('Could not find function hxt(');

code = code.slice(0, hxtIdx) + collabsHelpersCode + '\n' + code.slice(hxtIdx);
console.log('10. Collabs helper functions inserted before hxt.');

// Save new app file
fs.writeFileSync('assets/app-7UAGS7H2.js', code, 'utf8');
console.log('11. Saved assets/app-7UAGS7H2.js successfully. Final size:', code.length);

// Verify syntax
execSync('node -c assets/app-7UAGS7H2.js', { stdio: 'inherit' });
console.log('12. Syntax check passed 100%!');
