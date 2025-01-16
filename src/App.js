import React, { useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './navigation/AppNavigator';

// AuthContext'i oluştur
export const AuthContext = React.createContext({
  signIn: () => {},
  signOut: () => {},
  userData: null
});

const App = () => {
  const [userData, setUserData] = useState(null);

  const authContext = {
    signIn: (data) => {
      setUserData(data);
    },
    signOut: () => {
      setUserData(null);
    },
    userData
  };

  return (
    <AuthContext.Provider value={authContext}>
      <PaperProvider>
        <AppNavigator />
      </PaperProvider>
    </AuthContext.Provider>
  );
};

export default App; 