const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Kayıt ol
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, email, password } = req.body;

    // Kullanıcı var mı kontrol et
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    });

    if (existingUser) {
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

    // Token oluştur
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

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
    res.status(500).json({
      error: 'Kayıt sırasında bir hata oluştu',
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
      return res.status(404).json({
        error: 'Kullanıcı bulunamadı'
      });
    }

    // Şifreyi kontrol et
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Hatalı şifre'
      });
    }

    // Token oluştur
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      error: 'Giriş sırasında bir hata oluştu',
      details: error.message
    });
  }
});

module.exports = router;
