import { copyFileSync, mkdirSync, existsSync, rmSync } from 'fs';
import { resolve, dirname } from 'path';

const sourceDir = resolve('./icons');
const destDir = resolve('./dist/icons');

// Create destination directory if it doesn't exist
if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true });
}

// Copy icon files
const iconFiles = ['icon16.png', 'icon48.png', 'icon128.png'];
for (const file of iconFiles) {
  const sourcePath = resolve(sourceDir, file);
  const destPath = resolve(destDir, file);
  
  try {
    copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to ${destDir}`);
  } catch (error) {
    console.error(`Error copying ${file}: ${error.message}`);
  }
}

// Copy manifest to dist
const manifestSource = resolve('./src/manifest.json');
const manifestDest = resolve('./dist/manifest.json');

try {
  copyFileSync(manifestSource, manifestDest);
  console.log(`Copied manifest.json to dist/`);
} catch (error) {
  console.error(`Error copying manifest.json: ${error.message}`);
}

// Clean up unnecessary files
try {
  // Remove the src directory from dist since we've copied the HTML files
  // to the correct locations with the Vite plugin
  console.log('Cleaning up unnecessary files...');
  
  // Only remove if the directories exist and have been properly moved
  if (existsSync('./dist/popup/index.html') && existsSync('./dist/options/index.html')) {
    rmSync('./dist/src', { recursive: true, force: true });
    console.log('Removed redundant src directory from dist');
  } else {
    console.warn('HTML files not found in target locations, keeping src directory');
  }
} catch (error) {
  console.error(`Error cleaning up: ${error.message}`);
} 