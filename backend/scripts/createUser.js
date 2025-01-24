const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// MongoDB bağlantı bilgileri
const password = encodeURIComponent('App@Hatim1071');
const MONGODB_URI = `mongodb+srv://AppHatim:${password}@cluster0.1r6pu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Kullanıcı bilgileri
const userData = {
    firstName: 'Samet',
    lastName: 'Güder',
    email: 'gudersamet2@gmail.com',
    phoneNumber: '5383733459',
    password: 'Test0411'
};

async function createUser() {
    try {
        // MongoDB'ye bağlan
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB bağlantısı başarılı');

        // Şifreyi hashle
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        // Yeni kullanıcı oluştur
        const user = new User({
            ...userData,
            password: hashedPassword,
            createdAt: new Date()
        });

        // Kullanıcıyı kaydet
        await user.save();
        console.log('✅ Kullanıcı başarıyla oluşturuldu:', {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber
        });

    } catch (error) {
        console.error('❌ Hata:', error);
    } finally {
        // Bağlantıyı kapat
        await mongoose.connection.close();
        console.log('📝 MongoDB bağlantısı kapatıldı');
    }
}

// Scripti çalıştır
createUser();
