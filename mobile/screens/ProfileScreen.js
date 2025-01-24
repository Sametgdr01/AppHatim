import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import { Surface, Text, Title, Button, Avatar, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen = ({ navigation }) => {
  const { user, isAdmin, logout } = useAuth();

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

  const renderMenuItem = (icon, title, onPress, color = '#6200ee', badge = null) => (
    <TouchableOpacity 
      style={styles.menuItem}
      onPress={onPress}
    >
      <View style={styles.menuItemLeft}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
        <Text style={[styles.menuItemText, { color: color }]}>{title}</Text>
      </View>
      {badge ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      ) : (
        <MaterialCommunityIcons name="chevron-right" size={24} color="#999" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <LinearGradient
        colors={['#6200ee', '#9c4dff']}
        style={styles.headerGradient}
      >
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            <Avatar.Image 
              source={{ uri: user?.profileImage || 'https://via.placeholder.com/150' }} 
              size={100}
              style={styles.avatar}
            />
            <View style={styles.editAvatarBadge}>
              <MaterialCommunityIcons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.firstName} {user?.lastName}</Text>
            <View style={styles.roleContainer}>
              <MaterialCommunityIcons 
                name={isSuperAdmin ? "shield-crown" : "account"} 
                size={20} 
                color="#fff"
              />
              <Text style={styles.roleText}>
                {isSuperAdmin ? "Super Admin" : "Kullanıcı"}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <Surface style={styles.statsCard}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="book-open-variant" size={24} color="#6200ee" style={styles.statIcon} />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Hatim</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="book-open-page-variant" size={24} color="#6200ee" style={styles.statIcon} />
          <Text style={styles.statNumber}>48</Text>
          <Text style={styles.statLabel}>Cüz</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="account-group" size={24} color="#6200ee" style={styles.statIcon} />
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Grup</Text>
        </View>
      </Surface>

      <Surface style={styles.menuCard}>
        <Text style={styles.sectionTitle}>Ayarlar</Text>
        
        {renderMenuItem("account-edit", "Profili Düzenle", () => navigation.navigate('EditProfile'))}
        {renderMenuItem("bell-outline", "Bildirim Ayarları", () => navigation.navigate('NotificationSettings'), '#6200ee', '3')}

        {isSuperAdmin && (
          <>
            <Divider style={styles.divider} />
            <Text style={styles.sectionSubtitle}>Yönetici İşlemleri</Text>
            
            {renderMenuItem("account-multiple-plus", "Kullanıcı Yönetimi", () => navigation.navigate('UserManagement'), '#FF5722')}
            {renderMenuItem("shield-account", "Admin Paneli", () => navigation.navigate('AdminPanel'), '#FF5722')}
            {renderMenuItem("book-multiple", "Hatim Yönetimi", () => navigation.navigate('HatimManagement'), '#FF5722')}
          </>
        )}

        {renderMenuItem("information-outline", "Uygulama Hakkında", () => navigation.navigate('AboutApp'))}
      </Surface>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={logout}
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
    backgroundColor: '#f5f5f5'
  },
  contentContainer: {
    flexGrow: 1
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 30
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  avatarContainer: {
    position: 'relative'
  },
  avatar: {
    borderWidth: 4,
    borderColor: '#fff'
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6200ee',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff'
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  roleText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#fff',
    opacity: 0.9
  },
  statsCard: {
    flexDirection: 'row',
    margin: 20,
    marginTop: -15,
    borderRadius: 15,
    padding: 20,
    elevation: 4,
    backgroundColor: '#fff'
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  statIcon: {
    marginBottom: 8
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200ee'
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee',
    marginHorizontal: 15
  },
  menuCard: {
    margin: 20,
    borderRadius: 15,
    padding: 20,
    backgroundColor: '#fff',
    elevation: 2
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333'
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 12
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500'
  },
  badge: {
    backgroundColor: '#6200ee',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f44336',
    margin: 20,
    marginTop: 10,
    padding: 16,
    borderRadius: 15,
    elevation: 2
  },
  logoutButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default ProfileScreen;