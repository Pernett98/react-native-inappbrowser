import wd from 'wd'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 80000

const SERVER_PORT = 4723
const SERVER_URL = 'localhost'

const getFromEnv = (env) => (key) => env[key] || ''
const getEnv = getFromEnv(process.env)
const os = getEnv('E2E_OS')
const platform = getEnv('E2E_PLATFORM')
const platformVersion = getEnv('E2E_PLATFORM_VERSION')
const device = getEnv('E2E_DEVICE')

const platformSelect = (platforms) => {
  return platforms[os.toLowerCase()]
}

const makeCapabilitiesIos = (deviceName, platformVersion) => ({
  platformName: 'iOS',
  deviceName: deviceName || 'iPhone X',
  platformVersion: platformVersion || '13.2',
  automationName: 'XCUITest',
  app: './ios/build/example/Build/Products/Release-iphonesimulator/example.app.zip',
})

const makeCapabilitiesAndroid = (deviceName, platformVersion) => ({
  platformName: 'Android',
  deviceName: deviceName || 'Android Emulator',
  app: './android/app/build/outputs/apk/release/app-release.apk',
})

const sleep = (time = 500) => new Promise(resolve => setTimeout(resolve, time))

const driver = wd.promiseChainRemote(SERVER_URL, SERVER_PORT)

const handleIosAlert = (driver, text) => driver
  .waitForElementByAccessibilityId(text)
  .click()

const handleAndroidAlert = (driver) => driver
  .waitForElementById("android:id/button1")
  .click()

const handleRedirectLinkAndroid = (driver) => driver
  .waitForElementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout[1]/android.widget.FrameLayout[2]/android.webkit.WebView/android.view.View[2]")
  .click()

const handleRedirectLinkIos = (driver, text) => driver
  .waitForElementByName(text)
  .click()

const handleCloseBrowserAndroid = (driver) => driver
  .waitForElementByAccessibilityId("Close tab")
  .click()

const handleCloseBrowserIos = (driver, text) => driver
  .waitForElementByAccessibilityId(text)
  .click()

describe('SomeComponent', () => {
                      
  beforeAll(async () => {
    try {
      const capabilities = platformSelect({
        ios: makeCapabilitiesIos(device, platformVersion),
        android: makeCapabilitiesAndroid(device, platformVersion)
      })
      console.log('running e2e tests with the following capabilities')
      console.log(capabilities)
      await driver.init(capabilities)
      await driver.driver.sleep(90000) // wait for app to load
    } catch(err) {
      console.log(err)
    }
  })

  beforeEach(async () => {
    try {
      await driver.resetApp()
    } catch(err) {
      console.log(err)
    }
  })

  afterAll(async () => {
    try {
      await driver.quit()
    }
    catch(err) {
      console.error(err)
    }
  })
                                            
  test('try deep linking', async () => {
    const tryDeepBtn = await driver.waitForElementByAccessibilityId('btn_try_deep_linking')
    await tryDeepBtn
      .click()
    await platformSelect({
      ios: handleIosAlert(driver, 'Continue'),
      android: Promise.resolve()
    })
    await driver.sleep(1500)

    await platformSelect({
      ios: handleRedirectLinkIos(driver, 'Press here to redirect'),
      android: handleRedirectLinkAndroid(driver)
    })

    await driver.sleep(1000)

     await platformSelect({
       ios: handleIosAlert(driver, 'OK'),
       android: handleAndroidAlert(driver)
     }) 
    expect(await driver.hasElementByAccessibilityId('btn_try_deep_linking')).toBe(true)
  })  
  
  test('try redirect', async () => {
    const openLinkBtn = await driver.waitForElementByAccessibilityId('btn_open_link')
    await openLinkBtn
      .click()
    await driver.sleep(1000)
    await platformSelect({
      ios: handleCloseBrowserIos(driver, 'Cancel'),
      android: handleCloseBrowserAndroid(driver)
    })
    await driver.sleep(1000)
    await platformSelect({
      ios: handleIosAlert(driver, 'OK'),
      android: handleAndroidAlert(driver)
    })
    expect(await driver.hasElementByAccessibilityId('btn_open_link')).toBe(true)
  })

})