import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Surface, Text, Title, ProgressBar, Chip, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import NotificationService from '../services/NotificationService';

const HomeScreen = ({ navigation }) => {
  // Bildirim izinlerini kontrol et ve günlük hatırlatıcıyı ayarla
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const success = await NotificationService.scheduleDailyReminder(20, 0); // Her gün saat 20:00'de
        if (!success) {
          Alert.alert(
            'Bildirim İzni',
            'Günlük hatırlatıcıları alabilmek için lütfen bildirim izni verin.',
            [{ text: 'Tamam', style: 'default' }]
          );
        }
      } catch (error) {
        console.log('Bildirim ayarlanırken hata:', error);
      }
    };

    setupNotifications();
  }, []);

  // Örnek veriler (gerçek uygulamada API'den gelecek)
  const personalHatimData = {
    id: 1,
    number: 5,
    totalPages: 20,
    readPages: 15,
    progress: 0.75,
    isReadToday: true,
    startDate: '15.03.2024',
    endDate: '15.04.2024',
    daysLeft: 12,
    streakDays: 7,
    isCompleted: false
  };

  // Kullanıcı verisi (API'den gelecek)
  const userData = {
    isAdmin: false, // Yönetici kontrolü
    name: 'Ahmet Yılmaz'
  };

  // Özel gece hatmi verisi (API'den gelecek)
  const specialNightHatim = {
    isActive: true,
    title: "Miraç Kandili Hatmi",
    startTime: "20:00",
    endTime: "21:00",
    totalParticipants: 30,
    availableJuz: 12,
    progress: 0.4,
  };

  const renderReadingStatus = () => {
    const color = personalHatimData.isReadToday ? '#4caf50' : '#ff9800';
    const icon = personalHatimData.isReadToday ? 'check-circle' : 'clock-outline';
    const text = personalHatimData.isReadToday ? 'Bugünkü okuma tamamlandı' : 'Bugün henüz okuma yapılmadı';
    
    return (
      <View style={styles.readingStatus}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
        <Text style={[styles.readingStatusText, { color }]}>{text}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Hoş Geldin Bölümü */}
      <Surface style={styles.welcomeCard}>
        <LinearGradient
          colors={['#6200ee', '#9747FF']}
          style={styles.welcomeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.welcomeContent}>
            <Avatar.Icon 
              size={60} 
              icon="account" 
              style={styles.avatar}
              color="#6200ee"
              backgroundColor="white"
            />
            <View style={styles.welcomeText}>
              <Text style={styles.greeting}>Mübarek Hoşgeldin :)</Text>
              <Title style={styles.username}>Ahmet Yılmaz</Title>
            </View>
          </View>
        </LinearGradient>
      </Surface>

      {/* Özel Gece Hatmi Kartı - Sadece aktif olduğunda göster */}
      {specialNightHatim.isActive && (
        <Surface style={styles.specialNightCard}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={styles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <MaterialCommunityIcons name="star-circle" size={32} color="white" />
                <View style={styles.titleTextContainer}>
                  <Title style={styles.cardTitle}>Özel Gece Hatmi</Title>
                  <Text style={styles.cardSubtitle}>{specialNightHatim.title}</Text>
                </View>
              </View>
              <Chip 
                mode="outlined" 
                style={[styles.timeChip, { borderColor: 'white' }]}
                textStyle={{ color: 'white' }}
              >
                {specialNightHatim.startTime} - {specialNightHatim.endTime}
              </Chip>
            </View>

            <View style={styles.specialNightInfo}>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="account-group" size={24} color="rgba(255,255,255,0.9)" />
                <Text style={styles.infoText}>{specialNightHatim.totalParticipants} Katılımcı</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="book-open-variant" size={24} color="rgba(255,255,255,0.9)" />
                <Text style={styles.infoText}>{specialNightHatim.availableJuz} Cüz Müsait</Text>
              </View>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressText}>Genel İlerleme</Text>
                <Text style={styles.progressPercentage}>
                  {Math.round(specialNightHatim.progress * 100)}%
                </Text>
              </View>
              <ProgressBar 
                progress={specialNightHatim.progress} 
                color="white" 
                style={styles.progressBar}
              />
            </View>

            <TouchableOpacity 
              style={[styles.detailsButton, styles.specialNightButton]}
              onPress={() => {
                navigation.navigate('GroupDetail', { groupId: 'special' });
                Alert.alert(
                  'Bilgi',
                  'Katılım talebiniz alındı. Yönetici onayından sonra gruba ekleneceksiniz.',
                  [{ text: 'Tamam', style: 'default' }]
                );
              }}
            >
              <Text style={[styles.detailsButtonText, { color: '#FF6B6B' }]}>Katıl</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#FF6B6B" />
            </TouchableOpacity>
          </LinearGradient>
        </Surface>
      )}

      {/* Kişisel Hatim Kartı */}
      <Surface style={styles.personalHatimCard}>
        <LinearGradient
          colors={['#6200ee', '#9747FF']}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <MaterialCommunityIcons name="book-open-page-variant" size={32} color="white" />
              <View style={styles.titleTextContainer}>
                <Title style={styles.cardTitle}>Kişisel Hatim</Title>
                <Text style={styles.cardSubtitle}>{personalHatimData.number}. Cüz</Text>
              </View>
            </View>
            <Chip 
              mode="outlined" 
              style={styles.daysLeftChip}
              textStyle={styles.daysLeftText}
            >
              {personalHatimData.daysLeft} Gün Kaldı
            </Chip>
          </View>

          {renderReadingStatus()}

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>
                {personalHatimData.readPages}/{personalHatimData.totalPages} Sayfa
              </Text>
              <Text style={styles.progressPercentage}>
                {Math.round(personalHatimData.progress * 100)}%
              </Text>
            </View>
            <ProgressBar 
              progress={personalHatimData.progress} 
              color="white" 
              style={styles.progressBar}
            />
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="calendar-range" size={24} color="rgba(255,255,255,0.9)" />
              <Text style={styles.statValue}>{personalHatimData.startDate}</Text>
              <Text style={styles.statLabel}>Başlangıç</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="fire" size={24} color="rgba(255,255,255,0.9)" />
              <Text style={styles.statValue}>{personalHatimData.streakDays} Gün</Text>
              <Text style={styles.statLabel}>Kesintisiz</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="calendar-check" size={24} color="rgba(255,255,255,0.9)" />
              <Text style={styles.statValue}>{personalHatimData.endDate}</Text>
              <Text style={styles.statLabel}>Bitiş</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.detailButton}
            onPress={() => navigation.navigate('JuzDetail', { 
              juzId: personalHatimData.id,
              juzNo: personalHatimData.number,
              totalPages: personalHatimData.totalPages,
              readPages: personalHatimData.readPages,
              startDate: personalHatimData.startDate,
              endDate: personalHatimData.endDate
            })}
          >
            <Text style={styles.detailsButtonText}>Detayları Görüntüle</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </Surface>

      {/* Grup Hatim Kartı */}
      <Surface style={styles.groupHatimCard}>
        <LinearGradient
          colors={['#4A00E0', '#8E2DE2']}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <MaterialCommunityIcons name="account-group" size={32} color="white" />
              <View style={styles.titleTextContainer}>
                <Title style={styles.cardTitle}>Grup Hatmi</Title>
                <Text style={styles.cardSubtitle}>Ramazan Hatmi</Text>
              </View>
            </View>
            <Chip 
              mode="outlined" 
              style={styles.participantsChip}
              textStyle={styles.participantsText}
            >
              15 Katılımcı
            </Chip>
          </View>

          <View style={styles.groupProgressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressText}>Toplam İlerleme</Text>
              <Text style={styles.progressPercentage}>60%</Text>
            </View>
            <ProgressBar 
              progress={0.6} 
              color="white" 
              style={styles.progressBar}
            />
          </View>

          <View style={styles.groupStatsContainer}>
            <View style={styles.groupStatItem}>
              <MaterialCommunityIcons name="book-open-variant" size={24} color="rgba(255,255,255,0.9)" />
              <Text style={styles.groupStatValue}>18/30</Text>
              <Text style={styles.groupStatLabel}>Tamamlanan Cüz</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.groupStatItem}>
              <MaterialCommunityIcons name="calendar" size={24} color="rgba(255,255,255,0.9)" />
              <Text style={styles.groupStatValue}>15.04.2024</Text>
              <Text style={styles.groupStatLabel}>Bitiş Tarihi</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => navigation.navigate('GroupDetail', { groupId: 1 })}
          >
            <Text style={styles.detailsButtonText}>Detayları Görüntüle</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  welcomeCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  welcomeGradient: {
    padding: 20,
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 16,
  },
  welcomeText: {
    flex: 1,
  },
  greeting: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
  },
  username: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  personalHatimCard: {
    margin: 16,
    borderRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  groupHatimCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  gradientBackground: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleTextContainer: {
    marginLeft: 12,
  },
  cardTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
  },
  daysLeftChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'white',
  },
  daysLeftText: {
    color: 'white',
  },
  participantsChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'white',
  },
  participantsText: {
    color: 'white',
  },
  readingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  readingStatusText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  progressSection: {
    marginBottom: 20,
  },
  groupProgressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    color: 'white',
    fontSize: 16,
  },
  progressPercentage: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  groupStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  groupStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  groupStatValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  groupStatLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 8,
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  specialNightCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  timeChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  specialNightInfo: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '500',
  },
  specialNightButton: {
    backgroundColor: 'white',
  },
  specialNightButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 8,
  },
});

export default HomeScreen; 