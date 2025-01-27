import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import BottomTabNavigator from './BottomTabNavigator';
import EditProfileScreen from '../screens/EditProfileScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen'; // NotificationSettingsScreen'i import ediyoruz

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Yükleniyor ekranı gösterebilirsiniz
  }

  return (
    <Stack.Navigator 
      initialRouteName={user ? "Main" : "Login"}
      screenOptions={{
        animation: 'slide_from_right'
      }}
    >
      {!user ? (
        <>
          <Stack.Screen 
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen 
            name="Main"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="EditProfile"
            component={EditProfileScreen}
            options={{ title: 'Profili Düzenle' }}
          />
          <Stack.Screen 
            name="NotificationSettings"
            component={NotificationSettingsScreen}
            options={{ title: 'Bildirim Ayarları' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}