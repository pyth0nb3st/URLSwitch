#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get version type from arguments: major, minor, or patch
const versionType = process.argv[2] || 'patch';
if (!['major', 'minor', 'patch'].includes(versionType)) {
  console.error('Error: Version type must be one of: major, minor, patch');
  process.exit(1);
}

// Read manifest.json
const manifestPath = path.join(__dirname, 'src', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Get current version
const currentVersion = manifest.version;
console.log(`Current version: ${currentVersion}`);

// Split version into components
const [major, minor, patch] = currentVersion.split('.').map(Number);

// Calculate new version
let newVersion;
if (versionType === 'major') {
  newVersion = `${major + 1}.0.0`;
} else if (versionType === 'minor') {
  newVersion = `${major}.${minor + 1}.0`;
} else {
  newVersion = `${major}.${minor}.${patch + 1}`;
}

console.log(`New version: ${newVersion}`);

// Update manifest.json
manifest.version = newVersion;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 4));

// Commit changes
try {
  console.log('Committing version changes...');
  execSync('git add src/manifest.json');
  execSync(`git commit -m "Bump version to ${newVersion}"`);
  
  // Create and push tag
  console.log(`Creating tag v${newVersion}...`);
  execSync(`git tag -a v${newVersion} -m "Version ${newVersion}"`);
  
  console.log('Pushing changes and tags...');
  execSync('git push');
  execSync('git push --tags');
  
  console.log('\nVersion update complete!');
  console.log(`Version bumped from ${currentVersion} to ${newVersion}`);
  console.log(`Tag v${newVersion} created and pushed`);
  console.log('The CI/CD pipeline will automatically create a new release with build artifacts.');
} catch (error) {
  console.error('Error during git operations:', error.message);
  process.exit(1);
} 