import React from 'react';
import { View, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { Surface, Text, Title, List, Divider, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AboutAppScreen = () => {
  const appVersion = '1.0.0';

  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Uygulama Bilgileri */}
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

      {/* Medrese Kartı */}
      <Surface style={styles.medreseContainer}>
        <Title style={styles.medreseTitle}>Mustafa Sungur Medresesi</Title>
        <View style={styles.medreseContent}>
          <MaterialCommunityIcons name="mosque" size={40} color="#6200ee" style={styles.medreseIcon} />
          
          <View style={styles.dersInfo}>
            <Text style={styles.dersTitle}>Umumi Risale-i Nur Dersi</Text>
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
          Mustafa Sungur Apartmanı, Yenibaraj, 68073. Sk. 3 A, 01150 Seyhan/Adana
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.contactItem}
          onPress={() => openLink('tel:+905534698761')}
        >
          <MaterialCommunityIcons name="phone" size={24} color="#6200ee" />
          <Text style={styles.contactText}>+90 553 469 87 61  Mehmet Mecidiye</Text>
        </TouchableOpacity>
      </Surface>

      <Text style={styles.version}>Versiyon {appVersion}</Text>
      <Text style={styles.copyright}>© 2025 Hatim App. Tüm hakları saklıdır.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  contentContainer: {
    margin: 16,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: '#fff',
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
  },
});

export default AboutAppScreen; 