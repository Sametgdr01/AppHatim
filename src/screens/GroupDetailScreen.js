import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Surface, Text, Title, Button, Portal, Modal, RadioButton, Snackbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const GroupDetailScreen = ({ route, navigation }) => {
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [selectedJuzType, setSelectedJuzType] = useState('fixed');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Bu veriler API'den gelecek, şimdilik örnek veriler
  const groupData = {
    name: 'Ramazan Hatmi',
    startDate: '01.03.2024',
    endDate: '09.04.2024',
    totalJuz: 30,
    completedJuz: 12,
    participants: 15,
    availableJuz: 5,
    isAdmin: true, // Kullanıcının yönetici olup olmadığı
    joinRequestSent: false, // Kullanıcının katılım isteği gönderip göndermediği
  };

  const showJoinModal = () => setJoinModalVisible(true);
  const hideJoinModal = () => setJoinModalVisible(false);

  const handleJoin = () => {
    // API'ye katılma isteği gönderilecek
    console.log('Join request sent with type:', selectedJuzType);
    hideJoinModal();
    setSnackbarMessage('Katılım isteğiniz yöneticiye iletildi.');
    setSnackbarVisible(true);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Surface style={styles.headerCard}>
          <Title style={styles.headerTitle}>{groupData.name}</Title>
          {groupData.isAdmin && (
            <Button
              mode="contained"
              icon="account-multiple"
              onPress={() => navigation.navigate('GroupAdmin', { groupId: route.params?.groupId })}
              style={styles.adminButton}
            >
              Yönetici Paneli
            </Button>
          )}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="book-open-variant" size={24} color="#6200ee" />
              <Text style={styles.statValue}>{groupData.completedJuz}/{groupData.totalJuz}</Text>
              <Text style={styles.statLabel}>Cüz Tamamlandı</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="account-group" size={24} color="#6200ee" />
              <Text style={styles.statValue}>{groupData.participants}</Text>
              <Text style={styles.statLabel}>Katılımcı</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="bookmark-outline" size={24} color="#6200ee" />
              <Text style={styles.statValue}>{groupData.availableJuz}</Text>
              <Text style={styles.statLabel}>Boş Cüz</Text>
            </View>
          </View>
        </Surface>

        <Surface style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar-start" size={20} color="#666" />
            <View style={styles.detailTexts}>
              <Text style={styles.detailLabel}>Başlangıç</Text>
              <Text style={styles.detailValue}>{groupData.startDate}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar-end" size={20} color="#666" />
            <View style={styles.detailTexts}>
              <Text style={styles.detailLabel}>Bitiş</Text>
              <Text style={styles.detailValue}>{groupData.endDate}</Text>
            </View>
          </View>
        </Surface>

        {!groupData.isAdmin && !groupData.joinRequestSent && (
          <Button
            mode="contained"
            onPress={showJoinModal}
            style={styles.joinButton}
          >
            Gruba Katıl
          </Button>
        )}

        {groupData.joinRequestSent && (
          <Surface style={styles.pendingCard}>
            <MaterialCommunityIcons name="clock-outline" size={24} color="#666" />
            <Text style={styles.pendingText}>
              Katılım isteğiniz yönetici onayı bekliyor...
            </Text>
          </Surface>
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={joinModalVisible}
          onDismiss={hideJoinModal}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Cüz Seçimi</Title>
          <RadioButton.Group
            onValueChange={value => setSelectedJuzType(value)}
            value={selectedJuzType}
          >
            <View style={styles.radioOption}>
              <RadioButton.Item
                label="Sabit Cüz"
                value="fixed"
                position="leading"
              />
              <Text style={styles.optionDescription}>
                Size özel bir cüz atanır ve hatim bitene kadar bu cüz sizin sorumluluğunuzda olur.
              </Text>
            </View>

            <View style={styles.radioOption}>
              <RadioButton.Item
                label="Dönerli Cüz"
                value="rotating"
                position="leading"
              />
              <Text style={styles.optionDescription}>
                Her hafta farklı bir cüz size atanır, böylece tüm cüzleri okuma fırsatı bulursunuz.
              </Text>
            </View>
          </RadioButton.Group>

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={hideJoinModal}
              style={styles.modalButton}
            >
              İptal
            </Button>
            <Button
              mode="contained"
              onPress={handleJoin}
              style={styles.modalButton}
            >
              Katıl
            </Button>
          </View>
        </Modal>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    padding: 16,
    margin: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  adminButton: {
    marginBottom: 16,
    borderRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  detailsCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailTexts: {
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    marginTop: 2,
  },
  joinButton: {
    margin: 16,
    borderRadius: 8,
  },
  pendingCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff3e0',
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingText: {
    marginLeft: 12,
    color: '#666',
    flex: 1,
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
  radioOption: {
    marginBottom: 16,
  },
  optionDescription: {
    fontSize: 12,
    color: '#666',
    marginLeft: 52,
    marginTop: -8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  modalButton: {
    marginLeft: 8,
  },
});

export default GroupDetailScreen; 