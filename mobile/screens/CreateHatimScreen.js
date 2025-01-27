import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { Surface, TextInput, Button, Title, HelperText, Text } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CreateHatimScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    totalParts: '30'
  });

  const handleCreate = async () => {
    try {
      if (!formData.title.trim()) {
        Alert.alert('Hata', 'Lütfen hatim başlığını giriniz');
        return;
      }

      setLoading(true);
      
      const response = await api.post('/api/hatims', formData);
      
      Alert.alert(
        'Başarılı',
        'Hatim başarıyla oluşturuldu',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.navigate('MyHatims')
          }
        ]
      );
    } catch (error) {
      console.error('❌ Hatim oluşturma hatası:', error);
      Alert.alert(
        'Hata',
        error.response?.data?.message || 'Hatim oluşturulurken bir hata oluştu'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <Title style={styles.title}>Yeni Hatim Oluştur</Title>

        <TextInput
          label="Hatim Başlığı"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
          mode="outlined"
          style={styles.input}
        />
        <HelperText type="info">
          Örnek: Ramazan Hatmi, Cuma Hatmi vb.
        </HelperText>

        <TextInput
          label="Açıklama"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          mode="outlined"
          style={styles.input}
          multiline
          numberOfLines={3}
        />

        <TextInput
          label="Bitiş Tarihi"
          value={formData.deadline}
          onChangeText={(text) => setFormData({ ...formData, deadline: text })}
          mode="outlined"
          style={styles.input}
          placeholder="GG/AA/YYYY"
          keyboardType="numeric"
        />
        <HelperText type="info">
          İsteğe bağlı, hatmin bitirilmesi gereken tarih
        </HelperText>

        <TextInput
          label="Toplam Cüz Sayısı"
          value={formData.totalParts}
          onChangeText={(text) => setFormData({ ...formData, totalParts: text })}
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
          disabled
        />
        <HelperText type="info">
          Standart hatim 30 cüzden oluşur
        </HelperText>

        <Button
          mode="contained"
          onPress={handleCreate}
          style={styles.button}
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Oluşturuluyor...' : 'Hatim Oluştur'}
        </Button>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  surface: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
    elevation: 2
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#fff'
  },
  button: {
    marginTop: 16
  }
});

export default CreateHatimScreen;
