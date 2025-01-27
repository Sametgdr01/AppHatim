import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Alert, View } from 'react-native';
import { Surface, TextInput, Button, Title, Card, Paragraph, Chip } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const JoinHatimScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hatims, setHatims] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchHatims();
  }, []);

  const fetchHatims = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/hatims/available');
      setHatims(response.data);
    } catch (error) {
      console.error('❌ Hatimleri getirme hatası:', error);
      Alert.alert('Hata', 'Hatimler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (hatimId, partNumber) => {
    try {
      setLoading(true);
      
      await api.post(`/api/hatims/${hatimId}/join`, { partNumber });
      
      Alert.alert(
        'Başarılı',
        'Hatime başarıyla katıldınız',
        [
          {
            text: 'Tamam',
            onPress: () => navigation.navigate('MyHatims')
          }
        ]
      );
    } catch (error) {
      console.error('❌ Hatime katılma hatası:', error);
      Alert.alert(
        'Hata',
        error.response?.data?.message || 'Hatime katılırken bir hata oluştu'
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredHatims = hatims.filter(hatim => 
    hatim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hatim.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <Title style={styles.title}>Mevcut Hatimler</Title>

        <TextInput
          label="Hatim Ara"
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          style={styles.searchInput}
        />

        {loading ? (
          <Button loading>Yükleniyor...</Button>
        ) : filteredHatims.length === 0 ? (
          <Paragraph style={styles.noResults}>
            Katılabileceğiniz hatim bulunamadı
          </Paragraph>
        ) : (
          filteredHatims.map(hatim => (
            <Card key={hatim._id} style={styles.card}>
              <Card.Content>
                <Title>{hatim.title}</Title>
                <Paragraph>{hatim.description}</Paragraph>
                
                {hatim.deadline && (
                  <Chip icon="calendar" style={styles.chip}>
                    Bitiş: {hatim.deadline}
                  </Chip>
                )}
                
                <View style={styles.partsContainer}>
                  {Array.from({ length: hatim.totalParts }, (_, i) => i + 1).map(part => (
                    <Chip
                      key={part}
                      style={[
                        styles.partChip,
                        hatim.parts.includes(part) && styles.takenPart
                      ]}
                      disabled={hatim.parts.includes(part)}
                      onPress={() => handleJoin(hatim._id, part)}
                    >
                      {part}
                    </Chip>
                  ))}
                </View>
              </Card.Content>
            </Card>
          ))
        )}
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
  searchInput: {
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  card: {
    marginBottom: 16,
    elevation: 2
  },
  chip: {
    marginTop: 8,
    marginBottom: 8
  },
  partsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8
  },
  partChip: {
    margin: 4
  },
  takenPart: {
    backgroundColor: '#e0e0e0'
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666'
  }
});

export default JoinHatimScreen;
