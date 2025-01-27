import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { formatPhoneNumber } from '../utils/phoneUtils';

const RegisterScreen = ({ navigation, route }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  // Route params'dan gelen telefon numarasını al
  useEffect(() => {
    if (route.params?.phoneNumber) {
      setFormData(prev => ({
        ...prev,
        phoneNumber: route.params.phoneNumber
      }));
    }
  }, [route.params?.phoneNumber]);

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (!hasMinLength) {
      return 'Şifre en az 8 karakter olmalıdır';
    }
    if (!hasUpperCase) {
      return 'Şifre en az bir büyük harf içermelidir';
    }
    if (!hasLowerCase) {
      return 'Şifre en az bir küçük harf içermelidir';
    }
    if (!hasNumber) {
      return 'Şifre en az bir rakam içermelidir';
    }
    
    return null;
  };

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      Alert.alert('Hata', 'Lütfen adınızı ve soyadınızı girin');
      return false;
    }
    if (!formData.phoneNumber.trim() || formData.phoneNumber.length !== 10) {
      Alert.alert('Hata', 'Lütfen geçerli bir telefon numarası girin (5XX XXX XX XX)');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi girin');
      return false;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      Alert.alert('Hata', passwordError);
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Telefon numarasını formatla
      const formattedPhone = formatPhoneNumber(formData.phoneNumber);
      console.log('📱 Formatlanmış telefon:', formattedPhone);

      // Kayıt verilerini hazırla
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: formattedPhone,
        email: formData.email.toLowerCase().trim(),
        password: formData.password
      };

      console.log('📝 Kayıt verileri:', { ...userData, password: '***' });

      // Email kontrolü
      console.log('📧 Email kontrolü yapılıyor...');
      const response = await register(userData);
      console.log('✅ Kayıt başarılı:', response);

      // Başarılı kayıt sonrası ana sayfaya yönlendir
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });

    } catch (error) {
      console.error('❌ Kayıt hatası:', error);
      Alert.alert(
        'Hata',
        error.response?.data?.message || 'Kayıt sırasında bir hata oluştu'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.surface}>
          <MaterialCommunityIcons 
            name="account-plus" 
            size={50} 
            color="#6200ee" 
            style={styles.icon} 
          />
          <Title style={styles.title}>Kayıt Ol</Title>

          <TextInput
            label="Ad"
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
          />

          <TextInput
            label="Soyad"
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
          />

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
            label="E-posta"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            style={styles.input}
            mode="outlined"
            autoCapitalize="none"
            left={<TextInput.Icon icon="email" />}
          />
          <Text style={styles.emailDescription}>
            Şifrenizi unuttuğunuzda veya değiştirmek istediğinizde doğrulama kodunu gönderecegimiz e-posta adresi giriniz.
          </Text>

          <TextInput
            label="Şifre"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="lock" />}
          />

          <TextInput
            label="Şifre Tekrar"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            secureTextEntry
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="lock" />}
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </Button>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Zaten hesabınız var mı?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center'
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  surface: {
    padding: 20,
    borderRadius: 10,
    elevation: 4,
    backgroundColor: '#fff',
    width: '100%',
    alignSelf: 'center'
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
  emailDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: -8,
    marginBottom: 12,
    paddingHorizontal: 5
  },
  button: {
    marginTop: 10,
    marginBottom: 10
  },
  loginContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginText: {
    color: '#666',
    marginRight: 5
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: 'bold'
  }
});

export default RegisterScreen;