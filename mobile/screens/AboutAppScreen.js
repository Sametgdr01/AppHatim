import React from 'react';
import { View, StyleSheet, ScrollView, Linking, TouchableOpacity, Image } from 'react-native';
import { Surface, Text, Title, List, Divider, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AboutAppScreen = () => {
  const appVersion = '1.0.0';

  const openLink = (url) => {
    Linking.openURL(url);
  };

  // WhatsApp'ı açma fonksiyonu
  const openWhatsApp = () => {
    const phoneNumber = '905514140916';
    const message = 'Merhaba Hatim Takip Uygulaması üzerinden yazıyorum mustafa sungur medresi hakkında bilgi almak istiyorum.';
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          // WhatsApp yüklü değilse
          Linking.openURL(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
        }
      })
      .catch((err) => console.error('WhatsApp açılamadı:', err));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Uygulama Logosu */}
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/adaptive-icon.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
      </View>

      <Surface style={styles.contentContainer}>
        <List.Section>
          <List.Item
            title="Uygulama Hakkında"
            description="Kuran-ı Kerim hatimlerini kolayca takip etmenizi ve yönetmenizi sağlayan bir uygulamadır."
            left={props => <List.Icon {...props} icon="information" />}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
            descriptionNumberOfLines={3}
          />
          <Divider />
          <List.Item
            title="Geliştirici"
            description="Bu uygulama, Mustafa Sungur Medresesi için özel olarak Samet Güder tarafından geliştirilmiştir."
            left={props => <List.Icon {...props} icon="code-tags" />}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
            descriptionNumberOfLines={3}
          />
          <Divider />
          <List.Item
            title="İletişim"
            description="gudersamet@gmail.com"
            left={props => <List.Icon {...props} icon="email" />}
            onPress={() => openLink('mailto:gudersamet@gmail.com')}
            titleStyle={styles.listTitle}
            descriptionStyle={styles.listDescription}
          />
        </List.Section>
      </Surface>

      <Surface style={styles.medreseContainer}>
        <Title style={styles.medreseTitle}>Adana Çukurova İlim ve Kültür Vakfı</Title>
        <View style={styles.medreseContent}>
          <MaterialCommunityIcons name="mosque" size={40} color="#6200ee" style={styles.medreseIcon} />
          
          <View style={styles.dersInfo}>
            <Text style={styles.dersTitle}>Adana Mustafa Sungur Medresesi</Text>
            <View style={styles.dersDetail}>
              <MaterialCommunityIcons name="calendar-clock" size={20} color="#666" />
              <Text style={styles.dersText}>Her Çarşamba 19:30</Text>
            </View>
            <View style={styles.dersDetail}>
              <MaterialCommunityIcons name="information" size={20} color="#666" />
              <Text style={styles.dersText}>Yatsı namazından sonra </Text>
            </View>
            <Text style={styles.dersNote}>(Not: Tüm kardeşlerimizi bekleriz. Sadece erkekler için yer ayırılmıştır.)</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => openLink('https://maps.app.goo.gl/YJzVUv4cATqnBT8u7')}
        >
          <MaterialCommunityIcons name="map-marker" size={24} color="#6200ee" />
          <Text style={styles.contactText}>
          Yenibaraj Mahallesi 68073. Sk. 3 A, 01150  Mustafa Sungur Apartmanı  Seyhan/Adana
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.contactItem}
          onPress={openWhatsApp}
        >
          <MaterialCommunityIcons name="whatsapp" size={24} color="#25D366" />
          <Text style={styles.contactText}>WhatsApp İletişim</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => openLink('tel:+905534698761')}
        >
        
        </TouchableOpacity>
      </Surface>

      <Text style={styles.version}>Versiyon {appVersion}</Text>
      <Text style={styles.copyright}> 2025 Hatim App. Tüm hakları saklıdır.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  logo: {
    width: 250,
    height: 250,
    borderRadius:0,
    marginBottom: -60,
  },
  contentContainer: {
    margin: 16,
    marginTop: 40,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: '#fff',
  },
  medreseContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: '#fff',
  },
  medreseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee',
    textAlign: 'center',
    marginBottom: 16,
  },
  medreseContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  medreseIcon: {
    marginRight: 16,
    marginTop: 4,
  },
  dersInfo: {
    flex: 1,
  },
  dersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  dersDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dersText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  dersNote: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  divider: {
    marginVertical: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  listTitle: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  listDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    lineHeight: 20,
  },
  version: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
    fontSize: 14,
  },
  copyright: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 16,
    fontSize: 12,
  }
});

export default AboutAppScreen;