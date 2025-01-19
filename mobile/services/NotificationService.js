import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

class NotificationService {
  // Yöneticilere bildirim gönderme metodu
  static async sendAdminNotification(notificationData) {
    try {
      // Anlık bildirim gönder
      await this.sendImmediateNotification(
        notificationData.title, 
        notificationData.body
      );

      return true;
    } catch (error) {
      console.error('Admin bildirimi gönderilirken hata:', error);
      return false;
    }
  }

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