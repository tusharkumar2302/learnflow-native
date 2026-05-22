
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

//  default Expo Metro configuration
const defaultConfig = getDefaultConfig(__dirname);

//  NativeWind configuration
const nativeWindConfig = withNativeWind(defaultConfig, {
  input: "./global.css",
});

// Reanimated's Metro configuration
module.exports = wrapWithReanimatedMetroConfig(nativeWindConfig);
