#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

console.log("📈 Version Bumper");
console.log("================\n");

// Get current version
const packageJsonPath = path.join(projectRoot, "package.json");
const manifestPath = path.join(projectRoot, "public/manifest.json");

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const currentVersion = packageJson.version;
console.log(`Current version: ${currentVersion}`);

// Parse version
const versionParts = currentVersion.split(".").map(Number);
const [major, minor, patch] = versionParts;

// Get bump type from command line argument
const bumpType = process.argv[2] || "patch";

let newVersion;
switch (bumpType) {
  case "major":
    newVersion = `${major + 1}.0.0`;
    break;
  case "minor":
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case "patch":
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
  default:
    console.error("❌ Invalid bump type. Use: major, minor, or patch");
    process.exit(1);
}

console.log(`New version: ${newVersion}\n`);

// Update package.json
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");

// Update manifest.json
manifest.version = newVersion;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

console.log("✅ Version updated successfully!");
console.log(`📦 Package.json: ${newVersion}`);
console.log(`📋 Manifest.json: ${newVersion}\n`);

console.log("🎯 Next steps:");
console.log("1. Test your changes");
console.log("2. Commit your changes");
console.log("3. Run: npm run package");
console.log("4. Upload to Chrome Web Store");
