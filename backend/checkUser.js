const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const password = encodeURIComponent('App@Hatim1071');
const MONGO_URI = `mongodb+srv://AppHatim:${password}@cluster0.1r6pu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB bağlantısı başarılı');
    
    // Kullanıcıyı bul ve sil
    const result = await User.deleteOne({ phoneNumber: '5383733459' });
    
    if (result.deletedCount > 0) {
      console.log('✅ Kullanıcı başarıyla silindi');
    } else {
      console.log('❌ Kullanıcı bulunamadı');
    }
    
    process.exit();
  })
  .catch(err => {
    console.error('Hata:', err);
    process.exit(1);
  });
