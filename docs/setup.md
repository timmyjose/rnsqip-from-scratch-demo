

iOS:

    - Update Podfile with dependency.
    - pod install


Android:

    - Update android/build.gradle with dependency version and dependency urls:

    // Top-level build file where you can add configuration options common to all sub-projects/modules.

buildscript {
    ext {
        sqipVersion="1.6.6"
    }
    repositories {
        maven {
          url 'https://sdk.squareup.com/public/android'
        }
    }
    dependencies {
        classpath('com.android.tools.build:gradle')
        classpath('com.facebook.react:react-native-gradle-plugin')
        classpath('org.jetbrains.kotlin:kotlin-gradle-plugin')
    }
}

apply plugin: "com.facebook.react.rootproject"

allprojects {
    repositories {
        maven {
         url 'https://sdk.squareup.com/public/android'
       }
    }
}

    - Update AndroidManifest.xml (remove "package")
