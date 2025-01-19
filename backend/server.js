require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB bağlantısı
const password = encodeURIComponent('App@Hatim1071');
const MONGO_URI = `mongodb+srv://AppHatim:${password}@cluster0.1r6pu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(MONGO_URI)
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
      res.status(500).json({ error: 'Bir hata oluştu!', details: err.message });
    });

    // Render.com için port ayarı
    const port = process.env.PORT || 10000;
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
    
    app.listen(port, host, () => {
      console.log(`Server ${port} portunda çalışıyor (${host})`);
      console.log('Environment:', process.env.NODE_ENV);
      console.log('External URL:', process.env.RENDER_EXTERNAL_URL);
    });
  })
  .catch(err => {
    console.error('MongoDB bağlantı hatası:', err);
    process.exit(1);
  });
