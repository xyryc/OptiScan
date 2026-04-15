#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT_DIR = path.resolve(__dirname, "..");
const ENV_FILE = process.env.ENV_FILE || path.join(ROOT_DIR, ".env");
const BUILD_TYPE = process.argv[2] || "aab"; // aab | apk | both

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseEnvFile(filePath) {
  const env = {};
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const idx = line.indexOf("=");
    if (idx === -1) continue;

    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

function requireVar(env, name) {
  if (!env[name] || String(env[name]).trim() === "") {
    fail(`Missing required env var: ${name}`);
  }
}

function updateVersioning(env) {
  const appConfigJsonPath = path.join(ROOT_DIR, "app.config.json");
  if (!fs.existsSync(appConfigJsonPath)) {
    fail(`Missing file: ${appConfigJsonPath}`);
  }

  const appConfig = JSON.parse(fs.readFileSync(appConfigJsonPath, "utf8"));
  const appVersion = String(appConfig?.expo?.version || "").trim();
  const versionCodeRaw = String(appConfig?.expo?.android?.versionCode ?? "").trim();
  const versionCode = Number.parseInt(versionCodeRaw, 10);

  if (!appVersion) {
    fail(`Missing expo.version in ${appConfigJsonPath}`);
  }

  if (!/^\d+\.\d+\.\d+([-.][0-9A-Za-z.]+)?$/.test(appVersion)) {
    fail(`Invalid expo.version in ${appConfigJsonPath}: ${appVersion}`);
  }

  if (!Number.isInteger(versionCode) || versionCode <= 0) {
    fail(`Invalid expo.android.versionCode in ${appConfigJsonPath}: ${versionCodeRaw}`);
  }

  const buildGradlePath = path.join(ROOT_DIR, "android", "app", "build.gradle");
  if (!fs.existsSync(buildGradlePath)) {
    fail(`Missing file: ${buildGradlePath}`);
  }

  let gradleContent = fs.readFileSync(buildGradlePath, "utf8");
  const beforeGradleContent = gradleContent;
  gradleContent = gradleContent.replace(/versionCode\s+\d+/, `versionCode ${versionCode}`);
  gradleContent = gradleContent.replace(/versionName\s+"[^"]+"/, `versionName "${appVersion}"`);

  if (beforeGradleContent === gradleContent) {
    fail(`Could not update version fields in: ${buildGradlePath}`);
  }

  fs.writeFileSync(buildGradlePath, gradleContent, "utf8");
  console.log(`Applied app.config.json version to Android native: ${appVersion} (${versionCode})`);
}

function runGradleTask(androidDir, task, gradleArgs) {
  const gradleCmd = process.platform === "win32" ? "gradlew.bat" : "./gradlew";
  const result = spawnSync(gradleCmd, [task, ...gradleArgs], {
    cwd: androidDir,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

if (!fs.existsSync(ENV_FILE)) {
  fail(`Missing env file: ${ENV_FILE}\nCopy .env.example to .env and fill Android signing values.`);
}

if (!["aab", "apk", "both"].includes(BUILD_TYPE)) {
  fail(`Invalid build type: ${BUILD_TYPE}\nUsage: node scripts/release-android.js [aab|apk|both]`);
}

const fileEnv = parseEnvFile(ENV_FILE);
const env = { ...fileEnv, ...process.env };

requireVar(env, "ANDROID_KEYSTORE_PATH");
requireVar(env, "ANDROID_KEYSTORE_PASSWORD");
requireVar(env, "ANDROID_KEY_ALIAS");
updateVersioning(env);

const keyPassword =
  env.ANDROID_KEY_PASSWORD && String(env.ANDROID_KEY_PASSWORD).trim() !== ""
    ? env.ANDROID_KEY_PASSWORD
    : env.ANDROID_KEYSTORE_PASSWORD;

const keystorePath = path.isAbsolute(env.ANDROID_KEYSTORE_PATH)
  ? env.ANDROID_KEYSTORE_PATH
  : path.resolve(ROOT_DIR, env.ANDROID_KEYSTORE_PATH);

if (!fs.existsSync(keystorePath)) {
  fail(`Keystore not found at: ${keystorePath}`);
}

const androidAppDir = path.join(ROOT_DIR, "android", "app");
if (!fs.existsSync(androidAppDir)) {
  fail(`Missing ${androidAppDir}\nRun: npx expo prebuild --platform android`);
}

const targetKeystorePath = path.join(androidAppDir, "release.keystore");
fs.copyFileSync(keystorePath, targetKeystorePath);

try {
  fs.chmodSync(targetKeystorePath, 0o600);
} catch {
  // Ignore on platforms where chmod is not applicable.
}

console.log(`Copied keystore to: ${targetKeystorePath}`);

const gradleArgs = [
  `-PMYAPP_UPLOAD_STORE_FILE=${targetKeystorePath}`,
  `-PMYAPP_UPLOAD_STORE_PASSWORD=${env.ANDROID_KEYSTORE_PASSWORD}`,
  `-PMYAPP_UPLOAD_KEY_ALIAS=${env.ANDROID_KEY_ALIAS}`,
  `-PMYAPP_UPLOAD_KEY_PASSWORD=${keyPassword}`,
];

const androidDir = path.join(ROOT_DIR, "android");

if (BUILD_TYPE === "aab" || BUILD_TYPE === "both") {
  runGradleTask(androidDir, "bundleRelease", gradleArgs);
  console.log(`AAB: ${path.join(ROOT_DIR, "android/app/build/outputs/bundle/release/app-release.aab")}`);
  console.log("Verify AAB signature:");
  console.log(
    `jarsigner -verify -verbose -certs "${path.join(
      ROOT_DIR,
      "android/app/build/outputs/bundle/release/app-release.aab"
    )}"`
  );
}

if (BUILD_TYPE === "apk" || BUILD_TYPE === "both") {
  runGradleTask(androidDir, "assembleRelease", gradleArgs);
  console.log(`APK: ${path.join(ROOT_DIR, "android/app/build/outputs/apk/release/app-release.apk")}`);
  console.log("Verify APK signature (recommended):");
  console.log(
    `apksigner verify --verbose --print-certs "${path.join(
      ROOT_DIR,
      "android/app/build/outputs/apk/release/app-release.apk"
    )}"`
  );
}
