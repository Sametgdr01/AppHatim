import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { Surface, ProgressBar, ActivityIndicator } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

// API Service
import apiService from '../services/apiService';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();

  // State tanımlamaları
  const [personalHatimData, setPersonalHatimData] = useState(null);
  const [groupHatimData, setGroupHatimData] = useState(null);
  const [specialNightHatim, setSpecialNightHatim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeScreenData = async () => {
      try {
        // Kişisel hatim verilerini al
        const personalHatimResponse = await apiService.fetchHatimList();
        setPersonalHatimData(personalHatimResponse.data);

        // Özel etkinlikleri al
        const specialEventsResponse = await apiService.fetchSpecialEvents();
        setSpecialNightHatim(specialEventsResponse.data[0]); // İlk etkinliği al

        // Kullanıcının grup hatim bilgilerini al
        const groupHatimResponse = await apiService.fetchGroupHatimDetails(user.groupId);
        setGroupHatimData(groupHatimResponse.data);

        setLoading(false);
      } catch (err) {
        console.error('Ana sayfa verileri alınırken hata:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchHomeScreenData();
  }, [user.groupId]);

  // Yükleme durumu
  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator animating={true} size="large" />
        <Text>Veriler yükleniyor...</Text>
      </View>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Veriler yüklenirken hata oluştu</Text>
        <TouchableOpacity onPress={() => {/* Yeniden yükleme işlevi */}}>
          <Text>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Hatim bulunmadığında gösterilecek kart */}
      {(!personalHatimData || personalHatimData.length === 0) && (
        <Surface style={styles.noHatimCard}>
          <MaterialCommunityIcons 
            name="book-open-variant" 
            size={50} 
            color="#6200ee" 
            style={styles.noHatimIcon}
          />
          <Text style={styles.noHatimTitle}>Henüz Bir Hatim Oluşturmadınız</Text>
          <Text style={styles.noHatimSubtitle}>
            Kur'an-ı Kerim'i hatmetmek için hemen bir hatim başlatın
          </Text>
          <TouchableOpacity 
            style={styles.createHatimButton}
            onPress={() => navigation.navigate('CreateHatim')}
          >
            <Text style={styles.createHatimButtonText}>Hatim Oluştur</Text>
          </TouchableOpacity>
        </Surface>
      )}

      {/* Kişisel Hatim Kartı */}
      {personalHatimData && personalHatimData.length > 0 && (
        <Surface style={styles.hatimCard}>
          <View style={styles.hatimCardHeader}>
            <MaterialCommunityIcons name="book-open-variant" size={24} color="#6200ee" />
            <Text style={styles.hatimCardTitle}>Kişisel Hatim</Text>
          </View>
          <View style={styles.hatimCardContent}>
            <View style={styles.hatimCardRow}>
              <Text style={styles.hatimCardLabel}>Cüz Numarası</Text>
              <Text style={styles.hatimCardValue}>
                {personalHatimData[0]?.currentJuz || '0'}/30
              </Text>
            </View>
            <View style={styles.hatimCardRow}>
              <Text style={styles.hatimCardLabel}>Okunma Durumu</Text>
              <Text style={styles.hatimCardValue}>
                {personalHatimData[0]?.status || 'Başlamadı'}
              </Text>
            </View>
            <View style={styles.hatimCardProgressContainer}>
              <Text style={styles.hatimCardProgressLabel}>
                {personalHatimData[0]?.readPages || '0'}/
                {personalHatimData[0]?.totalPages || '604'} Sayfa
              </Text>
              <ProgressBar 
                progress={personalHatimData[0]?.progress || 0} 
                color="#6200ee" 
                style={styles.hatimCardProgressBar}
              />
            </View>
            <View style={styles.hatimCardFooter}>
              <View style={styles.hatimCardFooterItem}>
                <MaterialCommunityIcons name="calendar-start" size={16} color="#666" />
                <Text style={styles.hatimCardFooterText}>
                  {personalHatimData[0]?.startDate || '-'}
                </Text>
              </View>
              <View style={styles.hatimCardFooterItem}>
                <MaterialCommunityIcons name="calendar-end" size={16} color="#666" />
                <Text style={styles.hatimCardFooterText}>
                  {personalHatimData[0]?.endDate || '-'}
                </Text>
              </View>
              <View style={styles.hatimCardFooterItem}>
                <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
                <Text style={styles.hatimCardFooterText}>
                  {personalHatimData[0]?.daysLeft || '0'} Gün Kaldı
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.hatimCardDetailButton}
            onPress={() => navigation.navigate('JuzDetail', { 
              juzId: personalHatimData[0]?.id 
            })}
          >
            <Text style={styles.hatimCardDetailButtonText}>Detayları Görüntüle</Text>
          </TouchableOpacity>
        </Surface>
      )}

      {/* Grup Hatim Kartı */}
      {groupHatimData && (
        <Surface style={styles.hatimCard}>
          <View style={styles.hatimCardHeader}>
            <MaterialCommunityIcons name="account-group" size={24} color="#6200ee" />
            <Text style={styles.hatimCardTitle}>Grup Hatmi</Text>
          </View>
          <View style={styles.hatimCardContent}>
            <View style={styles.hatimCardRow}>
              <Text style={styles.hatimCardLabel}>Hatim Adı</Text>
              <Text style={styles.hatimCardValue}>
                {groupHatimData.name || 'Tanımsız Grup'}
              </Text>
            </View>
            <View style={styles.hatimCardRow}>
              <Text style={styles.hatimCardLabel}>Katılımcılar</Text>
              <Text style={styles.hatimCardValue}>
                {groupHatimData.participants || '0'} Kişi
              </Text>
            </View>
            <View style={styles.hatimCardProgressContainer}>
              <Text style={styles.hatimCardProgressLabel}>
                {groupHatimData.completedJuz || '0'}/
                {groupHatimData.totalJuz || '30'} Cüz Tamamlandı
              </Text>
              <ProgressBar 
                progress={groupHatimData.progress || 0} 
                color="#6200ee" 
                style={styles.hatimCardProgressBar}
              />
            </View>
            <View style={styles.hatimCardFooter}>
              <View style={styles.hatimCardFooterItem}>
                <MaterialCommunityIcons name="calendar-start" size={16} color="#666" />
                <Text style={styles.hatimCardFooterText}>
                  {groupHatimData.startDate || '-'}
                </Text>
              </View>
              <View style={styles.hatimCardFooterItem}>
                <MaterialCommunityIcons name="calendar-end" size={16} color="#666" />
                <Text style={styles.hatimCardFooterText}>
                  {groupHatimData.endDate || '-'}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.hatimCardDetailButton}
            onPress={() => navigation.navigate('GroupDetail', { 
              groupId: groupHatimData.id 
            })}
          >
            <Text style={styles.hatimCardDetailButtonText}>Detayları Görüntüle</Text>
          </TouchableOpacity>
        </Surface>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  noHatimCard: {
    margin: 16,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f0e6ff',
    elevation: 4,
  },
  noHatimIcon: {
    marginBottom: 16,
  },
  noHatimTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
    textAlign: 'center',
  },
  noHatimSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  createHatimButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createHatimButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  hatimCard: {
    margin: 16,
    borderRadius: 12,
    padding: 24,
    backgroundColor: '#f0e6ff',
    elevation: 4,
  },
  hatimCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hatimCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
    marginLeft: 8,
  },
  hatimCardContent: {
    marginBottom: 16,
  },
  hatimCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hatimCardLabel: {
    fontSize: 14,
    color: '#666',
  },
  hatimCardValue: {
    fontSize: 14,
    color: '#333',
  },
  hatimCardProgressContainer: {
    marginBottom: 16,
  },
  hatimCardProgressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  hatimCardProgressBar: {
    height: 4,
    borderRadius: 2,
  },
  hatimCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hatimCardFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hatimCardFooterText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  hatimCardDetailButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  hatimCardDetailButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;