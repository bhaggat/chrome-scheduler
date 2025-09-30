#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

console.log("🚀 Chrome Extension Publisher");
console.log("==============================\n");

// Get version from package.json
const packageJson = JSON.parse(
  fs.readFileSync(path.join(projectRoot, "package.json"), "utf8")
);
const currentVersion = packageJson.version;

console.log(`📦 Current version: ${currentVersion}`);

// Check if dist directory exists
const distPath = path.join(projectRoot, "dist");
if (!fs.existsSync(distPath)) {
  console.log("❌ Dist directory not found. Building project...\n");
  try {
    execSync("npm run build", { cwd: projectRoot, stdio: "inherit" });
    console.log("✅ Build completed successfully!\n");
  } catch (error) {
    console.error("❌ Build failed:", error.message);
    process.exit(1);
  }
} else {
  console.log("✅ Dist directory found\n");
}

// Create zip file for Chrome Web Store
const zipFileName = `scheduled-website-opener-v${currentVersion}.zip`;
const zipPath = path.join(projectRoot, zipFileName);

console.log("📦 Creating zip file for Chrome Web Store...");

try {
  // Remove existing zip if it exists
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  // Create zip using system zip command
  execSync(`cd ${distPath} && zip -r ../${zipFileName} .`, {
    stdio: "inherit",
  });

  console.log(`✅ Zip file created: ${zipFileName}`);
  console.log(`📁 Location: ${zipPath}\n`);
} catch (error) {
  console.error("❌ Failed to create zip file:", error.message);
  process.exit(1);
}

// Display next steps
console.log("🎯 Next Steps:");
console.log("==============");
console.log("1. Go to Chrome Web Store Developer Dashboard:");
console.log("   https://chrome.google.com/webstore/devconsole/");
console.log('2. Find your extension: "Scheduled Website Opener"');
console.log('3. Click "Upload new package"');
console.log(`4. Upload the file: ${zipFileName}`);
console.log("5. Update the version number if needed");
console.log("6. Add release notes describing the changes");
console.log("7. Submit for review\n");

console.log("📋 Release Notes Template:");
console.log("==========================");
console.log(`Version ${currentVersion} Updates:`);
console.log("- Reduced UI spacing and made interface more compact");
console.log("- Improved modal responsiveness and mobile experience");
console.log("- Enhanced visual consistency and modern design");
console.log("- Optimized performance and reduced bundle size");
console.log("- Fixed styling issues and improved user experience\n");

console.log("🔗 Extension URL:");
console.log(
  "https://chromewebstore.google.com/detail/scheduled-website-opener/peimippheccjbhianpahacphickkbbjl"
);

console.log("\n✨ Publishing script completed successfully!");
