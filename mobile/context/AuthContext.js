import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

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

  const login = async ({ phoneNumber, password }) => {
    try {
      setError(null);
      const response = await apiService.login(phoneNumber, password);

      if (response.data.token) {
        await AsyncStorage.setItem('@auth_token', response.data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        apiService.setAuthToken(response.data.token);
        setUser(response.data.user);
        setToken(response.data.token);
      }

      return response;
    } catch (error) {
      setError(error.response?.data?.message || 'Giriş başarısız');
      throw error;
    }
  };

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

  const uploadProfilePhoto = async (imageUri) => {
    try {
      const formData = new FormData();
      formData.append('profileImage', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });

      const response = await apiService.uploadProfileImage(formData);
      const updatedUser = { ...user, profileImage: response.data.profileImage };
      setUser(updatedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));

      return response;
    } catch (error) {
      console.error('Profil fotoğrafı yükleme hatası:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    uploadProfilePhoto,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};