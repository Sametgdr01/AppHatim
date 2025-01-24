const nodemailer = require('nodemailer');

console.log('📧 Email servisi başlatılıyor...');

// E-posta gönderici yapılandırması
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  debug: true,
  logger: true
});

// Bağlantıyı test et
console.log('📧 SMTP bağlantısı test ediliyor...');
transporter.verify()
  .then(() => {
    console.log('✅ SMTP sunucusuna bağlantı başarılı');
    console.log('📧 Email ayarları:', {
      user: process.env.EMAIL_USER || 'Tanımlanmamış',
      pass: process.env.EMAIL_PASSWORD ? '[16 karakter]' : 'Tanımlanmamış',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true
    });
  })
  .catch((error) => {
    console.error('❌ SMTP bağlantı hatası:', error);
    console.error('❌ Email ayarları:', {
      user: process.env.EMAIL_USER || 'Tanımlanmamış',
      pass: process.env.EMAIL_PASSWORD ? '[16 karakter]' : 'Tanımlanmamış',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true
    });
  });

// Şifre sıfırlama e-postası gönder
const sendPasswordResetEmail = async (to, resetCode, firstName) => {
  try {
    console.log('📧 E-posta gönderme başladı:', {
      to,
      resetCode,
      firstName,
      from: process.env.EMAIL_USER
    });

    // HTML template
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">AppHatim Şifre Sıfırlama</h2>
        <p style="color: #666; font-size: 16px;">Merhaba ${firstName},</p>
        <p style="color: #666; font-size: 16px;">Şifre sıfırlama talebiniz için doğrulama kodunuz:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <h1 style="color: #333; margin: 0; letter-spacing: 5px;">${resetCode}</h1>
        </div>
        <p style="color: #666; font-size: 14px;">Bu kod 15 dakika süreyle geçerlidir.</p>
        <p style="color: #666; font-size: 14px;">Eğer bu talebi siz yapmadıysanız, lütfen bu e-postayı dikkate almayın.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">Bu e-posta AppHatim tarafından otomatik olarak gönderilmiştir.</p>
      </div>
    `;

    // Mail gönder
    const info = await transporter.sendMail({
      from: `"AppHatim" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: 'AppHatim - Şifre Sıfırlama Kodu',
      html: html
    });

    console.log('📧 E-posta gönderildi:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected
    });
    
    return info;

  } catch (error) {
    console.error('❌ E-posta gönderme hatası:', {
      name: error.name,
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    throw error;
  }
};

module.exports = {
  sendPasswordResetEmail
};
