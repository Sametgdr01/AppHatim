const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'İsim gerekli'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Soyisim gerekli'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Telefon numarası gerekli'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^0?5[0-9]{9}$/.test(v);
      },
      message: 'Geçersiz telefon numarası formatı'
    }
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Geçersiz e-posta formatı'
    }
  },
  password: {
    type: String,
    required: [true, 'Şifre gerekli'],
    minlength: 6
  },
  profileImage: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user'
  },
  deviceInfo: {
    brand: String,
    modelName: String,
    osName: String,
    osVersion: String,
    deviceId: String
  },
  resetPasswordCode: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Kaydetmeden önce şifreyi hash'le
userSchema.pre('save', async function(next) {
  try {
    // Şifre değişmediyse hash'leme
    if (!this.isModified('password')) {
      return next();
    }

    console.log('🔐 Şifre hash\'leniyor:', {
      password: this.password,
      isNew: this.isNew,
      isModified: this.isModified('password')
    });

    // Şifreyi hash'le
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    
    // Hash'lenmiş şifreyi kaydet
    this.password = hashedPassword;
    
    console.log('✅ Şifre hash\'lendi');
    next();
  } catch (error) {
    console.error('❌ Şifre hash\'leme hatası:', error);
    next(error);
  }
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('🔐 Şifre karşılaştırması başlıyor:', {
      candidatePassword,
      hashedPassword: this.password
    });

    // Direkt bcrypt.compare kullan
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('🔐 Karşılaştırma sonucu:', { isMatch });
    return isMatch;
  } catch (error) {
    console.error('❌ Şifre karşılaştırma hatası:', error);
    return false;
  }
};

module.exports = mongoose.model('User', userSchema);
