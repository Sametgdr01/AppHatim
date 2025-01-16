import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../App';

// Import screens
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import MyJuzScreen from '../screens/MyJuzScreen';
import GroupHatimsScreen from '../screens/GroupHatimsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import JuzDetail from '../screens/JuzDetail';
import GroupDetailScreen from '../screens/GroupDetailScreen';
import GroupAdminScreen from '../screens/GroupAdminScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import AboutAppScreen from '../screens/AboutAppScreen';
import AdminPanel from '../screens/AdminPanel';
import UserManagement from '../screens/UserManagement';
import HatimManagement from '../screens/HatimManagement';
import NotificationScreen from '../screens/NotificationScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          height: 60,
          backgroundColor: 'white',
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}
    >
      <Tab.Screen
        name="Ana Sayfa"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cüzlerim"
        component={MyJuzScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="book-open-variant" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Grup Cüzleri"
        component={GroupHatimsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { userData } = useContext(AuthContext);
  const isAuthenticated = !!userData;

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: true,
          headerTintColor: '#6200ee',
          headerStyle: {
            height: 60,
            backgroundColor: 'white',
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: '#f5f5f5',
            paddingTop: 35,
          }
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ 
                headerShown: false,
                title: 'Giriş Yap'
              }} 
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ 
                headerShown: false,
                title: 'Kayıt Ol'
              }} 
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="JuzDetail" component={JuzDetail} options={{ title: 'Cüz Detayı' }} />
            <Stack.Screen name="GroupDetail" component={GroupDetailScreen} options={{ title: 'Grup Detayı' }} />
            <Stack.Screen name="GroupAdmin" component={GroupAdminScreen} options={{ title: 'Grup Yönetimi' }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Profili Düzenle' }} />
            <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{ title: 'Bildirimler' }} />
            <Stack.Screen name="AboutApp" component={AboutAppScreen} options={{ title: 'Program Hakkında' }} />
            <Stack.Screen name="AdminPanel" component={AdminPanel} options={{ title: 'Yönetici Paneli' }} />
            <Stack.Screen name="UserManagement" component={UserManagement} options={{ title: 'Kullanıcı Yönetimi' }} />
            <Stack.Screen name="HatimManagement" component={HatimManagement} options={{ title: 'Hatim Yönetimi' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 