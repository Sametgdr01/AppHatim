const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'İsim zorunludur']
  },
  lastName: {
    type: String,
    required: [true, 'Soyisim zorunludur']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Telefon numarası zorunludur'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^0?5[0-9]{9}$/.test(v);
      },
      message: 'Geçersiz telefon numarası formatı'
    }
  },
  email: {
    type: String,
    required: [true, 'E-posta zorunludur'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Geçersiz e-posta formatı'
    }
  },
  password: {
    type: String,
    required: [true, 'Şifre zorunludur'],
    minlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Şifre hashleme middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
