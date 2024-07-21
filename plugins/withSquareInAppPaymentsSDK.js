const { withProjectBuildGradle } = require('expo/config-plugins')

const SQIP_ANDROID_VERSION = '1.6.6'
const SQIP_ANDROID_MAVEN_URL_STR = 'maven { url \'https://sdk.squareup.com/public/android\' }'

const addSquareSDKToProjectBuildGradle = (config) => {
  return withProjectBuildGradle(config, (config) => {
    let buildGradle = config.modResults.contents

    // Update android/build.gradle: add Square In-App Payments SDK Android Version to buildscript.ext
    console.log(`Updating android/build.gradle: adding SQIP Android Version ${SQIP_ANDROID_VERSION}`)
    if (!buildGradle.includes(`sqipVersion = "${SQIP_ANDROID_VERSION}"`)) {
      buildGradle = buildGradle.replace(
        /ext\s*{([^}]*)}/,
        (_, curr) => `ext {${curr}\t\tsqipVersion = "${SQIP_ANDROID_VERSION}"\n\t\t}\n`
      )
    }

    // Add maven repository for the Android In-App Payments SDK to allprojoects.repositories
    console.log('Updating android/build.gradle: Adding SQIP Maven URL')
    if (!buildGradle.includes(SQIP_ANDROID_MAVEN_URL_STR)) {
      const jitpackUrlStr = 'maven { url \'https://www.jitpack.io\' }'
      const appendSquareMavenUrlPos = buildGradle.indexOf(jitpackUrlStr) + jitpackUrlStr.length
      buildGradle = buildGradle.substring(0, appendSquareMavenUrlPos) +
               `\n\t\t\t\t${SQIP_ANDROID_MAVEN_URL_STR}` +
                buildGradle.substring(appendSquareMavenUrlPos)
    }

    config.modResults.contents = buildGradle
    return config
  })
}

const withSquareInAppPaymentsSDK = (config) => {
  config = addSquareSDKToProjectBuildGradle(config)
  return config
}

module.exports = withSquareInAppPaymentsSDK
