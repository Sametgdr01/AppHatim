import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Bildirimleri yapılandır
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  // Bildirim izinlerini kontrol et ve al
  static async requestPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      return false;
    }
    
    return true;
  }

  // Günlük okuma hatırlatıcısı ayarla
  static async scheduleDailyReminder(hour = 20, minute = 0) {
    const hasPermission = await this.requestPermissions();
    
    if (!hasPermission) {
      console.log('Bildirim izni alınamadı');
      return false;
    }

    // Önce varolan bildirimleri temizle
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Yeni günlük bildirimi planla
    const trigger = {
      hour,
      minute,
      repeats: true,
    };

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Günlük Cüz Hatırlatıcısı",
          body: "Bugün henüz cüzünüzü okumadınız. Lütfen günlük okumanızı tamamlayın.",
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          color: "#6200ee",
        },
        trigger: Platform.OS === 'ios' ? trigger : {
          ...trigger,
          channelId: 'daily-reminders',
        },
      });

      // Android için bildirim kanalı oluştur
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('daily-reminders', {
          name: 'Günlük Hatırlatıcılar',
          description: 'Günlük cüz okuma hatırlatıcıları',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6200ee',
        });
      }

      return true;
    } catch (error) {
      console.log('Bildirim planlanırken hata:', error);
      return false;
    }
  }

  // Bildirimleri iptal et
  static async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Anlık bildirim gönder
  static async sendImmediateNotification(title, body) {
    const hasPermission = await this.requestPermissions();
    
    if (!hasPermission) {
      console.log('Bildirim izni alınamadı');
      return false;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          color: "#6200ee",
        },
        trigger: null, // Hemen gönder
      });
      return true;
    } catch (error) {
      console.log('Bildirim gönderilirken hata:', error);
      return false;
    }
  }
}

export default NotificationService; 