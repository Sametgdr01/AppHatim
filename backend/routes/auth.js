const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateEmail, validatePhoneNumber } = require('../utils/validation');
const { sendPasswordResetEmail } = require('../services/emailService');

// Log all registered routes
console.log(' Auth route\'ları yükleniyor...');

// Telefon numarası kontrolü
router.post('/check-phone', async (req, res) => {
  try {
    console.log(' Telefon kontrolü isteği alındı:', req.body);
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      console.log(' Eksik bilgi:', { phoneNumber: !!phoneNumber });
      return res.status(400).json({ 
        message: 'Telefon numarası gerekli',
        details: {
          phoneNumber: !phoneNumber ? 'Telefon numarası gerekli' : null
        }
      });
    }

    // Telefon numarası validasyonu
    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.isValid) {
      console.log(' Telefon numarası geçersiz:', validation.message);
      return res.status(400).json({ 
        message: validation.message,
        details: {
          phoneNumber: validation.message
        }
      });
    }

    // Telefon numarası kontrolü
    const existingUser = await User.findOne({ 
      phoneNumber: { 
        $in: [validation.cleanNumber, `0${validation.cleanNumber}`] 
      }
    });
    console.log(' Telefon kontrolü sonucu:', { exists: !!existingUser });

    if (existingUser) {
      return res.status(409).json({ 
        message: 'Bu telefon numarası zaten kayıtlı',
        details: {
          phoneNumber: 'Bu telefon numarası zaten kayıtlı'
        }
      });
    }

    res.json({ message: 'Telefon numarası kullanılabilir' });

  } catch (error) {
    console.error(' Telefon kontrolü hatası:', error);
    res.status(500).json({ 
      message: 'Telefon kontrolü yapılırken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Email kontrolü
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    console.log(' Email kontrolü isteği alındı:', req.body);
    console.log('📧 Email kontrolü:', email);

    if (!email) {
      console.log(' Eksik bilgi:', { email: !!email });
      return res.status(400).json({ 
        message: 'Email adresi gerekli',
        details: {
          email: !email ? 'Email adresi gerekli' : null
        }
      });
    }

    // Email formatını kontrol et
    if (!email.includes('@')) {
      return res.status(400).json({ message: 'Geçersiz email formatı' });
    }

    // Email validasyonu
    const validation = validateEmail(email);
    if (!validation.isValid) {
      console.log(' Email geçersiz:', validation.message);
      return res.status(400).json({ 
        message: validation.message,
        details: {
          email: validation.message
        }
      });
    }

    // Email'in veritabanında olup olmadığını kontrol et
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Bu email adresi zaten kullanımda' });
    }

    res.json({ message: 'Email adresi kullanılabilir' });
  } catch (error) {
    console.error(' Email kontrolü hatası:', error);
    res.status(500).json({ 
      message: 'Email kontrolü yapılırken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Email kontrolü
router.post('/check-email-format', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('📧 Email kontrolü:', email);

    // Email formatını kontrol et
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Geçersiz email formatı' });
    }

    // Email'in veritabanında olup olmadığını kontrol et
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Bu email adresi zaten kullanımda' });
    }

    res.json({ message: 'Email adresi kullanılabilir' });
  } catch (error) {
    console.error('❌ Email kontrolü hatası:', error);
    res.status(500).json({ message: 'Email kontrolü sırasında bir hata oluştu' });
  }
});

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Register isteği:', { ...req.body, password: '***' });

    const { firstName, lastName, phoneNumber, password } = req.body;

    // Kullanıcının var olup olmadığını kontrol et
    let user = await User.findOne({ phoneNumber });
    if (user) {
      console.log('❌ Kullanıcı zaten var');
      return res.status(400).json({ message: 'Bu telefon numarası zaten kayıtlı' });
    }

    // Yeni kullanıcı oluştur
    user = new User({
      firstName,
      lastName,
      phoneNumber,
      password
    });

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Kullanıcıyı kaydet
    await user.save();
    console.log('✅ Kullanıcı kaydedildi');

    // Token oluştur
    const payload = {
      userId: user.id
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    console.log('✅ Token oluşturuldu');

    res.json({
      token,
      user: {
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email
      }
    });
  } catch (err) {
    console.error('❌ Register hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    console.log('📱 Login isteği:', { ...req.body, password: '***' });

    const { phoneNumber, password } = req.body;

    // Kullanıcıyı bul
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      console.log('❌ Kullanıcı bulunamadı');
      return res.status(400).json({ message: 'Geçersiz telefon numarası veya şifre' });
    }
    console.log('✅ Kullanıcı bulundu:', { ...user.toObject(), password: '$2a$10$FeX...' });

    // Şifreyi karşılaştır
    console.log('🔐 Şifre karşılaştırması başlıyor:', {
      candidatePassword: password,
      hashedPassword: user.password
    });
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('🔐 Karşılaştırma sonucu:', { isMatch });
    if (!isMatch) {
      console.log('❌ Şifre yanlış');
      return res.status(400).json({ message: 'Geçersiz telefon numarası veya şifre' });
    }
    console.log('✅ Şifre doğru');

    // Token oluştur
    const payload = {
      userId: user.id
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    console.log('✅ Token oluşturuldu');

    res.json({
      token,
      user: {
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email
      }
    });
  } catch (err) {
    console.error('❌ Login hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Şifremi unuttum
router.post('/forgot-password', async (req, res) => {
  res.status(503).json({ 
    message: 'Şifremi unuttum özelliği geçici olarak devre dışıdır. Lütfen daha sonra tekrar deneyiniz.',
    status: 'maintenance'
  });
});

// Şifre sıfırlama
router.post('/reset-password', async (req, res) => {
  res.status(503).json({ 
    message: 'Şifre sıfırlama özelliği geçici olarak devre dışıdır. Lütfen daha sonra tekrar deneyiniz.',
    status: 'maintenance'
  });
});

// Log registered routes
console.log(' Kayıtlı route\'lar:');
console.log('POST /api/auth/check-phone - Telefon numarası kontrolü');
console.log('POST /api/auth/check-email - Email kontrolü');
console.log('POST /api/auth/check-email-format - Email formatı kontrolü');
console.log('POST /api/auth/register - Yeni kullanıcı kaydı');
console.log('POST /api/auth/login - Kullanıcı girişi');
console.log('POST /api/auth/forgot-password - Şifre sıfırlama kodu gönder');
console.log('POST /api/auth/reset-password - Şifre sıfırla');

console.log(' Auth route\'ları yüklendi');

module.exports = router;
