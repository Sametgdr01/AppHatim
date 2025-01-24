import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Surface, Text, Title, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const NotificationsScreen = () => {
  const notifications = [
    {
      id: '1',
      title: 'Hatim Tamamlandı',
      message: 'Ramazan Hatmi başarıyla tamamlandı.',
      time: '2 saat önce',
      type: 'success',
      read: false
    },
    {
      id: '2',
      title: 'Yeni Cüz Atandı',
      message: 'Size yeni bir cüz atandı: Yasin Suresi',
      time: '1 gün önce',
      type: 'info',
      read: true
    }
  ];

  const renderNotification = ({ item }) => (
    <Surface style={[styles.notificationCard, !item.read && styles.unread]}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={item.type === 'success' ? 'check-circle' : 'information'}
          size={24}
          color={item.type === 'success' ? '#4caf50' : '#2196f3'}
        />
      </View>
      <View style={styles.contentContainer}>
        <Title style={styles.title}>{item.title}</Title>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </Surface>
  );

  return (
    <View style={styles.container}>
      <Title style={styles.screenTitle}>Bildirimler</Title>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <Divider style={styles.divider} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    paddingHorizontal: 16
  },
  listContainer: {
    padding: 16
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2
  },
  unread: {
    backgroundColor: '#e3f2fd'
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: 'center'
  },
  contentContainer: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8
  },
  time: {
    fontSize: 12,
    color: '#999'
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8
  }
});

export default NotificationsScreen;
