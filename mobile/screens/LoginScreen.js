import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
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

  const handleLoginOrRegister = async () => {
    setIsLoading(true);

    try {
      if (step === 0) {
        // Giriş ekranı
        if (!phoneNumber || !password) {
          Alert.alert('Hata', 'Lütfen telefon numaranızı ve şifrenizi girin');
          return;
        }

        try {
          const formattedPhone = formatPhoneNumber(phoneNumber);
          console.log('📱 Giriş için kullanılan telefon numarası:', formattedPhone);

          await login(formattedPhone, password);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }]
          });
        } catch (error) {
          Alert.alert('Giriş Hatası', error.message || 'Giriş başarısız');
        }
      } else {
        // Kayıt ekranı
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
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {step === 0 ? (
        // Giriş Ekranı
        <>
          <Title>Giriş Yap</Title>
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
            onPress={handleLoginOrRegister}
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
          <Title>Kayıt Ol</Title>
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
            onPress={handleLoginOrRegister}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
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