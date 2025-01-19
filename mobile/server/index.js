const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Bağlantısı
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://AppHatim:App@Hatim1071@cluster0.1r6pu.mongodb.net/HatimApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Kullanıcı Modeli
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin', 'superadmin'] },
  profileImage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Kayıt Endpoint'i
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password } = req.body;

    // Kullanıcı var mı kontrol et
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phoneNumber }] 
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Kullanıcı zaten mevcut' });
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yeni kullanıcı oluştur
    const newUser = new User({
      fullName,
      email,
      phoneNumber,
      password: hashedPassword
    });

    await newUser.save();

    // JWT Token oluştur
    const token = jwt.sign(
      { 
        id: newUser._id, 
        email: newUser.email, 
        role: newUser.role 
      }, 
      process.env.JWT_SECRET || 'default_secret', 
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Kullanıcı başarıyla kaydedildi',
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası', details: error.message });
  }
});

// Giriş Endpoint'i
app.post('/api/auth/login', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Kullanıcıyı bul
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(400).json({ error: 'Kullanıcı bulunamadı' });
    }

    // Şifre kontrolü
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Geçersiz şifre' });
    }

    // JWT Token oluştur
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      }, 
      process.env.JWT_SECRET || 'default_secret', 
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Giriş başarılı',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası', details: error.message });
  }
});

// Sunucuyu başlat
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});

module.exports = app;
