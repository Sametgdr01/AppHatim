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
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUserProfile: async () => {},
  updateNotificationPreferences: async () => {}
});

// AuthProvider bileşeni
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      }
    };

    checkAuthStatus();
  }, []);

  // Giriş fonksiyonu
  const login = async (phoneNumber, password) => {
    try {
        setIsLoading(true);
        const response = await api.post('/auth/login', { phoneNumber, password });
        
        if (response.data.error) {
            Alert.alert('Hata', response.data.error); // Hata mesajını kullanıcıya göster
            throw new Error(response.data.error);
        }

        const { token, user: userData } = response.data;
        await AsyncStorage.setItem('userToken', token);
        setUser(userData);
        setIsAuthenticated(true);
        
        return userData;
    } catch (error) {
        console.error('Giriş hatası:', error);
        setIsAuthenticated(false);
        setUser(null);
        
        if (error.response) {
            Alert.alert('Hata', error.response.data.error || 'Giriş başarısız'); // Hata mesajını kullanıcıya göster
            throw new Error(error.response.data.error || 'Giriş başarısız');
        } else if (error.request) {
            Alert.alert('Hata', 'Sunucuya istek gönderilemedi'); // Hata mesajını kullanıcıya göster
            throw new Error('Sunucuya istek gönderilemedi');
        } else {
            Alert.alert('Hata', 'Giriş hatası: ' + error.message); // Hata mesajını kullanıcıya göster
            throw new Error('Giriş hatası: ' + error.message);
        }
    } finally {
        setIsLoading(false);
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

  // Çıkış fonksiyonu
  const logout = async () => {
    try {
      setIsLoading(true);
      await AsyncStorage.removeItem('userToken');
      
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      Alert.alert(
        'Çıkış Hatası', 
        'Çıkış işlemi tamamlanamadı'
      );
    } finally {
      setIsLoading(false);
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

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        register,
        logout,
        updateUserProfile,
        updateNotificationPreferences
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
