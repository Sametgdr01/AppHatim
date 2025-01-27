import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MyHatimsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Kişisel Hatim Kartı */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('HatimDetails')}
          style={styles.cardContainer}
        >
          <View style={styles.hatimCard}>
            <View style={styles.headerRow}>
              <Text style={styles.cuzTitle}>5. Cüz</Text>
              <MaterialCommunityIcons name="clock-outline" size={24} color="#fff" />
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: '75%' }]} />
            </View>

            {/* Detaylar */}
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="book-open-page-variant" size={20} color="#fff" />
                <Text style={styles.detailText}>15/20 Sayfa</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="calendar-range" size={20} color="#fff" />
                <Text style={styles.detailText}>15.03.2024 - 15.04.2024</Text>
              </View>
            </View>

            {/* Detay Butonu */}
            <TouchableOpacity 
              style={styles.detailButton}
              onPress={() => navigation.navigate('HatimDetails')}
            >
              <Text style={styles.buttonText}>Detayları Görüntüle</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Yeni Cüz Al Butonu */}
      <FAB
        style={styles.fab}
        icon="plus"
        label="Yeni Cüz Al"
        onPress={() => navigation.navigate('JoinHatim')}
        color="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cardContainer: {
    margin: 16,
  },
  hatimCard: {
    backgroundColor: '#6200ee',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cuzTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
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
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  detailButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6200ee',
  },
});

export default MyHatimsScreen;
