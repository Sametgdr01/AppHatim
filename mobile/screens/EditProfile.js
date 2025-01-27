import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Surface, Title } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const EditProfile = ({ navigation }) => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const handleUpdate = async () => {
    try {
      setLoading(true);
      
      // Form validasyonu
      if (!formData.firstName || !formData.lastName || !formData.email) {
        Alert.alert('Hata', 'Lütfen gerekli alanları doldurun.');
        return;
      }

      // Email formatı kontrolü
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Alert.alert('Hata', 'Geçerli bir email adresi girin.');
        return;
      }

      // Telefon numarası formatı kontrolü (opsiyonel alan)
      if (formData.phoneNumber) {
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
          Alert.alert('Hata', 'Geçerli bir telefon numarası girin.');
          return;
        }
      }

      // API'ye güncelleme isteği gönder
      const updatedUser = await api.updateProfile(formData);
      console.log('Güncellenmiş kullanıcı verisi:', updatedUser);
      
      if (updatedUser) {
        // Context'teki kullanıcı bilgilerini güncelle
        updateUserProfile(updatedUser);
        
        Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi.', [
          { text: 'Tamam', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      Alert.alert(
        'Hata',
        'Profil güncellenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <Title style={styles.title}>Profili Düzenle</Title>

        <TextInput
          label="Ad"
          value={formData.firstName}
          onChangeText={(text) => setFormData({ ...formData, firstName: text })}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Soyad"
          value={formData.lastName}
          onChangeText={(text) => setFormData({ ...formData, lastName: text })}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="E-posta"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          label="Telefon"
          value={formData.phoneNumber}
          onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
          mode="outlined"
          style={styles.input}
          keyboardType="phone-pad"
        />

        <Button
          mode="contained"
          onPress={handleUpdate}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Güncelle
        </Button>
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
    elevation: 4,
    borderRadius: 8,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default EditProfile;
