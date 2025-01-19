import React, { useContext } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider, AuthContext } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import LoadingScreen from './components/LoadingScreen';

// Ana uygulama içeriği
const AppContent = () => {
  const { isConnecting } = useContext(AuthContext);

  if (isConnecting) {
    return <LoadingScreen />;
  }

  return <AppNavigator />;
};

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider>
        <AppContent />
      </PaperProvider>
    </AuthProvider>
  );
}