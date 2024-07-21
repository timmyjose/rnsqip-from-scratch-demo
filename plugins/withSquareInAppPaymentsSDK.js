const { withXcodeProject, withPodfile, withProjectBuildGradle } = require('expo/config-plugins')

// iOS
const SQIP_IOS_POD_DEP = `pod 'RNSquareInAppPayments', :path => '../node_modules/react-native-square-in-app-payments'`
const SQIP_IOS_BUILD_PHASE_RUN_SCRIPT_NAME = 'Configure SQIP SDK for iOS'
const SQIP_IOS_BUILD_PHASE_RUN_SCRIPT = 'FRAMEWORKS="${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}" && "${FRAMEWORKS}/SquareInAppPaymentsSDK.framework/setup"'

const addSquareSDKToPodfile = (config) => {
  return withPodfile(config, async (config) => {
    console.log('[withSquareInAppPaymentsSDK] Updating ios/Podfile with SQIP pod dependency...')
    let podFile = config.modResults.contents

    const useFrameworksStr = `use_frameworks! :linkage => ENV['USE_FRAMEWORKS'].to_sym if ENV['USE_FRAMEWORKS']`
    const useFrameworksStrPos = podFile.indexOf(useFrameworksStr)
    const appendSquarePodDepPos = useFrameworksStrPos + useFrameworksStr.length
    podFile = podFile.substring(0, appendSquarePodDepPos) + `\n\n\t${SQIP_IOS_POD_DEP}` + podFile.substring(appendSquarePodDepPos)

    config.modResults.contents = podFile
    return config
  })
}

/**
 * Source: https://github.com/kuldip-simform
 * https://github.com/square/in-app-payments-react-native-plugin/issues/236#issuecomment-2071933733
 */
const addBuildPhaseRunScriptToXcode = (config) => {
 return withXcodeProject(config, async (config) => {
   console.log('[withSquareInAppPaymentsSDK] Adding Build Phase (Run Script) to Xcode project...')
   const xcodeProject = config.modResults

   xcodeProject.addBuildPhase(
     [],
     'PBXShellScriptBuildPhase',
     SQIP_IOS_BUILD_PHASE_RUN_SCRIPT_NAME,
     xcodeProject.getFirstTarget().uuid,
     {
       shellPath: '/bin/sh',
       shellScript: `${SQIP_IOS_BUILD_PHASE_RUN_SCRIPT}`
     }
   )

   return config
 })
}

// Android
const SQIP_ANDROID_VERSION = '1.6.6'
const SQIP_ANDROID_MAVEN_URL_STR = 'maven { url \'https://sdk.squareup.com/public/android\' }'

const addSquareSDKToProjectBuildGradle = (config) => {
  return withProjectBuildGradle(config, (config) => {
    let buildGradle = config.modResults.contents

    // Update android/build.gradle: add Square In-App Payments SDK Android Version to buildscript.ext
    console.log(`[withSquareInAppPaymentsSDK] Updating android/build.gradle: adding SQIP Android Version ${SQIP_ANDROID_VERSION}`)
    if (!buildGradle.includes(`sqipVersion = "${SQIP_ANDROID_VERSION}"`)) {
      buildGradle = buildGradle.replace(
        /ext\s*{([^}]*)}/,
        (_, curr) => `ext {${curr}\t\tsqipVersion = "${SQIP_ANDROID_VERSION}"\n\t\t}\n`
      )
    }

    // Add maven repository for the Android In-App Payments SDK to allprojoects.repositories
    console.log('[withSquareInAppPaymentsSDK] Updating android/build.gradle: Adding SQIP Maven URL')
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
  config = addSquareSDKToPodfile(config)
  config = addBuildPhaseRunScriptToXcode(config)
  config = addSquareSDKToProjectBuildGradle(config)

  return config
}

module.exports = withSquareInAppPaymentsSDK
