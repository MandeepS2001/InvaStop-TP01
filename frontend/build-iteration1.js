#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Build iteration1-deployment frontend first, then copy to main build directory
const iteration1FrontendDir = path.join(__dirname, '..', 'iteration1-deployment', 'frontend');
const sourceDir = path.join(iteration1FrontendDir, 'build');
const targetDir = path.join(__dirname, 'build', 'iteration1');

console.log('Building iteration1-deployment frontend...');
console.log('Iteration1 frontend dir:', iteration1FrontendDir);

try {
  // Check if iteration1-deployment frontend exists
  if (!fs.existsSync(iteration1FrontendDir)) {
    console.log('⚠️  iteration1-deployment frontend not found, skipping...');
    process.exit(0);
  }

  // Build the iteration1-deployment frontend
  console.log('Running npm install in iteration1-deployment frontend...');
  execSync('npm install', { 
    cwd: iteration1FrontendDir, 
    stdio: 'inherit' 
  });

  console.log('Running npm run build:iteration1 in iteration1-deployment frontend...');
  execSync('npm run build:iteration1', { 
    cwd: iteration1FrontendDir, 
    stdio: 'inherit' 
  });

  // Check if build was successful
  if (!fs.existsSync(sourceDir)) {
    console.error('❌ iteration1-deployment build failed - build directory not found');
    process.exit(1);
  }

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

  copyRecursive(sourceDir, targetDir);
  console.log('✅ Successfully built and copied iteration1-deployment build files');
} catch (error) {
  console.error('❌ Error building/copying files:', error);
  process.exit(1);
}
