const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function createTestUser() {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB\'ye bağlandı');

    // Test kullanıcı bilgileri
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      phoneNumber: '5383733459',
      email: 'test@example.com',
      password: '123456'
    };

    // Telefon numarasını kontrol et ve varsa sil
    const existingUser = await User.findOne({ phoneNumber: testUser.phoneNumber });
    if (existingUser) {
      console.log('🗑️ Eski test kullanıcısı silindi (varsa)');
      await User.deleteOne({ phoneNumber: testUser.phoneNumber });
    }

    // Yeni kullanıcı oluştur
    const user = new User(testUser);

    // Kullanıcıyı kaydet
    await user.save();

    // Test amaçlı şifre kontrolü
    const isMatch = await user.comparePassword(testUser.password);
    console.log('🔐 Şifre kontrolü:', { isMatch });

    console.log('✅ Test kullanıcısı oluşturuldu:', {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      password: '***'
    });

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createTestUser();
