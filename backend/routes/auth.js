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

// Kullanıcı kaydı
router.post('/register', async (req, res) => {
  try {
    console.log(' Kayıt isteği alındı:', req.body);
    const { firstName, lastName, phoneNumber, email, password } = req.body;

    // Zorunlu alanları kontrol et
    if (!firstName || !lastName || !phoneNumber || !password) {
      console.log(' Eksik bilgi:', { 
        firstName: !!firstName, 
        lastName: !!lastName, 
        phoneNumber: !!phoneNumber, 
        password: !!password 
      });
      return res.status(400).json({ 
        message: 'Tüm zorunlu alanları doldurun',
        details: {
          firstName: !firstName ? 'İsim gerekli' : null,
          lastName: !lastName ? 'Soyisim gerekli' : null,
          phoneNumber: !phoneNumber ? 'Telefon numarası gerekli' : null,
          password: !password ? 'Şifre gerekli' : null
        }
      });
    }

    // Telefon numarası validasyonu
    const phoneValidation = validatePhoneNumber(phoneNumber);
    if (!phoneValidation.isValid) {
      console.log(' Telefon numarası geçersiz:', phoneValidation.message);
      return res.status(400).json({ 
        message: phoneValidation.message,
        details: {
          phoneNumber: phoneValidation.message
        }
      });
    }

    // Email validasyonu (opsiyonel)
    if (email) {
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        console.log(' Email geçersiz:', emailValidation.message);
        return res.status(400).json({ 
          message: emailValidation.message,
          details: {
            email: emailValidation.message
          }
        });
      }
    }

    // Telefon numarası kontrolü
    const existingPhone = await User.findOne({ 
      phoneNumber: { 
        $in: [phoneValidation.cleanNumber, `0${phoneValidation.cleanNumber}`] 
      }
    });
    console.log(' Telefon kontrolü sonucu:', { exists: !!existingPhone });

    if (existingPhone) {
      return res.status(409).json({ 
        message: 'Bu telefon numarası zaten kayıtlı',
        details: {
          phoneNumber: 'Bu telefon numarası zaten kayıtlı'
        }
      });
    }

    // Email kontrolü (opsiyonel)
    if (email) {
      const existingEmail = await User.findOne({ email });
      console.log(' Email kontrolü sonucu:', { exists: !!existingEmail });

      if (existingEmail) {
        return res.status(409).json({ 
          message: 'Bu email adresi zaten kayıtlı',
          details: {
            email: 'Bu email adresi zaten kayıtlı'
          }
        });
      }
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yeni kullanıcı oluştur
    const user = new User({
      firstName,
      lastName,
      phoneNumber: phoneValidation.cleanNumber,
      email,
      password: hashedPassword
    });

    await user.save();
    console.log(' Kullanıcı kaydedildi:', { userId: user._id });

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Kayıt başarılı',
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email
      }
    });

  } catch (error) {
    console.error(' Kayıt hatası:', error);
    res.status(500).json({ 
      message: 'Kayıt yapılırken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Kullanıcı girişi
router.post('/login', async (req, res) => {
  try {
    console.log('\n🔐 Login isteği alındı:');
    console.log('📱 Request body:', JSON.stringify(req.body, null, 2));
    const { phoneNumber, password } = req.body;

    // Zorunlu alanları kontrol et
    if (!phoneNumber || !password) {
      console.log('❌ Eksik bilgi:', { phoneNumber: !!phoneNumber, password: !!password });
      return res.status(400).json({ 
        message: 'Telefon numarası ve şifre gerekli',
        details: {
          phoneNumber: !phoneNumber ? 'Telefon numarası gerekli' : null,
          password: !password ? 'Şifre gerekli' : null
        }
      });
    }

    // Telefon numarası validasyonu
    const validation = validatePhoneNumber(phoneNumber);
    console.log('📞 Telefon validasyonu:', validation);
    
    if (!validation.isValid) {
      console.log('❌ Telefon numarası geçersiz:', validation.message);
      return res.status(400).json({ 
        message: validation.message,
        details: {
          phoneNumber: validation.message
        }
      });
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ 
      phoneNumber: { 
        $in: [validation.cleanNumber, `0${validation.cleanNumber}`] 
      }
    });
    console.log('🔍 Kullanıcı arama sonucu:', { 
      found: !!user,
      phoneNumber: validation.cleanNumber,
      userPhoneNumber: user?.phoneNumber,
      userPassword: user?.password,
      requestPassword: password
    });

    if (!user) {
      return res.status(401).json({ 
        message: 'Geçersiz telefon numarası veya şifre',
        details: {
          phoneNumber: 'Geçersiz telefon numarası veya şifre'
        }
      });
    }

    // Şifreyi kontrol et
    console.log('🔑 Şifre karşılaştırması yapılıyor:', {
      girilenSifre: password,
      hashliSifre: user.password,
      passwordLength: password.length,
      hashLength: user.password.length,
      passwordType: typeof password,
      hashType: typeof user.password,
      passwordJSON: JSON.stringify(password),
      hashJSON: JSON.stringify(user.password)
    });

    const validPassword = await user.comparePassword(password);
    console.log('🔑 Şifre kontrolü:', { validPassword });

    if (!validPassword) {
      return res.status(401).json({ 
        message: 'Geçersiz telefon numarası veya şifre',
        details: {
          password: 'Geçersiz telefon numarası veya şifre'
        }
      });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    console.log(' Giriş başarılı:', { userId: user._id });

    // Send response
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
    console.error(' Giriş hatası:', error);
    res.status(500).json({ 
      message: 'Giriş yapılırken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Şifre sıfırlama kodu gönder
router.post('/forgot-password', async (req, res) => {
  try {
    console.log(' Şifre sıfırlama kodu gönderme isteği:', req.body);
    const { email } = req.body;

    if (!email) {
      console.log(' Eksik bilgi:', { email: !!email });
      return res.status(400).json({ 
        message: 'Email adresi gerekli',
        details: {
          email: !email ? 'Email adresi gerekli' : null
        }
      });
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

    // Kullanıcıyı bul
    const user = await User.findOne({ email });
    console.log(' Kullanıcı arama sonucu:', { found: !!user });

    if (!user) {
      return res.status(404).json({ 
        message: 'Bu email adresiyle kayıtlı kullanıcı bulunamadı',
        details: {
          email: 'Bu email adresiyle kayıtlı kullanıcı bulunamadı'
        }
      });
    }

    // Sıfırlama kodu oluştur (6 haneli)
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Kodun geçerlilik süresini ayarla (15 dakika)
    const resetCodeExpiry = new Date();
    resetCodeExpiry.setMinutes(resetCodeExpiry.getMinutes() + 15);

    // Kullanıcıya kodu kaydet
    user.resetCode = resetCode;
    user.resetCodeExpiry = resetCodeExpiry;
    await user.save();

    // Email gönder
    console.log(' Sıfırlama kodu:', resetCode);
    try {
      await sendPasswordResetEmail(email, resetCode, user.firstName);
      console.log('✅ Sıfırlama kodu e-postası gönderildi');
    } catch (emailError) {
      console.error('❌ E-posta gönderme hatası:', emailError);
      // E-posta gönderilemese bile işleme devam et
    }

    res.json({ 
      message: 'Şifre sıfırlama kodu email adresinize gönderildi',
      // DEV ortamında kodu göster
      ...(process.env.NODE_ENV === 'development' && { resetCode })
    });

  } catch (error) {
    console.error(' Şifre sıfırlama kodu gönderme hatası:', error);
    res.status(500).json({ 
      message: 'Şifre sıfırlama kodu gönderilirken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Şifre sıfırla
router.post('/reset-password', async (req, res) => {
  try {
    console.log(' Şifre sıfırlama isteği:', req.body);
    const { email, resetCode, newPassword } = req.body;

    if (!email || !resetCode || !newPassword) {
      console.log(' Eksik bilgi:', { email: !!email, resetCode: !!resetCode, newPassword: !!newPassword });
      return res.status(400).json({ 
        message: 'Email, kod ve yeni şifre gerekli',
        details: {
          email: !email ? 'Email gerekli' : null,
          resetCode: !resetCode ? 'Kod gerekli' : null,
          newPassword: !newPassword ? 'Yeni şifre gerekli' : null
        }
      });
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ 
      email,
      resetCode,
      resetCodeExpiry: { $gt: new Date() }
    });

    console.log(' Kullanıcı arama sonucu:', { found: !!user });

    if (!user) {
      return res.status(400).json({ 
        message: 'Geçersiz veya süresi dolmuş kod',
        details: {
          resetCode: 'Geçersiz veya süresi dolmuş kod'
        }
      });
    }

    // Yeni şifre güvenliğini kontrol et
    if (newPassword.length < 8) {
      console.log(' Yeni şifre geçersiz:', 'Şifre en az 8 karakter uzunluğunda olmalıdır');
      return res.status(400).json({ 
        message: 'Şifre en az 8 karakter uzunluğunda olmalıdır',
        details: {
          newPassword: 'Şifre en az 8 karakter uzunluğunda olmalıdır'
        }
      });
    }

    // Yeni şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Şifreyi güncelle ve reset kodunu temizle
    user.password = hashedPassword;
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;
    await user.save();

    console.log(' Şifre değiştirildi:', { userId: user._id });

    res.json({ message: 'Şifreniz başarıyla güncellendi' });

  } catch (error) {
    console.error(' Şifre sıfırlama hatası:', error);
    res.status(500).json({ 
      message: 'Şifre sıfırlanırken bir hata oluştu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
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
