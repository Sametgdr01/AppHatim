import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert, ScrollView, Animated } from 'react-native';
import { TextInput, Button, Title, Text, Banner, ActivityIndicator, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import apiService from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSecurityBanner, setShowSecurityBanner] = useState(false);
  const [error, setError] = useState(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const { login, register, signIn } = useContext(AuthContext);

  // Telefon numarası formatını düzenleme
  const formatPhoneNumber = (phone) => {
    try {
      // Tüm boşluk ve özel karakterleri kaldır
      let cleanedPhone = phone.replace(/\D/g, '');
      
      // Başındaki 0'ı kaldır
      if (cleanedPhone.startsWith('0')) {
        cleanedPhone = cleanedPhone.substring(1);
      }

      // Telefon numarası 10 haneli olmalı (başında 0 olmadan)
      if (cleanedPhone.length !== 10) {
        throw new Error('Telefon numarası 10 haneli olmalıdır');
      }

      // 5 ile başlamalı
      if (!cleanedPhone.startsWith('5')) {
        throw new Error('Telefon numarası 5 ile başlamalıdır');
      }

      console.log('📱 Formatlanmış telefon:', cleanedPhone);
      return cleanedPhone;
    } catch (error) {
      console.error('❌ Telefon format hatası:', error);
      throw new Error('Geçersiz telefon numarası formatı. Örnek: 5XXXXXXXXX');
    }
  };

  // E-posta formatını doğrulama
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Ad ve soyaddan tam isim oluşturma
  const createFullName = () => {
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    return `${trimmedFirstName} ${trimmedLastName}`.trim();
  };

  // Güvenlik banner'ını göster/gizle
  React.useEffect(() => {
    if (isLoading) {
      setShowSecurityBanner(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setShowSecurityBanner(false));
    }
  }, [isLoading]);

  // Giriş işlemi
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Telefon numarasını formatla
      const formattedPhone = formatPhoneNumber(phoneNumber);
      console.log('📱 Formatlanmış telefon:', formattedPhone);

      // Login isteği
      try {
        const response = await apiService.auth.login(formattedPhone);
        console.log('✅ Login yanıtı:', response);

        // Token'ı kaydet
        await AsyncStorage.setItem('userToken', response.token);
        
        // Kullanıcı bilgilerini kaydet
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));

        // AuthContext'i güncelle
        signIn(response.token);
      } catch (error) {
        console.error('❌ Login hatası detayları:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });

        // Hata mesajını belirle
        let errorMessage = 'Giriş yapılırken bir hata oluştu';
        
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.status === 401) {
          errorMessage = 'Telefon numarası veya şifre hatalı';
        } else if (error.message === 'Network Error') {
          errorMessage = 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.';
        }

        setError(errorMessage);
        console.error('❌ Kullanıcı dostu hata:', errorMessage);
      }
    } catch (error) {
      console.error('❌ Genel hata:', error);
      setError('Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (firstName && lastName && phoneNumber && email && password && confirmPassword) {
      if (!validateEmail(email)) {
        Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi girin');
        return;
      }

      if (password === confirmPassword) {
        try {
          const formattedPhone = formatPhoneNumber(phoneNumber);
          
          await register({
            firstName,
            lastName,
            phoneNumber: formattedPhone,
            email,
            password
          });

          // Başarılı kayıt sonrası giriş ekranına dön
          setStep(0);
          Alert.alert('Başarılı', 'Kaydınız başarıyla tamamlandı. Lütfen giriş yapın.');
          
        } catch (error) {
          Alert.alert('Kayıt Hatası', error.message || 'Kayıt işlemi başarısız');
        }
      } else {
        Alert.alert('Hata', 'Şifreler eşleşmiyor');
      }
    } else {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {showSecurityBanner && (
        <Animated.View style={[styles.securityBanner, { opacity: fadeAnim }]}>
          <Banner
            visible={true}
            icon={({size}) => (
              <MaterialCommunityIcons
                name="shield-lock"
                size={30}
                color="#6200ee"
              />
            )}
            style={styles.securityBanner}
          >
            <View>
              <Text style={styles.securityText}>Güvenli Bağlantı</Text>
              <Text style={styles.securityText}>
                Bilgileriniz uçtan uca şifreleme ile korunmaktadır
              </Text>
            </View>
          </Banner>
        </Animated.View>
      )}

      {/* Yükleme göstergesi */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Güvenli Bağlantı Kuruluyor...</Text>
          </View>
        </View>
      )}

      <Surface style={styles.card} elevation={2}>
        <Title style={styles.title}>
          {step === 0 ? 'Giriş Yap' : 'Kayıt Ol'}
        </Title>

      {step === 0 ? (
        // Giriş Ekranı
        <>
          <TextInput
            label="Telefon Numarası"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="phone" />}
            keyboardType="phone-pad"
            placeholder="5XXXXXXXXX"
            maxLength={10}
          />
          <TextInput
            label="Şifre"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
            left={<TextInput.Icon icon="lock" />}
          />
          <Button 
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            loading={isLoading}
            disabled={isLoading}
          >
            Giriş Yap
          </Button>
          <Text 
            style={styles.linkText}
            onPress={() => setStep(1)}
          >
            Hesabınız yok mu? Kayıt Ol
          </Text>
        </>
      ) : (
        // Kayıt Ekranı
        <>
          <TextInput
            label="Ad"
            value={firstName}
            onChangeText={setFirstName}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />
          <TextInput
            label="Soyad"
            value={lastName}
            onChangeText={setLastName}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />
          <TextInput
            label="Telefon Numarası"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="phone" />}
            keyboardType="phone-pad"
            placeholder="5XXXXXXXXX"
            maxLength={10}
          />
          <TextInput
            label="E-posta"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
            keyboardType="email-address"
            placeholder="ornek@email.com"
            autoCapitalize="none"
          />
          <TextInput
            label="Şifre"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
            left={<TextInput.Icon icon="lock" />}
          />
          <TextInput
            label="Şifre Tekrar"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
            left={<TextInput.Icon icon="lock" />}
          />
          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            loading={isLoading}
            disabled={isLoading}
          >
            Kayıt Ol
          </Button>
          <Text 
            style={styles.linkText}
            onPress={() => setStep(0)}
          >
            Zaten hesabınız var mı? Giriş Yap
          </Text>
        </>
      )}
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 20,
  },
  card: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#6200ee',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 8,
    marginBottom: 8,
  },
  linkText: {
    color: '#6200ee',
    textAlign: 'center',
    marginTop: 8,
  },
  securityBanner: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#E8F5E9',
  },
  securityText: {
    color: '#2E7D32',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

export default LoginScreen;