import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { Alert } from 'react-native';
import { OFFLINE_MODE_CONFIG } from '../config/config';

class OfflineManager {
  // Offline operasyon kuyruğu
  static operationQueue = [];

  // Offline durumunu kontrol et
  static async checkOfflineStatus() {
    try {
      const netState = await NetInfo.fetch();
      
      const isOffline = !netState.isConnected || !netState.isInternetReachable;
      
      console.log('🌐 Ağ Durumu:', {
        isConnected: netState.isConnected,
        isInternetReachable: netState.isInternetReachable,
        type: netState.type,
        isOffline: isOffline
      });

      return isOffline;
    } catch (error) {
      console.error('Offline durum kontrolü hatası:', error);
      return true;
    }
  }

  // Operasyon kuyruğuna ekle
  static async queueOperation(operation, priority = 'normal') {
    try {
      const queuedOperation = {
        id: Date.now(),
        operation,
        priority,
        timestamp: new Date().toISOString()
      };

      this.operationQueue.push(queuedOperation);

      // Kuyruğu AsyncStorage'a kaydet
      await this.saveOperationQueue();

      console.log('📦 İşlem kuyruğa alındı:', queuedOperation);

      return queuedOperation.id;
    } catch (error) {
      console.error('Operasyon kuyruğa eklenirken hata:', error);
      throw error;
    }
  }

  // Kuyruğu kaydet
  static async saveOperationQueue() {
    try {
      await AsyncStorage.setItem(
        'OFFLINE_OPERATION_QUEUE', 
        JSON.stringify(this.operationQueue)
      );
    } catch (error) {
      console.error('Kuyruk kaydedilirken hata:', error);
    }
  }

  // Kuyruğu yükle
  static async loadOperationQueue() {
    try {
      const queueString = await AsyncStorage.getItem('OFFLINE_OPERATION_QUEUE');
      
      if (queueString) {
        this.operationQueue = JSON.parse(queueString);
        console.log('📂 Kuyruk yüklendi:', this.operationQueue.length);
      }
    } catch (error) {
      console.error('Kuyruk yüklenirken hata:', error);
    }
  }

  // Kuyruktaki işlemleri senkronize et
  static async syncOperationQueue() {
    try {
      const isOnline = !(await this.checkOfflineStatus());
      
      if (isOnline && this.operationQueue.length > 0) {
        console.log(`🔄 ${this.operationQueue.length} işlem senkronize ediliyor`);

        // Öncelik sırasına göre sırala
        const sortedQueue = this.operationQueue.sort((a, b) => 
          a.priority === 'high' ? -1 : 1
        );

        for (const queuedOperation of sortedQueue) {
          try {
            await queuedOperation.operation();
            
            // Başarılı işlemi kuyruktan çıkar
            this.operationQueue = this.operationQueue.filter(
              op => op.id !== queuedOperation.id
            );
          } catch (error) {
            console.error('Kuyruk işlemi sırasında hata:', error);
          }
        }

        // Güncellenmiş kuyruğu kaydet
        await this.saveOperationQueue();

        Alert.alert(
          "Senkronizasyon Tamamlandı", 
          `${sortedQueue.length} bekleyen işlem senkronize edildi.`
        );
      }
    } catch (error) {
      console.error('Kuyruk senkronizasyonu hatası:', error);
    }
  }

  // Offline bildirim göster
  static showOfflineNotification() {
    Alert.alert(
      "Çevrimdışı Mod", 
      OFFLINE_MODE_CONFIG.OFFLINE_MESSAGE || 
      "İnternet bağlantısı yok. Bazı özellikler sınırlı olabilir."
    );
  }

  // Offline destek başlatıcısı
  static async initOfflineSupport() {
    try {
      // Ağ değişikliği dinleyicisi
      NetInfo.addEventListener(async (state) => {
        const isOffline = !state.isConnected || !state.isInternetReachable;
        
        if (!isOffline) {
          // Bağlantı geri geldiğinde kuyruğu senkronize et
          await this.syncOperationQueue();
        } else {
          // Offline bildirimini göster
          this.showOfflineNotification();
        }
      });

      // Kuyruğu yükle
      await this.loadOperationQueue();
    } catch (error) {
      console.error('Offline destek başlatılırken hata:', error);
    }
  }
}

export default OfflineManager;
