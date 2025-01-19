import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert, ScrollView, Animated } from 'react-native';
import { TextInput, Button, Title, Text, Banner, ActivityIndicator, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';

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
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const { login, register } = useContext(AuthContext);

  // Telefon numarası formatını düzenleme
  const formatPhoneNumber = (phone) => {
    // Tüm boşluk ve özel karakterleri kaldır
    const cleanedPhone = phone.replace(/\D/g, '');
    
    // Telefon numarasını düzenle
    const formattedPhone = cleanedPhone.startsWith('0') 
      ? cleanedPhone 
      : `0${cleanedPhone}`;

    // Telefon numarası formatını kontrol et (11 haneli)
    const phoneRegex = /^0?5\d{9}$/;
    if (!phoneRegex.test(formattedPhone)) {
      throw new Error('Geçersiz telefon numarası formatı. Örnek: 5XXXXXXXXX');
    }

    // Son 10 haneyi al (05 ile başlayacak şekilde)
    return `05${formattedPhone.slice(-9)}`;
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

  const handleLogin = async () => {
    if (!phoneNumber) {
      Alert.alert('Hata', 'Lütfen telefon numaranızı girin');
      return;
    }

    setIsLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      console.log('📱 Giriş için kullanılan telefon numarası:', formattedPhone);

      await login(formattedPhone);
      
      // TabNavigator'a yönlendirme
      navigation.navigate('TabNavigator');
    } catch (error) {
      Alert.alert('Giriş Hatası', error.message || 'Giriş başarısız');
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
    <ScrollView contentContainerStyle={styles.container}>
      {showSecurityBanner && (
        <Animated.View style={[styles.bannerContainer, { opacity: fadeAnim }]}>
          <Banner
            visible={true}
            icon={({size}) => (
              <MaterialCommunityIcons
                name="shield-lock"
                size={30}
                color="#6200ee"
              />
            )}
            style={styles.banner}
          >
            <View>
              <Text style={styles.bannerTitle}>Güvenli Bağlantı</Text>
              <Text style={styles.bannerText}>
                Bilgileriniz uçtan uca şifreleme ile korunmaktadır
              </Text>
            </View>
          </Banner>
        </Animated.View>
      )}

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Giriş yapılıyor...</Text>
        </View>
      )}

      <Surface style={styles.formContainer} elevation={2}>
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
            style={styles.registerText}
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
            style={styles.registerText}
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
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  bannerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  banner: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    marginTop: -50,
  },
  loadingText: {
    marginTop: 10,
    color: '#6200ee',
    fontSize: 16,
  },
  formContainer: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#6200ee',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  registerText: {
    textAlign: 'center',
    marginTop: 15,
    color: 'blue',
  }
});

export default LoginScreen;