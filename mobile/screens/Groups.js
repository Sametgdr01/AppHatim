import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Portal, Dialog, ActivityIndicator, Alert } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../services/api';

const Groups = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedHatim, setSelectedHatim] = useState(null);

  const handleJoinRequest = async (hatimId) => {
    try {
      setLoading(true);
      await api.post(`/api/hatims/group/${hatimId}/join-request`);
      setShowDialog(true);
    } catch (error) {
      console.error('Katılma isteği gönderme hatası:', error);
      Alert.alert('Hata', error.response?.data?.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {/* Özel Gece Hatmi Kartı */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('SpecialEventDetails', {
            hatimId: 'special-event-id',
            title: 'Miraç Kandili Hatmi'
          })}
          style={styles.cardContainer}
        >
          <View style={styles.specialEventCard}>
            <View style={styles.headerRow}>
              <MaterialCommunityIcons name="star" size={20} color="#fff" />
              <Text style={styles.specialEventLabel}>Özel Gece Hatmi</Text>
            </View>
            
            <Text style={styles.eventTitle}>Miraç Kandili Hatmi</Text>
            
            <View style={styles.timeRow}>
              <MaterialCommunityIcons name="clock-outline" size={16} color="#fff" />
              <Text style={styles.timeText}>06.02.2024 · 20:00 - 21:00</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: '65%' }]} />
            </View>

            {/* Katılımcılar */}
            <View style={styles.participantsContainer}>
              <View style={styles.participant}>
                <MaterialCommunityIcons name="account" size={16} color="#fff" />
                <Text style={styles.participantName}>Ahmet Yılmaz</Text>
                <Text style={styles.participantPages}>30 sayfa</Text>
              </View>
              <View style={styles.participant}>
                <MaterialCommunityIcons name="account" size={16} color="#fff" />
                <Text style={styles.participantName}>Mehmet Demir</Text>
                <Text style={styles.participantPages}>20 sayfa</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Normal Grup Hatmi Kartı */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('GroupHatimDetails', {
            hatimId: 'group-hatim-id',
            title: 'Grup Hatmi'
          })}
          style={styles.cardContainer}
          disabled={loading}
        >
          <View style={styles.groupCard}>
            <Text style={styles.groupTitle}>Grup Hatmi</Text>

            {/* Katılımcı Bilgisi */}
            <View style={styles.participantsCount}>
              <MaterialCommunityIcons name="account-multiple" size={20} color="#fff" />
              <Text style={styles.participantsText}>15 Katılımcı</Text>
            </View>

            {/* Cüz Bilgisi */}
            <View style={styles.cuzInfo}>
              <MaterialCommunityIcons name="book-open-variant" size={20} color="#fff" />
              <Text style={styles.cuzText}>5 Boş Cüz</Text>
            </View>

            {loading ? (
              <ActivityIndicator size={24} color="#fff" />
            ) : (
              <MaterialCommunityIcons 
                name="chevron-right" 
                size={24} 
                color="#fff" 
                style={styles.chevron}
              />
            )}
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Katılma İsteği Dialog */}
      <Portal>
        <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
          <Dialog.Title>Katılma İsteği Gönderildi</Dialog.Title>
          <Dialog.Content>
            <Text>
              {selectedHatim?.title} için katılma isteğiniz gönderildi. 
              Grup yöneticisi onayladıktan sonra hatime katılabileceksiniz.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDialog(false)}>Tamam</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cardContainer: {
    margin: 16,
    marginBottom: 8,
  },
  specialEventCard: {
    backgroundColor: '#FF4081',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  specialEventLabel: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 12,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  participantsContainer: {
    gap: 8,
  },
  participant: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  participantName: {
    color: '#fff',
    flex: 1,
    fontSize: 14,
  },
  participantPages: {
    color: '#fff',
    fontSize: 14,
  },
  groupCard: {
    backgroundColor: '#6200ee',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  groupTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1
  },
  participantsCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  participantsText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8
  },
  cuzInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16
  },
  cuzText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8
  },
  chevron: {
    opacity: 0.8
  }
});

export default Groups;
