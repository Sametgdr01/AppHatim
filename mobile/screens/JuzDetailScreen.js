import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Surface, Text, Title, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { markJuzAsCompleted, fetchJuzDetails, deleteJuz } from '../services/apiService';

const JuzDetailScreen = ({ route, navigation }) => {
  const { juzId } = route.params;
  const [juzDetails, setJuzDetails] = useState(null);
  const [isJuzCompleted, setIsJuzCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJuzDetails = async () => {
      try {
        const details = await fetchJuzDetails(juzId);
        console.log('Juz Detayları:', details);
        
        setJuzDetails(details);
        setIsJuzCompleted(details.isCompleted);
        setLoading(false);
      } catch (error) {
        console.error('Cüz detayları yüklenirken hata:', error);
        Alert.alert('Hata', 'Cüz detayları yüklenemedi.');
        setLoading(false);
      }
    };

    loadJuzDetails();
  }, [juzId]);

  const handleMarkJuzCompleted = async () => {
    try {
      Alert.alert(
        'Cüzü Tamamla',
        'Bu cüzü tamamladığınızdan emin misiniz?',
        [
          {
            text: 'İptal',
            style: 'cancel',
          },
          {
            text: 'Evet, Tamamladım',
            onPress: async () => {
              try {
                await markJuzAsCompleted(juzId);
                setIsJuzCompleted(true);
                
                Alert.alert(
                  'Tebrikler!', 
                  'Cüz başarıyla tamamlandı.',
                  [{ text: 'Tamam' }]
                );
              } catch (error) {
                Alert.alert('Hata', 'Cüz tamamlanamadı. Lütfen tekrar deneyin.');
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'Bir sorun oluştu.');
    }
  };

  const handleDeleteJuz = async () => {
    try {
      Alert.alert(
        'Cüzü Sil',
        'Bu cüzü silmek istediğinizden emin misiniz?',
        [
          {
            text: 'İptal',
            style: 'cancel',
          },
          {
            text: 'Evet, Sil',
            style: 'destructive',
            onPress: async () => {
              try {
                // Silme işlemi öncesi kontrol
                if (isJuzCompleted) {
                  Alert.alert('Hata', 'Tamamlanmış cüz silinemez.');
                  return;
                }

                await deleteJuz(juzId);
                
                Alert.alert(
                  'Başarılı', 
                  'Cüz başarıyla silindi.',
                  [
                    {
                      text: 'Tamam',
                      onPress: () => navigation.goBack() // Önceki sayfaya dön
                    }
                  ]
                );
              } catch (error) {
                Alert.alert('Hata', 'Cüz silinemedi. Lütfen tekrar deneyin.');
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'Bir sorun oluştu.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.headerCard}>
        <Title style={styles.headerTitle}>
          {juzDetails ? `${juzDetails.juzNumber}. Cüz Detayları` : 'Cüz Detayı'}
        </Title>
      </Surface>

      {/* Cüz Detayları Kartı */}
      {juzDetails && (
        <Surface style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Başlangıç Sayfası:</Text>
            <Text style={styles.detailValue}>{juzDetails.startPage}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bitiş Sayfası:</Text>
            <Text style={styles.detailValue}>{juzDetails.endPage}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Toplam Sayfa:</Text>
            <Text style={styles.detailValue}>{juzDetails.endPage - juzDetails.startPage + 1}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Durum:</Text>
            <Text 
              style={[
                styles.detailValue, 
                { color: isJuzCompleted ? '#4CAF50' : '#FF9800' }
              ]}
            >
              {isJuzCompleted ? 'Tamamlandı' : 'Devam Ediyor'}
            </Text>
          </View>
        </Surface>
      )}

      {/* Eylem Butonları */}
      <View style={styles.actionContainer}>
        {!isJuzCompleted && (
          <>
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={handleMarkJuzCompleted}
            >
              <Text style={styles.buttonText}>Cüzü Tamamla</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={handleDeleteJuz}
            >
              <Text style={styles.buttonText}>Cüzü Sil</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    textAlign: 'center',
  },
  detailCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default JuzDetailScreen;