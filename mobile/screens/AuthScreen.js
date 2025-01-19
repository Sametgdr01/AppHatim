import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

const AuthScreen = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async () => {
    if (username && password) {
      try {
        await login(username, password);
      } catch (error) {
        console.error('Giriş hatası:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoSection}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/quran-kid.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Cüz Takip Uygulaması</Text>
      </View>

      <View style={styles.formSection}>
        <TextInput
          label="E-posta"
          value={username}
          onChangeText={setUsername}
          mode="outlined"
          outlineColor="#e5e7eb"
          activeOutlineColor="#312e81"
          style={styles.input}
          theme={{ 
            colors: { 
              primary: '#312e81',
              background: 'white' 
            } 
          }}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          label="Şifre"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          outlineColor="#e5e7eb"
          activeOutlineColor="#312e81"
          style={styles.input}
          theme={{ 
            colors: { 
              primary: '#312e81',
              background: 'white' 
            } 
          }}
          secureTextEntry
        />

        <Button 
          mode="contained" 
          onPress={handleAuth}
          style={styles.button}
          labelStyle={styles.buttonText}
          theme={{ colors: { primary: '#312e81' } }}
        >
          Giriş Yap
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    padding: 20,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#312e81',
    marginTop: 20,
    textAlign: 'center',
  },
  formSection: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AuthScreen;