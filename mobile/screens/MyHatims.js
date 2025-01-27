import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchHatimList } from '../services/apiService';
import { useFocusEffect } from '@react-navigation/native';

const MyHatims = ({ navigation }) => {
  const [hatims, setHatims] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHatims = async () => {
    try {
      const response = await fetchHatimList();
      setHatims(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Hatimler yüklenirken hata:', error);
      Alert.alert('Hata', 'Hatimler yüklenemedi.');
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHatims();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {hatims.length === 0 ? (
          <Card style={styles.noHatimCard}>
            <Card.Content>
              <Text style={styles.noHatimText}>Cüz oluşturulmamış</Text>
            </Card.Content>
          </Card>
        ) : (
          hatims.map(hatim => (
            <Card key={hatim.id} style={styles.hatimCard}>
              <Card.Content>
                <View style={styles.hatimHeader}>
                  <View style={styles.hatimTitleContainer}>
                    <MaterialCommunityIcons name="book-open-variant" size={24} color="#6200ee" />
                    <Text style={styles.hatimTitle}>{hatim.title}</Text>
                  </View>
                  <View style={styles.hatimStatusContainer}>
                    <Text style={styles.hatimStatusLabel}>Cüz Numarası</Text>
                    <Text style={styles.hatimStatusValue}>{hatim.currentJuz}/{hatim.totalJuz}</Text>
                  </View>
                </View>

                <View style={styles.hatimInfo}>
                  <Text style={styles.hatimLabel}>Okunma Durumu</Text>
                  <Text style={styles.hatimStatus}>{hatim.status}</Text>
                </View>

                <Text style={styles.progressText}>{hatim.currentPage}/{hatim.totalPages} sayfa</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progress, { width: `${(hatim.currentPage / hatim.totalPages) * 100}%` }]} />
                </View>

                <View style={styles.dateContainer}>
                  <View style={styles.dateItem}>
                    <MaterialCommunityIcons name="calendar" size={16} color="#666" />
                    <Text style={styles.dateText}>{hatim.startDate}</Text>
                  </View>
                  <View style={styles.dateItem}>
                    <MaterialCommunityIcons name="calendar-check" size={16} color="#666" />
                    <Text style={styles.dateText}>{hatim.endDate}</Text>
                  </View>
                  <View style={styles.dateItem}>
                    <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
                    <Text style={styles.dateText}>{hatim.remainingDays} Gün kaldı</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.detailButton}
                  onPress={() => navigation.navigate('HatimDetails', { hatimId: hatim.id })}
                >
                  <Text style={styles.detailButtonText}>Detayları Görüntüle</Text>
                </TouchableOpacity>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <Button
        mode="contained"
        onPress={() => navigation.navigate('CreateHatim')}
        style={styles.createButton}
      >
        Cüz Oluştur
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollView: {
    flex: 1,
    paddingBottom: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noHatimCard: {
    margin: 16,
    backgroundColor: '#fff',
    elevation: 0,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  noHatimText: {
    fontSize: 18,
    color: '#666'
  },
  hatimCard: {
    margin: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    elevation: 0,
    borderRadius: 12
  },
  hatimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  hatimTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  hatimTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#6200ee'
  },
  hatimStatusContainer: {
    alignItems: 'flex-end'
  },
  hatimStatusLabel: {
    fontSize: 12,
    color: '#666'
  },
  hatimStatusValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333'
  },
  hatimInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  hatimLabel: {
    fontSize: 14,
    color: '#666'
  },
  hatimStatus: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold'
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden'
  },
  progress: {
    height: '100%',
    backgroundColor: '#6200ee',
    borderRadius: 2
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4
  },
  detailButton: {
    backgroundColor: '#6200ee',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  detailButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  createButton: {
    margin: 16,
    backgroundColor: '#6200ee'
  }
});

export default MyHatims;