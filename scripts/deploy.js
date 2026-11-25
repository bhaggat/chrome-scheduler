#!/usr/bin/env node

import { execSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function loadEnvFiles() {
  const candidates = ['.env.submit', '.env.local', '.env'];
  for (const file of candidates) {
    const filePath = path.join(rootDir, file);
    if (!fs.existsSync(filePath)) continue;
    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eqIdx = line.indexOf('=');
      if (eqIdx === -1) continue;
      const key = line.slice(0, eqIdx).trim();
      let val = line.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) {
        process.env[key] = val;
      }
    }
  }
}

function bumpVersion(version, type) {
  if (/^\d+\.\d+\.\d+$/.test(type)) return type;
  const parts = version.split('.').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    throw new Error(`Invalid version format: ${version}`);
  }
  let [major, minor, patch] = parts;
  if (type === 'major') {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (type === 'minor') {
    minor += 1;
    patch = 0;
  } else if (type === 'patch') {
    patch += 1;
  } else {
    throw new Error(`Unknown bump type or version: ${type}`);
  }
  return `${major}.${minor}.${patch}`;
}

function base64Url(input) {
  return Buffer.from(input).toString('base64url');
}

function createServiceAccountJwt(clientEmail, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64Url(
    JSON.stringify({
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/chromewebstore',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    })
  );
  const unsigned = `${header}.${payload}`;
  const normalizedKey = privateKey.replace(/\\n/g, '\n');
  const signature = crypto.createSign('RSA-SHA256').update(unsigned).sign(normalizedKey, 'base64url');
  return `${unsigned}.${signature}`;
}

async function getAccessToken(clientEmail, privateKey) {
  const assertion = createServiceAccountJwt(clientEmail, privateKey);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to get OAuth access token (${res.status}): ${text}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function cwsRequest(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { raw: text };
  }
  if (!res.ok) {
    throw new Error(`Chrome Web Store API error (${res.status}): ${JSON.stringify(json)}`);
  }
  return json;
}

async function main() {
  loadEnvFiles();

  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const skipBump = args.includes('--no-bump');
  const skipSubmit = args.includes('--skip-submit') || args.includes('--upload-only');
  const versionArg = args.find((a) => !a.startsWith('--')) || 'patch';

  const extensionId = process.env.CHROME_EXTENSION_ID || process.env.EXTENSION_ID;
  const publisherId = process.env.CHROME_PUBLISHER_ID;
  const clientEmail = process.env.CHROME_SERVICE_ACCOUNT_CLIENT_EMAIL;
  const privateKey = process.env.CHROME_SERVICE_ACCOUNT_PRIVATE_KEY;
  const publishType = process.env.CHROME_PUBLISH_TYPE || 'DEFAULT_PUBLISH';
  const cancelPending = process.env.CHROME_CANCEL_PENDING === 'true';

  if (!isDryRun && (!extensionId || !publisherId || !clientEmail || !privateKey)) {
    console.error('❌ Missing Chrome Web Store API v2 credentials in .env / .env.local / .env.submit:');
    console.error('   - CHROME_EXTENSION_ID');
    console.error('   - CHROME_PUBLISHER_ID');
    console.error('   - CHROME_SERVICE_ACCOUNT_CLIENT_EMAIL');
    console.error('   - CHROME_SERVICE_ACCOUNT_PRIVATE_KEY');
    process.exit(1);
  }

  const pkgPath = path.join(rootDir, 'package.json');
  const manifestPath = path.join(rootDir, 'public', 'manifest.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  let newVersion = pkg.version;
  if (!skipBump) {
    newVersion = bumpVersion(pkg.version, versionArg);
    console.log(`\n🚀 Bumping version: ${pkg.version} ➔ ${newVersion}`);
    pkg.version = newVersion;
    manifest.version = newVersion;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

    const lockPath = path.join(rootDir, 'package-lock.json');
    if (fs.existsSync(lockPath)) {
      const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
      lock.version = newVersion;
      if (lock.packages?.['']) lock.packages[''].version = newVersion;
      fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n');
    }
  } else {
    console.log(`\n📦 Deploying current version: ${newVersion}`);
  }

  console.log(`\n🔨 Building extension v${newVersion}...`);
  execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

  const distDir = path.join(rootDir, 'dist');
  const zipFileName = `extension-v${newVersion}.zip`;
  const zipPath = path.join(rootDir, zipFileName);
  if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

  console.log(`\n📦 Zipping ${zipFileName}...`);
  execSync(`cd "${distDir}" && zip -r "${zipPath}" . -x "*.DS_Store"`, { stdio: 'inherit' });

  if (isDryRun) {
    console.log(`\n🧪 DRY RUN complete. Built and zipped ${zipFileName} without uploading.`);
    return;
  }

  const itemName = `publishers/${publisherId}/items/${extensionId}`;
  const baseUrl = 'https://chromewebstore.googleapis.com';

  console.log('\n🔑 Authenticating with Chrome Web Store API v2...');
  const token = await getAccessToken(clientEmail, privateKey);
  const authHeaders = {
    Authorization: `Bearer ${token}`,
    'x-goog-api-version': '2',
  };

  const status = await cwsRequest(`${baseUrl}/v2/${itemName}:fetchStatus`, {
    method: 'GET',
    headers: authHeaders,
  });

  if (cancelPending && status.submittedItemRevisionStatus?.state === 'PENDING_REVIEW') {
    console.log('⏹️ Cancelling pending review...');
    await cwsRequest(`${baseUrl}/v2/${itemName}:cancelSubmission`, {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: '{}',
    });
  }

  console.log(`📤 Uploading ${zipFileName}...`);
  const zipBuffer = fs.readFileSync(zipPath);
  const uploadRes = await cwsRequest(`${baseUrl}/upload/v2/${itemName}:upload`, {
    method: 'POST',
    headers: {
      ...authHeaders,
      'Content-Type': 'application/zip',
    },
    body: zipBuffer,
  });

  if (uploadRes.uploadState !== 'SUCCEEDED') {
    throw new Error(`Upload failed: ${JSON.stringify(uploadRes)}`);
  }
  console.log('✅ Upload succeeded.');

  if (skipSubmit) {
    console.log(`\n🎉 Draft v${newVersion} uploaded (skipped review submission).`);
    return;
  }

  console.log(`🚀 Submitting v${newVersion} for review (${publishType})...`);
  const publishRes = await cwsRequest(`${baseUrl}/v2/${itemName}:publish`, {
    method: 'POST',
    headers: { ...authHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ publishType }),
  });

  if (publishRes.warningInfo?.warnings?.length) {
    for (const w of publishRes.warningInfo.warnings) {
      console.warn(`⚠️ ${w.reason}: ${w.description}`);
    }
  }

  console.log(`\n🎉 Successfully deployed ${pkg.name} v${newVersion} to Chrome Web Store!`);
}

main().catch((err) => {
  console.error('\n❌ Deployment failed:', err.message);
  process.exit(1);
});
