const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    console.log('🔑 Auth middleware çalıştı');
    console.log('📨 Headers:', req.headers);

    // Token'ı al
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('❌ Token bulunamadı');
      return res.status(401).json({ message: 'Token bulunamadı' });
    }

    // Bearer token'ı ayır
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      console.log('❌ Geçersiz token formatı');
      return res.status(401).json({ message: 'Geçersiz token formatı' });
    }

    const token = parts[1];
    console.log('🔑 Token:', token);

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token doğrulandı:', decoded);
    
    // User ID'yi request'e ekle
    req.user = { userId: decoded.userId };
    console.log('✅ User ID eklendi:', req.user);
    
    next();
  } catch (err) {
    console.error('❌ Token doğrulama hatası:', err);
    res.status(401).json({ message: 'Geçersiz token' });
  }
};

module.exports = auth;
