import axios from 'axios';
import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { 
  BASE_URL, 
  API_TIMEOUT, 
  SERVER_CONFIG,
  API_CONFIG
} from '../config/config';
import { Alert } from 'react-native';

class ApiClient {
  constructor() {
    this.axiosInstance = this.createAxiosInstance();
    this.setupInterceptors();
    this.retryCount = 0;
    this.maxRetries = API_CONFIG.RETRY_COUNT || 3;
  }

  // Platform bazlı Axios örneği oluştur
  createAxiosInstance() {
    const baseConfig = {
      baseURL: BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    return axios.create(baseConfig);
  }

  // İstek ve yanıt interceptorları
  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      this.requestInterceptor.bind(this),
      this.requestErrorInterceptor.bind(this)
    );

    this.axiosInstance.interceptors.response.use(
      this.responseInterceptor.bind(this),
      this.responseErrorInterceptor.bind(this)
    );
  }

  // İstek öncesi işlemler
  async requestInterceptor(config) {
    try {
      // İnternet bağlantısını kontrol et
      const netInfo = await NetInfo.fetch();
      
      if (!netInfo.isConnected) {
        throw new Error('İnternet bağlantısı yok');
      }

      // Retry başlık bilgisini ekle
      config.headers['x-retry-count'] = this.retryCount;

      // Platform bazlı optimizasyonlar
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        config.headers['X-Mobile-Platform'] = Platform.OS;
      }

      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // İstek hata interceptoru
  requestErrorInterceptor(error) {
    console.error('📡 İstek hatası:', error);
    return Promise.reject(error);
  }

  // Yanıt interceptoru
  responseInterceptor(response) {
    // Başarılı yanıt durumunda retry sayacını sıfırla
    this.retryCount = 0;
    return response;
  }

  // Yanıt hata interceptoru
  async responseErrorInterceptor(error) {
    // Hata detaylarını logla
    console.error('🔥 API Hatası:', {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      retryCount: this.retryCount
    });

    // 502 Bad Gateway hatası için yeniden deneme
    if (error.response?.status === 502 && this.retryCount < this.maxRetries) {
      this.retryCount++;
      
      // Exponential backoff ile bekleme süresi
      const delay = Math.min(1000 * Math.pow(2, this.retryCount), 10000);
      
      console.log(`🔄 Yeniden deneme ${this.retryCount}/${this.maxRetries} (${delay}ms sonra)`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return this.axiosInstance(error.config);
    }

    // Maksimum deneme sayısına ulaşıldı
    if (this.retryCount >= this.maxRetries) {
      console.error('❌ Maksimum yeniden deneme sayısına ulaşıldı');
      Alert.alert(
        'Bağlantı Hatası',
        'Sunucuya bağlanırken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.'
      );
    }

    return Promise.reject(error);
  }

  // HTTP metodları
  async get(url, config = {}) {
    return this.axiosInstance.get(url, config);
  }

  async post(url, data = {}, config = {}) {
    return this.axiosInstance.post(url, data, config);
  }

  async put(url, data = {}, config = {}) {
    return this.axiosInstance.put(url, data, config);
  }

  async delete(url, config = {}) {
    return this.axiosInstance.delete(url, config);
  }

  // Kullanıcı listesini getir
  async fetchUsers({ search = '', includeDetails = false } = {}) {
    try {
      const response = await this.get('/users', {
        params: {
          search,
          includeDetails
        }
      });
      return response.data;
    } catch (error) {
      console.error('Kullanıcı listesi alınamadı:', error);
      throw error;
    }
  }

  // Profil güncelleme
  async updateProfile(userData) {
    try {
      const response = await this.put('/users/profile', userData);
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      return response.data;
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      throw error;
    }
  }
}

export default new ApiClient();
