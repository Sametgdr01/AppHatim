import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Surface, Text, Title, Button, Avatar, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = ({ navigation }) => {
  const { signOut, user, isAdmin } = useContext(AuthContext);

  useEffect(() => {
    console.log('ProfileScreen user:', user);
    console.log('ProfileScreen isAdmin:', isAdmin);
  }, [user, isAdmin]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        console.log('Selected image:', result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  // Super admin kontrolü
  const isSuperAdmin = isAdmin && (user?.email === 'gudersamet@gmail.com' || user?.role === 'superadmin');

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profil Başlığı - Super Admin için özelleştirilmiş */}
      <View style={styles.profileHeader}>
        <Avatar.Image 
          source={{ uri: user?.profileImage || 'https://via.placeholder.com/150' }} 
          size={100} 
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.fullName || user?.name}</Text>
          <View style={styles.roleContainer}>
            <MaterialCommunityIcons 
              name={isSuperAdmin ? "shield-crown" : "account"} 
              size={20} 
              color={isSuperAdmin ? "#FF5722" : "#6200ee"} 
            />
            <Text style={[
              styles.roleText, 
              { 
                color: isSuperAdmin ? "#FF5722" : "#6200ee",
                fontWeight: isSuperAdmin ? 'bold' : 'normal'
              }
            ]}>
              {isSuperAdmin ? "Super Admin" : "Kullanıcı"}
            </Text>
          </View>
        </View>
      </View>

      {/* Ayarlar Menüsü */}
      <Surface style={styles.menuCard}>
        <Text style={styles.sectionTitle}>Ayarlar</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <MaterialCommunityIcons name="account-edit" size={24} color="#6200ee" />
          <Text style={styles.menuItemText}>Profili Düzenle</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('NotificationSettings')}
        >
          <MaterialCommunityIcons name="bell-outline" size={24} color="#6200ee" />
          <Text style={styles.menuItemText}>Bildirim Ayarları</Text>
        </TouchableOpacity>

        {/* Super Admin için Özel Menüler */}
        {(isAdmin && (user?.email === 'gudersamet@gmail.com' || user?.role === 'superadmin')) && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionSubtitle}>Yönetici İşlemleri</Text>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('UserManagement')}
            >
              <MaterialCommunityIcons name="account-multiple-plus" size={24} color="#FF5722" />
              <Text style={[styles.menuItemText, { color: '#FF5722' }]}>Kullanıcı Yönetimi</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('AdminPanel')}
            >
              <MaterialCommunityIcons name="shield-account" size={24} color="#FF5722" />
              <Text style={[styles.menuItemText, { color: '#FF5722' }]}>Admin Paneli</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => navigation.navigate('HatimManagement')}
            >
              <MaterialCommunityIcons name="book-multiple" size={24} color="#FF5722" />
              <Text style={[styles.menuItemText, { color: '#FF5722' }]}>Hatim Yönetimi</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('AboutApp')}
        >
          <MaterialCommunityIcons name="information-outline" size={24} color="#6200ee" />
          <Text style={styles.menuItemText}>Uygulama Hakkında</Text>
        </TouchableOpacity>
      </Surface>

      {/* Çıkış Yap Butonu */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={signOut}
      >
        <MaterialCommunityIcons name="logout" size={24} color="white" />
        <Text style={styles.logoutButtonText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  roleText: {
    marginLeft: 8,
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  menuCard: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 16,
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    padding: 16,
    borderRadius: 12,
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;