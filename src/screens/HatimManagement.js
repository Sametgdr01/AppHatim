import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { DataTable, Surface, Text, Searchbar, IconButton, Portal, Modal, Button, Chip, Divider, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const HatimManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHatim, setSelectedHatim] = useState(null);
  const [visible, setVisible] = useState(false);

  // Örnek hatim verileri
  const hatims = [
    { 
      id: 1, 
      title: 'Miraç Kandili Hatmi', 
      type: 'Özel Gece',
      participants: 30,
      completionRate: 85,
      status: 'Devam Ediyor',
      startDate: '27.03.2024',
      endDate: '28.03.2024'
    },
    { 
      id: 2, 
      title: 'Ramazan Hatmi', 
      type: 'Normal',
      participants: 25,
      completionRate: 60,
      status: 'Devam Ediyor',
      startDate: '10.03.2024',
      endDate: '09.04.2024'
    },
    { 
      id: 3, 
      title: 'Berat Kandili Hatmi', 
      type: 'Özel Gece',
      participants: 30,
      completionRate: 100,
      status: 'Tamamlandı',
      startDate: '25.02.2024',
      endDate: '26.02.2024'
    },
  ];

  const showModal = (hatim) => {
    setSelectedHatim(hatim);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setSelectedHatim(null);
  };

  const renderHatimType = (type) => {
    const color = type === 'Özel Gece' ? '#6200ee' : '#666';
    return (
      <Chip 
        mode="outlined" 
        style={[styles.typeChip, { borderColor: color }]}
        textStyle={{ color, fontSize: 14 }}
      >
        {type}
      </Chip>
    );
  };

  const renderCompletionRate = (rate) => {
    const color = rate === 100 ? '#4caf50' : rate > 50 ? '#fb8c00' : '#ff5252';
    return (
      <View style={styles.completionContainer}>
        <Text style={[styles.completionText, { color }]}>{rate}%</Text>
        <ProgressBar 
          progress={rate / 100} 
          color={color} 
          style={styles.progressBar}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.headerCard}>
        <Text style={styles.headerTitle}>Hatim Yönetimi</Text>
        <Text style={styles.headerSubtitle}>Tüm hatimleri görüntüle ve yönet</Text>
      </Surface>

      <Surface style={styles.surface}>
        <Searchbar
          placeholder="Hatim başlığı ile ara..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          iconColor="#6200ee"
          placeholderTextColor="#666"
        />

        <DataTable>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title style={styles.columnTitle}><Text style={styles.headerText}>Hatim</Text></DataTable.Title>
            <DataTable.Title style={styles.columnTitle}><Text style={styles.headerText}>Tür</Text></DataTable.Title>
            <DataTable.Title style={styles.columnTitle}><Text style={styles.headerText}>İlerleme</Text></DataTable.Title>
            <DataTable.Title style={styles.columnTitle}><Text style={styles.headerText}>İşlem</Text></DataTable.Title>
          </DataTable.Header>

          {hatims.map((hatim) => (
            <DataTable.Row key={hatim.id} style={styles.tableRow}>
              <DataTable.Cell style={styles.hatimCell}>
                <View>
                  <Text style={styles.hatimTitle}>{hatim.title}</Text>
                  <Text style={styles.hatimParticipants}>{hatim.participants} Katılımcı</Text>
                </View>
              </DataTable.Cell>
              <DataTable.Cell>{renderHatimType(hatim.type)}</DataTable.Cell>
              <DataTable.Cell>{renderCompletionRate(hatim.completionRate)}</DataTable.Cell>
              <DataTable.Cell>
                <IconButton
                  icon="dots-vertical"
                  size={24}
                  color="#6200ee"
                  onPress={() => showModal(hatim)}
                />
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Surface>

      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
          {selectedHatim && (
            <View>
              <View style={styles.modalHeader}>
                <MaterialCommunityIcons 
                  name={selectedHatim.type === 'Özel Gece' ? 'star-circle' : 'book-open-page-variant'} 
                  size={40} 
                  color="#6200ee" 
                />
                <View style={styles.modalHeaderText}>
                  <Text style={styles.modalTitle}>Hatim Detayları</Text>
                  <Text style={styles.modalSubtitle}>{selectedHatim.title}</Text>
                </View>
              </View>
              
              <Divider style={styles.modalDivider} />

              <View style={styles.modalInfo}>
                <View style={styles.modalInfoRow}>
                  <MaterialCommunityIcons name="calendar-range" size={24} color="#666" />
                  <Text style={styles.modalInfoText}>
                    {selectedHatim.startDate} - {selectedHatim.endDate}
                  </Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <MaterialCommunityIcons name="account-group" size={24} color="#666" />
                  <Text style={styles.modalInfoText}>{selectedHatim.participants} Katılımcı</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <MaterialCommunityIcons name="percent" size={24} color="#666" />
                  <Text style={styles.modalInfoText}>%{selectedHatim.completionRate} Tamamlandı</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <MaterialCommunityIcons 
                    name="circle" 
                    size={24} 
                    color={selectedHatim.status === 'Tamamlandı' ? '#4caf50' : '#fb8c00'} 
                  />
                  <Text style={styles.modalInfoText}>{selectedHatim.status}</Text>
                </View>
              </View>

              <View style={styles.modalButtons}>
                <Button 
                  mode="contained" 
                  onPress={() => {
                    // Hatim detaylarını görüntüleme
                    hideModal();
                  }}
                  style={[styles.modalButton, { backgroundColor: '#6200ee' }]}
                  labelStyle={styles.buttonLabel}
                >
                  Detayları Gör
                </Button>
                {selectedHatim.status === 'Devam Ediyor' && (
                  <Button 
                    mode="contained" 
                    onPress={() => {
                      // Hatmi sonlandırma işlemi
                      hideModal();
                    }}
                    style={[styles.modalButton, { backgroundColor: '#ff5252' }]}
                    labelStyle={styles.buttonLabel}
                  >
                    Hatmi Sonlandır
                  </Button>
                )}
              </View>
            </View>
          )}
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
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: '#6200ee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  surface: {
    margin: 16,
    elevation: 4,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  searchbar: {
    margin: 16,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    minHeight: 70,
  },
  hatimCell: {
    flex: 2,
  },
  hatimTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  hatimParticipants: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  typeChip: {
    height: 32,
  },
  completionContainer: {
    width: 100,
  },
  completionText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  modal: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeaderText: {
    marginLeft: 16,
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  modalInfo: {
    marginBottom: 24,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  modalInfoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    minWidth: 140,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    paddingVertical: 4,
  },
  columnTitle: {
    flex: 1,
  },
});

export default HatimManagement; 