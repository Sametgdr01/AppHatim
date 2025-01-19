import axios from 'axios';
import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { 
  BASE_URL, 
  API_TIMEOUT, 
  SERVER_CONFIG, 
  MONGO_CONNECTION 
} from '../config/config';
import MongooseAdapter from './mongooseAdapter';
import { Alert } from 'react-native';

class ApiClient {
  constructor() {
    this.axiosInstance = this.createAxiosInstance();
    this.setupInterceptors();
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

    // Platform özelinde ek konfigürasyonlar
    if (Platform.OS === 'web') {
      return axios.create(baseConfig);
    }

    // Mobil platformlar için özel ayarlar
    return axios.create({
      ...baseConfig,
      adapter: ['xhr', 'http', 'fetch']
    });
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

  // İstek öncesi interceptor
  async requestInterceptor(config) {
    try {
      // Ağ durumu kontrolü
      const connectionState = await NetInfo.fetch();
      if (!connectionState.isConnected) {
        throw new Error('İnternet bağlantısı yok');
      }

      // MongoDB bağlantısını kontrol et
      await MongooseAdapter.connect(MONGO_CONNECTION.uri);

      // Platform bazlı optimizasyonlar
      if (Platform.OS === 'android' || Platform.OS === 'ios') {
        config.headers['X-Mobile-Platform'] = Platform.OS;
        config.headers['X-Mobile-Version'] = Platform.Version;
      }

      console.log('🚀 API İstek Detayları:', {
        url: config.url,
        method: config.method,
        headers: config.headers
      });

      return config;
    } catch (error) {
      console.error('İstek Öncesi Hata:', error);
      this.handleNetworkError(error);
      throw error;
    }
  }

  // İstek hatası interceptor
  requestErrorInterceptor(error) {
    console.error('İstek Hatası:', error);
    return Promise.reject(error);
  }

  // Yanıt interceptor
  responseInterceptor(response) {
    console.log('✅ API Yanıtı:', {
      status: response.status,
      data: response.data
    });
    return response;
  }

  // Yanıt hatası interceptor
  async responseErrorInterceptor(error) {
    const originalRequest = error.config;

    // Sunucu hatası durumunda yeniden deneme
    if (error.response && error.response.status >= 500 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newBaseURL = await this.selectAlternativeServer();
        originalRequest.baseURL = newBaseURL;

        return this.axiosInstance(originalRequest);
      } catch (retryError) {
        this.handleNetworkError(retryError);
        return Promise.reject(retryError);
      }
    }

    this.handleNetworkError(error);
    return Promise.reject(error);
  }

  // Alternatif sunucu seçimi
  async selectAlternativeServer() {
    const servers = SERVER_CONFIG.PRIMARY_SERVERS.map(s => s.URL);
    
    for (const serverUrl of servers) {
      try {
        const response = await axios.get(`${serverUrl}/health`);
        if (response.status === 200) {
          console.log('🌐 Yeni sunucu seçildi:', serverUrl);
          return serverUrl;
        }
      } catch (error) {
        console.warn(`Sunucu çalışmıyor: ${serverUrl}`, error);
      }
    }

    throw new Error('Hiçbir sunucu kullanılabilir değil');
  }

  // Ağ hatası yönetimi
  handleNetworkError(error) {
    const errorMessage = error.message || 'Bilinmeyen ağ hatası';

    if (SERVER_CONFIG.ERROR_HANDLING.NOTIFY_USER_ON_PERSISTENT_ERRORS) {
      Alert.alert(
        'Ağ Bağlantı Hatası',
        `API isteği gönderilemedi: ${errorMessage}. Lütfen ağ ayarlarınızı kontrol edin.`
      );
    }

    console.error('🚨 Ağ Hatası:', error);
  }

  // HTTP metodları
  async get(url, config = {}) {
    return this.axiosInstance.get(url, config);
  }

  async post(url, data, config = {}) {
    return this.axiosInstance.post(url, data, config);
  }

  async put(url, data, config = {}) {
    return this.axiosInstance.put(url, data, config);
  }

  async delete(url, config = {}) {
    return this.axiosInstance.delete(url, config);
  }

  // Kullanıcı listesini getir
  async fetchUsers({ search = '', includeDetails = false } = {}) {
    try {
      const response = await this.axiosInstance.get('/users', {
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
}

export default new ApiClient();
