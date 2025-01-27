import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, RadioButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SelectPartScreen = ({ route, navigation }) => {
  const { hatimId } = route.params;
  const [selectedJuz, setSelectedJuz] = useState(null);
  const [availableJuzList, setAvailableJuzList] = useState([]);

  useEffect(() => {
    // TODO: Backend'den hatim için mevcut cüzleri getir
    const fetchAvailableJuzList = async () => {
      try {
        // Örnek statik veri, backend entegrasyonu yapılacak
        const mockJuzList = Array.from({ length: 30 }, (_, i) => ({
          juzNumber: i + 1,
          isAvailable: Math.random() > 0.5 // Rastgele kullanılabilirlik
        }));
        setAvailableJuzList(mockJuzList);
      } catch (error) {
        console.error('Cüz listesi getirilemedi:', error);
      }
    };

    fetchAvailableJuzList();
  }, [hatimId]);

  const handleJuzSelection = () => {
    if (selectedJuz) {
      // Seçilen cüzü kaydetme işlemi
      navigation.navigate('JuzDetailScreen', { 
        juzId: selectedJuz,
        hatimId: hatimId 
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Cüz Seçimi</Text>
          <Text style={styles.subtitle}>
            Okumak istediğiniz cüzü seçin
          </Text>

          <RadioButton.Group
            onValueChange={value => setSelectedJuz(value)}
            value={selectedJuz}
          >
            <ScrollView style={styles.juzList}>
              {availableJuzList.map((juz) => (
                <TouchableOpacity 
                  key={juz.juzNumber} 
                  style={styles.juzItem}
                  onPress={() => setSelectedJuz(juz.juzNumber)}
                >
                  <Text style={styles.juzText}>
                    {juz.juzNumber}. Cüz
                  </Text>
                  <RadioButton 
                    value={juz.juzNumber} 
                    status={selectedJuz === juz.juzNumber ? 'checked' : 'unchecked'}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </RadioButton.Group>

          <Button
            mode="contained"
            onPress={handleJuzSelection}
            disabled={!selectedJuz}
            style={styles.selectButton}
          >
            Cüzü Seç
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#6200ee',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  juzList: {
    maxHeight: 400,
  },
  juzItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  juzText: {
    fontSize: 16,
  },
  selectButton: {
    marginTop: 16,
  },
});

export default SelectPartScreen;