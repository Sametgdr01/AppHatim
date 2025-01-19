const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Kayıt ol
router.post('/register', async (req, res) => {
  try {
    console.log('Kayıt isteği alındı:', req.body);
    const { firstName, lastName, phoneNumber, email, password } = req.body;

    // Validasyon
    if (!firstName || !lastName || !phoneNumber || !email || !password) {
      console.log('Eksik bilgi:', { firstName, lastName, phoneNumber, email, password: '***' });
      return res.status(400).json({
        error: 'Tüm alanları doldurun'
      });
    }

    // Telefon numarası formatı
    if (!/^0?5[0-9]{9}$/.test(phoneNumber)) {
      console.log('Geçersiz telefon numarası:', phoneNumber);
      return res.status(400).json({
        error: 'Geçersiz telefon numarası formatı'
      });
    }

    // Email formatı
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log('Geçersiz email:', email);
      return res.status(400).json({
        error: 'Geçersiz e-posta formatı'
      });
    }

    // Kullanıcı var mı kontrol et
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingUser) {
      console.log('Kullanıcı zaten var:', { email, phoneNumber });
      return res.status(400).json({
        error: 'Bu e-posta veya telefon numarası zaten kayıtlı'
      });
    }

    // Yeni kullanıcı oluştur
    const user = new User({
      firstName,
      lastName,
      phoneNumber,
      email,
      password
    });

    await user.save();
    console.log('Kullanıcı kaydedildi:', { id: user._id, email });

    // Token oluştur
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('Token oluşturuldu');

    res.status(201).json({
      message: 'Kullanıcı başarıyla kaydedildi',
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({
      error: 'Kayıt işlemi başarısız',
      details: error.message
    });
  }
});

// Giriş yap
router.post('/login', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Kullanıcıyı bul
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(401).json({
        error: 'Telefon numarası veya şifre hatalı'
      });
    }

    // Şifreyi kontrol et
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Telefon numarası veya şifre hatalı'
      });
    }

    // Token oluştur
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Giriş başarılı',
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({
      error: 'Giriş işlemi başarısız',
      details: error.message
    });
  }
});

module.exports = router;
