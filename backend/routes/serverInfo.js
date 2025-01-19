const express = require('express');
const os = require('os');
const router = express.Router();

router.get('/server-info', (req, res) => {
  try {
    const serverInfo = {
      // Temel sunucu bilgileri
      uptime: process.uptime(),
      platform: process.platform,
      nodeVersion: process.version,
      
      // İşletim sistemi bilgileri
      hostname: os.hostname(),
      osType: os.type(),
      osRelease: os.release(),
      
      // Sistem kaynakları
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpuCores: os.cpus().length,
      
      // Ağ bilgileri
      networkInterfaces: Object.entries(os.networkInterfaces())
        .filter(([name, details]) => 
          details.some(detail => detail.family === 'IPv4' && !detail.internal)
        )
        .map(([name, details]) => ({
          name,
          ip: details.find(detail => detail.family === 'IPv4' && !detail.internal).address
        })),
      
      // Uygulama durumu
      status: 'healthy',
      timestamp: new Date().toISOString()
    };

    res.json(serverInfo);
  } catch (error) {
    console.error('Sunucu bilgisi alınırken hata:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Sunucu bilgisi alınamadı' 
    });
  }
});

module.exports = router;
