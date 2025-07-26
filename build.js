const fs = require('fs-extra');
const sass = require('sass');

// 1. Clean build dir
fs.emptyDirSync('build');

// 2. Copy ALL frontend files
fs.copySync('index.html', 'build/index.html');
fs.copySync('public', 'build/public');
fs.copySync('script.js', 'build/script.js');
fs.copySync('styles', 'build/styles');


// 4. Copy API routes (if exists)
if (fs.existsSync('pages/api')) {
  fs.copySync('pages/api', 'build/pages/api');
}

console.log('✅ Build complete!');