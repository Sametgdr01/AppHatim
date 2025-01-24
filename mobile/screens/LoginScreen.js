import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { TextInput, Button, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { formatPhoneNumber } from '../utils/phoneUtils';

export default function LoginScreen({ navigation, route }) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Route params'dan gelen telefon numarasını al
  useEffect(() => {
    if (route.params?.phoneNumber) {
      setFormData(prev => ({
        ...prev,
        phoneNumber: route.params.phoneNumber
      }));
    }
  }, [route.params?.phoneNumber]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Form validasyonu
      if (!formData.phoneNumber || !formData.password) {
        throw new Error('Lütfen tüm alanları doldurun');
      }

      // Telefon numarasını formatla
      const formattedPhone = formatPhoneNumber(formData.phoneNumber);
      console.log('📱 Formatlanmış telefon:', formattedPhone);

      // Login isteği
      await login({
        phoneNumber: formattedPhone,
        password: formData.password
      });

      // Ana ekrana yönlendir
      navigation.replace('Main');
    } catch (error) {
      console.error('❌ Login hatası:', error.message);

      // Hata mesajını belirle
      let errorMessage;
      
      if (error.response?.status === 401) {
        errorMessage = 'Telefon numarası veya şifre hatalı';
        Alert.alert(
          'Giriş Başarısız',
          'Telefon numarası veya şifre hatalı. Hesabınız yoksa kayıt olabilirsiniz.',
          [
            {
              text: 'Vazgeç',
              style: 'cancel'
            },
            {
              text: 'Kayıt Ol',
              onPress: () => navigation.navigate('Register', { 
                phoneNumber: formData.phoneNumber 
              })
            }
          ]
        );
      } else if (error.response?.status === 429) {
        errorMessage = 'Çok fazla deneme yaptınız. Lütfen bir süre bekleyip tekrar deneyin.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Sunucu kaynaklı bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message === 'Network Error') {
        errorMessage = 'İnternet bağlantınızı kontrol edip tekrar deneyin.';
      } else {
        errorMessage = error.message;
      }

      setError(errorMessage);
      console.error('❌ Kullanıcı dostu hata:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.surface}>
        <MaterialCommunityIcons 
          name="account" 
          size={50} 
          color="#6200ee" 
          style={styles.icon} 
        />
        <Text style={styles.title}>Giriş Yap</Text>

        <TextInput
          label="Telefon Numarası"
          value={formData.phoneNumber}
          onChangeText={(text) => {
            const formatted = text.replace(/\D/g, '').slice(0, 10);
            setFormData({ ...formData, phoneNumber: formatted });
          }}
          keyboardType="phone-pad"
          style={styles.input}
          mode="outlined"
          placeholder="5XX XXX XX XX"
          left={<TextInput.Icon icon="phone" />}
        />

        <TextInput
          label="Şifre"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          left={<TextInput.Icon icon="lock" />}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity 
          style={styles.forgotPassword}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
        </TouchableOpacity>

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
        </Button>

        <View style={styles.register}>
          <Text style={styles.registerText}>Hesabınız yok mu?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Kayıt Ol</Text>
          </TouchableOpacity>
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  surface: {
    padding: 20,
    borderRadius: 10,
    elevation: 4,
    backgroundColor: '#fff',
    width: '100%',
    alignSelf: 'center'
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  errorText: {
    color: '#ff3333',
    marginTop: 10,
    textAlign: 'center'
  },
  forgotPassword: {
    padding: 10,
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center'
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  register: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#6200ee',
    fontSize: 14,
    marginLeft: 5,
  }
});