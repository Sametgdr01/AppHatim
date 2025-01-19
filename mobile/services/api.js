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

      // Platform bazlı optimizasyonlar
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        config.headers['X-Mobile-Platform'] = Platform.OS;
      }

      return config;
    } catch (error) {
      console.error('İstek Öncesi Hata:', error);
      throw error;
    }
  }

  // İstek hatası
  requestErrorInterceptor(error) {
    console.error('🚨 İstek Hatası:', error);
    return Promise.reject(error);
  }

  // Yanıt başarılı
  responseInterceptor(response) {
    this.retryCount = 0; // Başarılı yanıt alındığında retry sayacını sıfırla
    return response;
  }

  // Yanıt hatası
  async responseErrorInterceptor(error) {
    console.error('🚨 Ağ Hatası:', error);

    // Timeout veya ağ hatası durumunda yeniden dene
    if (
      (error.code === 'ECONNABORTED' || !error.response) && 
      this.retryCount < this.maxRetries
    ) {
      this.retryCount++;
      console.log(`Yeniden deneme ${this.retryCount}/${this.maxRetries}`);
      
      // Yeniden denemeden önce bekle
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
      
      // İsteği yeniden dene
      return this.axiosInstance.request(error.config);
    }

    // Hata mesajını hazırla
    let errorMessage = 'Bir hata oluştu';
    
    if (error.response) {
      // Sunucu yanıt verdi ama hata döndü
      errorMessage = error.response.data?.message || error.response.data?.error || 'Sunucu hatası';
    } else if (error.request) {
      // Sunucuya istek gitti ama yanıt gelmedi
      errorMessage = 'Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.';
    } else {
      // İstek oluşturulurken hata oluştu
      errorMessage = error.message || 'Beklenmeyen bir hata oluştu';
    }

    // Kullanıcıya hata mesajını göster
    Alert.alert('Hata', errorMessage);

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
      return response.data;
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      throw error;
    }
  }
}

export default new ApiClient();
