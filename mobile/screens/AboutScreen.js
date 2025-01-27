import React from 'react';
import { View, StyleSheet, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { Text, Card, List, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AboutScreen = () => {
  const openWhatsApp = () => {
    Linking.openURL('https://wa.me/905514140916');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <List.Item
            title="Uygulama Hakkında"
            description="Kuran-ı Kerim hatimlerini kolayca takip etmenizi ve yönetmenizi sağlayan bir uygulamadır."
            left={props => <List.Icon {...props} icon="information" color="#6200ee" />}
          />
          <Divider style={styles.divider} />
          
          <List.Item
            title="Geliştirici"
            description="Bu uygulama, Mustafa Sungur Medresesi için özel olarak Samet Güder tarafından geliştirilmiştir."
            left={props => <List.Icon {...props} icon="code-tags" color="#6200ee" />}
          />
          <Divider style={styles.divider} />

          <List.Item
            title="İletişim"
            description="gudersamet@gmail.com"
            left={props => <List.Icon {...props} icon="email" color="#6200ee" />}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.centerContent}>
            <MaterialCommunityIcons name="mosque" size={50} color="#6200ee" />
            <Text variant="headlineMedium" style={styles.title}>
              Adana Çukurova İlim ve Kültür Vakfı
            </Text>
            <Text variant="titleLarge" style={styles.subtitle}>
              Adana Mustafa Sungur Medresi
            </Text>
          </View>

          <List.Item
            title="Her Çarşamba 19:30"
            description="Yatsı namazından sonra"
            left={props => <List.Icon {...props} icon="clock" color="#6200ee" />}
          />
          <Text style={styles.note}>
            (Not: Tüm kardeşlerimizi bekleriz. Sadece erkekler için yer ayrılmıştır.)
          </Text>
          <Divider style={styles.divider} />

          <List.Item
            title="Adres"
            description="Mustafa Sungur Apartmanı, Yenibaraj, 68073. Sk. 3 A, 01150 Seyhan/Adana"
            left={props => <List.Icon {...props} icon="map-marker" color="#6200ee" />}
          />
          <Divider style={styles.divider} />

          <TouchableOpacity onPress={openWhatsApp}>
            <List.Item
              title="WhatsApp İletişim"
              description="+90 551 414 09 16"
              left={props => <List.Icon {...props} icon="whatsapp" color="#25D366" />}
            />
          </TouchableOpacity>
        </Card.Content>
      </Card>

      <View style={styles.footer}>
        <Text style={styles.version}>Versiyon 1.0.0</Text>
        <Text style={styles.copyright}>2025 Hatim App. Tüm hakları saklıdır.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  divider: {
    marginVertical: 8,
  },
  centerContent: {
    alignItems: 'center',
    marginVertical: 16,
  },
  title: {
    color: '#6200ee',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  note: {
    fontStyle: 'italic',
    color: '#666',
    fontSize: 12,
    marginLeft: 72,
    marginTop: 4,
  },
  footer: {
    alignItems: 'center',
    padding: 16,
  },
  version: {
    color: '#666',
  },
  copyright: {
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
});

export default AboutScreen;
