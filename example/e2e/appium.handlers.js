export const handleIosAlert = (driver, text) => driver
  .waitForElementByAccessibilityId(text)
  .click()

export const handleAndroidAlert = (driver) => driver
  .waitForElementById("android:id/button1")
  .click()

export const handleRedirectLinkAndroid = (driver) => driver
  .waitForElementByXPath("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.FrameLayout[1]/android.widget.FrameLayout[2]/android.webkit.WebView/android.view.View[2]")
  .click()

export const handleRedirectLinkIos = (driver, text) => driver
  .waitForElementByName(text)
  .click()

export const handleCloseBrowserAndroid = (driver) => driver
  .waitForElementByAccessibilityId("Close tab")
  .click()
  
export const handleCloseBrowserIos = (driver, text) => driver
  .waitForElementByAccessibilityId(text)
  .click()