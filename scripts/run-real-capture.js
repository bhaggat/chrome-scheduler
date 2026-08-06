import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const rawDir = path.join(rootDir, 'chrome-store-assets', 'raw');
const chromeStoreDir = path.join(rootDir, 'chrome-store-assets', 'screenshots');
const chromePromoDir = path.join(rootDir, 'chrome-store-assets', 'promo');

[rawDir, chromeStoreDir, chromePromoDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateRealAssets() {
  console.log('🚀 Starting Real App Screenshot Capture with Left Info + Right App Layout...');
  
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });

  const sampleSchedulers = [
    {
      id: '1',
      title: 'Daily Standup & Jira Board',
      url: 'https://jira.atlassian.com/secure/Dashboard.jspa',
      type: 'Daily',
      triggerType: 'On Scheduled time',
      scheduledTime: '2026-08-10T09:30:00.000Z',
      shouldPin: true,
      focusOnOpen: true,
    },
    {
      id: '2',
      title: 'Google Analytics Dashboard',
      url: 'https://analytics.google.com/analytics/web',
      type: 'Daily',
      triggerType: 'Everytime on chrome open',
      shouldPin: true,
      focusOnOpen: false,
    },
    {
      id: '3',
      title: 'GitHub Pull Requests Sync',
      url: 'https://github.com/notifications',
      type: 'Daily',
      triggerType: 'Once per day',
      shouldPin: false,
      focusOnOpen: true,
    },
    {
      id: '4',
      title: 'Weekly Sprint Retrospective',
      url: 'https://miro.com/app/dashboard',
      type: 'Weekly',
      triggerType: 'On Scheduled time',
      scheduledTime: '2026-08-10T11:00:00.000Z',
      shouldPin: false,
      focusOnOpen: true,
    },
  ];

  // Helper to frame the page: Left Title & Description + Right Real App Popup
  async function wrapAppSplit(title, badgeText, description, features = []) {
    await page.evaluate((title, badgeText, description, features) => {
      document.body.style.width = '1280px';
      document.body.style.height = '800px';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.background = 'linear-gradient(135deg, #0b0f19 0%, #1e1b4b 60%, #311b92 100%)';
      document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      document.body.style.display = 'flex';
      document.body.style.flexDirection = 'row';
      document.body.style.alignItems = 'center';
      document.body.style.justifyContent = 'space-between';
      document.body.style.padding = '50px 70px';
      document.body.style.overflow = 'hidden';

      // Left column container
      let leftEl = document.getElementById('showcase-left');
      if (!leftEl) {
        leftEl = document.createElement('div');
        leftEl.id = 'showcase-left';
        document.body.insertBefore(leftEl, document.body.firstChild);
      }

      leftEl.style.position = 'relative';
      leftEl.style.zIndex = '999999';
      leftEl.style.flex = '1';
      leftEl.style.maxWidth = '550px';
      leftEl.style.display = 'flex';
      leftEl.style.flexDirection = 'column';
      leftEl.style.gap = '20px';
      leftEl.style.color = '#ffffff';

      // Style override element to prevent modal-overlay from dimming or blurring left side text
      let styleOverride = document.getElementById('store-style-override');
      if (!styleOverride) {
        styleOverride = document.createElement('style');
        styleOverride.id = 'store-style-override';
        document.head.appendChild(styleOverride);
      }
      styleOverride.innerHTML = `
        #showcase-left, #showcase-left * {
          position: relative !important;
          z-index: 999999 !important;
          opacity: 1 !important;
          filter: none !important;
        }
        .modal-overlay {
          position: absolute !important;
          top: 0 !important;
          left: auto !important;
          right: 70px !important;
          width: 440px !important;
          height: 800px !important;
          background: rgba(11, 15, 25, 0.45) !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          z-index: 1000 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .modal {
          width: 420px !important;
          max-width: 420px !important;
          margin: 0 auto !important;
          box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 35px rgba(99, 102, 241, 0.4) !important;
        }
      `;

      const featureItemsHtml = features.map(f => `
        <div style="display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 600; color: #f1f5f9;">
          <div style="width: 24px; height: 24px; border-radius: 50%; background: rgba(16, 185, 129, 0.2); color: #34d399; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; flex-shrink: 0;">✓</div>
          <span>${f}</span>
        </div>
      `).join('');

      leftEl.innerHTML = `
        <div>
          <span style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 16px; border-radius: 9999px; font-size: 13px; font-weight: 700; background: rgba(99, 102, 241, 0.25); color: #c7d2fe; border: 1px solid rgba(165, 180, 252, 0.4); text-transform: uppercase; letter-spacing: 0.5px;">
            ${badgeText}
          </span>
        </div>
        <h1 style="font-size: 42px; font-weight: 800; line-height: 1.15; color: #ffffff; margin: 0; background: linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          ${title}
        </h1>
        <p style="font-size: 16.5px; color: #cbd5e1; line-height: 1.6; margin: 0; font-weight: 400;">
          ${description}
        </p>
        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
          ${featureItemsHtml}
        </div>
      `;

      // Right column wrapper for the real app root
      const root = document.getElementById('root');
      if (root) {
        root.style.minHeight = 'auto';
        root.style.height = 'auto';
        root.style.width = '440px';
        root.style.display = 'flex';
        root.style.justifyContent = 'center';
        root.style.alignItems = 'center';
      }

      const container = document.querySelector('.app-container');
      if (container) {
        container.style.width = '420px';
        container.style.margin = '0 auto';
        container.style.height = 'auto';
      }

      const list = document.querySelector('.scheduler-list');
      if (list) {
        list.style.width = '420px';
        list.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px rgba(99, 102, 241, 0.35)';
      }
    }, title, badgeText, description, features);
  }

  // Pre-populate localStorage
  console.log('Pre-populating localStorage on new document...');
  await page.evaluateOnNewDocument((data) => {
    localStorage.setItem('schedulers', JSON.stringify(data));
    localStorage.setItem('preferences', JSON.stringify({
      checkoutReminderEnabled: true,
      checkoutUrl: 'https://company.com/checkout',
      reminderMessage: 'Did you complete your daily work log before closing Chrome?',
      confirmButtonText: 'Open Work Log',
      dismissButtonText: 'Dismiss',
    }));
  }, sampleSchedulers);

  // 1. Navigation to dev server
  console.log('Navigating to http://localhost:5188/...');
  await page.goto('http://localhost:5188/');
  await page.waitForSelector('.scheduler-list', { timeout: 10000 });
  await delay(500);

  // Screenshot 1: Overview Dashboard
  console.log('Capturing Screenshot 1...');
  await wrapAppSplit(
    'Automate Your Daily Web Routine',
    '🚀 Scheduled Website Opener',
    'Automatically launch your daily tools, Jira boards, analytics dashboards, and meeting URLs without opening them manually.',
    [
      'Daily, Weekly & Monthly Schedules',
      'Auto-Launch on Chrome Startup',
      'Support for Pinned Tabs & Focus',
      'Lightweight & Fast (Manifest V3)'
    ]
  );
  await delay(400);
  await page.screenshot({ path: path.join(rawDir, '1-overview-dashboard.png') });
  console.log('✅ Screenshot 1 captured!');

  // Screenshot 2: Add Scheduler Modal
  console.log('Opening Add Scheduler modal...');
  await page.evaluate(() => {
    const addBtns = document.querySelectorAll('.add-button');
    if (addBtns.length > 0) addBtns[0].click();
  });
  await page.waitForSelector('.modal-overlay', { timeout: 5000 });
  await wrapAppSplit(
    'Flexible Recurrence & Custom Timers',
    '⏰ Advanced Scheduling',
    'Set up precise time triggers, custom recurrence days, and time window constraints for any target URL.',
    [
      'Pick Specific Days & Exact Times',
      'Daily, Weekly, Monthly & Yearly Rules',
      'Time Window Restrictions',
      'One-Click Add & Edit Controls'
    ]
  );
  await delay(400);
  await page.screenshot({ path: path.join(rawDir, '2-flexible-scheduler.png') });
  console.log('✅ Screenshot 2 captured!');

  // Close Modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.click();
  });
  await delay(300);

  // Screenshot 3: Settings Modal
  console.log('Opening Settings modal...');
  await page.evaluate(() => {
    const addBtns = document.querySelectorAll('.add-button');
    if (addBtns.length > 1) addBtns[1].click();
  });
  await page.waitForSelector('.modal-overlay', { timeout: 5000 });
  await wrapAppSplit(
    'Custom Preferences & Checkout Prompts',
    '⚙️ Extension Settings',
    'Configure checkout prompts, reminder URLs, and custom confirmation messages before closing your browser.',
    [
      'Checkout Work Log Reminders',
      'Custom Confirmation Messages',
      'Toggle Desktop Notifications',
      'Instant Preferences Sync'
    ]
  );
  await delay(400);
  await page.screenshot({ path: path.join(rawDir, '3-smart-triggers.png') });
  console.log('✅ Screenshot 3 captured!');

  // Close Settings Modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.click();
  });
  await delay(300);

  // Screenshot 4: Help Modal
  console.log('Opening Help modal...');
  await page.evaluate(() => {
    const addBtns = document.querySelectorAll('.add-button');
    if (addBtns.length > 2) addBtns[2].click();
  });
  await page.waitForSelector('.modal-overlay', { timeout: 5000 });
  await wrapAppSplit(
    'Built-in Onboarding & Setup Guide',
    '📖 Instructions & FAQ',
    'Access step-by-step instructions, alarm permission FAQs, and setup tips directly inside the popup.',
    [
      'Instant Onboarding & FAQ Guide',
      'Alarm Permission Setup Help',
      'Simple 1-Click Operations',
      'Clean Glassmorphic UI Design'
    ]
  );
  await delay(400);
  await page.screenshot({ path: path.join(rawDir, '4-pinned-tabs-settings.png') });
  console.log('✅ Screenshot 4 captured!');

  // Close Help Modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.click();
  });
  await delay(300);

  // Screenshot 5: Edit Modal
  console.log('Opening Edit modal...');
  await page.evaluate(() => {
    const editBtns = document.querySelectorAll('.edit-button');
    if (editBtns.length > 0) editBtns[0].click();
  });
  await page.waitForSelector('.modal-overlay', { timeout: 5000 });
  await wrapAppSplit(
    'Pinned Tabs & Smart Tab Focus',
    '📌 Pinned Tab Integration',
    'Keep your critical dashboards pinned automatically so your workspace stays clean and organized.',
    [
      'Auto-Pin Scheduled Websites',
      'Custom Tab Focus Options',
      'Instant Edit & Update Controls',
      'Safe Local Storage Privacy'
    ]
  );
  await delay(400);
  await page.screenshot({ path: path.join(rawDir, '5-modern-design-quality.png') });
  console.log('✅ Screenshot 5 captured!');

  // Small Promo Tile (440x280)
  console.log('Capturing Small Promo Tile...');
  const pageSmall = await browser.newPage();
  await pageSmall.setViewport({ width: 440, height: 280, deviceScaleFactor: 2 });
  const iconBase64 = fs.readFileSync(path.join(rootDir, 'public', 'icon.png')).toString('base64');
  
  await pageSmall.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 440px;
          height: 280px;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #311b92 100%);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 24px;
          color: #ffffff;
        }
        .logo-img {
          width: 54px;
          height: 54px;
          border-radius: 12px;
          background: #ffffff;
          padding: 4px;
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
          margin-bottom: 12px;
        }
        .title {
          font-size: 22px;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 6px;
        }
        .subtitle {
          font-size: 12px;
          color: #94a3b8;
          max-width: 360px;
          line-height: 1.4;
          margin-bottom: 14px;
        }
        .chips {
          display: flex;
          gap: 6px;
        }
        .chip {
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 10px;
          font-weight: 700;
          background: rgba(99, 102, 241, 0.25);
          color: #c7d2fe;
          border: 1px solid rgba(165, 180, 252, 0.4);
        }
      </style>
    </head>
    <body>
      <img src="data:image/png;base64,${iconBase64}" class="logo-img" alt="Logo" />
      <div class="title">Scheduled Website Opener</div>
      <div class="subtitle">Auto-open Jira, Analytics, & daily tools at scheduled times or Chrome startup.</div>
      <div class="chips">
        <span class="chip">⏰ Daily & Weekly</span>
        <span class="chip">🚀 Auto-Launch</span>
        <span class="chip">📌 Pinned Tabs</span>
      </div>
    </body>
    </html>
  `);
  await delay(300);
  await pageSmall.screenshot({ path: path.join(rawDir, 'small-promo-440x280.png') });
  console.log('✅ Small Promo Tile captured!');

  // Marquee Promo Tile (1400x560)
  console.log('Capturing Marquee Promo Tile...');
  const pageMarquee = await browser.newPage();
  await pageMarquee.setViewport({ width: 1400, height: 560, deviceScaleFactor: 2 });
  
  await pageMarquee.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          width: 1400px;
          height: 560px;
          background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311b92 100%);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          padding: 60px 90px;
          gap: 70px;
          align-items: center;
          color: #ffffff;
        }
        .hero-left {
          flex: 1.2;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          background: rgba(99, 102, 241, 0.25);
          color: #c7d2fe;
          border: 1px solid rgba(165, 180, 252, 0.4);
          text-transform: uppercase;
        }
        .hero-title {
          font-size: 48px;
          font-weight: 800;
          line-height: 1.15;
          background: linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero-desc {
          font-size: 18px;
          color: #cbd5e1;
          line-height: 1.6;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 10px;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
          color: #e2e8f0;
        }
        .check-icon {
          color: #34d399;
          font-weight: 800;
        }
        .card-preview {
          width: 420px;
          background: #ffffff;
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6), 0 0 30px rgba(99, 102, 241, 0.4);
          color: #2d3748;
        }
      </style>
    </head>
    <body>
      <div class="hero-left">
        <div style="display: flex; align-items: center; gap: 14px;">
          <img src="data:image/png;base64,${iconBase64}" width="44" height="44" style="border-radius: 10px; background: #fff; padding: 3px;" alt="Logo" />
          <span class="badge">Chrome Web Store Extension</span>
        </div>
        <h1 class="hero-title">Scheduled Website Opener</h1>
        <p class="hero-desc">Automate your daily web routine. Open Jira, dashboards, analytics, and meeting links on custom schedules or Chrome startup.</p>
        <div class="feature-grid">
          <div class="feature-item"><span class="check-icon">✓</span> Daily, Weekly & Monthly Schedules</div>
          <div class="feature-item"><span class="check-icon">✓</span> Chrome Startup Auto-Launch</div>
          <div class="feature-item"><span class="check-icon">✓</span> Automatic Pinned Tab Support</div>
          <div class="feature-item"><span class="check-icon">✓</span> Custom Checkout Reminders</div>
        </div>
      </div>
      <div class="card-preview">
        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid rgba(102,126,234,0.2); margin-bottom: 14px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <img src="data:image/png;base64,${iconBase64}" width="28" height="28" style="border-radius: 6px;" alt="Logo" />
            <h2 style="font-size: 18px; font-weight: 700; margin: 0; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Schedulers</h2>
          </div>
          <div style="padding: 6px 12px; border-radius: 10px; background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; font-size: 13px; font-weight: 700;">+ Add New</div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="padding: 12px; background: rgba(102,126,234,0.06); border-radius: 10px; border: 1px solid rgba(102,126,234,0.15); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 700; color: #4c51bf; font-size: 14px;">Daily Standup & Jira</div>
              <div style="display: flex; gap: 6px; margin-top: 4px;">
                <span style="padding: 2px 8px; border-radius: 10px; background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; font-size: 10px; font-weight: 600;">Daily</span>
                <span style="padding: 2px 8px; border-radius: 10px; background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; font-size: 10px; font-weight: 600;">09:30 AM</span>
              </div>
            </div>
            <span style="color: #38a169; font-weight: 700; font-size: 12px;">Active</span>
          </div>
          <div style="padding: 12px; background: rgba(102,126,234,0.06); border-radius: 10px; border: 1px solid rgba(102,126,234,0.15); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 700; color: #4c51bf; font-size: 14px;">Google Analytics Dashboard</div>
              <div style="display: flex; gap: 6px; margin-top: 4px;">
                <span style="padding: 2px 8px; border-radius: 10px; background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; font-size: 10px; font-weight: 600;">Everytime</span>
                <span style="padding: 2px 8px; border-radius: 10px; background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; font-size: 10px; font-weight: 600;">Startup</span>
              </div>
            </div>
            <span style="color: #38a169; font-weight: 700; font-size: 12px;">Active</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
  await delay(300);
  await pageMarquee.screenshot({ path: path.join(rawDir, 'marquee-promo-1400x560.png') });
  console.log('✅ Marquee Promo Tile captured!');

  await browser.close();
  console.log('🎉 ALL STORE ASSETS WITH LEFT INFO + RIGHT APP CREATED SUCCESSFULLY!');
}

generateRealAssets().catch((err) => {
  console.error('❌ Error during capture:', err);
  process.exit(1);
});
