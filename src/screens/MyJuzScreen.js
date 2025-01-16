import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput, Alert } from 'react-native';
import { Surface, Text, Title, Button, Portal, Modal, RadioButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FAB } from 'react-native-paper';

const { width } = Dimensions.get('window');

const MyJuzScreen = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [selectedJuz, setSelectedJuz] = useState(null);
  const [endDate, setEndDate] = useState('');
  const [activeJuz, setActiveJuz] = useState({
    id: 1,
    number: 5,
    totalPages: 20,
    readPages: 15,
    startDate: '15.03.2024',
    endDate: '15.04.2024',
    isCompleted: false,
    isReadToday: false,
    progress: 0.75,
    daysLeft: 12,
    streakDays: 7
  });

  // Müsait cüzler listesi (1-30 arası, aktif cüz hariç)
  const availableJuzList = Array.from({ length: 30 }, (_, i) => i + 1)
    .filter(num => num !== activeJuz?.number);

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setSelectedJuz(null);
  };

  const handleJuzSelection = () => {
    if (selectedJuz) {
      // Burada seçilen cüzü kaydetme işlemi yapılacak
      // API call yapılacak
      hideModal();
    }
  };

  const handleNewJuz = () => {
    if (!activeJuz.isCompleted) {
      Alert.alert(
        'Uyarı',
        'Lütfen önceki aldığınız cüzü bitirdikten sonra yeni cüz alınız.',
        [{ text: 'Tamam', style: 'default' }]
      );
      return;
    }
    showModal();
  };

  return (
    <View style={styles.container}>
      <Surface style={styles.juzCard}>
        <LinearGradient
          colors={['#6200ee', '#9747FF']}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Title style={styles.cardTitle}>{activeJuz.number}. Cüz</Title>
              <MaterialCommunityIcons
                name={activeJuz.isReadToday ? "check-circle" : "clock-outline"}
                size={32}
                color={activeJuz.isReadToday ? "#4CAF50" : "#FFF"}
              />
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(activeJuz.readPages / activeJuz.totalPages) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round((activeJuz.readPages / activeJuz.totalPages) * 100)}%
              </Text>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="book-open-variant" size={24} color="#fff" />
                <Text style={styles.statText}>
                  {activeJuz.readPages}/{activeJuz.totalPages} Sayfa
                </Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="calendar-range" size={24} color="#fff" />
                <Text style={styles.statText}>
                  {activeJuz.startDate} - {activeJuz.endDate}
                </Text>
              </View>
            </View>

            <Button
              mode="contained"
              style={styles.detailButton}
              labelStyle={styles.buttonLabel}
              onPress={() => navigation.navigate('JuzDetail', { 
                juzId: activeJuz.id,
                juzNo: activeJuz.number,
                totalPages: activeJuz.totalPages,
                readPages: activeJuz.readPages,
                startDate: activeJuz.startDate,
                endDate: activeJuz.endDate
              })}
            >
              Detayları Görüntüle
            </Button>
          </View>
        </LinearGradient>
      </Surface>

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleNewJuz}
        label="Yeni Cüz Al"
      />

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Yeni Cüz Al</Title>
          <ScrollView style={styles.modalScroll}>
            <RadioButton.Group
              onValueChange={value => setSelectedJuz(value)}
              value={selectedJuz}
            >
              {availableJuzList.map((juz) => (
                <View key={juz} style={styles.radioOption}>
                  <RadioButton.Item
                    label={`${juz}. Cüz`}
                    value={juz}
                    labelStyle={styles.radioLabel}
                  />
                </View>
              ))}
            </RadioButton.Group>

            <TextInput
              style={styles.dateInput}
              label="Bitiş Tarihi"
              mode="outlined"
              placeholder="GG.AA.YYYY"
              value={endDate}
              onChangeText={setEndDate}
            />

            <Text style={styles.infoText}>
              * Cüzünüzü seçtikten sonra, ne zamana kadar bitirmeyi planladığınızı belirtin.
            </Text>
          </ScrollView>

          <View style={styles.modalActions}>
            <Button onPress={hideModal} style={styles.modalButton}>
              İptal
            </Button>
            <Button
              mode="contained"
              onPress={handleJuzSelection}
              style={styles.modalButton}
              disabled={!selectedJuz || !endDate}
            >
              Cüz Al
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  juzCard: {
    borderRadius: 20,
    elevation: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardGradient: {
    borderRadius: 20,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  progressText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  detailButton: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
  },
  buttonLabel: {
    fontSize: 16,
    color: '#fff',
  },
  newJuzButton: {
    marginTop: 16,
    backgroundColor: '#6200ee',
    borderRadius: 10,
    height: 50,
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 16,
    fontSize: 20,
    textAlign: 'center',
  },
  modalScroll: {
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
  dateInput: {
    marginTop: 16,
  },
  infoText: {
    marginTop: 8,
    color: 'gray',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default MyJuzScreen; 