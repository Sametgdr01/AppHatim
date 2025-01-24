import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/api';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Alert } from 'react-native';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Başlangıçta token kontrolü yap
  useEffect(() => {
    checkAuth();
  }, []);

  // Token ve kullanıcı bilgilerini kontrol et
  const checkAuth = async () => {
    try {
      const userToken = await AsyncStorage.getItem('@auth_token');
      const userData = await AsyncStorage.getItem('userData');
      
      if (userToken && userData) {
        setUser(JSON.parse(userData));
        apiService.setAuthToken(userToken);
        setToken(userToken);
      }
    } catch (error) {
      console.error('Token kontrolü hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // Giriş yap
  const login = async ({ phoneNumber, password }) => {
    try {
      setError(null);
      const response = await apiService.login(phoneNumber, password);
      
      // Token ve kullanıcı bilgilerini kaydet
      if (response.token) {
        await AsyncStorage.setItem('@auth_token', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
        apiService.setAuthToken(response.token);
        setUser(response.user);
        setToken(response.token);
      }
      
      return response;
    } catch (error) {
      setError(error.response?.data?.message || 'Giriş başarısız');
      throw error;
    }
  };

  // Çıkış yap
  const logout = async () => {
    try {
      setError(null);
      await AsyncStorage.clear();
      setUser(null);
      setToken(null);
      apiService.setAuthToken(null);
    } catch (error) {
      setError(error.message || 'Çıkış yapılırken bir hata oluştu');
      throw error;
    }
  };

  // Kayıt ol
  const register = async (registerData) => {
    try {
      setError(null);
      console.log('📝 Kayıt başlıyor...', { ...registerData, password: '***' });

      // Telefon kontrolü
      console.log('📱 Telefon kontrolü yapılıyor...');
      await checkPhone(registerData.phoneNumber);

      // Email kontrolü
      console.log('📧 Email kontrolü yapılıyor...');
      await checkEmail(registerData.email);

      // Cihaz bilgilerini ekle
      const deviceInfo = await getDeviceInfo();
      const userData = {
        ...registerData,
        deviceInfo
      };

      // Kayıt işlemini gerçekleştir
      const response = await apiService.register(userData);
      
      // Başarılı kayıt sonrası otomatik giriş yap
      if (response.token) {
        await AsyncStorage.setItem('@auth_token', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
        apiService.setAuthToken(response.token);
        setUser(response.user);
        setToken(response.token);
      }

      return response;
    } catch (error) {
      console.error('❌ Kayıt hatası:', error);
      setError(error.response?.data?.message || 'Kayıt işlemi başarısız');
      throw error;
    }
  };

  // Telefon kontrolü
  const checkPhone = async (phoneNumber) => {
    try {
      setError(null);
      const response = await apiService.checkPhone(phoneNumber);
      return response;
    } catch (error) {
      setError(error.response?.data?.message || 'Telefon kontrolü başarısız');
      throw error;
    }
  };

  // Email kontrolü
  const checkEmail = async (email) => {
    try {
      setError(null);
      const response = await apiService.checkEmail(email);
      return response;
    } catch (error) {
      setError(error.response?.data?.message || 'Email kontrolü başarısız');
      throw error;
    }
  };

  // Şifremi unuttum
  const forgotPassword = async (email) => {
    try {
      setError(null);
      const response = await apiService.forgotPassword(email);
      return response;
    } catch (error) {
      setError(error.response?.data?.message || 'Şifre sıfırlama kodu gönderme başarısız');
      throw error;
    }
  };

  // Şifre sıfırla
  const resetPassword = async (email, resetCode, newPassword) => {
    try {
      setError(null);
      const response = await apiService.resetPassword(email, resetCode, newPassword);
      return response;
    } catch (error) {
      setError(error.response?.data?.message || 'Şifre sıfırlama başarısız');
      throw error;
    }
  };

  // Cihaz bilgilerini al
  const getDeviceInfo = async () => {
    try {
      return {
        brand: Device.brand || 'Unknown',
        modelName: Device.modelName || 'Unknown',
        osName: Platform.OS || 'Unknown',
        osVersion: Platform.Version.toString() || 'Unknown',
        deviceId: Device.modelId || Device.deviceName || 'Unknown'
      };
    } catch (error) {
      console.error('Cihaz bilgileri alınamadı:', error);
      return {
        brand: 'Unknown',
        modelName: 'Unknown',
        osName: Platform.OS || 'Unknown',
        osVersion: Platform.Version.toString() || 'Unknown',
        deviceId: 'Unknown'
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    register,
    checkPhone,
    checkEmail,
    forgotPassword,
    resetPassword,
    isAdmin: user?.role === 'admin' || user?.role === 'superadmin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
