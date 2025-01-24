const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP bağlantı hatası:', error);
  } else {
    console.log('✅ SMTP sunucusuna bağlantı başarılı');
    // E-posta gönderim testini yap
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'gudersamet@gmail.com',
      subject: 'Test E-postası',
      text: 'Bu bir test e-postasıdır.'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.error('❌ E-posta gönderme hatası:', error);
      }
      console.log('📧 E-posta gönderildi:', info.response);
    });
  }
});
