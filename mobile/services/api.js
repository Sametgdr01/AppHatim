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

  // Auth endpoints
  async login(phoneNumber, password) {
    return this.api.post('/api/auth/login', { phoneNumber, password });
  }

  async register(userData) {
    return this.api.post('/api/auth/register', userData);
  }

  async forgotPassword(phoneNumber) {
    return this.api.post('/api/auth/forgot-password', { phoneNumber });
  }

  async resetPassword(resetData) {
    return this.api.post('/api/auth/reset-password', resetData);
  }

  // User endpoints
  async updateProfile(profileData) {
    return this.api.put('/api/user/profile', profileData);
  }

  async updateProfileImage(formData) {
    return this.api.post('/api/user/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  async getProfile() {
    return this.api.get('/api/user/profile');
  }

  // Profil fotoğrafı yükleme
  async uploadProfileImage(imageUri) {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: 'profile.jpg',
      type: 'image/jpeg',
    });

    return this.api.post('/api/user/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Hatim endpoints
  async createHatim(hatimData) {
    return this.api.post('/api/hatim', hatimData);
  }

  async getHatimList() {
    return this.api.get('/api/hatim');
  }

  async joinHatim(hatimId, cuzNo) {
    return this.api.post(`/api/hatim/${hatimId}/join`, { cuzNo });
  }

  async updateCuzStatus(hatimId, cuzNo, status) {
    return this.api.put(`/api/hatim/${hatimId}/cuz/${cuzNo}`, { status });
  }

  async getHatimDetails(hatimId) {
    return this.api.get(`/api/hatim/${hatimId}`);
  }

  // Token yönetimi
  setAuthToken(token) {
    this.authToken = token;
    if (token) {
      console.log('🔑 Token ayarlanıyor:', token);
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('🔑 Headers:', this.api.defaults.headers.common);
    } else {
      delete this.api.defaults.headers.common['Authorization'];
      console.log('🔑 Token silindi');
    }
  }

  getAuthToken() {
    return this.authToken;
  }

  handleApiError(error) {
    console.error('❌ API hatası:', error.message);
  }
}

// Singleton instance
const apiService = new ApiService();
export default apiService;
