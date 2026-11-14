const fs = require('fs');
const js = fs.readFileSync('assets/app-7UAGS7H2.js', 'utf8');

let pos = 0;
while ((pos = js.indexOf('"shape"', pos)) !== -1) {
  console.log('pos:', pos, js.slice(Math.max(0, pos - 50), Math.min(js.length, pos + 150)));
  pos += 7;
}
