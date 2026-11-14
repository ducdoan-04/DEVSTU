// Test exposing window._devstuLt in app-7UAGS7H2.js
const fs = require('fs');
let js = fs.readFileSync('assets/app-7UAGS7H2.js', 'utf8');

// Expose Lt and qt on window
if (!js.includes('window._devstuLt = Lt')) {
  js = js.replace('function Lt(t, e = !1, n) {', 'window._devstuLt = Lt; function Lt(t, e = !1, n) {');
  console.log('Exposed window._devstuLt');
}

if (!js.includes('window._devstuQt = qt')) {
  js = js.replace('function qt(t, e, n, o = !1) {', 'window._devstuQt = qt; function qt(t, e, n, o = !1) {');
  console.log('Exposed window._devstuQt');
}

fs.writeFileSync('assets/app-7UAGS7H2.js', js, 'utf8');
