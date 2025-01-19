require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
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

    const PORT = process.env.PORT || 10000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server ${PORT} portunda çalışıyor`);
    });
  })
  .catch(err => {
    console.error('MongoDB bağlantı hatası:', err);
    process.exit(1);
  });
