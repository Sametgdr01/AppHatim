// Offline ve Ağ Kesintisi Yapılandırması
export const OFFLINE_MODE_CONFIG = {
  // Offline mod ayarları
  ENABLED: true,
  CACHE_DURATION: {
    PROFILE_DATA: 24 * 60 * 60 * 1000, // 24 saat
    LESSON_DATA: 12 * 60 * 60 * 1000,  // 12 saat
    GENERAL_DATA: 6 * 60 * 60 * 1000   // 6 saat
  },

  // Offline veri stratejisi
  DATA_STRATEGY: {
    PRIORITIZE_CACHED_DATA: true,
    AUTO_SYNC_ON_RECONNECT: true,
    MAX_RETRY_SYNC_COUNT: 3
  },

  // Offline uyarı ve bilgilendirme
  NOTIFICATIONS: {
    SHOW_OFFLINE_BANNER: true,
    OFFLINE_MESSAGE: 'Şu anda çevrimdışı moddasınız. Bazı özellikler sınırlı olabilir.',
    RECONNECT_MESSAGE: 'İnternet bağlantınız yeniden kuruldu.'
  },

  // Offline işlem sınırlamaları
  FEATURE_RESTRICTIONS: {
    PROFILE_EDIT: false,
    UPLOAD_CONTENT: false,
    REAL_TIME_FEATURES: false
  }
};

// API Yapılandırması
export const API_CONFIG = {
  BASE_URL: 'https://apphatim.onrender.com/api',  // Render.com URL without port
  TIMEOUT: 30000, // 30 saniye
  RETRY_COUNT: 3,
  RETRY_DELAY: 2000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Sunucu ve Ağ Yapılandırması
export const SERVER_CONFIG = {
  // Ana sunucu adresleri
  PRIMARY_SERVERS: [
    {
      URL: 'https://apphatim.onrender.com/api', // Render.com URL without port
      NAME: 'Production Server',
      PRIORITY: 1,
      TIMEOUT_MS: 5000,
      RETRY_COUNT: 3
    }
  ],

  // Sunucu bağlantı parametreleri
  CONNECTION: {
    TIMEOUT_MS: 5000,  // Global timeout
    MAX_RETRIES: 3,    
    RETRY_DELAY_MS: 2000, 
    
    STRATEGY: {
      PREFER_CLOUD: true,
      FALLBACK_ON_FAILURE: true,
      DYNAMIC_SERVER_SELECTION: true
    }
  },

  // Offline mod desteği
  OFFLINE_SUPPORT: {
    ENABLED: true,
    FALLBACK_STRATEGIES: [
      'use_cached_data',
      'show_offline_message',
      'queue_operations'
    ]
  },

  // Hata yönetimi
  ERROR_HANDLING: {
    DETAILED_LOGGING: true,
    RETRY_ON_FAILURE: true,
    NOTIFY_USER_ON_PERSISTENT_ERRORS: true,
    MAX_ERROR_NOTIFICATIONS: 3
  }
};

// Sunucu seçimi için gelişmiş fonksiyon
export const selectServerUrl = () => {
  const manualServerUrl = 
    process.env.MANUAL_SERVER_URL || 
    process.env.REACT_NATIVE_SERVER_URL || 
    SERVER_CONFIG.PRIMARY_SERVERS[0].URL;
  
  console.log('🌐 Seçilen Sunucu Adresi:', manualServerUrl);
  
  return manualServerUrl;
};

export const BASE_URL = selectServerUrl();
export const API_TIMEOUT = 10000; // 10 saniye timeout

// MongoDB Bağlantı Yapılandırması
export const MONGO_CONNECTION = {
  uri: 'mongodb://atlas-sql-6788fad8ad010637ed3262c2-1r6pu.a.query.mongodb.net/HatimApp?ssl=true&authSource=admin',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true,
    retryWrites: true,
    w: 'majority'
  }
};

export const MOBILE_NETWORK_CONFIG = {
  CELLULAR: {
    PREFERRED_GENERATIONS: ['4g', '5g'],
    MAX_EXPENSIVE_CONNECTION_DURATION: 300000,
    DATA_SAVING_THRESHOLD_MB: 50,
  },

  QUALITY_METRICS: {
    GOOD_SIGNAL_STRENGTH: -70,
    ACCEPTABLE_SIGNAL_STRENGTH: -85,
    LATENCY_THRESHOLD_MS: 150,
  },

  PERFORMANCE_ALERTS: {
    SLOW_CONNECTION_THRESHOLD_MS: 2000,
    HIGH_LATENCY_ALERT: true,
    EXPENSIVE_CONNECTION_ALERT: true
  },

  DATA_OPTIMIZATION: {
    COMPRESS_REQUESTS: true,
    MINIMIZE_PAYLOAD: true,
    CACHE_STRATEGIES: {
      ENABLED: true,
      TTL: 300000,
      MAX_CACHE_SIZE: 50
    }
  }
};

export const NETWORK_CONFIG = {
  API_TIMEOUT: SERVER_CONFIG.CONNECTION.TIMEOUT_MS,
  RETRY_COUNT: SERVER_CONFIG.CONNECTION.MAX_RETRIES,
  RETRY_DELAY: SERVER_CONFIG.CONNECTION.RETRY_DELAY_MS,
  
  FALLBACK_SERVERS: SERVER_CONFIG.PRIMARY_SERVERS.map(server => server.URL),

  PING_SOURCES: [
    'https://api.ipify.org?format=json',
    'https://ip.seeip.org/jsonip',
    'https://httpbin.org/ip'
  ],
  
  PERFORMANCE_TRACKING: {
    enabled: true,
    logThresholdMS: 2000,
    slowRequestAlert: true
  },

  OFFLINE_HANDLING: {
    DETECT_OFFLINE: true,
    RETRY_INTERVAL_MS: 5000,
    MAX_OFFLINE_DURATION_MS: 30 * 60 * 1000 // 30 dakika
  }
};

export const ERROR_HANDLING = {
  NETWORK_ERROR_RETRY: SERVER_CONFIG.CONNECTION.STRATEGY.FALLBACK_ON_FAILURE,
  MAX_NETWORK_RETRIES: SERVER_CONFIG.CONNECTION.MAX_RETRIES,
  FALLBACK_ON_ERROR: SERVER_CONFIG.CONNECTION.STRATEGY.FALLBACK_ON_FAILURE,
  
  ALERT_TYPES: {
    NETWORK_ERROR: 'Ağ Bağlantısı Hatası',
    SERVER_ERROR: 'Sunucu Hatası',
    TIMEOUT_ERROR: 'Zaman Aşımı Hatası'
  }
};
