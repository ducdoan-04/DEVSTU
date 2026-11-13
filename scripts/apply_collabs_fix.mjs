import fs from 'fs';

console.log('--- APPLYING COLLABS RETOUCH FIX ---');

// 1. Update JS
const jsPath = 'assets/app-7UAGS7H2.js';
const js = fs.readFileSync(jsPath, 'utf8');

const pHist = js.indexOf('function createCollabsHistogram');
const pHair = js.indexOf('function createProHairTools');

if (pHist === -1 || pHair === -1) {
  throw new Error(`Could not find markers in JS: pHist=${pHist}, pHair=${pHair}`);
}

const newBlock = fs.readFileSync('scripts/new_collabs_block.js', 'utf8');

const updatedJs = js.slice(0, pHist) + newBlock + '\n\n' + js.slice(pHair);

// Validate complete JS syntax
console.log('Validating full app JS bundle syntax...');
try {
  new Function('async () => {' + updatedJs + '}');
  console.log('Full app JS bundle syntax is 100% valid!');
} catch (err) {
  console.error('JS Syntax validation failed:', err);
  process.exit(1);
}

// Backup JS and write
fs.writeFileSync('assets/app-7UAGS7H2.js.bak', js);
fs.writeFileSync(jsPath, updatedJs);
console.log('Updated app-7UAGS7H2.js successfully!');

// 2. Update CSS
const cssPath = 'assets/app-F7QCZXV2.css';
const css = fs.readFileSync(cssPath, 'utf8');

const pMarker = css.indexOf('/* =========================================================');
if (pMarker === -1) {
  throw new Error('Could not find CSS marker /* =========================================================');
}

const newCss = fs.readFileSync('scripts/collabs_complete_styles.css', 'utf8');

const updatedCss = css.slice(0, pMarker) + newCss;

// Backup CSS and write
fs.writeFileSync('assets/app-F7QCZXV2.css.bak', css);
fs.writeFileSync(cssPath, updatedCss);
console.log('Updated app-F7QCZXV2.css successfully!');
console.log('--- ALL UPDATES APPLIED CLEANLY ---');
