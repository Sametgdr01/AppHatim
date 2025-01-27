import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import apiService from '../services/apiService';

const EditProfileScreen = ({ navigation }) => {
  const { user, setUser, uploadProfilePhoto } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || ''
  });
  const [imageUri, setImageUri] = useState(user?.profileImage || null);

  const handleInputChange = (name, value) => {
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      // Profil bilgilerini güncelle
      const response = await apiService.updateProfile(profileData);
      console.log('Profil güncellendi:', response.data);
      setUser(response.data.user); // Güncellenmiş kullanıcı bilgilerini AuthContext'e yansıt

      // Profil fotoğrafını yükle
      if (imageUri) {
        const photoResponse = await uploadProfilePhoto(imageUri);
        console.log('Profil fotoğrafı yüklendi:', photoResponse.data);
        setUser({ ...response.data.user, profileImage: photoResponse.data.profileImage }); // Güncellenmiş profil fotoğrafını AuthContext'e yansıt
      }

      navigation.goBack(); // Profil sayfasına geri dön
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <TouchableOpacity onPress={handlePickImage}>
          <Image
            source={{ uri: imageUri || 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          <Text style={styles.changePhotoText}>Fotoğrafı Değiştir</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Ad"
          value={profileData.firstName}
          onChangeText={(value) => handleInputChange('firstName', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Soyad"
          value={profileData.lastName}
          onChangeText={(value) => handleInputChange('lastName', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={profileData.email}
          onChangeText={(value) => handleInputChange('email', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Telefon Numarası"
          value={profileData.phoneNumber}
          onChangeText={(value) => handleInputChange('phoneNumber', value)}
        />
        <Button mode="contained" onPress={handleUpdateProfile}>
          Güncelle
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 16,
  },
  input: {
    marginBottom: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 16,
  },
  changePhotoText: {
    textAlign: 'center',
    color: '#6200ee',
    marginBottom: 16,
  },
});

export default EditProfileScreen;