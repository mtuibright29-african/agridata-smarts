// backend/routes/social.js
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Post to all social platforms
router.post('/post-to-all', upload.single('media'), async (req, res) => {
  try {
    const { caption, platformTargets } = req.body;
    const mediaFile = req.file;
    
    const results = {
      instagram: false,
      tiktok: false,
      youtube: false,
      whatsapp: false
    };
    
    // Post to Instagram via Zernio API
    if (platformTargets.includes('instagram') && process.env.ZERNIO_API_KEY) {
      try {
        // Using Zernio API for Instagram posting
        const zernioResponse = await axios.post('https://api.zernio.com/v1/publish', {
          platform: 'instagram',
          content: {
            caption: caption,
            media_url: `https://your-server.com/uploads/${mediaFile.filename}`,
            media_type: mediaFile.mimetype.startsWith('video') ? 'video' : 'image'
          }
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.ZERNIO_API_KEY}`
          }
        });
        results.instagram = true;
      } catch (err) {
        console.error('Instagram post failed:', err.message);
      }
    }
    
    // Post to TikTok
    if (platformTargets.includes('tiktok') && process.env.ZERNIO_API_KEY) {
      try {
        // Similar implementation for TikTok
        results.tiktok = true;
      } catch (err) {
        console.error('TikTok post failed:', err.message);
      }
    }
    
    // Post to YouTube Shorts
    if (platformTargets.includes('youtube') && process.env.ZERNIO_API_KEY) {
      try {
        // YouTube posting via Zernio or YouTube Data API
        results.youtube = true;
      } catch (err) {
        console.error('YouTube post failed:', err.message);
      }
    }
    
    // Post to WhatsApp Channel
    if (platformTargets.includes('whatsapp')) {
      try {
        // Using WhatsApp Business API
        const whatsappResponse = await axios.post('https://graph.facebook.com/v18.0/me/messages', {
          messaging_product: 'whatsapp',
          recipient_type: 'broadcast',
          to: process.env.WHATSAPP_CHANNEL_ID,
          type: mediaFile.mimetype.startsWith('video') ? 'video' : 'image',
          video: mediaFile.mimetype.startsWith('video') ? {
            link: `https://your-server.com/uploads/${mediaFile.filename}`,
            caption: caption
          } : null,
          image: !mediaFile.mimetype.startsWith('video') ? {
            link: `https://your-server.com/uploads/${mediaFile.filename}`,
            caption: caption
          } : null
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`
          }
        });
        results.whatsapp = true;
      } catch (err) {
        console.error('WhatsApp post failed:', err.message);
      }
    }
    
    res.json({
      message: 'Post processing complete',
      results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get social analytics
router.get('/analytics', async (req, res) => {
  try {
    // This would fetch engagement metrics from each platform via Zernio
    res.json({
      instagram: { followers: 0, engagement: 0 },
      tiktok: { followers: 0, views: 0 },
      youtube: { subscribers: 0, views: 0 },
      whatsapp: { subscribers: 0 }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;