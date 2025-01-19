import { Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/config';

class ApiAdapter {
  static instance = null;

  constructor() {
    if (ApiAdapter.instance) {
      return ApiAdapter.instance;
    }
    ApiAdapter.instance = this;
    
    // Axios interceptor'ları ayarla
    this.setupAxiosInterceptors();
  }

  setupAxiosInterceptors() {
    // Request interceptor
    axios.interceptors.request.use(
      async (config) => {
        // İnternet bağlantısı kontrolü
        const netState = await NetInfo.fetch();
        if (!netState.isConnected) {
          throw new Error('İnternet bağlantısı yok');
        }

        // Token'ı ekle
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

    // Response interceptor
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token geçersiz, çıkış yap
          await AsyncStorage.removeItem('userToken');
        }
        return Promise.reject(error);
      }
    );
  }

  async get(endpoint) {
    try {
      const response = await axios.get(`${API_URL}${endpoint}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post(endpoint, data) {
    try {
      const response = await axios.post(`${API_URL}${endpoint}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put(endpoint, data) {
    try {
      const response = await axios.put(`${API_URL}${endpoint}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(endpoint) {
    try {
      const response = await axios.delete(`${API_URL}${endpoint}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error) {
    if (!error.response) {
      throw new Error('Sunucuya bağlanılamıyor');
    }

    switch (error.response.status) {
      case 400:
        throw new Error('Geçersiz istek');
      case 401:
        throw new Error('Oturum süresi doldu');
      case 403:
        throw new Error('Yetkisiz erişim');
      case 404:
        throw new Error('Kaynak bulunamadı');
      case 500:
        throw new Error('Sunucu hatası');
      default:
        throw new Error('Bir hata oluştu');
    }
  }
}

export default new ApiAdapter();
