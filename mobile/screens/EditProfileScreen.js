import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Platform,
  Alert,
  Linking
} from 'react-native';
import { 
  TextInput, 
  Button, 
  Surface, 
  Text, 
  Avatar, 
  Dialog, 
  Portal,
  Snackbar,
  IconButton
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import NetInfo from "@react-native-community/netinfo";
import { diagnoseNetworkIssues } from '../services/api';

const EditProfileScreen = ({ navigation }) => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [city, setCity] = useState(user?.city || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [networkStatus, setNetworkStatus] = useState({
    isConnected: true,
    isInternetReachable: true,
    type: null
  });

  // Ağ durumu dinleyicisi
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkStatus({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type
      });

      // Bağlantı değişikliğinde bilgilendirme
      if (!state.isConnected) {
        Alert.alert(
          "Ağ Bağlantısı Kesildi", 
          `Mevcut bağlantı türü: ${state.type || 'Bilinmiyor'}. 
           Lütfen internet bağlantınızı kontrol edin.`
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Ağ bağlantısı sorunu çözme yardımcısı
  const handleNetworkIssues = () => {
    Alert.alert(
      "Ağ Bağlantısı Sorunu", 
      `Mevcut durum: 
       Bağlantı: ${networkStatus.isConnected ? 'Var' : 'Yok'}
       İnternet Erişilebilir: ${networkStatus.isInternetReachable ? 'Evet' : 'Hayır'}
       Bağlantı Türü: ${networkStatus.type || 'Bilinmiyor'}

       Ne yapmak istersiniz?`,
      [
        { 
          text: "Ağ Ayarlarını Aç", 
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          }
        },
        { 
          text: "Ağı Tanıla", 
          onPress: () => {
            diagnoseNetworkIssues();
            Alert.alert(
              "Tanılama Raporu", 
              "Detaylı ağ tanılama raporu konsola yazdırıldı. Lütfen geliştirici konsolunu kontrol edin."
            );
          }
        },
        { 
          text: "İptal", 
          style: "cancel" 
        }
      ]
    );
  };

  // İzinleri kontrol et ve iste
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
        Alert.alert(
          'İzin Gerekli',
          'Fotoğraf seçmek için kamera ve galeri izinlerine ihtiyacımız var.',
          [{ text: 'Tamam' }]
        );
        return false;
      }
    }
    return true;
  };

  // Galeriden fotoğraf seç
  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true  // Base64 formatında da al
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setDialogVisible(false);
    }
  };

  // Kameradan fotoğraf çek
  const takePhotoFromCamera = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setDialogVisible(false);
    }
  };

  // Fotoğraf seçme dialogu
  const showImagePickerDialog = () => {
    setDialogVisible(true);
  };

  // Profil güncelleme
  const handleSave = async () => {
    // Validasyon
    if (!name || !email || !phone) {
      Alert.alert(
        "Eksik Bilgi", 
        "Lütfen tüm zorunlu alanları doldurun."
      );
      return;
    }

    // Ağ bağlantısı kontrolü
    const netState = await NetInfo.fetch();
    if (!netState.isConnected || !netState.isInternetReachable) {
      Alert.alert(
        "Bağlantı Hatası", 
        "İnternet bağlantınız yok. Ne yapmak istersiniz?",
        [
          { 
            text: "Ağ Ayarlarını Kontrol Et", 
            onPress: handleNetworkIssues 
          },
          { 
            text: "İptal", 
            style: "cancel" 
          }
        ]
      );
      return;
    }

    try {
      // Profil güncelleme
      await updateProfile({
        fullName: name,
        email,
        phoneNumber: phone,
        city,
        profileImage
      });

      // Başarılı güncelleme
      Alert.alert(
        "Başarılı", 
        "Profil bilgileriniz güncellendi.", 
        [{ 
          text: "Tamam", 
          onPress: () => navigation.goBack() 
        }]
      );

    } catch (error) {
      // Hata durumunda detaylı bilgilendirme
      const errorMessage = error.response?.data?.message || 
                           error.message || 
                           "Profil güncellenirken bir hata oluştu";
      
      Alert.alert(
        "Güncelleme Hatası", 
        errorMessage,
        [
          { 
            text: "Tekrar Dene", 
            onPress: handleSave 
          },
          { 
            text: "Ağ Sorunlarını Kontrol Et", 
            onPress: handleNetworkIssues 
          },
          { 
            text: "İptal", 
            style: "cancel" 
          }
        ]
      );
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Profil Fotoğrafı */}
      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={showImagePickerDialog}>
          {profileImage ? (
            <Image 
              source={{ uri: profileImage }} 
              style={styles.profileImage} 
            />
          ) : (
            <Avatar.Icon 
              size={120} 
              icon="account" 
              style={styles.placeholderAvatar} 
            />
          )}
          <View style={styles.cameraIconContainer}>
            <MaterialCommunityIcons 
              name="camera" 
              size={24} 
              color="white" 
            />
          </View>
        </TouchableOpacity>
      </View>

      {/* Fotoğraf Seçme Dialogu */}
      <Portal>
        <Dialog 
          visible={dialogVisible} 
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>Profil Fotoğrafı Seç</Dialog.Title>
          <Dialog.Content>
            <Button 
              icon="image" 
              mode="outlined" 
              onPress={pickImageFromGallery}
            >
              Galeriden Seç
            </Button>
            <Button 
              icon="camera" 
              mode="outlined" 
              onPress={takePhotoFromCamera}
              style={{ marginTop: 10 }}
            >
              Kameradan Çek
            </Button>
          </Dialog.Content>
        </Dialog>
      </Portal>

      {/* Profil Bilgileri Formu */}
      <Surface style={styles.formContainer}>
        <TextInput
          label="Ad Soyad"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="account" />}
        />
        <TextInput
          label="E-posta"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          left={<TextInput.Icon icon="email" />}
        />
        <TextInput
          label="Telefon"
          value={phone}
          onChangeText={setPhone}
          mode="outlined"
          style={styles.input}
          keyboardType="phone-pad"
          left={<TextInput.Icon icon="phone" />}
        />
        <TextInput
          label="Şehir"
          value={city}
          onChangeText={setCity}
          mode="outlined"
          style={styles.input}
          left={<TextInput.Icon icon="map-marker" />}
        />
        
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.button}
          icon="content-save"
        >
          Profili Güncelle
        </Button>
      </Surface>

      {/* Snackbar ile bilgilendirme */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Kapat',
          onPress: () => setSnackbarVisible(false)
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: 150,
    paddingBottom: 40,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#6200ee',
  },
  placeholderAvatar: {
    backgroundColor: '#6200ee',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6200ee',
    borderRadius: 20,
    padding: 5,
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