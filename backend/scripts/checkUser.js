const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function checkUser() {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 MongoDB\'ye bağlandı');

    // Kullanıcıyı bul
    const user = await User.findOne({
      $or: [
        { phoneNumber: "05383733459" },
        { phoneNumber: "5383733459" },
        { email: "gudersamet@gmail.com" }
      ]
    });

    if (user) {
      console.log('👤 Kullanıcı bulundu:', {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email
      });
    } else {
      console.log('❌ Kullanıcı bulunamadı');
    }

    // Bağlantıyı kapat
    await mongoose.connection.close();
    console.log('📦 MongoDB bağlantısı kapatıldı');
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

checkUser();
