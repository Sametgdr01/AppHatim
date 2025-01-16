import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { AuthContext } from '../App';

const AuthScreen = () => {
  const { signIn } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = () => {
    if (username && password) {
      signIn({
        name: username,
        email: username,
        totalJuz: 0,
        completedHatims: 0,
        activeGroups: 0,
      });
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
          label="Username"
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
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
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
        />

        <Button
          mode="contained"
          onPress={handleAuth}
          style={styles.button}
          contentStyle={styles.buttonContent}
          buttonColor="#312e81"
        >
          Giriş Yap
        </Button>

        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Hesap Oluştur</Text>
          <Text style={styles.linkText}>Şifremi Unuttum</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
    padding: 20,
    justifyContent: 'center',
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  formSection: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
    height: 56,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
    height: 56,
  },
  buttonContent: {
    height: 56,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  linkText: {
    color: '#666',
    fontSize: 14,
  },
});

export default AuthScreen; 