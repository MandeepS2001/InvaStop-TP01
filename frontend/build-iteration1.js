#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Copy iteration1-deployment build files to the main build directory
const sourceDir = path.join(__dirname, '..', 'iteration1-deployment', 'frontend', 'build');
const targetDir = path.join(__dirname, 'build', 'iteration1');

console.log('Copying iteration1-deployment build files...');
console.log('Source:', sourceDir);
console.log('Target:', targetDir);

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy all files from source to target
function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const files = fs.readdirSync(src);
    files.forEach(file => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  copyRecursive(sourceDir, targetDir);
  console.log('✅ Successfully copied iteration1-deployment build files');
} catch (error) {
  console.error('❌ Error copying files:', error);
  process.exit(1);
}
