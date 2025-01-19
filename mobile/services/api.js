import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { API_CONFIG } from '../config/config';

// API istemcisi oluşturma
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
  withCredentials: false,
  validateStatus: function (status) {
    return status >= 200 && status < 300; // Sadece 2xx yanıtları başarılı kabul et
  },
  maxContentLength: 100 * 1024 * 1024, // 100MB
  maxBodyLength: 100 * 1024 * 1024, // 100MB
  decompress: true
});

// Retry mekanizması
api.interceptors.response.use(null, async (error) => {
  const { config } = error;
  if (!config || !config.retry) {
    return Promise.reject(error);
  }

  config.currentRetryCount = config.currentRetryCount || 0;

  if (config.currentRetryCount >= API_CONFIG.RETRY_STRATEGY.MAX_RETRIES) {
    return Promise.reject(error);
  }

  config.currentRetryCount += 1;

  const delayMs = Math.min(
    API_CONFIG.RETRY_STRATEGY.INITIAL_DELAY_MS * Math.pow(API_CONFIG.RETRY_STRATEGY.BACKOFF_FACTOR, config.currentRetryCount),
    API_CONFIG.RETRY_STRATEGY.MAX_DELAY_MS
  );

  console.log(`🔄 Yeniden deneme ${config.currentRetryCount}/${API_CONFIG.RETRY_STRATEGY.MAX_RETRIES} (${delayMs}ms sonra)`);

  await new Promise(resolve => setTimeout(resolve, delayMs));

  return api(config);
});

// Yanıt interceptor'ı
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Yanıtı:', {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    // Detaylı hata loglaması
    console.error('❌ API Hatası:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      stack: error.stack
    });

    // Retry mekanizması
    const { config } = error;
    if (!config || !config.retry) {
      return Promise.reject(error);
    }

    config.currentRetryCount = config.currentRetryCount || 0;

    if (config.currentRetryCount >= API_CONFIG.RETRY_STRATEGY.MAX_RETRIES) {
      return Promise.reject(error);
    }

    config.currentRetryCount += 1;

    const delayMs = Math.min(
      API_CONFIG.RETRY_STRATEGY.INITIAL_DELAY_MS * Math.pow(API_CONFIG.RETRY_STRATEGY.BACKOFF_FACTOR, config.currentRetryCount),
      API_CONFIG.RETRY_STRATEGY.MAX_DELAY_MS
    );

    console.log(`🔄 Yeniden deneme ${config.currentRetryCount}/${API_CONFIG.RETRY_STRATEGY.MAX_RETRIES} (${delayMs}ms sonra)`);

    await new Promise(resolve => setTimeout(resolve, delayMs));

    return api(config);
  }
);

// İstek interceptor'ı
api.interceptors.request.use(
  async (config) => {
    // Her isteğe retry özelliği ekle
    config.retry = true;
    config.currentRetryCount = 0;

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

    console.log('🚀 API İsteği:', {
      url: config.url,
      method: config.method?.toUpperCase(),
      headers: config.headers,
      data: config.data
    });

    return config;
  },
  (error) => {
    console.error('❌ API İstek Hatası:', error);
    return Promise.reject(error);
  }
);

// API servisi
export const apiService = {
  // Kimlik doğrulama işlemleri
  auth: {
    async login(phoneNumber) {
      try {
        // Telefon numarasından basit bir şifre oluştur
        const password = phoneNumber.slice(-4); // Son 4 rakam
        console.log('🔑 Oluşturulan şifre:', password);

        const loginData = { 
          phoneNumber, 
          password,
          deviceInfo: {
            platform: 'Unknown',
            version: 'Unknown',
            manufacturer: 'Unknown',
            model: 'Unknown'
          }
        };

        console.log('📱 Login isteği detayları:', {
          url: `${API_CONFIG.BASE_URL}/auth/login`,
          method: 'POST',
          data: loginData,
          headers: API_CONFIG.HEADERS
        });

        try {
          // Önce login dene
          const response = await api.post('/auth/login', loginData);
          
          console.log('✅ Login başarılı:', {
            status: response.status,
            data: response.data
          });

          return response.data;
        } catch (loginError) {
          console.error('❌ Login hatası:', {
            status: loginError.response?.status,
            data: loginError.response?.data,
            message: loginError.message
          });

          // Eğer 401 hatası alındıysa, kullanıcı kayıtlı değil demektir
          if (loginError.response?.status === 401) {
            console.log('ℹ️ Kullanıcı bulunamadı, otomatik kayıt yapılıyor...');
            
            const registerData = {
              phoneNumber,
              password,
              name: `Kullanıcı-${phoneNumber.slice(-4)}`, // Geçici isim
              email: `${phoneNumber}@temp.com`, // Geçici email
              deviceInfo: {
                platform: 'Unknown',
                version: 'Unknown',
                manufacturer: 'Unknown',
                model: 'Unknown'
              }
            };

            console.log('📝 Kayıt isteği detayları:', registerData);

            // Otomatik kayıt yap
            const registerResponse = await api.post('/auth/register', registerData);

            console.log('✅ Kayıt başarılı:', {
              status: registerResponse.status,
              data: registerResponse.data
            });

            console.log('🔄 Tekrar giriş deneniyor...');

            // Kayıt başarılıysa tekrar login dene
            const loginResponse = await api.post('/auth/login', loginData);

            console.log('✅ İkinci login denemesi başarılı:', {
              status: loginResponse.status,
              data: loginResponse.data
            });

            return loginResponse.data;
          }
          
          // Başka bir hata varsa tekrar fırlat
          throw loginError;
        }
      } catch (error) {
        console.error('❌ Login/Kayıt hatası detayları:', {
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
