import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import axios from 'axios';
import { API_CONFIG } from '../config/config';

// AuthContext oluşturma
const AuthContext = createContext({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  isConnecting: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
  updateNotificationPreferences: async () => {},
  isAdmin: false
});

// AuthProvider bileşeni
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(true);

  // API istemcisi
  const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.HEADERS
  });

  // Token interceptor
  api.interceptors.request.use(
    async (config) => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Uygulama başlangıcında oturum kontrolü
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsConnecting(true);
        const storedToken = await AsyncStorage.getItem('userToken');
        
        if (!storedToken) {
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        const response = await api.get('/auth/me');
        if (response.data) {
          setUser(response.data);
          setIsAuthenticated(true);
        } else {
          throw new Error('Kullanıcı bilgileri alınamadı');
        }
      } catch (error) {
        console.error('Oturum kontrol hatası:', error);
        setIsAuthenticated(false);
        setUser(null);
        await AsyncStorage.removeItem('userToken');
      } finally {
        setIsLoading(false);
        setIsConnecting(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login işlemi
  const login = async (phoneNumber) => {
    try {
      const response = await api.post('/auth/login', { phoneNumber });
      
      if (response.data && response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        setUser(response.data.user);
        setIsAuthenticated(true);
        return response.data;
      } else {
        throw new Error('Token alınamadı');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Kayıt fonksiyonu
  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await api.post('/auth/register', userData);
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      return response.data;
    } catch (error) {
      console.error('Kayıt hatası:', error);
      if (error.response) {
        throw new Error(error.response.data.error || 'Kayıt işlemi başarısız oldu');
      } else if (error.request) {
        throw new Error('Sunucuya bağlanılamadı');
      } else {
        throw new Error('Bir hata oluştu');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Çıkış işlemi
  const logout = async () => {
    try {
      // Token'ı sil
      await AsyncStorage.removeItem('userToken');
      
      // API header'dan token'ı kaldır
      delete api.defaults.headers.common['Authorization'];
      
      // State'i temizle
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      
      return true;
    } catch (error) {
      console.error('Çıkış hatası:', error);
      throw new Error('Çıkış yapılırken bir hata oluştu');
    }
  };

  // Profil güncelleme fonksiyonu
  const updateUserProfile = async (userData) => {
    try {
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu');
      return false;
    }
  };

  // Bildirim tercihlerini güncelleme
  const updateNotificationPreferences = async (preferences) => {
    try {
      setIsLoading(true);
      const response = await api.put('/users/notifications', preferences);
      setUser(response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      } else if (error.request) {
        throw new Error('Sunucuya bağlanılamadı');
      } else {
        throw new Error('Bir hata oluştu');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // isAdmin hesaplama
  const checkIsAdmin = (userData) => {
    return userData?.role === 'admin' || userData?.role === 'superadmin' || userData?.email === 'gudersamet@gmail.com';
  };

  // isAdmin değerini hesapla
  const isAdmin = checkIsAdmin(user);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        isConnecting,
        login,
        register,
        logout,
        updateUserProfile,
        updateNotificationPreferences,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook olarak kullanmak için
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
