import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Surface, Text, Avatar, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { fetchHatimList, fetchSpecialEvents } from '../services/apiService';
import { useFocusEffect } from '@react-navigation/native';

const MainScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [hatims, setHatims] = useState([]);
  const [specialEvents, setSpecialEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHatimsAndEvents = async () => {
    try {
      const hatimResponse = await fetchHatimList();
      setHatims(hatimResponse.data);

      const eventResponse = await fetchSpecialEvents();
      setSpecialEvents(eventResponse.data);

      setLoading(false);
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
      Alert.alert('Hata', 'Veriler yüklenemedi.');
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHatimsAndEvents();
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
        {/* Üst Banner */}
        <Card style={styles.topBanner}>
          <Card.Content style={styles.topBannerContent}>
            <Text style={styles.bannerTitle}>Anasayfa</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Support')}>
              <Text style={styles.supportText}>💜 Destek Ol</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>

        {/* Hoş Geldin Kartı */}
        <Card style={styles.welcomeCard}>
          <Card.Content style={styles.welcomeContent}>
            <View style={styles.avatarContainer}>
              <Avatar.Icon 
                size={40} 
                icon="account" 
                color="#fff" 
                style={styles.avatar}
              />
            </View>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeText}>Hoş Geldin,</Text>
              <Text style={styles.subText}>Bugün hatimini tamamlamaya ne dersin?</Text>
            </View>
          </Card.Content>
        </Card>

        {/* İstatistikler */}
        <Card style={styles.statsCard}>
          <Card.Content style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="book-open-page-variant" size={24} color="#6200ee" />
              <Text style={styles.statTitle}>Toplam Cüz</Text>
              <Text style={styles.statValue}>30/30</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="account-group" size={24} color="#6200ee" />
              <Text style={styles.statTitle}>Kişiler</Text>
              <Text style={styles.statValue}>15/30</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="fire" size={24} color="#6200ee" />
              <Text style={styles.statTitle}>Son Gün</Text>
              <Text style={styles.statValue}>7</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Özel Gece Hatmi */}
        {specialEvents.map(event => (
          <Card key={event.id} style={styles.specialEventCard}>
            <Card.Content>
              <Text style={styles.eventTitle}>🌙 {event.title}</Text>
              <View style={styles.eventDetails}>
                <View style={styles.eventRow}>
                  <Text style={styles.eventLabel}>Etkinlik</Text>
                  <Text style={styles.eventValue}>{event.name}</Text>
                </View>
                <View style={styles.eventRow}>
                  <Text style={styles.eventLabel}>Zaman Aralığı</Text>
                  <Text style={styles.eventValue}>{event.timeRange}</Text>
                </View>
                <View style={styles.eventRow}>
                  <Text style={styles.eventLabel}>Durum</Text>
                  <Text style={styles.eventValue}>{event.status}</Text>
                </View>
                <View style={styles.eventRow}>
                  <Text style={styles.eventLabel}>Kalan Süre</Text>
                  <Text style={styles.eventValue}>{event.remainingTime}</Text>
                </View>
                <View style={styles.eventStats}>
                  <Text style={styles.eventStatText}>👥 {event.participants} Katılımcı</Text>
                  <Text style={styles.eventStatText}>📖 {event.availableJuz} Cüz Müsait</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.detailButton}
                onPress={() => navigation.navigate('SpecialEventDetails', { eventId: event.id })}
              >
                <Text style={styles.detailButtonText}>Katıl</Text>
              </TouchableOpacity>
            </Card.Content>
          </Card>
        ))}

        {/* Kişisel Hatim Kartı */}
        {hatims.map(hatim => (
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
        ))}

        {/* Alt kısımda boşluk bırak */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Alt Menü - ScrollView dışında */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <MaterialCommunityIcons name="home" size={24} color="#6200ee" />
          <Text style={styles.navText}>Ana Sayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MyHatims')}>
          <MaterialCommunityIcons name="book-open-variant" size={24} color="#666" />
          <Text style={styles.navText}>Hatimlerim</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Groups')}>
          <MaterialCommunityIcons name="account-multiple" size={24} color="#666" />
          <Text style={styles.navText}>Gruplar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <MaterialCommunityIcons name="account" size={24} color="#666" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
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
  bottomPadding: {
    height: 70
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Üst Banner Stilleri
  topBanner: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#f8f0ff',
    elevation: 0,
    borderRadius: 12
  },
  topBannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee'
  },
  supportText: {
    color: '#6200ee',
    fontWeight: 'bold'
  },
  // Hoş Geldin Kartı Stilleri
  welcomeCard: {
    margin: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    elevation: 0,
    borderRadius: 12
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarContainer: {
    backgroundColor: '#6200ee',
    borderRadius: 20,
    marginRight: 12
  },
  avatar: {
    backgroundColor: '#6200ee'
  },
  welcomeTextContainer: {
    flex: 1
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  subText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2
  },
  // İstatistik Kartı Stilleri
  statsCard: {
    margin: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    elevation: 0,
    borderRadius: 12
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statItem: {
    alignItems: 'center',
    flex: 1
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
    marginTop: 2
  },
  // Özel Gece Hatmi Kartı Stilleri
  specialEventCard: {
    margin: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    elevation: 0,
    borderRadius: 12
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#6200ee'
  },
  eventDetails: {
    backgroundColor: '#f8f0ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  eventLabel: {
    fontSize: 14,
    color: '#666'
  },
  eventValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333'
  },
  eventStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  eventStatText: {
    fontSize: 12,
    color: '#666'
  },
  // Hatim Kartları Genel Stilleri
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
  hatimValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333'
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
  // Buton Stilleri
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
  // Alt Menü Stilleri
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  navItem: {
    alignItems: 'center',
    flex: 1
  },
  activeNavItem: {
    borderTopWidth: 2,
    borderTopColor: '#6200ee'
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666'
  }
});

export default MainScreen;