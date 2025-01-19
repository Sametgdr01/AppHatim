import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/config';

class UserModel {
  static async findByEmail(email) {
    try {
      const response = await axios.get(`${API_URL}/users/email/${email}`);
      return response.data;
    } catch (error) {
      throw new Error('Kullanıcı bulunamadı');
    }
  }

  static async createWithToken(userData, token) {
    try {
      const response = await axios.post(`${API_URL}/users`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await AsyncStorage.setItem('userToken', token);
      return response.data;
    } catch (error) {
      throw new Error('Kullanıcı oluşturulamadı');
    }
  }

  static async updateProfile(userId, updateData) {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.put(`${API_URL}/users/${userId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw new Error('Profil güncellenemedi');
    }
  }

  static async updateNotificationPreferences(userId, preferences) {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.put(
        `${API_URL}/users/${userId}/notifications`,
        preferences,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Bildirim tercihleri güncellenemedi');
    }
  }

  static async getCurrentUser() {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return null;

      const response = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      await AsyncStorage.removeItem('userToken');
      return null;
    }
  }

  static async logout() {
    try {
      await AsyncStorage.removeItem('userToken');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  }
}

export default UserModel;
