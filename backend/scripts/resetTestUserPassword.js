require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const resetTestUserPassword = async () => {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB\'ye bağlandı');

    // Test kullanıcısını bul
    const user = await User.findOne({ phoneNumber: '5383733459' });
    if (!user) {
      console.error('❌ Test kullanıcısı bulunamadı');
      return;
    }

    console.log('📝 Mevcut kullanıcı:', {
      id: user._id,
      phoneNumber: user.phoneNumber,
      currentPassword: user.password
    });

    // Yeni şifreyi set et
    const newPassword = 'test123';
    user.password = newPassword;

    // Kaydet (bu işlem pre-save middleware'ini tetikleyecek)
    await user.save();

    // Güncellenmiş kullanıcıyı al
    const updatedUser = await User.findById(user._id);
    console.log('✅ Test kullanıcısının şifresi güncellendi:', {
      phoneNumber: updatedUser.phoneNumber,
      oldPassword: user.password,
      newPassword,
      currentPassword: updatedUser.password
    });

    // Test et
    const isValid = await updatedUser.comparePassword(newPassword);
    console.log('🔍 Şifre testi:', { isValid });

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

resetTestUserPassword();
