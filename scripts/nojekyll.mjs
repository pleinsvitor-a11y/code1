// GitHub Pages runs Jekyll by default, which skips files and folders starting
// with an underscore. This empty marker turns that off.
import { writeFile } from 'node:fs/promises';
await writeFile('dist/.nojekyll', '');
console.log('wrote dist/.nojekyll');
