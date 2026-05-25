import "dotenv/config";

export default {
  expo: {
    name: "ZuperLearn",
    slug: "zuperior-learn",
    version: "1.0.9",
    orientation: "default",
    icon: "./assets/images/App-icon.png",
    scheme: "zuperlearn",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/Splash-screen.png",
      resizeMode: "contain",
      backgroundColor: "#0F0820",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.zuperlearn.app",
      infoPlist: {
        NSPhotoLibraryUsageDescription:
          "We need access to your photo library to let you select a profile picture.",
        NSCameraUsageDescription:
          "We need access to your camera if you choose to take a new profile photo.",
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/App-icon.png",
        backgroundColor: "#0F0820",
      },
      edgeToEdgeEnabled: true,
      package: "com.anujchamoli.zuper_learn",
      softwareKeyboardLayoutMode: "resize",
      versionCode: 22,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#0F0820",
          image: "./assets/images/Splash-screen.png",
          resizeMode: "contain",
          dark: {
            image: "./assets/images/Splash-screen.png",
            backgroundColor: "#0F0820",
          },
        },
      ],
      [
        "expo-video",
        {
          supportsBackgroundPlayback: true,
          supportsPictureInPicture: true,
        },
      ],
      "expo-font",
      "expo-secure-store",
      "react-native-video",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: "db453c11-0d90-4410-bddf-fefa03212ca7",
      },
      GRANT_TYPE: process.env.GRANT_TYPE,
      CLIENT_ID: process.env.CLIENT_ID,
      CLIENT_SECRET: process.env.CLIENT_SECRET,
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL
    },
  },
};
