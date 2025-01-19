import { registerRootComponent } from 'expo';
import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';

// Expo ve React Native için kök bileşen kaydı
registerRootComponent(App);
AppRegistry.registerComponent('main', () => App);

export default App;
