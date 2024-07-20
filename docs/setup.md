iOS:

    - Update Podfile with dependency.
    - pod install
    - Sign with development team


Android:

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

    - android/app/build.gradle:

 dependencies {
    implementation project(':react-native-square-in-app-payments')
    implementation 'com.facebook.react:react-native:+'
    implementation 'com.google.android.gms:play-services-wallet:16.0.1'
}


    - settings.gradle (end):

include ':react-native-square-in-app-payments'
project(':react-native-square-in-app-payments').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-square-in-app-payments/android')


