import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';

const AppIntroScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoSection}>
        <Image 
          source={require('../assets/quran-kid.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Hatim Takip Uygulaması</Text>
      </View>

      <Surface style={styles.surface}>
        <Text style={styles.description}>
          Hatim Takip Uygulaması, Kuran-ı Kerim'in tamamını okuma sürecinizi kolaylaştırmak için tasarlanmıştır.
        </Text>

        <View style={styles.featureSection}>
          <Text style={styles.featureTitle}>Özelliklerimiz:</Text>
          <Text style={styles.featureItem}>• Bireysel Hatim Takibi</Text>
          <Text style={styles.featureItem}>• Grup Hatim Organizasyonu</Text>
          <Text style={styles.featureItem}>• İlerleme Raporları</Text>
          <Text style={styles.featureItem}>• Günlük Hatırlatmalar</Text>
        </View>

        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
        >
          Hemen Başla
        </Button>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ee',
    textAlign: 'center',
  },
  surface: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: 'white',
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  featureSection: {
    marginBottom: 24,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  }
});

export default AppIntroScreen;
