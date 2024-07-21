iOS:
====

    - Update Podfile with dependency:

         pod 'RNSquareInAppPayments', :path => '../node_modules/react-native-square-in-app-payments'

    - Create new Build Phase Run Script:

 FRAMEWORKS="${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}"
"${FRAMEWORKS}/SquareInAppPaymentsSDK.framework/setup"

    - pod install

    - Sign with development team



Android:
=========

    - app.json `expo` build properties, set minSdkVersion to 24:

                "minSdkVersion": 24 [static change once in `app.json`]

    - android/build.gradle:

buildscript {
    ext {
        sqipVersion = "1.6.6"
    }
    repositories {
        maven {
          url 'https://sdk.squareup.com/public/android'
       }
    }
}

allprojects {
    repositories {
        maven {
          url 'https://sdk.squareup.com/public/android'
       }
    }
}



`expo` Config plugin:
=====================

Goal: Enable the use of the `Square` In-App Payments SDK in an `expo` CNG project.

Android: done (`plugins/withSquareInAppPaymentsSDK.js`)

iOS:  done (manual signing needed, but that should be handled by the actual app automatically(?)) (`plugins/withSquareInAppPaymentsSDK.js`)

