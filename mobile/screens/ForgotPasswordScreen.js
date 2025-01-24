import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function ForgotPasswordScreen({ navigation }) {
  const { forgotPassword, resetPassword } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: E-posta, 2: Kod ve yeni şifre

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert('Hata', 'Lütfen email adresinizi girin');
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email);
      Alert.alert(
        'Kod Gönderildi',
        'Şifre sıfırlama kodu email adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.',
        [{ text: 'Tamam' }]
      );
      setStep(2);
    } catch (error) {
      console.error('❌ Kod gönderme hatası:', error);
      Alert.alert('Hata', error.response?.data?.message || 'Kod gönderme sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetCode || !newPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email, resetCode, newPassword);
      Alert.alert(
        'Başarılı',
        'Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.',
        [{ 
          text: 'Giriş Yap',
          onPress: () => navigation.navigate('Login')
        }]
      );
    } catch (error) {
      console.error('❌ Şifre sıfırlama hatası:', error);
      Alert.alert('Hata', error.response?.data?.message || 'Şifre sıfırlama sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <Text style={styles.title}>
            {step === 1 ? 'Şifremi Unuttum' : 'Şifre Sıfırlama'}
          </Text>
          
          {step === 1 ? (
            <>
              <Text style={styles.description}>
                Kayıtlı e-posta adresinize şifre sıfırlama kodu göndereceğiz.
              </Text>
              <TextInput
                style={styles.input}
                placeholder="E-posta Adresi"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={[styles.button, (!email || loading) && styles.buttonDisabled]}
                onPress={handleSendCode}
                disabled={loading || !email}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Kod Gönder</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.description}>
                E-posta adresinize gönderilen kodu ve yeni şifrenizi girin.
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Doğrulama Kodu"
                value={resetCode}
                onChangeText={setResetCode}
                keyboardType="number-pad"
                maxLength={6}
              />
              <TextInput
                style={styles.input}
                placeholder="Yeni Şifre"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              <TouchableOpacity
                style={[styles.button, (!resetCode || !newPassword || loading) && styles.buttonDisabled]}
                onPress={handleResetPassword}
                disabled={loading || !resetCode || !newPassword}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Şifremi Sıfırla</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.linkText}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkButton: {
    padding: 10,
  },
  linkText: {
    color: '#2196F3',
    textAlign: 'center',
    fontSize: 16,
  },
});
