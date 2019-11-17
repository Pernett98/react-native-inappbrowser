#!/usr/bin/env node
const parseArgs = require('minimist')
const { exec } = require('child_process')

const { 
  platform,
  deviceName,
  platformVersion
} = parseArgs(process.argv)

const getDefault = (value, defaultValue) => value || ''
const fixPlatformVersion = (version) => {
  if (version) return version.toFixed(1)
}

console.log({ 
  platform,
  deviceName,
  platformVersion
})
exec(`E2E_OS=${getDefault(platform)} E2E_PLATFORM=${getDefault(platform)} E2E_PLATFORM_VERSION=${getDefault(fixPlatformVersion(platformVersion))} E2E_DEVICE="${getDefault(deviceName)}" yarn e2e`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});