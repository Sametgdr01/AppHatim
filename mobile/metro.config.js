// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Backend dosyalarını dışla
config.resolver.blockList = [
  /backend\/.*/,
];

// Sadece mobile klasörünü tara
config.watchFolders = [
  path.resolve(__dirname, './'),
];

module.exports = config;
