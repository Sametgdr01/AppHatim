import axios from 'axios';
import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { API_CONFIG } from '../config/config';

class ApiService {
  constructor() {
    this.init();
    this.authToken = null;
  }

  init() {
    console.log('🔧 API servisi başlatılıyor...');
    console.log('📱 Platform:', Platform.OS);
    console.log('🌐 Base URL:', API_CONFIG.BASE_URL);

    // Axios instance'ı oluştur
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: API_CONFIG.HEADERS
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      async (config) => {
        try {
          // İnternet bağlantısını kontrol et
          const netInfo = await NetInfo.fetch();
          console.log('📡 Ağ durumu:', netInfo);

          if (!netInfo.isConnected) {
            throw new Error('İnternet bağlantısı yok');
          }

          // Debug bilgisi
          const debugInfo = {
            url: `${config.baseURL}${config.url}`,
            method: config.method,
            headers: config.headers,
            data: { ...config.data }  // Orijinal datayı kopyala
          };

          if (debugInfo.data && debugInfo.data.password) {
            debugInfo.data.password = '***';  // Sadece log için maskele
          }

          console.log('🚀 İstek gönderiliyor:', debugInfo);
          return config;

        } catch (error) {
          console.error('❌ Request hatası:', error.message);
          return Promise.reject(error);
        }
      },
      (error) => {
        console.error('❌ Request interceptor hatası:', error.message);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ Başarılı yanıt:', {
          url: response.config.url,
          status: response.status,
          data: response.data
        });
        return response;
      },
      async (error) => {
        // Hata detaylarını logla
        const errorDetails = {
          message: error.message,
          code: error.code
        };

        if (error.config) {
          errorDetails.request = {
            url: `${error.config.baseURL}${error.config.url}`,
            method: error.config.method,
            headers: error.config.headers
          };
        }

        if (error.response) {
          errorDetails.response = {
            status: error.response.status,
            data: error.response.data
          };
        }

        console.error('❌ API hatası:', errorDetails);

        // Yeniden deneme mantığı
        const config = error.config;
        
        // Eğer config yoksa veya istek zaten yeniden denendiyse
        if (!config || config.retryCount >= API_CONFIG.RETRY.MAX_RETRIES) {
          return Promise.reject(error);
        }

        // Yeniden deneme sayacını artır
        config.retryCount = (config.retryCount || 0) + 1;

        // Yeniden deneme hakkında bilgi ver
        console.log(`🔄 Yeniden deneme ${config.retryCount}/${API_CONFIG.RETRY.MAX_RETRIES}`);

        // Yeniden denemeden önce bekle
        await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY.RETRY_DELAY));

        // Eğer data string ise, parse et
        if (typeof config.data === 'string') {
          config.data = JSON.parse(config.data);
        }

        // İsteği tekrar dene
        return this.api.request(config);
      }
    );

    console.log('✅ API servisi başarıyla başlatıldı');
  }

  // Auth işlemleri
  async login(phoneNumber, password) {
    const response = await this.api.post('/api/auth/login', { phoneNumber, password });
    return response.data;
  }

  async register(userData) {
    const response = await this.api.post('/api/auth/register', userData);
    return response.data;
  }

  async checkPhone(phoneNumber) {
    const response = await this.api.post('/api/auth/check-phone', { phoneNumber });
    return response.data;
  }

  async checkEmail(email) {
    const response = await this.api.post('/api/auth/check-email', { email });
    return response.data;
  }

  // Token yönetimi
  setAuthToken(token) {
    this.authToken = token;
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
    console.log('🔑 Auth token güncellendi:', token ? 'Token set edildi' : 'Token silindi');
  }

  getAuthToken() {
    return this.authToken;
  }

  async forgotPassword(email) {
    try {
      console.log('🔑 Şifre sıfırlama isteği gönderiliyor...');
      const response = await this.api.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('❌ Şifre sıfırlama hatası:', error.message);
      throw error;
    }
  }

  async resetPassword(email, resetCode, newPassword) {
    try {
      console.log('🔑 Şifre değiştiriliyor...');
      const response = await this.api.post('/api/auth/reset-password', {
        email,
        resetCode,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('❌ Şifre değiştirme hatası:', error.message);
      throw error;
    }
  }
}

// Singleton instance
const apiService = new ApiService();
export default apiService;
