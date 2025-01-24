import { Platform } from 'react-native';

// Offline ve Ağ Kesintisi Yapılandırması
export const OFFLINE_MODE_CONFIG = {
  ENABLED: false,
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 saat
  MAX_CACHE_SIZE: 50 * 1024 * 1024 // 50MB
};

// API Yapılandırması
export const API_CONFIG = {
  BASE_URL: __DEV__ 
    ? Platform.select({
        android: 'http://192.168.1.3:11000',
        ios: 'http://localhost:11000',
        default: 'http://localhost:11000'
      })
    : 'https://apphatim.onrender.com',
  TIMEOUT: 30000, // 30 saniye
  HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  RETRY: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    RETRY_STATUS_CODES: [408, 500, 502, 503, 504]
  }
};

// Hata Yönetimi Yapılandırması
export const ERROR_HANDLING_CONFIG = {
  DEFAULT_ERROR_MESSAGE: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
  NETWORK_ERROR_MESSAGE: 'İnternet bağlantınızı kontrol edip tekrar deneyin.',
  TIMEOUT_ERROR_MESSAGE: 'Sunucu yanıt vermiyor. Lütfen daha sonra tekrar deneyin.',
  SERVER_ERROR_MESSAGE: 'Sunucu kaynaklı bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
  AUTH_ERROR_MESSAGE: 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
  NETWORK_ERROR: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 2000,
    SHOW_ERROR: true,
    USE_FALLBACK: true
  },
  API_ERROR: {
    RETRY_ON_STATUS: [408, 429, 500, 502, 503, 504],
    SHOW_ERROR: true,
    LOG_DETAILS: true
  },
  AUTH_ERROR: {
    AUTO_LOGOUT: true,
    REDIRECT_TO_LOGIN: true,
    CLEAR_CACHE: true
  }
};

// Uygulama Yapılandırması
export const APP_CONFIG = {
  APP_NAME: 'AppHatim',
  APP_VERSION: '1.0.0',
  APP_BUNDLE_ID: 'com.apphatim',
  APP_STORE_URL: 'https://play.google.com/store/apps/details?id=com.apphatim',
  PRIVACY_POLICY_URL: 'https://apphatim.com/privacy',
  TERMS_URL: 'https://apphatim.com/terms',
  SUPPORT_EMAIL: 'support@apphatim.com',
  SUPPORT_PHONE: '+90 538 373 34 59',
  SUPPORT_WEBSITE: 'https://apphatim.com',
  SOCIAL_MEDIA: {
    FACEBOOK: 'https://facebook.com/apphatim',
    TWITTER: 'https://twitter.com/apphatim',
    INSTAGRAM: 'https://instagram.com/apphatim'
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
