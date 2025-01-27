const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function checkUser() {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB\'ye bağlandı');

    // Test kullanıcısını bul
    const phoneNumber = '5383733459';
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      console.log('❌ Kullanıcı bulunamadı:', phoneNumber);
      return;
    }

    console.log('✅ Kullanıcı bulundu:', {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      password: user.password.substring(0, 10) + '...'
    });

    // Şifre kontrolü
    const testPassword = '123456';
    const isMatch = await bcrypt.compare(testPassword, user.password);
    console.log('🔐 Şifre kontrolü:', {
      testPassword,
      hashedPassword: user.password,
      isMatch
    });

  } catch (error) {
    console.error('❌ Hata:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkUser();
