import {
  getFromEnv,
  getPlatformSelect,
  getPlatformSelectLazy,
} from './environment.utils';
import {
  handleAndroidAlert,
  handleCloseBrowserAndroid,
  handleCloseBrowserIos,
  handleIosAlert,
  handleRedirectLinkAndroid,
  handleRedirectLinkIos,
} from './appium.handlers';

const wd = require('wd');

const getEnv = getFromEnv(process.env);

jasmine.DEFAULT_TIMEOUT_INTERVAL = getEnv('JEST_INTERVAL_TIME', 800000);

const SERVER_PORT = getEnv('APPIUM_PORT', 4723);
const SERVER_URL = getEnv('APPIUM_HOST', 'localhost');
const WAIT_FOR_SIMULATOR = getEnv('APPIUM_WAIT_FOR_SIMULATOR', 6000);

const platform = getEnv('E2E_PLATFORM');
const platformVersion = getEnv('E2E_PLATFORM_VERSION');
const device = getEnv('E2E_DEVICE');

const platformSelect = getPlatformSelect(platform);
const platformSelectLazy = getPlatformSelectLazy(platformSelect);

const makeCapabilitiesIos = (deviceName, version) => ({
  platformName: 'iOS',
  deviceName: deviceName || 'iPhone X',
  platformVersion: version || '12.0',
  automationName: 'XCUITest',
  app: './ios/build/example/Build/Products/Release-iphonesimulator/example.app.zip',
});

const makeCapabilitiesAndroid = deviceName => ({
  platformName: 'Android',
  deviceName: deviceName || 'Android Emulator',
  app: './android/app/build/outputs/apk/release/app-release.apk',
});

const driver = wd.promiseChainRemote(SERVER_URL, SERVER_PORT);

describe('Simple tests for deep linking and redirection', () => {
  beforeAll(async () => {
    try {
      const capabilities = platformSelect({
        ios: makeCapabilitiesIos(device, platformVersion),
        android: makeCapabilitiesAndroid(device, platformVersion),
      });
      await driver.init(capabilities);
      await driver.sleep(WAIT_FOR_SIMULATOR);
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await driver.resetApp();
      await driver.sleep(10000); // wait for app to load
    } catch (err) {
      console.log(err);
    }
  });

  afterAll(async () => {
    await driver.quit();
  });

  test('try redirect', async () => {
    const openLinkBtn = await driver.waitForElementByAccessibilityId(
      'btn_open_link',
    );
    await openLinkBtn.click();
    await driver.sleep(1000);
    await platformSelectLazy({
      ios: () => handleCloseBrowserIos(driver, 'Cancel'),
      android: () => handleCloseBrowserAndroid(driver),
    });
    await driver.sleep(1000);
    await platformSelectLazy({
      ios: () => handleIosAlert(driver, 'OK'),
      android: () => handleAndroidAlert(driver),
    });
    expect(await driver.hasElementByAccessibilityId('btn_open_link')).toBe(
      true,
    );
  });

  test('try deep linking', async () => {
    const tryDeepBtn = await driver.waitForElementByAccessibilityId(
      'btn_try_deep_linking',
    );
    await tryDeepBtn.click();
    await platformSelectLazy({
      ios: () => handleIosAlert(driver, 'Continue'),
      android: () => Promise.resolve(),
    });
    await driver.sleep(1500);

    await platformSelectLazy({
      ios: () => handleRedirectLinkIos(driver, 'Press here to redirect'),
      android: () => handleRedirectLinkAndroid(driver),
    });

    await driver.sleep(1000);

    await platformSelectLazy({
      ios: () => handleIosAlert(driver, 'OK'),
      android: () => handleAndroidAlert(driver),
    });
    expect(
      await driver.hasElementByAccessibilityId('btn_try_deep_linking'),
    ).toBe(true);
  });
});
