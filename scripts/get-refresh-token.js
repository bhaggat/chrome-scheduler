#!/usr/bin/env node

/**
 * Helper script to get Chrome Web Store API refresh token
 * This provides instructions for using Google OAuth2 Playground
 */

console.log('🔑 Chrome Web Store API - Get Refresh Token\n');
console.log('='.repeat(50));
console.log('\n');

const CLIENT_ID = process.argv[2];
const CLIENT_SECRET = process.argv[3];

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.log('Usage: node scripts/get-refresh-token.js <CLIENT_ID> <CLIENT_SECRET>\n');
  console.log('Example:');
  console.log('  node scripts/get-refresh-token.js YOUR_CLIENT_ID YOUR_CLIENT_SECRET\n');
  process.exit(1);
}

console.log('📋 Your Credentials:');
console.log('─'.repeat(50));
console.log(`Client ID: ${CLIENT_ID}`);
console.log(`Client Secret: ${CLIENT_SECRET}`);
console.log('\n');

console.log('🌐 Follow these steps to get your refresh token:\n');
console.log('─'.repeat(50));

console.log('\n1️⃣  Go to Google OAuth2 Playground:');
console.log('   https://developers.google.com/oauthplayground/\n');

console.log('2️⃣  Click the gear icon (⚙️) in the top right corner\n');

console.log('3️⃣  Check "Use your own OAuth credentials"\n');

console.log('4️⃣  Enter your credentials:');
console.log(`   OAuth Client ID: ${CLIENT_ID}`);
console.log(`   OAuth Client secret: ${CLIENT_SECRET}\n`);

console.log('5️⃣  In the left sidebar, find and select:');
console.log('   "Chrome Web Store API v1.1"');
console.log('   └─ https://www.googleapis.com/auth/chromewebstore\n');

console.log('6️⃣  Click "Authorize APIs" button\n');

console.log('7️⃣  Sign in with your Google account (the one that owns the extension)\n');

console.log('8️⃣  Click "Allow" to grant permissions\n');

console.log('9️⃣  Click "Exchange authorization code for tokens"\n');

console.log('🔟  Copy the "Refresh token" value\n');

console.log('─'.repeat(50));
console.log('\n✅ Once you have the refresh token:\n');
console.log('1. Open .env.local file');
console.log('2. Set CHROME_REFRESH_TOKEN=<your_refresh_token>');
console.log('3. Save the file');
console.log('4. Run: npm run deploy\n');

console.log('─'.repeat(50));
console.log('\n💡 Tip: The refresh token is a long string that starts with "1//"\n');
