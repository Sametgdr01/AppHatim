// API yapılandırması
const config = {
    development: {
        apiUrl: 'http://192.168.1.3:11000',
        timeout: 10000, // 10 saniye
        retryCount: 3,
        retryDelay: 1000, // 1 saniye
    },
    production: {
        apiUrl: 'https://apphatim.onrender.com',
        timeout: 30000, // 30 saniye
        retryCount: 3,
        retryDelay: 2000, // 2 saniye
    }
};

// Ortam seçimi
const env = __DEV__ ? 'development' : 'production';
console.log('🌍 Ortam:', env);

// Seçili ortamın yapılandırmasını dışa aktar
module.exports = config[env];
