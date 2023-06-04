
# Environment Setup

## NodeJS
```
brew install node
```
Tested using 18.16.0

## Watchman
```
brew install watchman
```

## Ruby
```
brew install rbenv ruby-build
rbenv init
```

Update shell init script, exit and restart shell session
```
rbenv install 2.7.6
rbenv global 2.7.6
```

Exit and restart shell session

```
gem install bundler
gem install cocoapods
```

## Xcode (for iOS development)
Install using App Store

## Android Studio (for Android development)
Download and install from Android Studio website

# Project Creation Process
```
npx create-expo-app -t expo-template-blank-typescript expo-ble-sample     
cd expo-ble-sample 
npx expo install react-native-ble-plx @config-plugins/react-native-ble-plx
npx expo install expo-device react-native-base64                          
npx expo install @shopify/react-native-skia
npx npm install eas-cli
npx expo install expo-dev-client
```
Create `eas.json` and add config for react-native-ble-plx
Update `app.json` with user specific iOS bundleIdentifier and Android package

```
npx expo prebuild
```

# Run the app on Android
```
npx expo run:android
```

# Build the dev Expo app for iOS 

This step will build a custom iOS app that allows for development using the local server. Rebuilding dev app is only required when the native plugins change. For this to work you must have an expo.dev account and an Apple dev account (costs $100 per year). You must also have updated the iOS bundleIdentifier in `eas.json` to something unique to your application. 
```
npx eas-cli build --profile development --platform ios
npx expo start --dev-client
```

# Start the local app server
```
npx expo start --dev-client
```

# References
Tutorial from: https://www.youtube.com/watch?v=UuHLPsjp6fM&t=128s  
Example project: https://github.com/friyiajr/BLESampleExpo.git
