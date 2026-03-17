const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=========================================');
console.log('🚀 Building Next.js app for cPanel...');
console.log('=========================================');

try {
  // 1. Run the standard Next.js build using npx to ensure it finds the local next binary
  execSync('npx next build', { stdio: 'inherit' });

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

  // 4. Patch server.js for cPanel/Passenger compatibility and rename to app.js
  const serverJsPath = path.join(standaloneDir, 'server.js');
  const appJsPath = path.join(standaloneDir, 'app.js');
  
  if (fs.existsSync(serverJsPath)) {
    console.log('-> Patching server.js for Phusion Passenger compatibility...');
    let serverCode = fs.readFileSync(serverJsPath, 'utf8');
    
    // FIX 1: Passenger uses named pipes (strings) for PORT. Next.js tries to parseInt() it, which returns NaN and breaks the app.
    serverCode = serverCode.replace(/parseInt\(process\.env\.PORT,\s*10\)/g, 'process.env.PORT');
    
    // FIX 2: Passenger intercepts listen(). Binding to a specific hostname can bypass Passenger and cause timeouts.
    serverCode = serverCode.replace(/listen\(currentPort,\s*hostname,/g, 'listen(currentPort,');

    // FIX 3: Add a crash logger so if it fails again, we can see exactly why in cPanel!
    const crashLogger = `
// --- CPANEL CRASH LOGGER ---
process.on('uncaughtException', function(err) {
  require('fs').writeFileSync(__dirname + '/crash-log.txt', err.stack || err.toString());
  process.exit(1);
});
process.on('unhandledRejection', function(reason, p) {
  require('fs').writeFileSync(__dirname + '/crash-log.txt', (reason && reason.stack) ? reason.stack : String(reason));
  process.exit(1);
});
// ---------------------------
`;
    
    fs.writeFileSync(appJsPath, crashLogger + serverCode);
    fs.unlinkSync(serverJsPath); // Remove original server.js
    console.log('-> Renamed to app.js');
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
