import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Surface } from 'react-native-paper';

const EditProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('Ahmet Yılmaz');
  const [email, setEmail] = useState('ahmet.yilmaz@example.com');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  const handleSave = () => {
    // Burada API'ye kaydetme işlemi yapılacak
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.formContainer}>
        <TextInput
          label="Ad Soyad"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="E-posta"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          label="Telefon"
          value={phone}
          onChangeText={setPhone}
          mode="outlined"
          style={styles.input}
          keyboardType="phone-pad"
        />
        <TextInput
          label="Şehir"
          value={city}
          onChangeText={setCity}
          mode="outlined"
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.button}
        >
          Kaydet
        </Button>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});

export default EditProfileScreen; 