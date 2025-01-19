import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { Surface, Text, Title, Avatar, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import NotificationService from '../services/NotificationService';
import { WebView } from 'react-native-webview';
import SupportModal from '../components/SupportModal';

const HomeScreen = ({ navigation }) => {
  const { user, isAdmin } = useAuth();

  // Örnek hatim verileri
  const personalHatimData = {
    id: 1,
    number: 5,
    totalPages: 30,
    readPages: 15,
    progress: 0.5,
    startDate: '15.03.2024',
    endDate: '15.04.2024',
    daysLeft: 15,
    status: 'Devam Ediyor'
  };

  const groupHatimData = {
    id: 2,
    name: 'Ramazan Hatmi',
    totalJuz: 30,
    completedJuz: 18,
    participants: 15,
    progress: 0.6,
    startDate: '15.03.2024',
    endDate: '15.04.2024'
  };

  const [specialNightHatim, setSpecialNightHatim] = useState({
    isActive: true,
    title: "Miraç Kandili Hatmi",
    startTime: "20:00",
    endTime: "21:00",
    totalParticipants: 30,
    availableJuz: 12,
    progress: 0.4,
    remainingTime: 3600, // 1 saat (saniye cinsinden)
    status: 'Devam Ediyor'
  });

  const [supportModalVisible, setSupportModalVisible] = useState(false);

  useEffect(() => {
    let timer;
    if (specialNightHatim.isActive && specialNightHatim.remainingTime > 0) {
      timer = setInterval(() => {
        setSpecialNightHatim(prev => {
          const updatedTime = prev.remainingTime - 1;
          return {
            ...prev,
            remainingTime: updatedTime,
            status: updatedTime <= 0 ? 'Tamamlandı' : 'Devam Ediyor'
          };
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [specialNightHatim.isActive, specialNightHatim.remainingTime]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSpecialNightParticipation = async () => {
    try {
      // Kullanıcı bilgilerini al
      const participantInfo = {
        userId: user.id,
        userName: user.fullName || user.name,
        eventName: specialNightHatim.title,
        participationTime: new Date().toISOString()
      };

      // Yöneticilere bildirim gönder
      await NotificationService.sendAdminNotification({
        title: 'Yeni Katılım Talebi',
        body: `${participantInfo.userName}, ${participantInfo.eventName} etkinliğine katılmak istiyor.`
      });

      // Kullanıcıya bilgilendirme mesajı
      Alert.alert(
        'Katılım Talebi Gönderildi',
        'Yönetici onayından sonra gruba katılabileceksiniz. Size en kısa sürede dönüş yapılacaktır.'
      );
    } catch (error) {
      console.error('Katılım talebi gönderilirken hata:', error);
      Alert.alert('Hata', 'Katılım talebi gönderilemedi. Lütfen daha sonra tekrar deneyin.');
    }
  };

  const handleSupport = () => {
    setSupportModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Destek Popup Modal */}
      <Modal
        visible={supportModalVisible}
        onRequestClose={() => setSupportModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Destek Ol</Text>
              <TouchableOpacity onPress={() => setSupportModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <WebView
              source={{ uri: 'https://iyzi.link/AJ8JeQ' }}
              style={styles.webview}
            />
          </View>
        </View>
      </Modal>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Üst Bar - Anasayfa ve Destek Ol */}
        <Surface style={styles.topBar}>
          <Text style={styles.pageTitle}>
            {user ? `${user.firstName} ${user.lastName}` : 'Anasayfa'}
          </Text>
          <TouchableOpacity 
            style={styles.supportButton}
            onPress={handleSupport}
          >
            <MaterialCommunityIcons name="heart" size={24} color="#6200ee" />
            <Text style={styles.supportButtonText}>Destek Ol</Text>
          </TouchableOpacity>
        </Surface>

        {/* Kullanıcı Karşılama Bölümü */}
        <Surface style={styles.welcomeCard}>
          <View style={styles.welcomeHeader}>
            <Avatar.Icon 
              size={50} 
              icon="account" 
              style={styles.avatar}
            />
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeText}>
                Hoş Geldin, {user ? `${user.firstName} ${user.lastName}` : 'Misafir'}
              </Text>
              <Text style={styles.subtitleText}>
                Bugün hatmini tamamlamaya ne dersin?
              </Text>
            </View>
          </View>
        </Surface>

        {/* Hatim İstatistikleri */}
        <Surface style={styles.statsCard}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="book-open-variant" size={24} color="#6200ee" />
              <Text style={styles.statLabel}>Toplam Cüz</Text>
              <Text style={styles.statValue}>30/30</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="calendar-check" size={24} color="#6200ee" />
              <Text style={styles.statLabel}>Günler</Text>
              <Text style={styles.statValue}>15/30</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="fire" size={24} color="#6200ee" />
              <Text style={styles.statLabel}>Seri Gün</Text>
              <Text style={styles.statValue}>7</Text>
            </View>
          </View>
        </Surface>

        {/* Hızlı Eylemler */}
        <Surface style={styles.quickActionsCard}>
          <View style={styles.quickActionsHeader}>
            <MaterialCommunityIcons name="lightning-bolt" size={24} color="#6200ee" />
            <Text style={styles.quickActionsTitle}>Hızlı Eylemler</Text>
          </View>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('ReadQuran')}
            >
              <MaterialCommunityIcons name="book-open-page-variant" size={24} color="#6200ee" />
              <Text style={styles.quickActionText}>Hatmi Oku</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('JuzProgress')}
            >
              <MaterialCommunityIcons name="chart-line" size={24} color="#6200ee" />
              <Text style={styles.quickActionText}>İlerleme</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => navigation.navigate('InviteFriends')}
            >
              <MaterialCommunityIcons name="account-plus" size={24} color="#6200ee" />
              <Text style={styles.quickActionText}>Davet Et</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={handleSupport}
            >
              <MaterialCommunityIcons name="help-circle" size={24} color="#6200ee" />
              <Text style={styles.quickActionText}>Destek</Text>
            </TouchableOpacity>
          </View>
        </Surface>

        {/* Özel Gece Hatmi Kartı */}
        {specialNightHatim.isActive && (
          <Surface style={styles.specialNightCard}>
            <View style={styles.specialNightCardHeader}>
              <MaterialCommunityIcons name="star-circle" size={24} color="#FF6B6B" />
              <Text style={styles.specialNightCardTitle}>Özel Gece Hatmi</Text>
            </View>
            <View style={styles.specialNightCardContent}>
              <View style={styles.specialNightCardRow}>
                <Text style={styles.specialNightCardLabel}>Etkinlik</Text>
                <Text style={styles.specialNightCardValue}>{specialNightHatim.title}</Text>
              </View>
              <View style={styles.specialNightCardRow}>
                <Text style={styles.specialNightCardLabel}>Zaman Aralığı</Text>
                <Text style={styles.specialNightCardValue}>
                  {specialNightHatim.startTime} - {specialNightHatim.endTime}
                </Text>
              </View>
              <View style={styles.specialNightCardRow}>
                <Text style={styles.specialNightCardLabel}>Durum</Text>
                <Text style={styles.specialNightCardValue}>{specialNightHatim.status}</Text>
              </View>
              <View style={styles.specialNightCardProgressContainer}>
                <Text style={styles.specialNightCardProgressLabel}>
                  Kalan Süre: {formatTime(specialNightHatim.remainingTime)}
                </Text>
                <ProgressBar 
                  progress={(3600 - specialNightHatim.remainingTime) / 3600} 
                  color="#FF6B6B" 
                  style={styles.specialNightCardProgressBar}
                />
              </View>
              <View style={styles.specialNightCardFooter}>
                <View style={styles.specialNightCardFooterItem}>
                  <MaterialCommunityIcons name="account-group" size={16} color="#666" />
                  <Text style={styles.specialNightCardFooterText}>
                    {specialNightHatim.totalParticipants} Katılımcı
                  </Text>
                </View>
                <View style={styles.specialNightCardFooterItem}>
                  <MaterialCommunityIcons name="book-open-variant" size={16} color="#666" />
                  <Text style={styles.specialNightCardFooterText}>
                    {specialNightHatim.availableJuz} Cüz Müsait
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.specialNightCardButton}
              onPress={handleSpecialNightParticipation}
            >
              <Text style={styles.specialNightCardButtonText}>Katıl</Text>
            </TouchableOpacity>
          </Surface>
        )}

        {/* Kişisel Hatim Kartı */}
        <Surface style={styles.hatimCard}>
          <View style={styles.hatimCardHeader}>
            <MaterialCommunityIcons name="book-open-variant" size={24} color="#6200ee" />
            <Text style={styles.hatimCardTitle}>Kişisel Hatim</Text>
          </View>
          <View style={styles.hatimCardContent}>
            <View style={styles.hatimCardRow}>
              <Text style={styles.hatimCardLabel}>Cüz Numarası</Text>
              <Text style={styles.hatimCardValue}>{personalHatimData.number}/30</Text>
            </View>
            <View style={styles.hatimCardRow}>
              <Text style={styles.hatimCardLabel}>Okunma Durumu</Text>
              <Text style={styles.hatimCardValue}>{personalHatimData.status}</Text>
            </View>
            <View style={styles.hatimCardProgressContainer}>
              <Text style={styles.hatimCardProgressLabel}>
                {personalHatimData.readPages}/{personalHatimData.totalPages} Sayfa
              </Text>
              <ProgressBar 
                progress={personalHatimData.progress} 
                color="#6200ee" 
                style={styles.hatimCardProgressBar}
              />
            </View>
            <View style={styles.hatimCardFooter}>
              <View style={styles.hatimCardFooterItem}>
                <MaterialCommunityIcons name="calendar-start" size={16} color="#666" />
                <Text style={styles.hatimCardFooterText}>{personalHatimData.startDate}</Text>
              </View>
              <View style={styles.hatimCardFooterItem}>
                <MaterialCommunityIcons name="calendar-end" size={16} color="#666" />
                <Text style={styles.hatimCardFooterText}>{personalHatimData.endDate}</Text>
              </View>
              <View style={styles.hatimCardFooterItem}>
                <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
                <Text style={styles.hatimCardFooterText}>{personalHatimData.daysLeft} Gün Kaldı</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.hatimCardDetailButton}
            onPress={() => navigation.navigate('JuzDetail', { juzId: personalHatimData.id })}
          >
            <Text style={styles.hatimCardDetailButtonText}>Detayları Görüntüle</Text>
          </TouchableOpacity>
        </Surface>

        {/* Grup Hatim Kartı */}
        <Surface style={styles.hatimCard}>
          <View style={styles.hatimCardHeader}>
            <MaterialCommunityIcons name="account-group" size={24} color="#6200ee" />
            <Text style={styles.hatimCardTitle}>Grup Hatmi</Text>
          </View>
          <View style={styles.hatimCardContent}>
            <View style={styles.hatimCardRow}>
              <Text style={styles.hatimCardLabel}>Hatim Adı</Text>
              <Text style={styles.hatimCardValue}>{groupHatimData.name}</Text>
            </View>
            <View style={styles.hatimCardRow}>
              <Text style={styles.hatimCardLabel}>Katılımcılar</Text>
              <Text style={styles.hatimCardValue}>{groupHatimData.participants} Kişi</Text>
            </View>
            <View style={styles.hatimCardProgressContainer}>
              <Text style={styles.hatimCardProgressLabel}>
                {groupHatimData.completedJuz}/{groupHatimData.totalJuz} Cüz Tamamlandı
              </Text>
              <ProgressBar 
                progress={groupHatimData.progress} 
                color="#6200ee" 
                style={styles.hatimCardProgressBar}
              />
            </View>
            <View style={styles.hatimCardFooter}>
              <View style={styles.hatimCardFooterItem}>
                <MaterialCommunityIcons name="calendar-start" size={16} color="#666" />
                <Text style={styles.hatimCardFooterText}>{groupHatimData.startDate}</Text>
              </View>
              <View style={styles.hatimCardFooterItem}>
                <MaterialCommunityIcons name="calendar-end" size={16} color="#666" />
                <Text style={styles.hatimCardFooterText}>{groupHatimData.endDate}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.hatimCardDetailButton}
            onPress={() => navigation.navigate('GroupDetail', { groupId: groupHatimData.id })}
          >
            <Text style={styles.hatimCardDetailButtonText}>Detayları Görüntüle</Text>
          </TouchableOpacity>
        </Surface>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollContainer: {
    padding: 16
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0e6ff',
    padding: 8,
    borderRadius: 20,
  },
  supportButtonText: {
    marginLeft: 4,
    color: '#6200ee',
    fontWeight: 'bold',
  },
  welcomeCard: {
    margin: 16,
    borderRadius: 10,
    elevation: 3,
    padding: 16,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#6200ee',
    marginRight: 16,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitleText: {
    fontSize: 14,
    color: '#666',
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    elevation: 3,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#e0e0e0',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
    marginTop: 4,
  },
  quickActionsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    elevation: 3,
    padding: 16,
  },
  quickActionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#6200ee',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    alignItems: 'center',
    flex: 1,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 12,
    color: '#6200ee',
  },
  hatimCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    elevation: 3,
    padding: 16,
  },
  hatimCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  hatimCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#6200ee',
  },
  hatimCardContent: {
    marginBottom: 12,
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
    fontWeight: 'bold',
    color: '#333',
  },
  hatimCardProgressContainer: {
    marginVertical: 8,
  },
  hatimCardProgressLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  hatimCardProgressBar: {
    height: 8,
    borderRadius: 4,
  },
  hatimCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  hatimCardFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hatimCardFooterText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  hatimCardDetailButton: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  hatimCardDetailButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  specialNightCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    elevation: 3,
    padding: 16,
    backgroundColor: '#FFF3E0', // Hafif turuncu arka plan
  },
  specialNightCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  specialNightCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#FF6B6B',
  },
  specialNightCardContent: {
    marginBottom: 12,
  },
  specialNightCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  specialNightCardLabel: {
    fontSize: 14,
    color: '#666',
  },
  specialNightCardValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  specialNightCardProgressContainer: {
    marginVertical: 8,
  },
  specialNightCardProgressLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  specialNightCardProgressBar: {
    height: 8,
    borderRadius: 4,
  },
  specialNightCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  specialNightCardFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specialNightCardFooterText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  specialNightCardButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  specialNightCardButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  webview: {
    flex: 1,
  },
});

export default HomeScreen;