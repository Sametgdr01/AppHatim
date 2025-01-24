/**
 * Telefon numarasını formatlar
 * @param {string} phone - Formatlanacak telefon numarası
 * @returns {string} - Formatlanmış telefon numarası (5XXXXXXXXX)
 */
export const formatPhoneNumber = (phone) => {
  try {
    // Tüm boşluk ve özel karakterleri kaldır
    let cleanedPhone = phone.replace(/\D/g, '');
    
    // Başındaki 0'ı kaldır
    if (cleanedPhone.startsWith('0')) {
      cleanedPhone = cleanedPhone.substring(1);
    }

    // Telefon numarası 10 haneli olmalı (başında 0 olmadan)
    if (cleanedPhone.length !== 10) {
      throw new Error('Telefon numarası 10 haneli olmalıdır');
    }

    // 5 ile başlamalı
    if (!cleanedPhone.startsWith('5')) {
      throw new Error('Telefon numarası 5 ile başlamalıdır');
    }

    console.log('📱 Formatlanmış telefon:', cleanedPhone);
    return cleanedPhone;
  } catch (error) {
    console.error('❌ Telefon format hatası:', error);
    throw new Error('Geçersiz telefon numarası formatı. Örnek: 5XXXXXXXXX');
  }
};

/**
 * Telefon numarasını görüntüleme formatına çevirir
 * @param {string} phone - Formatlanacak telefon numarası
 * @returns {string} - Görüntüleme için formatlanmış telefon numarası (5XX XXX XX XX)
 */
export const formatPhoneNumberForDisplay = (phone) => {
  try {
    const formatted = formatPhoneNumber(phone);
    return formatted.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
  } catch (error) {
    return phone;
  }
};

/**
 * Telefon numarasının geçerli olup olmadığını kontrol eder
 * @param {string} phone - Kontrol edilecek telefon numarası
 * @returns {boolean} - Telefon numarası geçerli mi?
 */
export const isValidPhoneNumber = (phone) => {
  try {
    formatPhoneNumber(phone);
    return true;
  } catch (error) {
    return false;
  }
};
