const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer yapılandırması
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/profile';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Sadece resim dosyaları yüklenebilir!'));
  }
});

// Profil bilgilerini getir
router.get('/profile', auth, async (req, res) => {
  try {
    console.log('👤 Profil bilgileri getirme isteği');
    console.log('🔑 Auth middleware:', req.user);

    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      console.log('❌ Kullanıcı bulunamadı');
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    console.log('✅ Kullanıcı bulundu:', user);
    res.json(user);
  } catch (error) {
    console.error('❌ Profil bilgileri getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Profil bilgilerini güncelle
router.put('/profile', auth, async (req, res) => {
  try {
    console.log('👤 Profil güncelleme isteği:', req.body);
    console.log('🔑 Auth middleware:', req.user);

    const { firstName, lastName, email, phoneNumber } = req.body;

    // Kullanıcıyı bul
    const user = await User.findById(req.user.userId);
    if (!user) {
      console.log('❌ Kullanıcı bulunamadı');
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    console.log('✅ Kullanıcı bulundu:', user);

    // Profili güncelle
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    await user.save();
    console.log('✅ Profil güncellendi:', user);

    res.json({
      user: {
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email
      }
    });
  } catch (err) {
    console.error('❌ Profil güncelleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Profil fotoğrafı yükleme
router.post('/profile/image', auth, upload.single('file'), async (req, res) => {
  try {
    console.log('📸 Profil fotoğrafı yükleme isteği');
    console.log('🔑 Auth middleware:', req.user);

    if (!req.file) {
      return res.status(400).json({ error: 'Dosya yüklenmedi' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    user.profileImage = req.file.path;
    await user.save();

    res.status(200).json({ profileImage: user.profileImage });
  } catch (error) {
    console.error('❌ Profil fotoğrafı yükleme hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;
