import * as dotenv from 'dotenv';

// Inicializando as variáveis de ambiente
dotenv.config();

module.exports = {
  expo: {
    name: 'ignitefleet',
    slug: 'ignitefleet',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    newArchEnabled: true,
    splash: {
      image: './assets/splash.png',
      resizeMode: 'cover',
      backgroundColor: '#202024',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.lubnnia.ignitefleet',
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#202024',
      },
      edgeToEdgeEnabled: true,
      package: 'com.lubnnia.ignitefleet',
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-font',
      'expo-location',
      {
        locationAlwaysAndWhenInUsePermission:
          'Allow $(PRODUCT_NAME) to use your location.',
      },
    ],
  },
};
