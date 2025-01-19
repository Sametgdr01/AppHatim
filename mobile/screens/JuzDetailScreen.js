import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Surface, Text, Title, Button, Portal, Modal, RadioButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const JuzDetailScreen = ({ route, navigation }) => {
  const [visible, setVisible] = useState(false);
  const [selectedJuz, setSelectedJuz] = useState(null);
  const juzList = Array.from({ length: 30 }, (_, i) => i + 1);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handleJuzSelection = () => {
    if (selectedJuz) {
      // Burada seçilen cüzü kaydetme işlemi yapılacak
      hideModal();
      // API call yapılacak
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.headerCard}>
        <Title style={styles.headerTitle}>Cüz Detayı</Title>
        <Button
          mode="contained"
          onPress={showModal}
          style={styles.selectButton}
        >
          Cüz Seç
        </Button>
      </Surface>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Cüz Seçin</Title>
          <ScrollView style={styles.juzList}>
            <RadioButton.Group
              onValueChange={value => setSelectedJuz(value)}
              value={selectedJuz}
            >
              {juzList.map((juz) => (
                <View key={juz} style={styles.radioOption}>
                  <RadioButton.Item
                    label={`${juz}. Cüz`}
                    value={juz}
                    labelStyle={styles.radioLabel}
                  />
                </View>
              ))}
            </RadioButton.Group>
          </ScrollView>
          <View style={styles.modalActions}>
            <Button onPress={hideModal} style={styles.modalButton}>İptal</Button>
            <Button
              mode="contained"
              onPress={handleJuzSelection}
              style={styles.modalButton}
              disabled={!selectedJuz}
            >
              Seç
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
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    marginBottom: 16,
  },
  selectButton: {
    marginTop: 8,
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

export default JuzDetailScreen; 