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


Notes:

(Incorrect error while testing out Apple Pay in Simulator with sandbox application id):

 LOG  STARTING card entry
 LOG  In startDIgitalWallet, about to call requestApplePayNonce
[UIKitCore] Attempt to present <RCTModalHostViewController: 0x10727d9c0> on <UIViewController: 0x10730a780> (from <RNSScreen: 0x10901c200>) which is already presenting <PKPaymentAuthorizationViewController: 0x138904ac0>.
 LOG  In startDIgitalWallet, about to call requestApplePayNonce
 ERROR  request failed:  {"code": "USAGE_ERROR", "debugCode": "apple_pay_nonce_request_production_simulator", "debugMessage": "Apple Pay cannot be used in the simulator with a production Square application ID. Please use a Square sandbox application ID or test Apple Pay on a physical device.", "message": "Something went wrong. Please contact the developer of this application and provide them with this error code: production_simulator"}
[rnsqipfromscratchdemo] 'request failed: ', { code: 'USAGE_ERROR',
message: 'Something went wrong. Please contact the developer of this application and provide them with this error code: production_simulator',
debugCode: 'apple_pay_nonce_request_production_simulator',
debugMessage: 'Apple Pay cannot be used in the simulator with a production Square application ID. Please use a Square sandbox application ID or test Apple Pay on a physical device.' }


Square SDK:
===========

Calque over git@github.com:square/square-java-sdk.git ?

