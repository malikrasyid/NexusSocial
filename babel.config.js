module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // specific plugins go here as strings or arrays
      'react-native-reanimated/plugin',
    ],
  };
};