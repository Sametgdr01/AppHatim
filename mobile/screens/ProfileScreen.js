import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Avatar, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { SERVER_URL } from '@env'; // .env dosyasından SERVER_URL değişkenini import ediyoruz
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  console.log('Güncellenmiş kullanıcı verisi:', user);

  useEffect(() => {
    if (!user) {
      navigation.navigate('Login');
    }
    console.log('Profil sayfası yeniden render edildi.');
  }, [user]);

  const stats = [
    {
      title: "Tamamlanan Hatim",
      value: "12",
      icon: "book-check",
      color: "#4CAF50"
    },
    {
      title: "Aktif Hatim",
      value: "3",
      icon: "book-open-variant",
      color: "#2196F3"
    },
    {
      title: "Toplam Cüz",
      value: "45",
      icon: "bookmark-multiple",
      color: "#9C27B0"
    }
  ];

  const menuItems = [
    {
      title: "Profili Düzenle",
      icon: "account-edit",
      onPress: () => navigation.navigate('EditProfile'),
      color: "#6200ee"
    },
    {
      title: "Bildirim Ayarları",
      icon: "bell-outline",
      onPress: () => navigation.navigate('NotificationSettings'), // Bildirim ayarları ekranına yönlendirme
      color: "#FF9800"
    },
    {
      title: "Uygulama Hakkında",
      icon: "information",
      onPress: () => navigation.navigate('About'),
      color: "#607D8B"
    },
    {
      title: "Çıkış Yap",
      icon: "logout",
      onPress: logout,
      color: "#F44336"
    }
  ];

  const profileImageUri = user?.profileImage ? `${SERVER_URL}/${user.profileImage.replace(/\\/g, '/')}` : 'https://via.placeholder.com/150';
  console.log('Profil fotoğrafı URI:', profileImageUri);

  return (
    <ScrollView style={styles.container}>
      {/* Profil Başlığı */}
      <View style={styles.header}>
        <Avatar.Image 
          size={80} 
          source={{ uri: profileImageUri }} 
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{user?.firstName || 'Kullanıcı'}</Text>
          <Text style={styles.email}>{user?.email || 'kullanici@email.com'}</Text>
        </View>
      </View>

      <Divider style={styles.divider} />

      {/* İstatistik Kartları */}
      <View style={styles.statisticsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statisticsCard}>
            <MaterialCommunityIcons 
              name={stat.icon} 
              size={24} 
              color={stat.color} 
            />
            <Text style={styles.statisticLabel}>{stat.title}</Text>
            <Text style={styles.statisticValue}>{stat.value}</Text>
          </View>
        ))}
        <View style={styles.statisticsCard}>
          <View style={styles.statisticItem}>
            <MaterialCommunityIcons 
              name="book-open-variant" 
              size={24} 
              color="#6200ee" 
            />
            <Text style={styles.statisticLabel}>Tamamlanan Cüz</Text>
            <Text style={styles.statisticValue}>
              {user.completedJuzCount || 0}/30
            </Text>
          </View>
        </View>
      </View>

      {/* Menü */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <MaterialCommunityIcons 
                name={item.icon} 
                size={24} 
                color={item.color}
                style={styles.menuIcon}
              />
              <Text style={styles.menuTitle}>{item.title}</Text>
            </View>
            <MaterialCommunityIcons 
              name="chevron-right" 
              size={24} 
              color="#666"
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6200ee',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    // backgroundColor: '#fff', // Bu satırı kaldırıyoruz
  },
  headerInfo: {
    marginLeft: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  divider: {
    marginVertical: 16,
  },
  statisticsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statisticsCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    width: '30%',
    alignItems: 'center',
  },
  statisticItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statisticLabel: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  statisticValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
  },
});

export default ProfileScreen;