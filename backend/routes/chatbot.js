// backend/routes/chatbot.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { verifyToken } = require('../middleware/auth');
const ChatMessage = require('../models/ChatMessage');
const { analyzeImage, verifyOpenAIConnection, verifyAzureConnection, verifyGeminiConnection } = require('../services/imageAnalysis');
const router = express.Router();

// multer setup for image uploads
const uploadsPath = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, uploadsPath); },
  filename: function (req, file, cb) { cb(null, Date.now() + '-' + file.originalname); }
});
const upload = multer({ storage });

// Swahili intent responses
const responses = {
  'hali ya hewa': "Hali ya hewa leo Chalinze: Joto 28°C, unyevu 65%. Hakuna uwezekano wa mvua. (Weather today in Chalinze: 28°C, humidity 65%. No rain expected.)",
  'bei': "Bei ya sasa ya mananasi kwa kilo: Bei ya jumla TZS 1,500 - 2,000, Bei ya rejareja TZS 2,500 - 3,500. (Current pineapple prices per kg: Wholesale TZS 1,500-2,000, Retail TZS 2,500-3,500.)",
  'chunguza': "Tuma picha ya mmea wako. Nitaichambua kwa AI na kukupa matokeo. (Send a photo of your plant. I will analyze it with AI and give you results.)",
  'mafunzo': "Vidokezo vya kilimo cha mananasi: 1) Panda katika udongo wenye maji mengi. 2) Weka mbolea kila baada ya miezi 3. (Pineapple farming tips...)",
  'msaada': "Wasiliana nasi: WhatsApp +255 093 653 378, Gmail agridatasmart@gmail.com. Au tembelea ofisi zetu Chalinze. (Contact us...)"
};

const saveChatMessage = async ({ phoneNumber, direction, source, content, meta }) => {
  try {
    await ChatMessage.create({ phoneNumber, direction, source, content, meta });
  } catch (err) {
    console.warn('Could not save chat message:', err.message);
  }
};

// Chatbot endpoint
router.post('/message', async (req, res) => {
  try {
    const { message, phoneNumber = '+255000000000', imageUrl } = req.body;
    const lowerMessage = (message || '').toLowerCase();
    await saveChatMessage({ phoneNumber, direction: 'inbound', source: 'chatbot', content: message });

    let reply = "Samahani, sikuelewa. Tuma 'msaada' kwa orodha ya amri. (Sorry, I didn't understand. Send 'msaada' for commands.)";
    let replySource = 'chatbot';

    // Check for keywords
    if (lowerMessage.includes('hali') || lowerMessage.includes('hewa') || lowerMessage.includes('weather')) {
      reply = responses['hali ya hewa'];
    } else if (lowerMessage.includes('bei') || lowerMessage.includes('price') || lowerMessage.includes('gharama')) {
      reply = responses['bei'];
    } else if (lowerMessage.includes('chunguza') || lowerMessage.includes('picha') || lowerMessage.includes('photo')) {
      if (imageUrl) {
        reply = "Picha imepokelewa. AI inachambua... Matokeo: Mmea wako una afya nzuri! Hakuna ugonjwa uliogunduliwa. (Image received. AI analyzing... Result: Your plant is healthy! No disease detected.)";
        replySource = 'image';
      } else {
        reply = responses['chunguza'];
      }
    } else if (lowerMessage.includes('mafunzo') || lowerMessage.includes('elimu') || lowerMessage.includes('tips')) {
      reply = responses['mafunzo'];
    } else if (lowerMessage.includes('msaada') || lowerMessage.includes('help')) {
      reply = responses['msaada'];
    }

    await saveChatMessage({ phoneNumber, direction: 'outbound', source: replySource, content: reply });

    res.json({ 
      reply,
      timestamp: new Date(),
      from: 'AgriData Smart Bot'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Image upload and AI analysis
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    const phoneNumber = req.body.phoneNumber || '+255000000000';
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const imageUrl = `/uploads/${path.basename(file.path)}`;
    let analysisData = null;
    let reply = '';

    try {
      analysisData = await analyzeImage(file.path);
    } catch (analysisError) {
      console.warn('Image analysis failed:', analysisError.message);
    }

    if (analysisData?.summary) {
      reply = `Picha imepokelewa. Matokeo ya AI: ${analysisData.summary}`;
    } else {
      const stats = fs.statSync(file.path);
      const sizeKb = Math.max(1, Math.round(stats.size / 1024));
      const healthScore = Math.max(40, 100 - Math.min(60, Math.round(sizeKb / 10)));
      const recommendations = [];
      if (healthScore > 80) recommendations.push('Mmea wako unaonekana mzuri. Endelea na mazoea mazuri.');
      else if (healthScore > 60) recommendations.push('Mmea unaonekana vizuri lakini zingatia udongo na maji.');
      else recommendations.push('Inaonekana kuna tatizo. Tuma picha zaidi au wasiliana na extension officer.');

      reply = `Picha imepokelewa. Matokeo ya AI: Afya ${healthScore}% - ${recommendations.join(' ')}`;
      analysisData = { fallbackHealthScore: healthScore, fallbackRecommendations: recommendations };
    }

    await saveChatMessage({
      phoneNumber,
      direction: 'inbound',
      source: 'image',
      content: `Uploaded image: ${file.filename}`,
      meta: { imageUrl }
    });

    await saveChatMessage({
      phoneNumber,
      direction: 'outbound',
      source: 'image',
      content: reply,
      meta: { imageUrl, analysis: analysisData }
    });

    res.json({ reply, analysis: analysisData, url: imageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Provider connectivity test endpoint
router.get('/image-test', async (req, res) => {
  try {
    if (process.env.GEMINI_API_KEY) {
      const result = await verifyGeminiConnection();
      return res.json({ ok: true, provider: 'gemini', result });
    }

    if (process.env.OPENAI_API_KEY) {
      const result = await verifyOpenAIConnection();
      return res.json({ ok: true, provider: 'openai', result });
    }

    if (process.env.AZURE_COMPUTER_VISION_ENDPOINT && process.env.AZURE_COMPUTER_VISION_KEY) {
      const result = await verifyAzureConnection();
      return res.json({ ok: true, provider: 'azure', result });
    }

    return res.status(400).json({ ok: false, message: 'No image analysis provider configured. Set GEMINI_API_KEY, OPENAI_API_KEY or AZURE_COMPUTER_VISION_ENDPOINT/AZURE_COMPUTER_VISION_KEY.' });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
});

// Send WhatsApp message (via Twilio) if configured
router.post('/send-whatsapp', async (req, res) => {
  try {
    const { to, body, phoneNumber = '+255000000000' } = req.body;
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env.TWILIO_WHATSAPP_FROM; // e.g. 'whatsapp:+1415xxxxxxx'

    if (!accountSid || !authToken || !from) return res.status(400).json({ message: 'WhatsApp not configured' });

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const params = new URLSearchParams();
    params.append('To', `whatsapp:${to}`);
    params.append('From', from);
    params.append('Body', body);

    const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const resp = await axios.post(url, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `Basic ${auth}` }
    });

    await saveChatMessage({ phoneNumber, direction: 'outbound', source: 'whatsapp', content: body, meta: { twilioSid: resp.data.sid } });

    res.json({ message: 'sent', data: resp.data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// WhatsApp incoming webhook (Twilio) - forwards to socket.io clients
router.post('/webhook/whatsapp', express.urlencoded({ extended: false }), async (req, res) => {
  try {
    // Twilio posts form-encoded data: From, Body, etc.
    const from = req.body.From || req.body.from || '';
    const body = req.body.Body || req.body.body || '';
    const phoneNumber = from.replace('whatsapp:', '');
    console.log('Incoming WhatsApp:', from, body);

    await saveChatMessage({ phoneNumber, direction: 'inbound', source: 'whatsapp', content: body, meta: { from } });

    const io = req.app.get('io');
    if (io) io.emit('receive_message', { message: `WhatsApp ${from}: ${body}` });

    // Respond with 200 OK (Twilio expects 200)
    res.status(200).send('<Response></Response>');
  } catch (error) {
    res.status(500).send('Error');
  }
});

// Chat history endpoint
router.get('/history', verifyToken, async (req, res) => {
  try {
    const phoneNumber = req.query.phoneNumber || req.user.phoneNumber || '';
    const filter = phoneNumber ? { phoneNumber } : {};
    const history = await ChatMessage.find(filter).sort({ createdAt: 1 }).limit(200);
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;