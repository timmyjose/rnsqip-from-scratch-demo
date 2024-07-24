// Adapted (slightly) from: https://github.com/square/in-app-payments-react-native-plugin/issues/236#issuecomment-2071933733
// By https://github.com/kuldip-simform

const {
  AndroidConfig,
  IOSConfig,
  withAndroidManifest,
  withEntitlementsPlist,
} = require('expo/config-plugins')

const { addMetaDataItemToMainApplication, getMainApplicationOrThrow, removeMetaDataItemFromMainApplication } =
  AndroidConfig.Manifest

const withSQIPIos = (expoConfig, { merchantIdentifier }) => {
  console.log('[withConfigureApplePayAndGooglePay] Adding iOS support for Apple Pay...')

  return withEntitlementsPlist(expoConfig, (config) => {
      config.modResults = setApplePayEntitlement(merchantIdentifier, config.modResults)
      return config
  })
}

const withConfigureApplePayAndGooglePlay = (config, props) => {
  config = withSQIPIos(config, props)
  config = withNoopSwiftFile(config)
  config = withSQIPAndroid(config, props)
  return config
}

/**
* Adds the following to the entitlements:
*
* <key>com.apple.developer.in-app-payments</key>
* <array>
*	 <string>[MERCHANT_IDENTIFIER]</string>
* </array>
*/
function setApplePayEntitlement(merchantIdentifiers, entitlements) {
  console.log('[withConfigureApplePayAndGooglePay] Updating iOS entitlements to add Apple Pay Merchant Id')

  const key = 'com.apple.developer.in-app-payments'
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const merchants = entitlements[key] ?? []

  if (!Array.isArray(merchantIdentifiers)) {
      merchantIdentifiers = [merchantIdentifiers]
  }

  for (const id of merchantIdentifiers) {
      if (id && !merchants.includes(id)) {
          merchants.push(id)
      }
  }

  if (merchants.length) {
      entitlements[key] = merchants
  }
  return entitlements
}

/**
* Add a blank Swift file to the Xcode project for Swift compatibility.
*/
const withNoopSwiftFile = (config) => {
  console.log('[withConfigureApplePayAndGooglePay] Adding an empty file for Xcode Swift compatibility ')

  return IOSConfig.XcodeProjectFile.withBuildSourceFile(config, {
      filePath: 'noop-file.swift',
      contents: [
          '//',
          '// @generated',
          '// A blank Swift file must be created for native modules with Swift files to work correctly.',
          '//',
          '',
      ].join('\n'),
  })
}

const withSQIPAndroid = (expoConfig, { enableGooglePay = false }) => {
  console.log('[withConfigureApplePayAndGooglePay] Adding Android support for Google Pay...')

  return withAndroidManifest(expoConfig, (config) => {
      config.modResults = setGooglePayMetaData(enableGooglePay, config.modResults)

      return config
  })
}

/**
* Adds the following to AndroidManifest.xml:
*
* <application>
*   ...
*	 <meta-data
*     android:name="com.google.android.gms.wallet.api.enabled"
*     android:value="true|false" />
* </application>
*/
function setGooglePayMetaData(enabled, modResults) {
  console.log('[withConfigureApplePayAndGooglePay] Updating AndroidManifest.xml to support Google Pay')

  const GOOGLE_PAY_META_NAME = 'com.google.android.gms.wallet.api.enabled'
  const mainApplication = getMainApplicationOrThrow(modResults)
  if (enabled) {
      addMetaDataItemToMainApplication(mainApplication, GOOGLE_PAY_META_NAME, 'true')
  } else {
      removeMetaDataItemFromMainApplication(mainApplication, GOOGLE_PAY_META_NAME)
  }

  return modResults
}

module.exports = withConfigureApplePayAndGooglePlay
