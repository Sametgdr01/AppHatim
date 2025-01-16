import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Title, Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1: Bilgi girişi, 2: SMS doğrulama
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Hata', 'Lütfen adınızı ve soyadınızı girin');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length !== 10) {
      Alert.alert('Hata', 'Lütfen geçerli bir telefon numarası girin (5XX XXX XX XX)');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi girin');
      return false;
    }
    return true;
  };

  const handleSendVerificationCode = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // API çağrısı yapılacak - SMS gönderimi
      // await sendVerificationSMS(formData.phone);
      
      Alert.alert(
        'Doğrulama Kodu Gönderildi',
        `${formData.phone} numaralı telefona gönderilen 6 haneli doğrulama kodunu girin.`
      );
      setStep(2);
    } catch (error) {
      Alert.alert('Hata', 'Doğrulama kodu gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert('Hata', 'Lütfen 6 haneli doğrulama kodunu girin');
      return;
    }

    setLoading(true);
    try {
      // API çağrısı yapılacak - Kod doğrulama ve kayıt
      // await verifyCodeAndRegister(formData, verificationCode);
      
      Alert.alert(
        'Başarılı',
        'Kaydınız başarıyla tamamlandı. Şimdi giriş yapabilirsiniz.',
        [{ text: 'Tamam', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert('Hata', 'Doğrulama kodu hatalı veya süresi dolmuş.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <MaterialCommunityIcons 
          name="account-plus" 
          size={64} 
          color="#6200ee" 
          style={styles.icon}
        />
        <Title style={styles.title}>Yeni Hesap Oluştur</Title>

        {step === 1 ? (
          <View style={styles.formContainer}>
            <TextInput
              label="Ad Soyad"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
            />

            <TextInput
              label="Telefon Numarası"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text.replace(/[^0-9]/g, '') })}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
              maxLength={10}
              left={<TextInput.Icon icon="phone" />}
              placeholder="5XX XXX XX XX"
            />

            <TextInput
              label="E-posta Adresi"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email" />}
            />

            <Button
              mode="contained"
              onPress={handleSendVerificationCode}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              Doğrulama Kodu Gönder
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.linkButton}
            >
              Zaten hesabınız var mı? Giriş yapın
            </Button>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.verificationText}>
              Lütfen telefonunuza gönderilen 6 haneli doğrulama kodunu girin
            </Text>

            <TextInput
              label="Doğrulama Kodu"
              value={verificationCode}
              onChangeText={setVerificationCode}
              mode="outlined"
              style={styles.input}
              keyboardType="number-pad"
              maxLength={6}
              left={<TextInput.Icon icon="key" />}
            />

            <Button
              mode="contained"
              onPress={handleVerifyCode}
              style={styles.button}
              loading={loading}
              disabled={loading}
            >
              Doğrula ve Kaydı Tamamla
            </Button>

            <Button
              mode="outlined"
              onPress={() => setStep(1)}
              style={styles.backButton}
            >
              Bilgileri Düzenle
            </Button>
          </View>
        )}
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  surface: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  icon: {
    alignSelf: 'center',
    marginTop: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 24,
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  linkButton: {
    marginTop: 16,
  },
  backButton: {
    marginTop: 16,
    borderColor: '#6200ee',
  },
  verificationText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
});

export default RegisterScreen; 