const fs = require('fs');
const html = fs.readFileSync('F:/Workspace/Code projects/2. Tool Media by Doan/Collabs-Retouch-Pro/index.html', 'utf8');

const railMatch = html.match(/<nav[^>]*class="[^"]*retouch-right-rail[^"]*"[^>]*>[\s\S]*?<\/nav>/);
if (railMatch) {
  console.log('Rail HTML length:', railMatch[0].length);
  fs.writeFileSync('scripts/collabs_rail.html', railMatch[0]);
}

const inspectorMatch = html.match(/<aside[^>]*class="[^"]*retouch-right-inspector[^"]*"[^>]*>[\s\S]*?<\/aside>/);
if (inspectorMatch) {
  console.log('Inspector HTML length:', inspectorMatch[0].length);
  fs.writeFileSync('scripts/collabs_inspector.html', inspectorMatch[0]);
}
