import cpy from 'cpy';
import fs from 'fs';

if (!fs.existsSync('build')) fs.mkdirSync('build');

await cpy(['index.html', 'script.js', 'styles/**/*', 'assets/**/*'], 'build', {
  parents: true
});
console.log('Files copied!');