import fs from 'fs';
const css = fs.readFileSync('F:/Workspace/Code projects/2. Tool Media by Doan/Collabs-Retouch-Pro/src/style.css', 'utf8');

const sTabs = css.indexOf('.evoto-mode-tabs');
const eTabs = css.indexOf('.retouch-header-right');
const tabsCss = css.slice(sTabs, eTabs);

const sDock = css.indexOf('/* Left Dock & Floating Preset Drawer */') !== -1 ? css.indexOf('/* Left Dock & Floating Preset Drawer */') : css.indexOf('.left-dock-container');
const eDock = css.indexOf('/* Stage Viewport */');
const dockAndGridCss = css.slice(sDock, eDock);

console.log('tabsCss len:', tabsCss.length);
console.log('dockAndGridCss len:', dockAndGridCss.length);

fs.writeFileSync('scripts/extracted_left_and_grid.css', tabsCss + '\n\n' + dockAndGridCss);
console.log('Extracted successfully!');

