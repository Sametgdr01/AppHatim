const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const net = require('net');
const os = require('os');

// Environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = parseInt(process.env.PORT || '11000');

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set');
  process.exit(1);
}

// Get local IP addresses
const getLocalIPs = () => {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const k in interfaces) {
    for (const k2 in interfaces[k]) {
      const address = interfaces[k][k2];
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address);
      }
    }
  }
  return addresses;
};

// Express app
const app = express();

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`\n📝 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('📨 Headers:', req.headers);
  console.log('📍 Client IP:', req.ip);
  next();
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    port: PORT,
    localIPs: getLocalIPs()
  });
});

// MongoDB connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: false,
  useUnifiedTopology: false
})
.then(() => {
  console.log('✅ MongoDB bağlantısı başarılı');
  
  // Start server
  const server = app.listen(PORT, '0.0.0.0', () => {
    const localIPs = getLocalIPs();
    console.log(`\n🚀 Server ${PORT} adresinde çalışıyor`);
    console.log(`   API URL: http://localhost:${PORT}`);
    console.log(`   API URL (Emulator): http://10.0.2.2:${PORT}`);
    console.log('\n🌐 Local IPs:');
    localIPs.forEach(ip => {
      console.log(`   - http://${ip}:${PORT}`);
    });
  });

  // Hata yakalama
  server.on('error', (error) => {
    console.error('❌ Sunucu hatası:', error);
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} zaten kullanımda`);
    }
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('⚠️ SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('✅ Server closed');
      mongoose.connection.close(false, () => {
        console.log('✅ MongoDB connection closed');
        process.exit(0);
      });
    });
  });
})
.catch((err) => {
  console.error('❌ MongoDB bağlantı hatası:', err);
  process.exit(1);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Sunucu hatası:', {
    message: err.message,
    stack: err.stack
  });
  
  res.status(500).json({ 
    error: 'Sunucu hatası',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Bir hata oluştu'
  });
});
