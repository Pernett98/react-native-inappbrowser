#!/usr/bin/env node
'use strict';

const parseArgs = require('minimist');
const {exec} = require('child_process');

const {platform, deviceName, platformVersion} = parseArgs(process.argv);

const getDefault = (value, defaultValue) => value || '';
const fixPlatformVersion = version => {
  if (version) {
    return version.toFixed(1);
  }
};

console.log({
  platform,
  deviceName,
  platformVersion,
});

const platformEnv = getDefault(platform)


exec(
  `E2E_PLATFORM=${platformEnv} E2E_PLATFORM_VERSION=${getDefault(
    fixPlatformVersion(platformVersion),
  )} E2E_DEVICE="${getDefault(deviceName)}" yarn e2e`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      process.exit(error.code);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    process.exit();
  },
);
