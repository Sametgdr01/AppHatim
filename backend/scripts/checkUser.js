require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const checkUser = async (phoneNumber) => {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB\'ye bağlandı');

    // Kullanıcıyı bul
    const user = await User.findOne({ phoneNumber });
    
    if (!user) {
      console.log('❌ Kullanıcı bulunamadı');
      return;
    }

    // Kullanıcı bilgilerini göster (şifre hariç)
    console.log('✅ Kullanıcı bulundu:', {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      password: user.password // Hash'lenmiş şifreyi göster
    });

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Komut satırı argümanını al
const phoneNumber = process.argv[2];

if (!phoneNumber) {
  console.error('❌ Telefon numarası gerekli');
  process.exit(1);
}

checkUser(phoneNumber);
