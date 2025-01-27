import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../services/api';

const SpecialEventDetails = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    try {
      setLoading(true);
      // API isteği - örnek endpoint
      await api.post(`/api/hatims/special-event/${route.params?.hatimId}/join`);
      Alert.alert('Başarılı', 'Özel gece hatimine başarıyla katıldınız');
      navigation.goBack();
    } catch (error) {
      console.error('Hatime katılma hatası:', error);
      Alert.alert('Hata', error.response?.data?.message || 'Hatime katılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerRow}>
            <MaterialCommunityIcons name="star" size={24} color="#FF4081" />
            <Text style={styles.title}>Miraç Kandili Hatmi</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
            <Text style={styles.infoText}>06.02.2024 · 20:00 - 21:00</Text>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>İlerleme</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: '65%' }]} />
            </View>
            <Text style={styles.progressText}>423/604 Sayfa tamamlandı</Text>
          </View>

          <View style={styles.participantsContainer}>
            <Text style={styles.sectionTitle}>Katılımcılar</Text>
            <View style={styles.participant}>
              <MaterialCommunityIcons name="account" size={24} color="#666" />
              <Text style={styles.participantName}>Ahmet Yılmaz</Text>
              <Text style={styles.participantPages}>30 sayfa</Text>
            </View>
            <View style={styles.participant}>
              <MaterialCommunityIcons name="account" size={24} color="#666" />
              <Text style={styles.participantName}>Mehmet Demir</Text>
              <Text style={styles.participantPages}>20 sayfa</Text>
            </View>
          </View>

          <Button 
            mode="contained" 
            style={styles.joinButton}
            onPress={handleJoin}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Katılınıyor...' : 'Katıl'}
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
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  infoText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 16,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    color: '#666',
    fontSize: 14,
  },
  participantsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  participant: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  participantName: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  participantPages: {
    fontSize: 14,
    color: '#666',
  },
  joinButton: {
    backgroundColor: '#6200ee',
  },
});

export default SpecialEventDetails;
