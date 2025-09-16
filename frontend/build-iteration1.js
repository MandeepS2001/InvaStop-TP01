#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = path.join(__dirname, 'build', 'iteration1');

console.log('Building iteration1 version from current branch...');

// Check if we're in a Vercel environment (no git access)
const isVercelEnvironment = process.env.VERCEL === '1' || !fs.existsSync(path.join(__dirname, '..', '..', '.git'));

try {
  // Create target directory
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  if (isVercelEnvironment) {
    console.log('Detected Vercel environment - using current build for iteration1');
    
    // In Vercel, we just copy the current build to the iteration1 subdirectory
    const sourceDir = path.join(__dirname, 'build');
    
    if (!fs.existsSync(sourceDir)) {
      console.log('No build directory found, skipping iteration1 build');
      return;
    }
    
    console.log('Copying current build to iteration1 subdirectory...');
    console.log('Source:', sourceDir);
    console.log('Target:', targetDir);

    function copyRecursive(src, dest) {
      const stats = fs.statSync(src);
      if (stats.isDirectory()) {
        // Skip copying if we're trying to copy into the iteration1 directory itself
        if (src === targetDir || dest.startsWith(targetDir + path.sep)) {
          console.log('Skipping recursive copy of iteration1 directory');
          return;
        }
        
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }
        const files = fs.readdirSync(src);
        files.forEach(file => {
          // Skip the iteration1 directory to prevent recursion
          if (file === 'iteration1') {
            console.log('Skipping iteration1 directory to prevent recursion');
            return;
          }
          copyRecursive(path.join(src, file), path.join(dest, file));
        });
      } else {
        fs.copyFileSync(src, dest);
      }
    }

    // Copy all files from build to build/iteration1, excluding the iteration1 directory itself
    const files = fs.readdirSync(sourceDir);
    files.forEach(file => {
      // Skip the iteration1 directory to prevent recursion
      if (file === 'iteration1') {
        console.log('Skipping iteration1 directory to prevent recursion');
        return;
      }
      copyRecursive(path.join(sourceDir, file), path.join(targetDir, file));
    });
    
    console.log('✅ Successfully copied current build to iteration1 subdirectory');
  } else {
    // Local development environment - use git to switch branches
    const projectRoot = path.join(__dirname, '..', '..');
    
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
  }
} catch (error) {
  console.error('❌ Error building iteration1 version:', error);
  
  // Only try to switch back to original branch if we're in local environment
  if (!isVercelEnvironment) {
    try {
      const projectRoot = path.join(__dirname, '..', '..');
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
  }
  
  process.exit(1);
}