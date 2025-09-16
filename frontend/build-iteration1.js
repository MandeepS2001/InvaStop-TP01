#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = path.join(__dirname, 'build', 'iteration1');
const projectRoot = path.join(__dirname, '..', '..');

console.log('Building iteration1 version from iteration1-sept5 branch...');

try {
  // Create target directory
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Store current branch
  const currentBranch = execSync('git branch --show-current', { 
    cwd: projectRoot, 
    encoding: 'utf8' 
  }).trim();

  console.log('Current branch:', currentBranch);

  // Switch to iteration1-sept5 branch
  console.log('Switching to iteration1-sept5 branch...');
  execSync('git checkout iteration1-sept5', { 
    cwd: projectRoot, 
    stdio: 'inherit' 
  });

  // Build the iteration1 version with PUBLIC_URL=/iteration1
  console.log('Building iteration1 version with PUBLIC_URL=/iteration1...');
  execSync('CI=false PUBLIC_URL=/iteration1 react-scripts build', { 
    cwd: path.join(__dirname, '..'), 
    stdio: 'inherit' 
  });

  // Copy the built files to the iteration1 subdirectory
  const sourceDir = path.join(__dirname, '..', 'build');
  console.log('Copying build files to iteration1 subdirectory...');
  console.log('Source:', sourceDir);
  console.log('Target:', targetDir);

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

  // Copy all files from build to build/iteration1
  const files = fs.readdirSync(sourceDir);
  files.forEach(file => {
    copyRecursive(path.join(sourceDir, file), path.join(targetDir, file));
  });

  // Switch back to original branch
  console.log('Switching back to', currentBranch, 'branch...');
  execSync(`git checkout ${currentBranch}`, { 
    cwd: projectRoot, 
    stdio: 'inherit' 
  });

  console.log('✅ Successfully built iteration1 version');
} catch (error) {
  console.error('❌ Error building iteration1 version:', error);
  
  // Try to switch back to original branch in case of error
  try {
    const currentBranch = execSync('git branch --show-current', { 
      cwd: projectRoot, 
      encoding: 'utf8' 
    }).trim();
    console.log('Switching back to', currentBranch, 'branch...');
    execSync(`git checkout ${currentBranch}`, { 
      cwd: projectRoot, 
      stdio: 'inherit' 
    });
  } catch (switchError) {
    console.error('❌ Error switching back to original branch:', switchError);
  }
  
  process.exit(1);
}