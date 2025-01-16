import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Surface, Text, Title, Button, Portal, Modal, RadioButton, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const GroupAdminScreen = ({ route }) => {
  const [showJuzModal, setShowJuzModal] = useState(false);
  const [selectedJuz, setSelectedJuz] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Örnek veriler
  const availableJuzList = Array.from({ length: 30 }, (_, i) => ({
    number: i + 1,
    isAvailable: true,
  }));

  const pendingRequests = [
    {
      id: 1,
      userName: 'Ahmet Yılmaz',
      requestDate: '10.03.2024',
    },
    // Diğer istekler...
  ];

  const handleApprove = (request) => {
    setSelectedUser(request);
    setShowJuzModal(true);
  };

  const handleJuzAssignment = () => {
    if (selectedJuz && selectedUser) {
      // Burada cüz atama işlemi yapılacak
      // API call yapılacak
      setShowJuzModal(false);
      setSelectedUser(null);
      setSelectedJuz(null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Katılım İstekleri */}
      <Surface style={styles.headerCard}>
        <Title style={styles.headerTitle}>Katılım İstekleri</Title>
      </Surface>

      {pendingRequests.map((request) => (
        <Surface key={request.id} style={styles.requestCard}>
          <View style={styles.userInfo}>
            <MaterialCommunityIcons name="account" size={40} color="#6200ee" />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{request.userName}</Text>
              <Text style={styles.requestDate}>İstek Tarihi: {request.requestDate}</Text>
            </View>
          </View>
          <View style={styles.actions}>
            <Button
              mode="outlined"
              onPress={() => {}}
              style={[styles.actionButton, styles.rejectButton]}
              labelStyle={styles.rejectButtonLabel}
            >
              Reddet
            </Button>
            <Button
              mode="contained"
              onPress={() => handleApprove(request)}
              style={styles.actionButton}
            >
              Onayla
            </Button>
          </View>
        </Surface>
      ))}

      {/* Boş Cüz Seçme Modalı */}
      <Portal>
        <Modal
          visible={showJuzModal}
          onDismiss={() => setShowJuzModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Boş Cüz Seçin</Title>
          <ScrollView style={styles.juzList}>
            <RadioButton.Group
              onValueChange={value => setSelectedJuz(value)}
              value={selectedJuz}
            >
              {availableJuzList.map((juz) => (
                juz.isAvailable && (
                  <View key={juz.number} style={styles.radioOption}>
                    <RadioButton.Item
                      label={`${juz.number}. Cüz`}
                      value={juz.number}
                      labelStyle={styles.radioLabel}
                    />
                  </View>
                )
              ))}
            </RadioButton.Group>
          </ScrollView>
          <View style={styles.modalActions}>
            <Button 
              onPress={() => setShowJuzModal(false)} 
              style={styles.modalButton}
            >
              İptal
            </Button>
            <Button
              mode="contained"
              onPress={handleJuzAssignment}
              style={styles.modalButton}
              disabled={!selectedJuz}
            >
              Ata
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
  headerCard: {
    padding: 16,
    margin: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    textAlign: 'center',
  },
  requestCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userDetails: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  requestDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: 8,
    borderRadius: 20,
  },
  rejectButton: {
    borderColor: '#ff5252',
  },
  rejectButtonLabel: {
    color: '#ff5252',
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 16,
  },
  juzList: {
    maxHeight: 400,
  },
  radioOption: {
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 16,
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

export default GroupAdminScreen; 