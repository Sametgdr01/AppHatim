// Telefon numarası validasyonu
const validatePhoneNumber = (phoneNumber) => {
    // Boşlukları ve özel karakterleri kaldır
    const cleanNumber = phoneNumber.replace(/\D/g, '');

    // Türkiye telefon numarası formatı kontrolü:
    // 1. 10 haneli olmalı (başında 0 olmadan)
    // 2. 5 ile başlamalı
    const isValid = /^5[0-9]{9}$/.test(cleanNumber);

    return {
        isValid,
        cleanNumber,
        message: isValid ? 'Geçerli telefon numarası' : 'Geçersiz telefon numarası formatı'
    };
};

// Email validasyonu
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    return {
        isValid,
        message: isValid ? 'Geçerli email adresi' : 'Geçersiz email formatı'
    };
};

// Şifre validasyonu
const validatePassword = (password) => {
    // En az 6 karakter
    const isValid = password.length >= 6;
    
    return {
        isValid,
        message: isValid ? 'Geçerli şifre' : 'Şifre en az 6 karakter olmalıdır'
    };
};

// Ad ve soyad validasyonu
const validateName = (name) => {
    // En az 2 karakter, sadece harf ve boşluk
    const isValid = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]{2,}$/.test(name);

    return {
        isValid,
        message: isValid ? 'Geçerli isim' : 'İsim en az 2 karakter olmalı ve sadece harf içermelidir'
    };
};

module.exports = {
    validatePhoneNumber,
    validateEmail,
    validatePassword,
    validateName
};
