import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const rawDir = path.join(rootDir, 'chrome-store-assets', 'raw');
const chromeStoreDir = path.join(rootDir, 'chrome-store-assets', 'screenshots');
const chromePromoDir = path.join(rootDir, 'chrome-store-assets', 'promo');

[rawDir, chromeStoreDir, chromePromoDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Read logo PNG as base64
const iconPath = path.join(rootDir, 'public', 'icons', 'icon128.png');
const iconFallbackPath = path.join(rootDir, 'public', 'icon.png');
let logoDataUri = '';

if (fs.existsSync(iconPath)) {
  const base64 = fs.readFileSync(iconPath).toString('base64');
  logoDataUri = `data:image/png;base64,${base64}`;
} else if (fs.existsSync(iconFallbackPath)) {
  const base64 = fs.readFileSync(iconFallbackPath).toString('base64');
  logoDataUri = `data:image/png;base64,${base64}`;
} else {
  logoDataUri = `data:image/svg+xml;utf8,<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><rect width="128" height="128" rx="28" fill="%236366f1"/><circle cx="64" cy="64" r="36" stroke="%23ffffff" stroke-width="8" fill="none"/><path d="M64 36v32h24" stroke="%23ffffff" stroke-width="8" stroke-linecap="round"/></svg>`;
}

const APP_LOGO_IMG = (size = 36, extraStyle = '') => `
  <img src="${logoDataUri}" width="${size}" height="${size}" style="border-radius: ${Math.round(size * 0.22)}px; box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4); object-fit: contain; flex-shrink: 0; ${extraStyle}" alt="Scheduled Website Opener Logo" />
`;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateAllAssets() {
  console.log('🚀 Launching Puppeteer to generate Chrome Web Store promo assets...');
  
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const baseCss = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');

    :root {
      color-scheme: dark;
      --bg: #0b0f19;
      --surface: #111827;
      --surface-raised: #1f2937;
      --border: rgba(255, 255, 255, 0.1);
      --border-glow: rgba(99, 102, 241, 0.3);
      --fg: #f9fafb;
      --fg-muted: #9ca3af;
      --muted: #6b7280;
      --accent: #818cf8;
      --accent-strong: #6366f1;
      --accent-purple: #a855f7;
      --accent-emerald: #10b981;
      --accent-amber: #f59e0b;
      --glow: 0 0 25px rgba(99, 102, 241, 0.35);
      --sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --mono: 'JetBrains Mono', monospace;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--bg);
      background-image: 
        radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.18), transparent 45%),
        radial-gradient(circle at 85% 20%, rgba(168, 85, 247, 0.2), transparent 45%),
        radial-gradient(circle at 50% 85%, rgba(16, 185, 129, 0.12), transparent 50%),
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
      background-size: 100% 100%, 100% 100%, 100% 100%, 36px 36px, 36px 36px;
      font-family: var(--sans);
      color: var(--fg);
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
      position: relative;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      background: rgba(99, 102, 241, 0.15);
      color: #a5b4fc;
      border: 1px solid rgba(99, 102, 241, 0.3);
      backdrop-filter: blur(8px);
    }

    .badge-green {
      background: rgba(16, 185, 129, 0.15);
      color: #6ee7b7;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .badge-purple {
      background: rgba(168, 85, 247, 0.15);
      color: #d8b4fe;
      border: 1px solid rgba(168, 85, 247, 0.3);
    }

    /* Mock Extension Popup Window */
    .popup-card {
      width: 380px;
      background: #111827;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(99, 102, 241, 0.25);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .popup-header {
      padding: 16px 20px;
      background: rgba(31, 41, 55, 0.8);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .popup-header-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .popup-header-title h2 {
      font-size: 16px;
      font-weight: 700;
      color: #fff;
    }

    .header-actions-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .header-actions-btn-primary {
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
    }

    .scheduler-item {
      padding: 14px 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: background 0.2s;
    }

    .scheduler-item:last-child {
      border-bottom: none;
    }

    .scheduler-info h4 {
      font-size: 14px;
      font-weight: 600;
      color: #60a5fa;
      margin-bottom: 4px;
    }

    .scheduler-tags {
      display: flex;
      gap: 6px;
    }

    .tag {
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.08);
      color: #d1d5db;
    }

    .tag-type {
      background: rgba(99, 102, 241, 0.2);
      color: #a5b4fc;
    }

    .tag-trigger {
      background: rgba(16, 185, 129, 0.2);
      color: #6ee7b7;
    }

    /* Form UI */
    .form-group {
      margin-bottom: 14px;
    }

    .form-label {
      font-size: 12px;
      font-weight: 600;
      color: #9ca3af;
      margin-bottom: 6px;
      display: block;
    }

    .form-input, .form-select {
      width: 100%;
      padding: 10px 12px;
      background: #1f2937;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      color: #fff;
      font-size: 13px;
      font-family: inherit;
    }

    .form-checkbox-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      background: rgba(31, 41, 55, 0.5);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
  `;

  // Screenshot 1: Overview Dashboard
  const page1 = await browser.newPage();
  await page1.setViewport({ width: 1280, height: 800 });
  await page1.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        ${baseCss}
        body {
          width: 1280px;
          height: 800px;
          display: flex;
          padding: 40px 60px;
          gap: 50px;
          align-items: center;
        }
        .hero-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .hero-left h1 {
          font-size: 46px;
          font-weight: 800;
          line-height: 1.15;
          background: linear-gradient(135deg, #ffffff 30%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-left p {
          font-size: 18px;
          color: #9ca3af;
          line-height: 1.6;
        }
        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 15px;
          font-weight: 600;
          color: #e5e7eb;
        }
        .feature-icon {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(99, 102, 241, 0.2);
          color: #818cf8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="hero-left">
        <div>
          <span class="badge">🚀 Chrome Extension</span>
        </div>
        <h1>Automate Your Daily Web Workflow</h1>
        <p>Schedule websites to open automatically on startup or at exact times. Perfect for daily standups, analytics, dashboards, and routines.</p>
        <div class="feature-list">
          <div class="feature-item"><div class="feature-icon">✓</div> Daily, Weekly, Monthly, & Custom Schedules</div>
          <div class="feature-item"><div class="feature-icon">✓</div> Open automatically when Chrome launches</div>
          <div class="feature-item"><div class="feature-icon">✓</div> Support for Pinned Tabs & Custom Time Windows</div>
          <div class="feature-item"><div class="feature-icon">✓</div> Built with React 19 & High-Performance Background Alarms</div>
        </div>
      </div>
      <div class="popup-card">
        <div class="popup-header">
          <div class="popup-header-title">
            ${APP_LOGO_IMG(32)}
            <h2>Scheduled Website Opener</h2>
          </div>
          <div style="display: flex; gap: 8px;">
            <div class="header-actions-btn header-actions-btn-primary">+</div>
            <div class="header-actions-btn">⚙️</div>
          </div>
        </div>
        <div>
          <div class="scheduler-item">
            <div class="scheduler-info">
              <h4>Daily Standup & Jira</h4>
              <div class="scheduler-tags">
                <span class="tag tag-type">Daily</span>
                <span class="tag tag-trigger">09:30 AM</span>
                <span class="tag">📌 Pinned</span>
              </div>
            </div>
            <div style="display: flex; gap: 6px;">
              <span style="color: #818cf8; cursor: pointer;">✏️</span>
              <span style="color: #ef4444; cursor: pointer;">🗑️</span>
            </div>
          </div>
          <div class="scheduler-item">
            <div class="scheduler-info">
              <h4>Google Analytics Dashboard</h4>
              <div class="scheduler-tags">
                <span class="tag tag-type">Everytime</span>
                <span class="tag tag-trigger">Chrome Startup</span>
              </div>
            </div>
            <div style="display: flex; gap: 6px;">
              <span style="color: #818cf8; cursor: pointer;">✏️</span>
              <span style="color: #ef4444; cursor: pointer;">🗑️</span>
            </div>
          </div>
          <div class="scheduler-item">
            <div class="scheduler-info">
              <h4>Weekly Team Metrics Report</h4>
              <div class="scheduler-tags">
                <span class="tag tag-type">Weekly</span>
                <span class="tag tag-trigger">Mon 10:00 AM</span>
              </div>
            </div>
            <div style="display: flex; gap: 6px;">
              <span style="color: #818cf8; cursor: pointer;">✏️</span>
              <span style="color: #ef4444; cursor: pointer;">🗑️</span>
            </div>
          </div>
          <div class="scheduler-item">
            <div class="scheduler-info">
              <h4>Crypto & Stock Market Watch</h4>
              <div class="scheduler-tags">
                <span class="tag tag-type">Daily</span>
                <span class="tag tag-trigger">Once per day</span>
              </div>
            </div>
            <div style="display: flex; gap: 6px;">
              <span style="color: #818cf8; cursor: pointer;">✏️</span>
              <span style="color: #ef4444; cursor: pointer;">🗑️</span>
            </div>
          </div>
        </div>
        <div style="padding: 12px 18px; font-size: 11px; color: #6b7280; text-align: center; border-top: 1px solid rgba(255,255,255,0.06);">
          Version 2.0.20 • Active Alarms: 4
        </div>
      </div>
    </body>
    </html>
  `);
  await delay(500);
  await page1.screenshot({ path: path.join(rawDir, '1-overview-dashboard.png') });

  // Screenshot 2: Flexible Scheduler Form
  const page2 = await browser.newPage();
  await page2.setViewport({ width: 1280, height: 800 });
  await page2.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        ${baseCss}
        body {
          width: 1280px;
          height: 800px;
          display: flex;
          padding: 40px 60px;
          gap: 50px;
          align-items: center;
        }
        .hero-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .hero-left h1 {
          font-size: 46px;
          font-weight: 800;
          line-height: 1.15;
          background: linear-gradient(135deg, #ffffff 30%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-left p {
          font-size: 18px;
          color: #9ca3af;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="hero-left">
        <div>
          <span class="badge badge-purple">⚡ Flexible Recurrence</span>
        </div>
        <h1>Custom Scheduling Options</h1>
        <p>Set up website openers for any schedule: Daily, Weekly, Monthly, or custom intervals with precise time parameters.</p>
        <div style="display: flex; gap: 12px; margin-top: 10px;">
          <div style="padding: 14px 20px; border-radius: 12px; background: rgba(31, 41, 55, 0.6); border: 1px solid rgba(255, 255, 255, 0.1);">
            <div style="font-weight: 700; color: #a855f7; font-size: 18px;">Daily / Weekly</div>
            <div style="font-size: 13px; color: #9ca3af; margin-top: 4px;">Choose specific days & times</div>
          </div>
          <div style="padding: 14px 20px; border-radius: 12px; background: rgba(31, 41, 55, 0.6); border: 1px solid rgba(255, 255, 255, 0.1);">
            <div style="font-weight: 700; color: #3b82f6; font-size: 18px;">Startup Triggers</div>
            <div style="font-size: 13px; color: #9ca3af; margin-top: 4px;">Auto-launch on browser start</div>
          </div>
        </div>
      </div>
      <div class="popup-card" style="width: 420px; padding: 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h3 style="font-size: 18px; font-weight: 700; color: #fff;">Add New Scheduler</h3>
          <span style="color: #9ca3af; cursor: pointer;">✕</span>
        </div>
        <div class="form-group">
          <label class="form-label">Title / Name</label>
          <input class="form-input" value="Morning Analytics & Metrics" />
        </div>
        <div class="form-group">
          <label class="form-label">Target Website URL</label>
          <input class="form-input" value="https://analytics.google.com/dashboard" />
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;" class="form-group">
          <div>
            <label class="form-label">Schedule Type</label>
            <select class="form-select"><option>Daily</option></select>
          </div>
          <div>
            <label class="form-label">Scheduled Time</label>
            <input class="form-input" type="time" value="09:00" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Trigger Type</label>
          <select class="form-select"><option>Once per day</option></select>
        </div>
        <div class="form-checkbox-row" style="margin-bottom: 20px;">
          <input type="checkbox" checked id="pin-check" style="accent-color: #6366f1; width: 16px; height: 16px;" />
          <label for="pin-check" style="font-size: 13px; color: #e5e7eb; cursor: pointer; font-weight: 500;">Pin tab automatically when opened</label>
        </div>
        <div style="display: flex; gap: 10px;">
          <button style="flex: 1; padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: #fff; font-weight: 600; cursor: pointer;">Cancel</button>
          <button style="flex: 2; padding: 10px; border-radius: 8px; border: none; background: linear-gradient(135deg, #6366f1, #4f46e5); color: #fff; font-weight: 700; cursor: pointer; box-shadow: 0 4px 14px rgba(99,102,241,0.4);">Save Scheduler</button>
        </div>
      </div>
    </body>
    </html>
  `);
  await delay(500);
  await page2.screenshot({ path: path.join(rawDir, '2-flexible-scheduler.png') });

  // Screenshot 3: Smart Triggers & Chrome Startup
  const page3 = await browser.newPage();
  await page3.setViewport({ width: 1280, height: 800 });
  await page3.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        ${baseCss}
        body {
          width: 1280px;
          height: 800px;
          display: flex;
          padding: 40px 60px;
          gap: 50px;
          align-items: center;
        }
        .hero-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .hero-left h1 {
          font-size: 46px;
          font-weight: 800;
          line-height: 1.15;
          background: linear-gradient(135deg, #ffffff 30%, #34d399 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-left p {
          font-size: 18px;
          color: #9ca3af;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="hero-left">
        <div>
          <span class="badge badge-green">✨ Smart Triggers</span>
        </div>
        <h1>Chrome Startup & Smart Rules</h1>
        <p>Trigger websites every time you open Chrome or ensure tabs open smoothly once per day without duplicate windows.</p>
        <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 10px;">
          <div style="padding: 16px; border-radius: 12px; background: rgba(31, 41, 55, 0.6); border: 1px solid rgba(16, 185, 129, 0.3); display: flex; gap: 14px; align-items: center;">
            <div style="font-size: 24px;">🌐</div>
            <div>
              <div style="font-weight: 700; color: #34d399; font-size: 16px;">Everytime on Chrome open</div>
              <div style="font-size: 13px; color: #9ca3af;">Opens essential work tools every fresh browser session.</div>
            </div>
          </div>
          <div style="padding: 16px; border-radius: 12px; background: rgba(31, 41, 55, 0.6); border: 1px solid rgba(99, 102, 241, 0.3); display: flex; gap: 14px; align-items: center;">
            <div style="font-size: 24px;">⏰</div>
            <div>
              <div style="font-weight: 700; color: #818cf8; font-size: 16px;">Once per day Guard</div>
              <div style="font-size: 13px; color: #9ca3af;">Ensures scheduled tabs only trigger once every 24 hours.</div>
            </div>
          </div>
        </div>
      </div>
      <div class="popup-card" style="width: 400px; padding: 24px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="width: 56px; height: 56px; border-radius: 16px; background: rgba(16, 185, 129, 0.15); color: #34d399; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 12px;">⚡</div>
          <h3 style="font-size: 20px; font-weight: 700; color: #fff;">Smart Chrome Alarm System</h3>
          <p style="font-size: 13px; color: #9ca3af; margin-top: 4px;">Powered by Manifest V3 Service Worker Alarms</p>
        </div>
        <div style="background: rgba(17, 24, 39, 0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 13px; color: #d1d5db; font-weight: 600;">Alarm Accuracy</span>
            <span style="font-size: 12px; color: #34d399; font-weight: 700;">Real-time</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 13px; color: #d1d5db; font-weight: 600;">Background Memory</span>
            <span style="font-size: 12px; color: #60a5fa; font-weight: 700;">Lightweight (< 5MB)</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 13px; color: #d1d5db; font-weight: 600;">Chrome Sync Storage</span>
            <span style="font-size: 12px; color: #a855f7; font-weight: 700;">Enabled</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
  await delay(500);
  await page3.screenshot({ path: path.join(rawDir, '3-smart-triggers.png') });

  // Screenshot 4: Pinned Tabs & Settings
  const page4 = await browser.newPage();
  await page4.setViewport({ width: 1280, height: 800 });
  await page4.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        ${baseCss}
        body {
          width: 1280px;
          height: 800px;
          display: flex;
          padding: 40px 60px;
          gap: 50px;
          align-items: center;
        }
        .hero-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .hero-left h1 {
          font-size: 46px;
          font-weight: 800;
          line-height: 1.15;
          background: linear-gradient(135deg, #ffffff 30%, #fbbf24 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-left p {
          font-size: 18px;
          color: #9ca3af;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="hero-left">
        <div>
          <span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #fcd34d; border-color: rgba(245, 158, 11, 0.3);">📌 Tab Pinning & Control</span>
        </div>
        <h1>Pinned Tabs & Settings</h1>
        <p>Keep your critical dashboards pinned automatically so your workspace stays organized throughout your workday.</p>
        <div style="padding: 20px; border-radius: 14px; background: rgba(31, 41, 55, 0.5); border: 1px solid rgba(255,255,255,0.1); display: flex; gap: 16px; align-items: center;">
          <div style="font-size: 32px;">📌</div>
          <div>
            <div style="font-weight: 700; color: #fbbf24; font-size: 16px;">Automatic Tab Pinning</div>
            <div style="font-size: 13px; color: #9ca3af; margin-top: 2px;">Opened tabs automatically dock as compact pinned tabs.</div>
          </div>
        </div>
      </div>
      <div class="popup-card" style="width: 400px; padding: 24px;">
        <h3 style="font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 16px;">Extension Settings</h3>
        <div class="form-group">
          <label class="form-label">Default Open Mode</label>
          <select class="form-select"><option>Open as Pinned Tab</option></select>
        </div>
        <div class="form-group">
          <label class="form-label">Notification Preference</label>
          <select class="form-select"><option>Show desktop notification on schedule trigger</option></select>
        </div>
        <div class="form-group">
          <label class="form-label">Time Window Offset</label>
          <input class="form-input" value="0 minutes delay" />
        </div>
        <button style="width: 100%; padding: 12px; border-radius: 8px; border: none; background: linear-gradient(135deg, #f59e0b, #d97706); color: #fff; font-weight: 700; cursor: pointer; margin-top: 10px;">Save Preferences</button>
      </div>
    </body>
    </html>
  `);
  await delay(500);
  await page4.screenshot({ path: path.join(rawDir, '4-pinned-tabs-settings.png') });

  // Screenshot 5: Glassmorphism Design & Quality
  const page5 = await browser.newPage();
  await page5.setViewport({ width: 1280, height: 800 });
  await page5.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        ${baseCss}
        body {
          width: 1280px;
          height: 800px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 60px;
          gap: 30px;
        }
        .hero-title {
          font-size: 52px;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 20%, #818cf8 60%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-desc {
          font-size: 20px;
          color: #9ca3af;
          max-width: 750px;
          line-height: 1.6;
        }
        .cards-row {
          display: flex;
          gap: 24px;
          margin-top: 20px;
        }
        .card-feature {
          padding: 24px;
          border-radius: 16px;
          background: rgba(31, 41, 55, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          width: 260px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .card-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(99, 102, 241, 0.2);
          color: #818cf8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }
      </style>
    </head>
    <body>
      <div>
        ${APP_LOGO_IMG(64)}
      </div>
      <div>
        <span class="badge">✨ Modern Chrome Scheduler</span>
      </div>
      <h1 class="hero-title">Effortless Web Automation</h1>
      <p class="hero-desc">Never forget to open your daily tools, Jira boards, analytics dashboards, or meeting URLs again.</p>
      <div class="cards-row">
        <div class="card-feature">
          <div class="card-icon">⚡</div>
          <h3 style="font-size: 16px; font-weight: 700; color: #fff;">Fast & Reliable</h3>
          <p style="font-size: 13px; color: #9ca3af;">Manifest V3 background worker keeps schedules accurate.</p>
        </div>
        <div class="card-feature">
          <div class="card-icon" style="background: rgba(168, 85, 247, 0.2); color: #c084fc;">🎨</div>
          <h3 style="font-size: 16px; font-weight: 700; color: #fff;">Modern UI</h3>
          <p style="font-size: 13px; color: #9ca3af;">Glassmorphism design with React 19 and smooth transitions.</p>
        </div>
        <div class="card-feature">
          <div class="card-icon" style="background: rgba(16, 185, 129, 0.2); color: #34d399;">🔒</div>
          <h3 style="font-size: 16px; font-weight: 700; color: #fff;">100% Private</h3>
          <p style="font-size: 13px; color: #9ca3af;">All schedule data stays local inside your browser storage.</p>
        </div>
      </div>
    </body>
    </html>
  `);
  await delay(500);
  await page5.screenshot({ path: path.join(rawDir, '5-modern-design-quality.png') });

  // Small Promo Tile (440x280)
  const pageSmall = await browser.newPage();
  await pageSmall.setViewport({ width: 440, height: 280 });
  await pageSmall.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        ${baseCss}
        body {
          width: 440px;
          height: 280px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 24px;
          gap: 12px;
          background: linear-gradient(135deg, #0b0f19 0%, #1e1b4b 100%);
        }
        .small-title {
          font-size: 22px;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.2;
        }
        .small-sub {
          font-size: 12px;
          color: #9ca3af;
          font-weight: 500;
        }
        .small-badges {
          display: flex;
          gap: 6px;
          margin-top: 4px;
        }
        .chip-sm {
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 10px;
          font-weight: 700;
          background: rgba(99, 102, 241, 0.25);
          color: #c7d2fe;
          border: 1px solid rgba(99, 102, 241, 0.4);
        }
      </style>
    </head>
    <body>
      <div>
        ${APP_LOGO_IMG(44)}
      </div>
      <div class="small-title">Scheduled Website Opener</div>
      <div class="small-sub">Automatically open specific websites on daily schedules or Chrome startup.</div>
      <div class="small-badges">
        <span class="chip-sm">⏰ Daily & Weekly</span>
        <span class="chip-sm">🚀 Auto-Launch</span>
        <span class="chip-sm">📌 Pinned Tabs</span>
      </div>
    </body>
    </html>
  `);
  await delay(500);
  await pageSmall.screenshot({ path: path.join(rawDir, 'small-promo-440x280.png') });

  // Marquee Promo Tile (1400x560)
  const pageMarquee = await browser.newPage();
  await pageMarquee.setViewport({ width: 1400, height: 560 });
  await pageMarquee.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        ${baseCss}
        body {
          width: 1400px;
          height: 560px;
          display: flex;
          padding: 50px 80px;
          gap: 60px;
          align-items: center;
          background: linear-gradient(135deg, #0b0f19 0%, #1e1b4b 60%, #311b92 100%);
        }
        .marquee-left {
          flex: 1.2;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .marquee-title {
          font-size: 48px;
          font-weight: 800;
          line-height: 1.15;
          background: linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .marquee-sub {
          font-size: 18px;
          color: #cbd5e1;
          line-height: 1.6;
        }
        .marquee-badges {
          display: flex;
          gap: 12px;
        }
      </style>
    </head>
    <body>
      <div class="marquee-left">
        <div style="display: flex; align-items: center; gap: 14px;">
          ${APP_LOGO_IMG(48)}
          <span class="badge">Chrome Web Store Featured</span>
        </div>
        <h1 class="marquee-title">Scheduled Website Opener</h1>
        <p class="marquee-sub">Automate your browser workflow. Open Jira, daily dashboards, analytics, and meeting links on custom schedules or Chrome startup.</p>
        <div class="marquee-badges">
          <span class="badge badge-green">✓ Daily / Weekly / Monthly</span>
          <span class="badge badge-purple">✓ Chrome Startup Trigger</span>
          <span class="badge">✓ Pin Tab Support</span>
        </div>
      </div>
      <div class="popup-card" style="width: 440px;">
        <div class="popup-header">
          <div class="popup-header-title">
            ${APP_LOGO_IMG(28)}
            <h2>Scheduled Website Opener</h2>
          </div>
          <div class="header-actions-btn header-actions-btn-primary">+</div>
        </div>
        <div style="padding: 10px 0;">
          <div class="scheduler-item">
            <div class="scheduler-info">
              <h4>Daily Standup & Board</h4>
              <div class="scheduler-tags">
                <span class="tag tag-type">Daily</span>
                <span class="tag tag-trigger">09:30 AM</span>
              </div>
            </div>
            <span style="color: #10b981; font-weight: 700; font-size: 12px;">Active</span>
          </div>
          <div class="scheduler-item">
            <div class="scheduler-info">
              <h4>Analytics & Revenue</h4>
              <div class="scheduler-tags">
                <span class="tag tag-type">Everytime</span>
                <span class="tag tag-trigger">Chrome Start</span>
              </div>
            </div>
            <span style="color: #10b981; font-weight: 700; font-size: 12px;">Active</span>
          </div>
          <div class="scheduler-item">
            <div class="scheduler-info">
              <h4>Weekly Team Review</h4>
              <div class="scheduler-tags">
                <span class="tag tag-type">Weekly</span>
                <span class="tag tag-trigger">Mon 10:00 AM</span>
              </div>
            </div>
            <span style="color: #10b981; font-weight: 700; font-size: 12px;">Active</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
  await delay(500);
  await pageMarquee.screenshot({ path: path.join(rawDir, 'marquee-promo-1400x560.png') });

  await browser.close();
  console.log('✅ Puppeteer finished generating raw images!');
}

generateAllAssets().catch((err) => {
  console.error('❌ Error generating assets:', err);
  process.exit(1);
});
