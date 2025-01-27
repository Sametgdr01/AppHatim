import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './context/AuthContext';

// Ekranları import edelim
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainScreen from './screens/MainScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import AboutAppScreen from './screens/AboutAppScreen';
import CreateHatimScreen from './screens/CreateHatimScreen';
import JoinHatimScreen from './screens/JoinHatimScreen';
import MyHatims from './screens/MyHatims'; // MyHatimsScreen yerine MyHatims
import HatimDetails from './screens/HatimDetails';
import Groups from './screens/Groups';
import SpecialEventDetails from './screens/SpecialEventDetails';
import GroupHatimDetails from './screens/GroupHatimDetails';
import AboutScreen from './screens/AboutScreen';
import JuzDetailScreen from './screens/JuzDetailScreen'; // Yeni ekran
import SelectPartScreen from './screens/SelectPartScreen'; // Yeni ekran

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Login"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#6200ee',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{ title: 'Giriş Yap' }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{ title: 'Kayıt Ol' }}
            />
            <Stack.Screen 
              name="Main" 
              component={MainScreen}
              options={{ title: 'Ana Sayfa' }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen}
              options={{ title: 'Profil' }}
            />
            <Stack.Screen 
              name="EditProfile" 
              component={EditProfileScreen}
              options={{ title: 'Profili Düzenle' }}
            />
            <Stack.Screen 
              name="AboutApp" 
              component={AboutAppScreen}
              options={{ title: 'Uygulama Hakkında' }}
            />
            <Stack.Screen 
              name="CreateHatim" 
              component={CreateHatimScreen}
              options={{ title: 'Yeni Hatim Oluştur' }}
            />
            <Stack.Screen 
              name="JoinHatim" 
              component={JoinHatimScreen}
              options={{ title: 'Hatime Katıl' }}
            />
            <Stack.Screen 
              name="MyHatims" 
              component={MyHatims}
              options={{ title: 'Hatimlerim' }}
            />
            <Stack.Screen 
              name="HatimDetails" 
              component={HatimDetails}
              options={{ title: 'Hatim Detayları' }}
              initialParams={{ hatimId: null }} // Varsayılan parametre
            />
            <Stack.Screen 
              name="Groups" 
              component={Groups}
              options={{ title: 'Gruplar' }}
            />
            <Stack.Screen 
              name="SpecialEventDetails" 
              component={SpecialEventDetails}
              options={{ title: 'Özel Gece Hatmi' }}
            />
            <Stack.Screen 
              name="GroupHatimDetails" 
              component={GroupHatimDetails}
              options={{ title: 'Grup Hatmi Detayları' }}
            />
            <Stack.Screen 
              name="About" 
              component={AboutScreen}
              options={{
                title: 'Uygulama Hakkında'
              }}
            />
            <Stack.Screen 
              name="JuzDetail" 
              component={JuzDetailScreen}
              options={{ title: 'Cüz Detayları' }}
            />
            <Stack.Screen 
              name="SelectPart" 
              component={SelectPartScreen}
              options={{ title: 'Cüz Seç' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}