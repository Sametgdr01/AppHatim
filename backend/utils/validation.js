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
    const minLength = password.length >= 6;
    
    // En az bir büyük harf
    const hasUpperCase = /[A-Z]/.test(password);
    
    // En az bir küçük harf
    const hasLowerCase = /[a-z]/.test(password);
    
    // En az bir rakam
    const hasNumber = /[0-9]/.test(password);
    
    // En az bir özel karakter
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const isValid = minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    
    let message = '';
    if (!minLength) message += 'Şifre en az 6 karakter olmalıdır. ';
    if (!hasUpperCase) message += 'En az bir büyük harf içermelidir. ';
    if (!hasLowerCase) message += 'En az bir küçük harf içermelidir. ';
    if (!hasNumber) message += 'En az bir rakam içermelidir. ';
    if (!hasSpecialChar) message += 'En az bir özel karakter içermelidir. ';
    
    if (isValid) message = 'Geçerli şifre';

    return {
        isValid,
        message: message.trim()
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
