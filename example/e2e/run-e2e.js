#!/usr/bin/env node
const parseArgs = require('minimist')
const { exec } = require('child_process')

const { 
  platform,
  deviceName,
  platformVersion
} = parseArgs(process.argv)

exec(`E2E_OS=${platform} E2E_PLATFORM=${platform} E2E_PLATFORM_VERSION=${platformVersion} E2E_DEVICE="${deviceName}" yarn e2e`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});