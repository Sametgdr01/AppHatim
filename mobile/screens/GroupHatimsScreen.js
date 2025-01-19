import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Surface, Text, Title, Button, Portal, Modal, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthContext } from '../context/AuthContext';

const GroupHatimsScreen = ({ navigation }) => {
  const { userData } = useContext(AuthContext);
  const [showSpecialModal, setShowSpecialModal] = useState(false);
  const [specialHatimTitle, setSpecialHatimTitle] = useState('');
  const [remainingTime, setRemainingTime] = useState(3600); // 1 saat = 3600 saniye

  // Timer fonksiyonu
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Örnek grup hatim verileri
  const groupHatims = [
    {
      id: 1,
      title: 'Miraç Kandili Hatmi',
      isSpecial: true,
      startTime: '20:00',
      endTime: '21:00',
      date: '06.02.2024',
      totalPages: 604,
      completedPages: 423,
      participants: [
        { id: 1, name: 'Ahmet Yılmaz', pages: 30, completed: true },
        { id: 2, name: 'Mehmet Demir', pages: 20, completed: false },
      ],
      color: ['#FF6B6B', '#FF8E8E'],
    },
    {
      id: 2,
      title: 'Grup Hatmi',
      isSpecial: false,
      endDate: '15.03.2024',
      participants: 15,
      availableJuz: 5,
      color: ['#4A00E0', '#8E2DE2'],
    },
  ];

  const createSpecialHatim = () => {
    // Burada özel hatim oluşturma işlemi yapılacak
    setShowSpecialModal(false);
    setSpecialHatimTitle('');
  };

  const renderHatimCard = (hatim) => {
    if (hatim.isSpecial) {
      return (
        <TouchableOpacity 
          key={hatim.id}
          onPress={() => navigation.navigate('GroupDetail', { groupId: hatim.id })}
          activeOpacity={0.8}
        >
          <Surface style={styles.hatimCard}>
            <LinearGradient
              colors={hatim.color}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View style={styles.cardContent}>
                <View style={styles.specialBadge}>
                  <MaterialCommunityIcons name="star" size={16} color="#fff" />
                  <Text style={styles.specialText}>Özel Gece Hatmi</Text>
                </View>
                
                <Title style={styles.cardTitle}>{hatim.title}</Title>
                
                <View style={styles.timeInfo}>
                  <MaterialCommunityIcons name="clock-outline" size={20} color="#fff" />
                  <Text style={styles.timeText}>
                    {formatTime(remainingTime)}
                  </Text>
                </View>

                <View style={styles.progressSection}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${((3600 - remainingTime) / 3600) * 100}%` }
                      ]} 
                    />
                  </View>
                </View>

                <View style={styles.participantsList}>
                  {hatim.participants.map(participant => (
                    <View key={participant.id} style={styles.participantItem}>
                      <MaterialCommunityIcons 
                        name={participant.completed ? "check-circle" : "clock-outline"} 
                        size={20} 
                        color={participant.completed ? "#4CAF50" : "#fff"} 
                      />
                      <Text style={styles.participantName}>{participant.name}</Text>
                      <Text style={styles.participantPages}>{participant.pages} sayfa</Text>
                    </View>
                  ))}
                </View>
              </View>
            </LinearGradient>
          </Surface>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        key={hatim.id}
        onPress={() => navigation.navigate('GroupDetail', { groupId: hatim.id })}
        activeOpacity={0.8}
      >
        <Surface style={styles.hatimCard}>
          <LinearGradient
            colors={hatim.color}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.cardContent}>
              <Title style={styles.cardTitle}>{hatim.title}</Title>
              <View style={styles.cardRow}>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="account-group" size={24} color="#fff" />
                  <Text style={styles.cardInfoText}>{hatim.participants} Katılımcı</Text>
                </View>
              </View>
              <View style={styles.cardRow}>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="book-open-variant" size={24} color="#fff" />
                  <Text style={styles.cardInfoText}>{hatim.availableJuz} Boş Cüz</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={32} color="#fff" />
              </View>
            </View>
          </LinearGradient>
        </Surface>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {userData?.isAdmin && (
        <View style={styles.header}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('AdminPanel')}
            style={styles.specialButton}
            icon="star"
          >
            Özel Gece Hatmi Oluştur
          </Button>
        </View>
      )}

      {groupHatims.map(hatim => renderHatimCard(hatim))}

      <Portal>
        <Modal
          visible={showSpecialModal}
          onDismiss={() => setShowSpecialModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Özel Gece Hatmi Oluştur</Title>
          <TextInput
            label="Hatim Başlığı"
            value={specialHatimTitle}
            onChangeText={setSpecialHatimTitle}
            mode="outlined"
            style={styles.input}
          />
          <View style={styles.modalActions}>
            <Button onPress={() => setShowSpecialModal(false)} style={styles.modalButton}>
              İptal
            </Button>
            <Button
              mode="contained"
              onPress={createSpecialHatim}
              style={styles.modalButton}
              disabled={!specialHatimTitle}
            >
              Oluştur
            </Button>
          </View>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
  },
  specialButton: {
    backgroundColor: '#FF6B6B',
  },
  hatimCard: {
    margin: 16,
    borderRadius: 20,
    elevation: 4,
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: 20,
  },
  cardContent: {
    padding: 20,
  },
  specialBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  specialText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 12,
  },
  cardTitle: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 16,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeText: {
    color: '#fff',
    marginLeft: 8,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
  },
  participantsList: {
    marginTop: 16,
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  participantName: {
    color: '#fff',
    marginLeft: 8,
    flex: 1,
  },
  participantPages: {
    color: '#fff',
    marginLeft: 8,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardInfoText: {
    marginLeft: 12,
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    marginLeft: 8,
  },
});

export default GroupHatimsScreen;