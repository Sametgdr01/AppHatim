require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createTestUser = async () => {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB\'ye bağlandı');

    // Test kullanıcı bilgileri
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      phoneNumber: '5383733459',
      email: 'test@example.com',
      password: 'test123'
    };

    // Telefon numarasını kontrol et ve varsa sil
    await User.deleteOne({ phoneNumber: testUser.phoneNumber });
    console.log('🗑️ Eski test kullanıcısı silindi (varsa)');

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testUser.password, salt);

    // Yeni kullanıcı oluştur
    const user = new User({
      ...testUser,
      password: hashedPassword
    });

    // Kullanıcıyı kaydet
    await user.save();
    console.log('✅ Test kullanıcısı oluşturuldu:', {
      ...testUser,
      password: '***'
    });
  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createTestUser();
