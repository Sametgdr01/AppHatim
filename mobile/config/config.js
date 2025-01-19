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

// Sunucu ve Ağ Yapılandırması
export const SERVER_CONFIG = {
  // Ana sunucu adresi
  PRIMARY_SERVERS: [
    {
      URL: 'https://apphatim.onrender.com/api',
      NAME: 'Production Server',
      PRIORITY: 1
    }
  ],

  // Sunucu bağlantı parametreleri
  CONNECTION: {
    TIMEOUT_MS: 30000,     // 30 saniye timeout
    MAX_RETRIES: 5,        // 5 kez deneme
    RETRY_DELAY_MS: 5000,  // 5 saniye bekleme
    
    STRATEGY: {
      PREFER_CLOUD: true,
      FALLBACK_ON_FAILURE: true,
      DYNAMIC_SERVER_SELECTION: false
    }
  },

  // Hata yönetimi
  ERROR_HANDLING: {
    DETAILED_LOGGING: true,
    RETRY_ON_FAILURE: true,
    NOTIFY_USER_ON_PERSISTENT_ERRORS: true,
    MAX_ERROR_NOTIFICATIONS: 3
  }
};

// Sunucu seçimi için fonksiyon
export const selectServerUrl = () => {
  const serverUrl = SERVER_CONFIG.PRIMARY_SERVERS[0].URL;
  console.log('🌐 Seçilen Sunucu Adresi:', serverUrl);
  return serverUrl;
};

export const BASE_URL = selectServerUrl();

// API yapılandırması
export const API_CONFIG = {
  // Temel API ayarları
  BASE_URL: BASE_URL,
  VERSION: 'v1',
  TIMEOUT: SERVER_CONFIG.CONNECTION.TIMEOUT_MS,

  // İstek başlıkları
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Version': '1.0.0',
  },

  // İstek limitleri
  RATE_LIMIT: {
    MAX_REQUESTS_PER_MINUTE: 60,
    BURST_LIMIT: 10
  },

  // Yeniden deneme stratejisi
  RETRY_STRATEGY: {
    MAX_RETRIES: SERVER_CONFIG.CONNECTION.MAX_RETRIES,
    BACKOFF_FACTOR: 2,
    INITIAL_DELAY_MS: SERVER_CONFIG.CONNECTION.RETRY_DELAY_MS
  }
};

// Ağ yapılandırması
export const NETWORK_CONFIG = {
  API_TIMEOUT: SERVER_CONFIG.CONNECTION.TIMEOUT_MS,
  RETRY_COUNT: SERVER_CONFIG.CONNECTION.MAX_RETRIES,
  RETRY_DELAY: SERVER_CONFIG.CONNECTION.RETRY_DELAY_MS,
  
  FALLBACK_SERVERS: SERVER_CONFIG.PRIMARY_SERVERS.map(server => server.URL),

  // Bağlantı durumu kontrolleri
  CONNECTION_CHECK: {
    ENABLED: true,
    INTERVAL_MS: 10000,
    TIMEOUT_MS: 5000
  }
};

// Hata yönetimi yapılandırması
export const ERROR_HANDLING = {
  NETWORK_ERROR_RETRY: SERVER_CONFIG.CONNECTION.STRATEGY.FALLBACK_ON_FAILURE,
  MAX_NETWORK_RETRIES: SERVER_CONFIG.CONNECTION.MAX_RETRIES,
  FALLBACK_ON_ERROR: SERVER_CONFIG.CONNECTION.STRATEGY.FALLBACK_ON_FAILURE,
  
  ALERT_TYPES: {
    NETWORK_ERROR: 'Ağ Bağlantısı Hatası',
    SERVER_ERROR: 'Sunucu Hatası',
    TIMEOUT_ERROR: 'Zaman Aşımı Hatası',
    AUTH_ERROR: 'Kimlik Doğrulama Hatası'
  },
  
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'İnternet bağlantınızı kontrol edin',
    SERVER_ERROR: 'Sunucu şu anda hizmet veremiyor',
    TIMEOUT_ERROR: 'İstek zaman aşımına uğradı',
    AUTH_ERROR: 'Oturum süreniz doldu'
  }
};

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
