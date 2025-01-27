const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Hatim = require('../models/Hatim');
const User = require('../models/User');

// Hatim listesini getir
router.get('/list', async (req, res) => {
  try {
    const hatimList = await Hatim.find();
    res.json(hatimList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Grup hatimine katılma isteği gönder
router.post('/group/:hatimId/join-request', auth, async (req, res) => {
  try {
    const hatim = await Hatim.findById(req.params.hatimId);
    if (!hatim) {
      return res.status(404).json({ message: 'Hatim bulunamadı' });
    }

    // Kullanıcı zaten istek göndermişse
    if (hatim.joinRequests.includes(req.user.id)) {
      return res.status(400).json({ message: 'Zaten katılma isteği gönderilmiş' });
    }

    // Kullanıcı zaten üyeyse
    if (hatim.participants.includes(req.user.id)) {
      return res.status(400).json({ message: 'Zaten bu hatime katılmışsınız' });
    }

    // İsteği ekle
    hatim.joinRequests.push(req.user.id);
    await hatim.save();

    res.json({ message: 'Katılma isteği gönderildi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Grup hatimine katılma isteklerini listele (sadece yönetici)
router.get('/group/:hatimId/join-requests', auth, async (req, res) => {
  try {
    const hatim = await Hatim.findById(req.params.hatimId)
      .populate('joinRequests', 'name email');
    
    if (!hatim) {
      return res.status(404).json({ message: 'Hatim bulunamadı' });
    }

    // Sadece yönetici görebilir
    if (hatim.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Yetkiniz yok' });
    }

    res.json(hatim.joinRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

// Katılma isteğini onayla/reddet (sadece yönetici)
router.post('/group/:hatimId/join-requests/:userId/respond', auth, async (req, res) => {
  try {
    const { approved } = req.body;
    const hatim = await Hatim.findById(req.params.hatimId);
    
    if (!hatim) {
      return res.status(404).json({ message: 'Hatim bulunamadı' });
    }

    // Sadece yönetici onaylayabilir
    if (hatim.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Yetkiniz yok' });
    }

    // İstek var mı kontrol et
    if (!hatim.joinRequests.includes(req.params.userId)) {
      return res.status(404).json({ message: 'Katılma isteği bulunamadı' });
    }

    // İstekten kaldır
    hatim.joinRequests = hatim.joinRequests.filter(
      id => id.toString() !== req.params.userId
    );

    if (approved) {
      // Onaylandıysa katılımcılara ekle
      hatim.participants.push(req.params.userId);
    }

    await hatim.save();

    res.json({ 
      message: approved ? 'Katılma isteği onaylandı' : 'Katılma isteği reddedildi' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;