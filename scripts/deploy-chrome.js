#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chromeWebstoreUpload from 'chrome-webstore-upload';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Load environment variables
dotenv.config({ path: path.join(projectRoot, '.env') });
// Also try loading from .env.local if it exists (common pattern)
if (fs.existsSync(path.join(projectRoot, '.env.local'))) {
  dotenv.config({ path: path.join(projectRoot, '.env.local') });
}

console.log('🚀 Chrome Extension Auto-Deployer');
console.log('=================================\n');

// Configuration
const EXTENSION_ID = process.env.EXTENSION_ID || 'peimippheccjbhianpahacphickkbbjl';
const CLIENT_ID = process.env.CHROME_CLIENT_ID;
const CLIENT_SECRET = process.env.CHROME_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.CHROME_REFRESH_TOKEN;

// Validation
if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.error('❌ Error: Missing credentials!');
  console.log('Please set the following environment variables in .env or .env.local:');
  console.log('- CHROME_CLIENT_ID');
  console.log('- CHROME_CLIENT_SECRET');
  console.log('- CHROME_REFRESH_TOKEN');
  console.log('\nSee PUBLISHING.md for instructions on how to get these keys.');
  process.exit(1);
}

const store = chromeWebstoreUpload({
  extensionId: EXTENSION_ID,
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  refreshToken: REFRESH_TOKEN,
});

async function main() {
  try {
    // 1. Build
    console.log('🔨 Building project...');
    execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
    console.log('✅ Build successful.\n');

    // 2. Package (Zip)
    console.log('📦 Packaging extension...');
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8')
    );
    const version = packageJson.version;
    const distPath = path.join(projectRoot, 'dist');
    const zipFileName = `extension-v${version}.zip`;
    const zipPath = path.join(projectRoot, zipFileName);

    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }

    // Zip command (assumes unix-like environment or compatible zip tool)
    execSync(`cd ${distPath} && zip -r "${zipPath}" .`, { stdio: 'inherit' });
    console.log(`✅ Packaged: ${zipFileName}\n`);

    // 3. Upload
    console.log('📤 Uploading to Chrome Web Store...');
    const myZipFile = fs.createReadStream(zipPath);
    const token = await store.fetchToken(); // Fetch new access token using refresh token
    const uploadRes = await store.uploadExisting(myZipFile, token);

    if (uploadRes.uploadState === 'FAILURE') {
      throw new Error(`Upload failed: ${JSON.stringify(uploadRes.itemError, null, 2)}`);
    }
    console.log('✅ Upload successful!');
    console.log(`Included item errors: ${JSON.stringify(uploadRes.itemError, null, 2) || 'None'}`);
    console.log('Item metadata:', uploadRes);

    // 4. Publish (Optional - asks user or defaults to trusted testers based on env?)
    // Defaulting to 'trustedTesters' is safer, but 'default' sends to everyone.
    // Let's use an arg or env var for target.
    const publishTarget = process.env.PUBLISH_TARGET || 'default'; // 'default' or 'trustedTesters'

    console.log(`\n🚀 Publishing to target: ${publishTarget}...`);
    const publishRes = await store.publish(publishTarget, token);
    
    if (publishRes.status && publishRes.status.length > 0 && publishRes.status[0] === 'OK') {
        console.log('✅ Publish request submitted successfully!');
    } else {
        console.log('⚠️ Publish response:', JSON.stringify(publishRes, null, 2));
    }
    
    console.log('\n🎉 Deployment process finished!');

  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    if (error.response && error.response.body) {
         console.error('Response body:', JSON.stringify(error.response.body, null, 2));
    }
    process.exit(1);
  }
}

main();
