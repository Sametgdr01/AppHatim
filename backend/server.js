require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

// JWT Secret key'i tanımla
process.env.JWT_SECRET = process.env.JWT_SECRET || 'apphatim-secret-key-2024';

const app = express();

// Middleware
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// MongoDB bağlantısı
const password = encodeURIComponent('App@Hatim1071');
const MONGO_URI = `mongodb+srv://AppHatim:${password}@cluster0.1r6pu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('MongoDB bağlantısı başarılı');
  
  // Routes
  app.use('/api/auth', authRoutes);

  // Test endpoint'i
  app.get('/api/test', (req, res) => {
    res.json({ message: 'API çalışıyor!' });
  });

  // Error handling
  app.use((err, req, res, next) => {
    console.error('Hata:', err.stack);
    res.status(500).json({ 
      error: 'Bir hata oluştu!', 
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
    });
  });

  // Render.com için port ayarı
  const port = process.env.PORT || 10000;
  const host = '0.0.0.0';
  
  app.listen(port, host, () => {
    console.log(`Server ${port} portunda çalışıyor (${host})`);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('External URL:', process.env.RENDER_EXTERNAL_URL);
    console.log('JWT Secret:', process.env.JWT_SECRET ? 'Ayarlandı' : 'Ayarlanmadı');
  });
})
.catch((err) => {
  console.error('MongoDB bağlantı hatası:', err);
  process.exit(1);
});
