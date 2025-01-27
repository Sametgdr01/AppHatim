import React from 'react';
import { ScrollView, StyleSheet, Linking } from 'react-native';
import { Surface, Title, Paragraph, Button } from 'react-native-paper';

const AboutAppScreen = () => {
  const handleWhatsApp = () => {
    Linking.openURL('whatsapp://send?phone=+905050954795');
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.surface}>
        <Title style={styles.title}>Hatim Uygulaması</Title>
        
        <Paragraph style={styles.paragraph}>
          Bu uygulama, Kur'an-ı Kerim hatimlerini organize etmek ve takip etmek için geliştirilmiştir.
          Kullanıcılar hatim grupları oluşturabilir, mevcut hatimlere katılabilir ve cüz takibi yapabilirler.
        </Paragraph>

        <Title style={styles.subtitle}>Özellikler</Title>
        <Paragraph style={styles.paragraph}>
          • Hatim grupları oluşturma ve yönetme{'\n'}
          • Cüz seçimi ve takibi{'\n'}
          • Bildirim sistemi{'\n'}
          • Profil yönetimi{'\n'}
          • Grup sohbeti
        </Paragraph>

        <Title style={styles.subtitle}>İletişim</Title>
        <Paragraph style={styles.paragraph}>
          Herhangi bir sorun, öneri veya geri bildirim için bizimle iletişime geçebilirsiniz.
        </Paragraph>

        <Button
          mode="contained"
          icon="whatsapp"
          onPress={handleWhatsApp}
          style={styles.button}
        >
          WhatsApp ile İletişim
        </Button>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  surface: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
    elevation: 2
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#444'
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 10
  },
  button: {
    marginTop: 20
  }
});

export default AboutAppScreen;