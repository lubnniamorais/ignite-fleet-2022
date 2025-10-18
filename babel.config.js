module.exports = (api) => {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env', // Optional: specify the path to your .env file
          safe: false, // Optional: set to true to load .env.example if .env is missing
          allowUndefined: false, // Optional: set to true to allow undefined variables
        },
      ],
    ],
  };
};
