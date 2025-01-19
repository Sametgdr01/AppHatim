module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        alias: {
          crypto: 'crypto-browserify',
          stream: 'stream-browserify',
          http: 'stream-http',
          https: 'https-browserify',
          zlib: 'browserify-zlib'
        }
      }],
      'react-native-reanimated/plugin',
      ['@babel/plugin-transform-runtime', {
        regenerator: true
      }],
      ['@babel/plugin-proposal-decorators', { 
        'legacy': true 
      }],
      ['@babel/plugin-proposal-class-properties', {
        'loose': true
      }]
    ]
  };
};
