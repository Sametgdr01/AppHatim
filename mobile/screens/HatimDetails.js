import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { fetchHatimDetails } from '../services/apiService';

const HatimDetails = ({ route, navigation }) => {
  const { hatimId } = route.params;
  const [hatimDetails, setHatimDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHatimDetails = async () => {
      try {
        const details = await fetchHatimDetails(hatimId);
        setHatimDetails(details);
        setLoading(false);
      } catch (error) {
        console.error('Hatim detayları yüklenirken hata:', error);
        Alert.alert('Hata', 'Hatim detayları yüklenemedi.');
        setLoading(false);
      }
    };

    if (hatimId) {
      loadHatimDetails();
    } else {
      Alert.alert('Hata', 'Hatim ID bulunamadı');
      navigation.goBack();
    }
  }, [hatimId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {hatimDetails ? (
        <Text>{hatimDetails.title}</Text>
      ) : (
        <Text>Hatim detayları bulunamadı.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  juzItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  juzText: {
    fontSize: 16,
    color: '#333',
  },
  juzStatus: {
    fontSize: 12,
    marginLeft: 10,
  },
});

export default HatimDetails;