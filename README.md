# Hermes

*"Emissary and messenger of the gods and the divine trickster."*  

A specialized React Native app with BLE functionality for use with maker hardware development. The audience for this app is likely very limited. It is a custom iOS/Android app that is maintained for use with custom BLE enabled hardware projects. This project could be used a a starting point for those wishing to develop their own BLE enabled apps that communicate with Nordic UART Service (NUS) devices.

# Environment Setup
The below tools only need to be setup once. If they are already installed you can skip this step.

## NodeJS
```
brew install node
```
Node can also be installed using the downloadable installer. This project was developed using Node `18.16.0`

## Watchman
```
brew install watchman
```

## Ruby
Install a Ruby version manager since a specific version of Ruby is required for React Native.
```
brew install rbenv ruby-build
rbenv init
```
Update shell init script as instructed by the final command. Exit and restart shell session.

Currently React Native is expecting Ruby `2.7.6`.
```
rbenv install 2.7.6
rbenv global 2.7.6
```
Exit and restart shell session to activate desired version of Ruby.

Install a few libraries to support iOS app build requirements.
```
gem install bundler
gem install cocoapods
```

## Xcode (optional, required for iOS development)
Install using App Store. This is only required if building for iOS targets.

## Android Studio (optional, required for Android development)
Download and install from Android Studio website. This is only required if building for Android targets.

# Developing App Locally

Clone the repo
```
git clone git@github.com:boiceam/hermes.git
cd hermes
```

Install the node module packages
```
npx npm install
```

Start the dev server
```
npx npm start
```

# Custom Expo Go build process
Update `app.json` with user specific `ios.bundleIdentifier` and `android.package` with unique values.

If prebuild has been run before be sure to remove the platform specific directories.
```
rm -rf android
rm -rf ios
```

Run the prebuild to expose the necessary platform specific source.
```
npx expo prebuild
```

# Build the dev Expo Go app for Android
```
npx expo run:android
```

# Build the dev Expo Go app for iOS 

This step will build a custom iOS app that allows for development using the local server. Rebuilding Expo Go dev app is only required when the native plugins change. For this step to work you must have an [Expo.dev](https://expo.dev) account (free tier is good) and an Apple dev account (costs $100 per year). You must also have updated the iOS bundleIdentifier in `eas.json` to something unique to your application. 
```
npx eas-cli build --profile development --platform ios
npx expo start --dev-client
```
Once this process finishes it will provide instructions with how to install the dev version of the app on your device.

# Start the local app server
Once the Expo Go app w/ BLE support is installed on your device you just need to run the following command to start the dev server in future sessions.
```
npx expo start --dev-client
```

# Project Creation Process
This project was created based on a YouTube tutorial by Dan's React Native Lab (references below). The following steps we taken from that tutorial and the example code was pulled from his example Github.
```
npx create-expo-app -t expo-template-blank-typescript expo-ble-sample     
cd expo-ble-sample 
npx expo install react-native-ble-plx @config-plugins/react-native-ble-plx
npx expo install expo-device react-native-base64                          
npx expo install @shopify/react-native-skia
npx npm install eas-cli
npx expo install expo-dev-client
```
Create `eas.json` and add config for react-native-ble-plx.
Update `app.json` with user specific iOS bundleIdentifier and Android package.

# References
Tutorial from: https://www.youtube.com/watch?v=UuHLPsjp6fM&t=128s  
Example project: https://github.com/friyiajr/BLESampleExpo.git
