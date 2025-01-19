import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { API_CONFIG, SERVER_CONFIG } from '../config/config';

// API istemcisi oluşturma
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS
});

// İstek interceptor'ı
api.interceptors.request.use(
  async (config) => {
    // İnternet bağlantısı kontrolü
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      throw new Error('İnternet bağlantısı bulunamadı');
    }

    // Token kontrolü ve ekleme
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🚀 API İsteği: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API İstek Hatası:', error);
    return Promise.reject(error);
  }
);

// Yanıt interceptor'ı
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Yanıtı: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error) => {
    console.error('❌ API Yanıt Hatası:', error);

    // Özel hata mesajları
    let errorMessage = 'Bir hata oluştu';
    
    if (error.message === 'Network Error') {
      errorMessage = 'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.';
    } else if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = 'Geçersiz istek. Lütfen bilgilerinizi kontrol edin.';
          break;
        case 401:
          errorMessage = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
          // Token'ı temizle
          await AsyncStorage.removeItem('userToken');
          break;
        case 403:
          errorMessage = 'Bu işlem için yetkiniz yok.';
          break;
        case 404:
          errorMessage = 'İstenen kaynak bulunamadı.';
          break;
        case 500:
          errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
          break;
        case 502:
          errorMessage = 'Sunucu şu anda meşgul. Lütfen biraz bekleyip tekrar deneyin.';
          break;
        default:
          errorMessage = `Sunucu hatası: ${error.response.status}`;
      }
    }

    // Hata nesnesini özelleştir
    const customError = new Error(errorMessage);
    customError.originalError = error;
    customError.response = error.response;
    customError.status = error.response?.status;

    return Promise.reject(customError);
  }
);

// API fonksiyonları
const apiService = {
  // Kimlik doğrulama işlemleri
  auth: {
    async login(phoneNumber) {
      try {
        console.log('📱 Login isteği detayları:', {
          url: `${API_CONFIG.BASE_URL}/auth/login`,
          method: 'POST',
          data: { phoneNumber },
          headers: API_CONFIG.HEADERS
        });

        const response = await api.post('/auth/login', { phoneNumber });
        
        console.log('✅ Login yanıtı:', {
          status: response.status,
          data: response.data,
          headers: response.headers
        });

        return response.data;
      } catch (error) {
        console.error('❌ Login hatası detayları:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
        throw error;
      }
    },

    async register(userData) {
      try {
        console.log('📝 Kayıt isteği detayları:', {
          url: `${API_CONFIG.BASE_URL}/auth/register`,
          method: 'POST',
          data: userData,
          headers: API_CONFIG.HEADERS
        });

        const response = await api.post('/auth/register', userData);
        
        console.log('✅ Kayıt yanıtı:', {
          status: response.status,
          data: response.data,
          headers: response.headers
        });

        return response.data;
      } catch (error) {
        console.error('❌ Kayıt hatası detayları:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
        throw error;
      }
    },

    async logout() {
      try {
        await AsyncStorage.removeItem('userToken');
        return true;
      } catch (error) {
        console.error('❌ Çıkış hatası:', error);
        throw error;
      }
    }
  },

  // Kullanıcı işlemleri
  user: {
    async getProfile() {
      try {
        console.log('👥 Profil isteği detayları:', {
          url: `${API_CONFIG.BASE_URL}/user/profile`,
          method: 'GET',
          headers: API_CONFIG.HEADERS
        });

        const response = await api.get('/user/profile');
        
        console.log('✅ Profil yanıtı:', {
          status: response.status,
          data: response.data,
          headers: response.headers
        });

        return response.data;
      } catch (error) {
        console.error('❌ Profil getirme hatası detayları:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
        throw error;
      }
    },

    async updateProfile(data) {
      try {
        console.log('📝 Profil güncelleme isteği detayları:', {
          url: `${API_CONFIG.BASE_URL}/user/profile`,
          method: 'PUT',
          data: data,
          headers: API_CONFIG.HEADERS
        });

        const response = await api.put('/user/profile', data);
        
        console.log('✅ Profil güncelleme yanıtı:', {
          status: response.status,
          data: response.data,
          headers: response.headers
        });

        return response.data;
      } catch (error) {
        console.error('❌ Profil güncelleme hatası detayları:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          config: error.config
        });
        throw error;
      }
    }
  }
};

export default apiService;
