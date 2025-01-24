const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AppHatim API Dokümantasyonu',
      version: '1.0.0',
      description: 'AppHatim uygulamasının API dokümantasyonu',
      contact: {
        name: 'AppHatim Destek',
        email: 'gudersamet@gmail.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:10000',
        description: 'Geliştirme Sunucusu'
      },
      {
        url: 'https://apphatim.onrender.com',
        description: 'Production Sunucusu'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js'], // routes klasöründeki tüm JS dosyalarını tara
};

const specs = swaggerJsdoc(options);

module.exports = specs;
