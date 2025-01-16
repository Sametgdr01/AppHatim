import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Surface, Text, Title, Button, Avatar, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AuthContext } from '../App';
import * as ImagePicker from 'expo-image-picker';

const StatBox = ({ icon, value, label, color }) => (
  <Surface style={[styles.statBox, { borderLeftColor: color }]}>
    <MaterialCommunityIcons name={icon} size={24} color={color} />
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </Surface>
);

const ProfileScreen = ({ navigation }) => {
  const { signOut, userData } = useContext(AuthContext);

  console.log('ProfileScreen userData:', userData);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        // Burada API'ye fotoğrafı yükleyebilirsiniz
        console.log('Selected image:', result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <Surface style={styles.headerCard}>
        <View style={styles.avatarContainer}>
          <Avatar.Icon 
            size={80} 
            icon="account"
            style={styles.avatar}
            color="white"
            onTouchEnd={pickImage}
          />
          <Title style={styles.userName}>{userData?.name || 'Kullanıcı'}</Title>
          <Text style={styles.userEmail}>{userData?.email || 'E-posta eklenmemiş'}</Text>
        </View>
      </Surface>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <StatBox
          icon="book-open-variant"
          value={userData?.totalJuz || 0}
          label="Toplam Cüz"
          color="#1976D2"
        />
        <StatBox
          icon="bookmark-check"
          value={userData?.completedHatims || 0}
          label="Hatim"
          color="#43A047"
        />
        <StatBox
          icon="account-group"
          value={userData?.activeGroups || 0}
          label="Aktif Grup"
          color="#7B1FA2"
        />
      </View>

      {/* Settings Section */}
      <Surface style={styles.settingsCard}>
        <Title style={styles.settingsTitle}>Ayarlar</Title>
        
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <View style={styles.settingItem}>
            <MaterialCommunityIcons name="account-edit" size={24} color="#6200ee" />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Profili Düzenle</Text>
              <Text style={styles.settingDescription}>Kişisel bilgilerinizi güncelleyin</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#6200ee" />
          </View>
        </TouchableOpacity>

        <Divider style={styles.divider} />

        <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')}>
          <View style={styles.settingItem}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="#6200ee" />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Bildirimler</Text>
              <Text style={styles.settingDescription}>Bildirim ayarlarını yönetin</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#6200ee" />
          </View>
        </TouchableOpacity>

        <Divider style={styles.divider} />

        {userData?.isAdmin && (
          <>
            <TouchableOpacity onPress={() => navigation.navigate('AdminPanel')}>
              <View style={styles.settingItem}>
                <MaterialCommunityIcons name="shield-account" size={24} color="#6200ee" />
                <View style={styles.settingContent}>
                  <Text style={[styles.settingLabel, { color: '#6200ee' }]}>Yönetici Paneli</Text>
                  <Text style={styles.settingDescription}>Kullanıcı ve hatim yönetimi</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#6200ee" />
              </View>
            </TouchableOpacity>

            <Divider style={styles.divider} />
          </>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('AboutApp')}>
          <View style={styles.settingItem}>
            <MaterialCommunityIcons name="information" size={24} color="#666" />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Program Hakkında</Text>
              <Text style={styles.settingDescription}>Uygulama bilgilerini görüntüleyin</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
          </View>
        </TouchableOpacity>
      </Surface>

      {/* Logout Button */}
      <Button
        mode="outlined"
        onPress={signOut}
        style={styles.logoutButton}
        icon="logout"
        textColor="#ff5252"
      >
        Çıkış Yap
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    backgroundColor: '#6200ee',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 24,
    elevation: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16,
  },
  userName: {
    color: 'white',
    fontSize: 24,
    marginBottom: 4,
  },
  userEmail: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: -30,
  },
  statBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
    borderLeftWidth: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  settingsCard: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  settingsTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  divider: {
    marginVertical: 8,
  },
  logoutButton: {
    margin: 16,
    borderColor: '#ff5252',
  },
});

export default ProfileScreen; 