api.cache(false);
module.exports = {
  plugins: [
    ['module:react-native-dotenv'],
    {
      moduleName: '@env',
      allowUndefined: false,
    },
  ],
};
