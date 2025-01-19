import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Surface, Text, Title, Button, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import NotificationService from '../services/NotificationService';

const JuzDetail = ({ route }) => {
  const { juzNo, totalPages = 20, initialReadPages = 0, startDate, endDate } = route.params;
  const [readPages, setReadPages] = useState(initialReadPages || 0);
  const [isReadToday, setIsReadToday] = useState(false);

  const progress = totalPages > 0 ? readPages / totalPages : 0;
  const remainingPages = Math.max(totalPages - readPages, 0);

  const handleMarkAsRead = async () => {
    if (!isReadToday) {
      setIsReadToday(true);
      setReadPages(prev => Math.min(prev + 1, totalPages));
      
      // Günlük okuma tamamlandığında bildirimi iptal et
      await NotificationService.cancelAllNotifications();
      
      // Başarılı okuma bildirimi gönder
      await NotificationService.sendImmediateNotification(
        "Tebrikler!",
        "Bugünkü cüz okumanızı tamamladınız. Yarın görüşmek üzere!"
      );
      
      // Yarın için yeni hatırlatıcı ayarla
      await NotificationService.scheduleDailyReminder(20, 0);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.card}>
        <View style={styles.header}>
          <Title style={styles.title}>{juzNo}. Cüz Detayları</Title>
          <MaterialCommunityIcons
            name={isReadToday ? "check-circle" : "clock-outline"}
            size={32}
            color={isReadToday ? "#4CAF50" : "#6200ee"}
          />
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressText}>İlerleme: {Math.round(progress * 100)}%</Text>
          <ProgressBar progress={progress} color="#6200ee" style={styles.progressBar} />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="book-open-variant" size={24} color="#6200ee" />
            <Text style={styles.statLabel}>Okunan Sayfa</Text>
            <Text style={styles.statValue}>{readPages}/{totalPages}</Text>
          </View>

          <View style={styles.statItem}>
            <MaterialCommunityIcons name="book" size={24} color="#6200ee" />
            <Text style={styles.statLabel}>Kalan Sayfa</Text>
            <Text style={styles.statValue}>{remainingPages}</Text>
          </View>
        </View>

        <View style={styles.dateContainer}>
          <View style={styles.dateItem}>
            <MaterialCommunityIcons name="calendar-start" size={24} color="#6200ee" />
            <Text style={styles.dateLabel}>Başlangıç</Text>
            <Text style={styles.dateValue}>{startDate}</Text>
          </View>

          <View style={styles.dateItem}>
            <MaterialCommunityIcons name="calendar-end" size={24} color="#6200ee" />
            <Text style={styles.dateLabel}>Bitiş</Text>
            <Text style={styles.dateValue}>{endDate}</Text>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={handleMarkAsRead}
          style={[styles.button, isReadToday && styles.buttonDisabled]}
          disabled={isReadToday}
        >
          {isReadToday ? "Bugün Okundu" : "Bugün Okundu İşaretle"}
        </Button>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressSection: {
    marginBottom: 24,
  },
  progressText: {
    fontSize: 16,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  dateItem: {
    alignItems: 'center',
  },
  dateLabel: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  dateValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
  },
  buttonDisabled: {
    backgroundColor: '#4CAF50',
  },
});

export default JuzDetail; 