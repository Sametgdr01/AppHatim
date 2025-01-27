const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Juz = require('../models/jaz');
const Hatim = require('../models/Hatim');

// Cüz Silme
router.delete('/:juzId', auth, async (req, res) => {
  try {
    const juzId = req.params.juzId;

    // Cüzü bul
    const juz = await Juz.findById(juzId);
    
    if (!juz) {
      return res.status(404).json({ message: 'Cüz bulunamadı' });
    }

    // Cüzün ait olduğu hatimi bul
    const hatim = await Hatim.findById(juz.hatimId);

    // Sadece hatim sahibi veya cüz sahibi silebilir
    if (hatim.admin.toString() !== req.user.id && juz.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Cüzü silme yetkiniz yok' });
    }

    // Cüz tamamlanmamışsa silinebilir
    if (juz.isCompleted) {
      return res.status(400).json({ message: 'Tamamlanmış cüz silinemez' });
    }

    // Cüzü sil
    await Juz.findByIdAndDelete(juzId);

    // Hatim'in parts listesinden cüzü çıkar
    await Hatim.findByIdAndUpdate(
      juz.hatimId, 
      { $pull: { parts: juzId } }
    );

    res.json({ message: 'Cüz başarıyla silindi' });
  } catch (error) {
    console.error('Cüz silme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
});

module.exports = router;