import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Surface, Text, Switch, List, Divider, Title, IconButton, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const NotificationScreen = () => {
  // Bildirim ayarları state'i
  const [settings, setSettings] = useState({
    hatimReminders: true,
    groupUpdates: true,
    dailyReminders: true,
    completionNotifications: true,
    newGroupInvites: true
  });

  // Örnek bildirim geçmişi (gerçek uygulamada API'den gelecek)
  const notifications = [
    {
      id: 1,
      title: "Günlük Cüz Hatırlatıcısı",
      message: "Bugün henüz cüzünüzü okumadınız. Lütfen günlük okumanızı tamamlayın.",
      type: "reminder",
      time: "Bugün 20:00",
      isRead: false
    },
    {
      id: 2,
      title: "Tebrikler!",
      message: "5. Cüz için günlük okumanızı tamamladınız.",
      type: "success",
      time: "Bugün 15:30",
      isRead: true
    },
    {
      id: 3,
      title: "Grup Güncellemesi",
      message: "Ramazan Hatmi grubunda 3 yeni üye katıldı.",
      type: "group",
      time: "Dün 14:20",
      isRead: true
    },
    {
      id: 4,
      title: "Özel Gece Hatmi",
      message: "Miraç Kandili için özel hatim grubu oluşturuldu. Katılmak ister misiniz?",
      type: "special",
      time: "2 gün önce",
      isRead: true
    }
  ];

  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'reminder':
        return 'clock-outline';
      case 'success':
        return 'check-circle';
      case 'group':
        return 'account-group';
      case 'special':
        return 'star-circle';
      default:
        return 'bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'reminder':
        return '#FF9800';
      case 'success':
        return '#4CAF50';
      case 'group':
        return '#2196F3';
      case 'special':
        return '#9C27B0';
      default:
        return '#757575';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Bildirim Geçmişi */}
      <Surface style={styles.section}>
        <Title style={styles.sectionTitle}>Bildirimler</Title>
        {notifications.map((notification) => (
          <View key={notification.id}>
            <List.Item
              title={notification.title}
              description={notification.message}
              left={() => (
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name={getNotificationIcon(notification.type)}
                    size={24}
                    color={getNotificationColor(notification.type)}
                  />
                  {!notification.isRead && <View style={styles.unreadDot} />}
                </View>
              )}
              right={() => (
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>{notification.time}</Text>
                  <IconButton
                    icon="dots-vertical"
                    size={20}
                    onPress={() => {}}
                  />
                </View>
              )}
              style={[
                styles.notificationItem,
                !notification.isRead && styles.unreadItem
              ]}
            />
            <Divider />
          </View>
        ))}
      </Surface>

      {/* Bildirim Ayarları */}
      <Surface style={styles.section}>
        <Title style={styles.sectionTitle}>Bildirim Ayarları</Title>
        <List.Item
          title="Hatim Hatırlatıcıları"
          description="Günlük cüz okuma hatırlatmaları"
          left={props => <List.Icon {...props} icon="book-open-variant" />}
          right={() => (
            <Switch
              value={settings.hatimReminders}
              onValueChange={() => toggleSetting('hatimReminders')}
              color="#6200ee"
            />
          )}
        />
        <Divider />
        <List.Item
          title="Grup Güncellemeleri"
          description="Grup hatimlerindeki değişiklikler"
          left={props => <List.Icon {...props} icon="account-group" />}
          right={() => (
            <Switch
              value={settings.groupUpdates}
              onValueChange={() => toggleSetting('groupUpdates')}
              color="#6200ee"
            />
          )}
        />
        <Divider />
        <List.Item
          title="Günlük Hatırlatıcılar"
          description="Her gün belirlenen saatte hatırlatma"
          left={props => <List.Icon {...props} icon="clock-outline" />}
          right={() => (
            <Switch
              value={settings.dailyReminders}
              onValueChange={() => toggleSetting('dailyReminders')}
              color="#6200ee"
            />
          )}
        />
        <Divider />
        <List.Item
          title="Tamamlama Bildirimleri"
          description="Cüz ve hatim tamamlama bildirimleri"
          left={props => <List.Icon {...props} icon="check-circle" />}
          right={() => (
            <Switch
              value={settings.completionNotifications}
              onValueChange={() => toggleSetting('completionNotifications')}
              color="#6200ee"
            />
          )}
        />
        <Divider />
        <List.Item
          title="Yeni Grup Davetleri"
          description="Grup hatimlerine davet bildirimleri"
          left={props => <List.Icon {...props} icon="email-outline" />}
          right={() => (
            <Switch
              value={settings.newGroupInvites}
              onValueChange={() => toggleSetting('newGroupInvites')}
              color="#6200ee"
            />
          )}
        />
      </Surface>

      <Text style={styles.note}>
        * Değişiklikler otomatik olarak kaydedilir
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    overflow: 'hidden',
  },
  sectionTitle: {
    padding: 16,
    paddingBottom: 8,
    fontSize: 20,
    fontWeight: 'bold',
  },
  notificationItem: {
    backgroundColor: 'white',
  },
  unreadItem: {
    backgroundColor: '#fafafa',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6200ee',
  },
  timeContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  note: {
    margin: 16,
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default NotificationScreen; 