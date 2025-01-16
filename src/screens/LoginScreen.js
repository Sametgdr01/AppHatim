import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Title, Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../App';

const LoginScreen = ({ navigation }) => {
  const { signIn } = useContext(AuthContext);
  const [step, setStep] = useState(1); // 1: Telefon girişi, 2: SMS doğrulama
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendVerificationCode = async () => {
    if (!phone || phone.length !== 10) {
      Alert.alert('Hata', 'Lütfen geçerli bir telefon numarası girin (5XX XXX XX XX)');
      return;
    }

    setLoading(true);
    try {
      // API çağrısı yapılacak - SMS gönderimi
      // await sendLoginVerificationSMS(phone);
      
      Alert.alert(
        'Doğrulama Kodu Gönderildi',
        `${phone} numaralı telefona gönderilen 6 haneli doğrulama kodunu girin.`
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
      // API çağrısı yapılacak - Kod doğrulama ve giriş
      // const userData = await verifyCodeAndLogin(phone, verificationCode);
      const mockUserData = {
        id: 1,
        name: 'Ahmet Yılmaz',
        phone: phone,
        email: 'ahmet@example.com',
        isAdmin: false
      };
      
      signIn(mockUserData);
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
          name="book-open-page-variant" 
          size={64} 
          color="#6200ee" 
          style={styles.icon}
        />
        <Title style={styles.title}>Hatim Uygulaması</Title>

        {step === 1 ? (
          <View style={styles.formContainer}>
            <TextInput
              label="Telefon Numarası"
              value={phone}
              onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
              maxLength={10}
              left={<TextInput.Icon icon="phone" />}
              placeholder="5XX XXX XX XX"
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
              onPress={() => navigation.navigate('Register')}
              style={styles.linkButton}
            >
              Hesabınız yok mu? Kayıt olun
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
              Doğrula ve Giriş Yap
            </Button>

            <Button
              mode="outlined"
              onPress={() => setStep(1)}
              style={styles.backButton}
            >
              Telefon Numarasını Düzenle
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

export default LoginScreen; 