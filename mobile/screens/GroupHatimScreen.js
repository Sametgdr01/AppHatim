import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Dimensions } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import SupportModal from '../components/SupportModal';

const { width } = Dimensions.get('window');

const GroupHatimScreen = () => {
  const [miracCard, setMiracCard] = useState({
    title: 'Müslümanlar İçin Miraç',
    description: 'Miraç gecesi, Peygamber Efendimiz (s.a.v) Hz. Muhammed\'in miracı ve Allah\'ın huzuruna yükselişinin sembolüdür. Bu kutlu gecede, tüm Müslümanlar için rahmet, mağfiret ve hidayet dileriz.',
    imageUri: require('../assets/images/mirac.jpg')
  });

  return (
    <View style={styles.container}>
      <SupportModal />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <ImageBackground 
            source={miracCard.imageUri} 
            style={styles.cardBackground}
            imageStyle={styles.cardBackgroundImage}
          >
            <View style={styles.cardOverlay}>
              <Title style={styles.cardTitle}>{miracCard.title}</Title>
              <Paragraph style={styles.cardDescription}>
                {miracCard.description}
              </Paragraph>
              <Button 
                mode="contained" 
                style={styles.cardButton}
                onPress={() => {/* Detay sayfasına yönlendir */}}
              >
                Daha Fazla Bilgi
              </Button>
            </View>
          </ImageBackground>
        </Card>

        {/* Diğer Grup Hatim İçerikleri */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollContainer: {
    padding: 15
  },
  card: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden'
  },
  cardBackground: {
    width: '100%',
    height: 250,
    justifyContent: 'flex-end'
  },
  cardBackgroundImage: {
    resizeMode: 'cover'
  },
  cardOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15
  },
  cardTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold'
  },
  cardDescription: {
    color: 'white',
    marginVertical: 10
  },
  cardButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#4CAF50'
  }
});

export default GroupHatimScreen;
