import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../services/api';

const GroupHatimDetails = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);

  const handleJoinRequest = async () => {
    try {
      setLoading(true);
      await api.post(`/api/hatims/group/${route.params?.hatimId}/join-request`);
      Alert.alert(
        'Başarılı', 
        'Katılma isteğiniz gönderildi. Grup yöneticisi onayladıktan sonra hatime katılabileceksiniz.'
      );
      navigation.goBack();
    } catch (error) {
      console.error('Katılma isteği gönderme hatası:', error);
      Alert.alert('Hata', error.response?.data?.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Grup Hatmi</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <MaterialCommunityIcons name="account-multiple" size={24} color="#6200ee" />
              <Text style={styles.statValue}>15</Text>
              <Text style={styles.statLabel}>Katılımcı</Text>
            </View>
            <View style={styles.stat}>
              <MaterialCommunityIcons name="book-open-variant" size={24} color="#6200ee" />
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Boş Cüz</Text>
            </View>
            <View style={styles.stat}>
              <MaterialCommunityIcons name="check-circle" size={24} color="#6200ee" />
              <Text style={styles.statValue}>25</Text>
              <Text style={styles.statLabel}>Tamamlanan</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.sectionTitle}>Genel İlerleme</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: '83%' }]} />
            </View>
            <Text style={styles.progressText}>25/30 Cüz tamamlandı</Text>
          </View>

          <View style={styles.participantsContainer}>
            <Text style={styles.sectionTitle}>Katılımcılar ve Cüzleri</Text>
            {[1, 2, 3].map((_, index) => (
              <View key={index} style={styles.participant}>
                <MaterialCommunityIcons name="account" size={24} color="#666" />
                <View style={styles.participantInfo}>
                  <Text style={styles.participantName}>Katılımcı {index + 1}</Text>
                  <View style={styles.cuzContainer}>
                    <Chip style={styles.cuzChip}>1. Cüz</Chip>
                    <Chip style={styles.cuzChip}>15. Cüz</Chip>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <Button 
            mode="contained" 
            style={styles.joinButton}
            onPress={handleJoinRequest}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'İstek Gönderiliyor...' : 'Katılma İsteği Gönder'}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
    marginTop: 4,
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
  },
  progressContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
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
    textAlign: 'center',
  },
  participantsContainer: {
    marginBottom: 24,
  },
  participant: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  participantInfo: {
    flex: 1,
    marginLeft: 12,
  },
  participantName: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  cuzContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cuzChip: {
    backgroundColor: '#E8EAF6',
  },
  joinButton: {
    backgroundColor: '#6200ee',
  },
});

export default GroupHatimDetails;
