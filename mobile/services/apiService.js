import axios from 'axios';
import { API_BASE_URL } from '@env';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const login = (phoneNumber, password) => {
  return api.post('/api/auth/login', { phoneNumber, password });
};

export const updateProfile = (profileData) => {
  return api.put('/api/user/profile', profileData);
};

export const uploadProfileImage = (formData) => {
  return api.post('/api/user/profile/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Hatim İşlemleri
export const fetchHatimList = () => {
  return api.get('/api/hatim/list');
};

export const fetchGroupHatimDetails = (groupId) => {
  return api.get(`/api/hatim/groups/${groupId}`);
};

export const createHatimGroup = (groupData) => {
  return api.post('/api/hatim/groups', groupData);
};

export const joinHatimGroup = (groupId) => {
  return api.post(`/api/hatim/groups/${groupId}/join`);
};

export const saveHatimProgress = (progressData) => {
  return api.post('/api/hatim/progress', progressData);
};

export const markJuzAsCompleted = async (juzId) => {
  try {
    const response = await api.post(`/api/hatim/juz/complete/${juzId}`);
    return response.data;
  } catch (error) {
    console.error('Cüz tamamlama hatası:', error);
    throw error;
  }
};

export const fetchJuzDetails = async (juzId) => {
  try {
    const response = await api.get(`/api/hatim/juz/${juzId}`);
    return response.data;
  } catch (error) {
    console.error('Cüz detayları çekilirken hata:', error);
    throw error;
  }
};

// Etkinlik İşlemleri
export const fetchSpecialEvents = () => {
  return api.get('/api/events/special');
};

export const fetchEventDetails = (eventId) => {
  return api.get(`/api/events/${eventId}`);
};

export const registerForEvent = (eventId) => {
  return api.post(`/api/events/${eventId}/register`);
};

// Kullanıcı İşlemleri
export const fetchUserProfile = (userId) => {
  return api.get(`/api/users/${userId}/profile`);
};

export const fetchUserHatimGroups = (userId) => {
  return api.get(`/api/users/${userId}/hatim-groups`);
};

// Bildirim İşlemleri
export const fetchNotifications = () => {
  return api.get('/api/notifications');
};

export const markNotificationAsRead = (notificationId) => {
  return api.put(`/api/notifications/${notificationId}/read`);
};

export const savePushToken = (token) => {
  return api.post('/api/notifications/token', { token });
};

// Hata yakalama interceptor'ı
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Çağrısı Hatası:', error.response ? error.response.data : error.message);
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.warn('Oturumunuzun süresi doldu');
          break;
        case 403:
          console.warn('Bu işlemi gerçekleştirme yetkiniz yok');
          break;
        case 500:
          console.error('Sunucu hatası oluştu');
          break;
        case 404:
          console.error('Kaynak bulunamadı');
          break;
      }
    }
    
    return Promise.reject(error);
  }
);

export default {
  api,
  setAuthToken,
  login,
  updateProfile,
  uploadProfileImage,
  fetchHatimList,
  fetchGroupHatimDetails,
  createHatimGroup,
  joinHatimGroup,
  saveHatimProgress,
  markJuzAsCompleted,
  fetchJuzDetails,
  fetchSpecialEvents,
  fetchEventDetails,
  registerForEvent,
  fetchUserProfile,
  fetchUserHatimGroups,
  fetchNotifications,
  markNotificationAsRead,
  savePushToken,
};