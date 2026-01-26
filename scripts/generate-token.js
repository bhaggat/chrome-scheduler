#!/usr/bin/env node

/**
 * OAuth2 Token Generator for Chrome Web Store API
 * This script helps you get a refresh token by opening a browser for OAuth authorization
 */

import http from 'http';
import { URL } from 'url';
import open from 'open';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Load environment variables
dotenv.config({ path: path.join(projectRoot, '.env.local') });

const CLIENT_ID = process.env.CHROME_CLIENT_ID;
const CLIENT_SECRET = process.env.CHROME_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:8818/oauth2callback';
const SCOPE = 'https://www.googleapis.com/auth/chromewebstore';

console.log('🔑 Chrome Web Store OAuth2 Token Generator\n');
console.log('='.repeat(50));

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('\n❌ Error: Missing credentials!');
  console.log('Please set CHROME_CLIENT_ID and CHROME_CLIENT_SECRET in .env.local\n');
  process.exit(1);
}

console.log('\n✅ Credentials loaded from .env.local');
console.log(`Client ID: ${CLIENT_ID.substring(0, 20)}...`);
console.log('\n📋 Starting OAuth2 flow...\n');

// Create authorization URL
const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPE);
authUrl.searchParams.set('access_type', 'offline');
authUrl.searchParams.set('prompt', 'consent');

let server;

// Create a local server to receive the OAuth callback
const startServer = () => {
  return new Promise((resolve, reject) => {
    server = http.createServer(async (req, res) => {
      const url = new URL(req.url, `http://${req.headers.host}`);
      
      if (url.pathname === '/oauth2callback') {
        const code = url.searchParams.get('code');
        
        if (code) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <html>
              <body style="font-family: Arial; padding: 50px; text-align: center;">
                <h1>✅ Authorization Successful!</h1>
                <p>You can close this window and return to the terminal.</p>
              </body>
            </html>
          `);
          
          server.close();
          resolve(code);
        } else {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end('<h1>❌ Authorization Failed</h1><p>No code received.</p>');
          server.close();
          reject(new Error('No authorization code received'));
        }
      }
    });

    server.listen(8818, () => {
      console.log('🌐 Local server started on http://localhost:8818');
      console.log('🔓 Opening browser for authorization...\n');
      open(authUrl.toString());
    });

    server.on('error', (err) => {
      reject(err);
    });
  });
};

// Exchange authorization code for tokens
const exchangeCodeForTokens = async (code) => {
  console.log('\n🔄 Exchanging authorization code for tokens...');
  
  const tokenUrl = 'https://oauth2.googleapis.com/token';
  const params = new URLSearchParams({
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
  });

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Token exchange failed: ${error}`);
    }

    const tokens = await response.json();
    return tokens;
  } catch (error) {
    throw new Error(`Failed to exchange code for tokens: ${error.message}`);
  }
};

// Update .env.local file with new refresh token
const updateEnvFile = (refreshToken) => {
  const envPath = path.join(projectRoot, '.env.local');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  // Update or add CHROME_REFRESH_TOKEN
  if (envContent.includes('CHROME_REFRESH_TOKEN=')) {
    envContent = envContent.replace(
      /CHROME_REFRESH_TOKEN=.*/,
      `CHROME_REFRESH_TOKEN=${refreshToken}`
    );
  } else {
    envContent += `\nCHROME_REFRESH_TOKEN=${refreshToken}\n`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ Updated .env.local with new refresh token!');
};

// Main flow
(async () => {
  try {
    const code = await startServer();
    const tokens = await exchangeCodeForTokens(code);
    
    console.log('\n✅ Tokens received successfully!');
    console.log('\n📝 Token Details:');
    console.log('─'.repeat(50));
    console.log(`Access Token: ${tokens.access_token.substring(0, 20)}...`);
    console.log(`Refresh Token: ${tokens.refresh_token.substring(0, 20)}...`);
    console.log(`Expires In: ${tokens.expires_in} seconds`);
    console.log(`Token Type: ${tokens.token_type}`);
    
    // Update .env.local
    updateEnvFile(tokens.refresh_token);
    
    console.log('\n🎉 Setup complete!');
    console.log('─'.repeat(50));
    console.log('\nYou can now run:');
    console.log('  npm run deploy\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (server) {
      server.close();
    }
    process.exit(1);
  }
})();
