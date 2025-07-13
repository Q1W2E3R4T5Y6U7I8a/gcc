// build.js
const fs = require('fs-extra');

console.log('Building static files...');

fs.emptyDirSync('build');
fs.copySync('index.html', 'build/index.html');
fs.copySync('styles', 'build/styles');
fs.copySync('script/index.js', 'build/index.js');
fs.copySync('assets', 'build/assets');

console.log('Build complete.');
