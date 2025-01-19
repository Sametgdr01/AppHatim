import { MOBILE_NETWORK_CONFIG } from '../config/config';

// İstek sıkıştırma
export const compressRequest = (data) => {
  try {
    // Gereksiz alanları kaldır
    const compressedData = JSON.parse(JSON.stringify(data, (key, value) => {
      // Boş veya null değerleri çıkar
      if (value === null || value === undefined || value === '') return undefined;
      return value;
    }));

    return compressedData;
  } catch (error) {
    console.warn('İstek sıkıştırma hatası:', error);
    return data;
  }
};

// Payload minimize etme
export const minimizePayload = (data) => {
  try {
    // Veri boyutunu sınırla
    const dataSize = new Blob([JSON.stringify(data)]).size / (1024 * 1024); // MB cinsinden
    
    if (dataSize > MOBILE_NETWORK_CONFIG.DATA_OPTIMIZATION.CACHE_STRATEGIES.MAX_CACHE_SIZE) {
      console.warn(`Payload boyutu sınırı aşıyor: ${dataSize.toFixed(2)} MB`);
      
      // Payload boyutunu azaltmak için alan seçimi
      const minimizedData = {};
      const priorityFields = ['id', 'name', 'email', 'type'];
      
      priorityFields.forEach(field => {
        if (data[field] !== undefined) {
          minimizedData[field] = data[field];
        }
      });

      return minimizedData;
    }

    return data;
  } catch (error) {
    console.warn('Payload minimize etme hatası:', error);
    return data;
  }
};

// Önbellek yönetimi
export const cacheManager = {
  cache: new Map(),
  
  set(key, value, ttl = MOBILE_NETWORK_CONFIG.DATA_OPTIMIZATION.CACHE_STRATEGIES.TTL) {
    if (!MOBILE_NETWORK_CONFIG.DATA_OPTIMIZATION.CACHE_STRATEGIES.ENABLED) return;
    
    const item = {
      value,
      expiry: Date.now() + ttl
    };
    
    this.cache.set(key, item);
  },
  
  get(key) {
    if (!MOBILE_NETWORK_CONFIG.DATA_OPTIMIZATION.CACHE_STRATEGIES.ENABLED) return null;
    
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  },
  
  clear() {
    this.cache.clear();
  }
};
