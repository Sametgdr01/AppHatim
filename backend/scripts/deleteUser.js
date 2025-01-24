const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function deleteUser() {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 MongoDB\'ye bağlandı');

    // Kullanıcıyı sil
    const result = await User.deleteOne({
      $or: [
        { phoneNumber: "05383733459" },
        { phoneNumber: "5383733459" },
        { email: "gudersamet@gmail.com" }
      ]
    });

    console.log('🗑️ Silme sonucu:', result);

    // Bağlantıyı kapat
    await mongoose.connection.close();
    console.log('📦 MongoDB bağlantısı kapatıldı');
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

deleteUser();
