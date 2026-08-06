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
  console.log('🚀 Launching Puppeteer to capture REAL app screenshots from http://localhost:5173/...');
  
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });

  // Sample data to inject into real app
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

  // Function to setup wrapper page surrounding the real app
  async function wrapApp(title, badgeText, description) {
    await page.evaluate((title, badgeText, description) => {
      // Style body and wrapper to frame the real app nicely
      document.body.style.width = '1280px';
      document.body.style.height = '800px';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311b92 100%)';
      document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      document.body.style.display = 'flex';
      document.body.style.flexDirection = 'column';
      document.body.style.alignItems = 'center';
      document.body.style.justifyContent = 'center';
      document.body.style.overflow = 'hidden';

      // Check if showcase-header already exists
      let headerEl = document.getElementById('showcase-header');
      if (!headerEl) {
        headerEl = document.createElement('div');
        headerEl.id = 'showcase-header';
        document.body.insertBefore(headerEl, document.body.firstChild);
      }

      headerEl.style.textAlign = 'center';
      headerEl.style.marginBottom = '24px';
      headerEl.style.color = '#ffffff';
      headerEl.innerHTML = `
        <div style="display: inline-block; padding: 6px 16px; border-radius: 9999px; background: rgba(99, 102, 241, 0.25); border: 1px solid rgba(165, 180, 252, 0.4); color: #c7d2fe; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
          ${badgeText}
        </div>
        <h1 style="font-size: 38px; font-weight: 800; margin: 0 0 8px 0; background: linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          ${title}
        </h1>
        <p style="font-size: 16px; color: #cbd5e1; margin: 0; max-width: 650px;">
          ${description}
        </p>
      `;

      // Style root container
      const root = document.getElementById('root');
      if (root) {
        root.style.minHeight = 'auto';
        root.style.height = 'auto';
        root.style.width = '420px';
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
        list.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(99, 102, 241, 0.3)';
      }
    }, title, badgeText, description);
  }

  console.log('Navigating to http://localhost:5173/...');
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  console.log('Page navigation complete!');

  // Set localStorage data
  await page.evaluate((data) => {
    localStorage.setItem('schedulers', JSON.stringify(data));
    localStorage.setItem('preferences', JSON.stringify({
      checkoutReminderEnabled: true,
      checkoutUrl: 'https://company.com/checkout',
      reminderMessage: 'Did you complete your daily work log before closing Chrome?',
      confirmButtonText: 'Open Work Log',
      dismissButtonText: 'Dismiss',
    }));
  }, sampleSchedulers);

  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.scheduler-list');

  // Screenshot 1: Overview Dashboard
  await wrapApp(
    'Automate Your Daily Web Workflow',
    '🚀 Scheduled Website Opener',
    'Automatically open specific websites on daily schedules, alarms, or Chrome startup.'
  );
  await delay(400);
  await page.screenshot({ path: path.join(rawDir, '1-overview-dashboard.png') });
  console.log('✅ Captured Screenshot 1: Real Overview Dashboard');

  // Screenshot 2: Add Scheduler Modal
  await page.evaluate(() => {
    const addBtns = document.querySelectorAll('.add-button');
    if (addBtns.length > 0) addBtns[0].click(); // Click Add button
  });
  await page.waitForSelector('.modal');
  await wrapApp(
    'Flexible Scheduling & Recurrence',
    '⏰ Custom Timers & Triggers',
    'Configure Daily, Weekly, Monthly schedules with time windows and pin tab options.'
  );
  await delay(400);
  await page.screenshot({ path: path.join(rawDir, '2-flexible-scheduler.png') });
  console.log('✅ Captured Screenshot 2: Real Add Scheduler Modal');

  // Close Add Modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.click();
  });
  await delay(300);

  // Screenshot 3: Settings Modal
  await page.evaluate(() => {
    const addBtns = document.querySelectorAll('.add-button');
    if (addBtns.length > 1) addBtns[1].click(); // Click Settings button
  });
  await page.waitForSelector('.modal');
  await wrapApp(
    'Custom Preferences & Checkout Reminders',
    '⚙️ Extension Settings',
    'Set up checkout prompts, reminder URLs, and custom modal confirmation messages.'
  );
  await delay(400);
  await page.screenshot({ path: path.join(rawDir, '3-smart-triggers.png') });
  console.log('✅ Captured Screenshot 3: Real Settings Modal');

  // Close Settings Modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.click();
  });
  await delay(300);

  // Screenshot 4: Help Modal
  await page.evaluate(() => {
    const addBtns = document.querySelectorAll('.add-button');
    if (addBtns.length > 2) addBtns[2].click(); // Click Help button
  });
  await page.waitForSelector('.modal');
  await wrapApp(
    'Built-in User Guide & Instructions',
    '📖 Step-by-Step Help',
    'Clear instructions on setting up background alarms, startup rules, and permissions.'
  );
  await delay(400);
  await page.screenshot({ path: path.join(rawDir, '4-pinned-tabs-settings.png') });
  console.log('✅ Captured Screenshot 4: Real Help Modal');

  // Close Help Modal
  await page.evaluate(() => {
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) closeBtn.click();
  });
  await delay(300);

  // Screenshot 5: Edit Modal / Pinned Tabs
  await page.evaluate(() => {
    const editBtns = document.querySelectorAll('.edit-button');
    if (editBtns.length > 0) editBtns[0].click(); // Edit first scheduler item
  });
  await page.waitForSelector('.modal');
  await wrapApp(
    'Edit Schedulers & Pin Tab Control',
    '📌 Pinned Tab Integration',
    'Easily modify target URLs, trigger times, and automatic tab pinning behavior.'
  );
  await delay(400);
  await page.screenshot({ path: path.join(rawDir, '5-modern-design-quality.png') });
  console.log('✅ Captured Screenshot 5: Real Edit Scheduler Modal');

  // Small Promo Tile (440x280)
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
          width: 56px;
          height: 56px;
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
  console.log('✅ Captured Small Promo Tile (440x280)');

  // Marquee Promo Tile (1400x560)
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
  console.log('✅ Captured Marquee Promo Tile (1400x560)');

  await browser.close();
  console.log('🎉 REAL App screenshots and promo tiles captured successfully!');
}

generateRealAssets().catch((err) => {
  console.error('❌ Error capturing real assets:', err);
  process.exit(1);
});
