const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function deleteUsers() {
  try {
    // MongoDB'ye bağlan
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 MongoDB\'ye bağlandı');

    // Kullanıcıları sil
    const result = await User.deleteMany({
      $or: [
        { phoneNumber: "05383733459" },
        { email: "gudersamet@gmail.com" }
      ]
    });

    console.log(`🗑️ ${result.deletedCount} kullanıcı silindi`);

    // Bağlantıyı kapat
    await mongoose.connection.close();
    console.log('📦 MongoDB bağlantısı kapatıldı');
    process.exit(0);
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

deleteUsers();
