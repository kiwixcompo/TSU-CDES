const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=========================================');
console.log('🚀 Building Next.js app for cPanel...');
console.log('=========================================');

try {
  // 1. Run the standard Next.js build
  execSync('npm run build', { stdio: 'inherit' });

  console.log('\n📦 Preparing standalone directory...');
  const standaloneDir = path.join(__dirname, '../.next/standalone');
  const publicDir = path.join(__dirname, '../public');
  const staticDir = path.join(__dirname, '../.next/static');

  // 2. Copy public directory
  if (fs.existsSync(publicDir)) {
    console.log('-> Copying public directory...');
    fs.cpSync(publicDir, path.join(standaloneDir, 'public'), { recursive: true });
  }

  // 3. Copy .next/static directory
  const targetStaticDir = path.join(standaloneDir, '.next', 'static');
  if (fs.existsSync(staticDir)) {
    console.log('-> Copying static assets...');
    fs.mkdirSync(targetStaticDir, { recursive: true });
    fs.cpSync(staticDir, targetStaticDir, { recursive: true });
  }

  // 4. Rename server.js to app.js for cPanel Application Manager
  const serverJsPath = path.join(standaloneDir, 'server.js');
  const appJsPath = path.join(standaloneDir, 'app.js');
  if (fs.existsSync(serverJsPath)) {
    console.log('-> Renaming server.js to app.js for cPanel compatibility...');
    fs.renameSync(serverJsPath, appJsPath);
  }

  console.log('\n✅ BUILD COMPLETE!');
  console.log('=========================================');
  console.log('To deploy to cPanel:');
  console.log('1. Open the ".next/standalone" folder on your computer.');
  console.log('2. Zip all the files inside it.');
  console.log('3. Upload the Zip file to your cPanel File Manager (cdes.tsuniversity.edu.ng).');
  console.log('4. Extract the Zip file.');
  console.log('5. Go to Application Manager and click Restart.');
  console.log('=========================================');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
