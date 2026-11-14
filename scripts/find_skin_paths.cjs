const fs = require('fs');
const js = fs.readFileSync('assets/app-7UAGS7H2.js', 'utf8');

const idx = js.indexOf('function Lt(');
console.log('function Lt idx:', idx);
console.log(js.slice(idx - 50, idx + 200));
