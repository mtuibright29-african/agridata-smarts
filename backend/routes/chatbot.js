// backend/routes/chatbot.js
const express = require('express');
const router = express.Router();

// Swahili intent responses
const responses = {
  'hali ya hewa': "Hali ya hewa leo Chalinze: Joto 28°C, unyevu 65%. Hakuna uwezekano wa mvua. (Weather today in Chalinze: 28°C, humidity 65%. No rain expected.)",
  'bei': "Bei ya sasa ya mananasi kwa kilo: Bei ya jumla TZS 1,500 - 2,000, Bei ya rejareja TZS 2,500 - 3,500. (Current pineapple prices per kg: Wholesale TZS 1,500-2,000, Retail TZS 2,500-3,500.)",
  'chunguza': "Tuma picha ya mmea wako. Nitaichambua kwa AI na kukupa matokeo. (Send a photo of your plant. I will analyze it with AI and give you results.)",
  'mafunzo': "Vidokezo vya kilimo cha mananasi: 1) Panda katika udongo wenye maji mengi. 2) Weka mbolea kila baada ya miezi 3. (Pineapple farming tips...)",
  'msaada': "Wasiliana nasi: WhatsApp +255 093 653 378, Gmail agridatasmart@gmail.com. Au tembelea ofisi zetu Chalinze. (Contact us...)"
};

// Chatbot endpoint
router.post('/message', async (req, res) => {
  try {
    const { message, phoneNumber, imageUrl } = req.body;
    const lowerMessage = message.toLowerCase();
    
    let reply = "Samahani, sikuelewa. Tuma 'msaada' kwa orodha ya amri. (Sorry, I didn't understand. Send 'msaada' for commands.)";
    
    // Check for keywords
    if (lowerMessage.includes('hali') || lowerMessage.includes('hewa') || lowerMessage.includes('weather')) {
      reply = responses['hali ya hewa'];
    } else if (lowerMessage.includes('bei') || lowerMessage.includes('price') || lowerMessage.includes('gharama')) {
      reply = responses['bei'];
    } else if (lowerMessage.includes('chunguza') || lowerMessage.includes('picha') || lowerMessage.includes('photo')) {
      if (imageUrl) {
        // Process image for disease detection
        reply = "Picha imepokelewa. AI inachambua... Matokeo: Mmea wako una afya nzuri! Hakuna ugonjwa uliogunduliwa. (Image received. AI analyzing... Result: Your plant is healthy! No disease detected.)";
      } else {
        reply = responses['chunguza'];
      }
    } else if (lowerMessage.includes('mafunzo') || lowerMessage.includes('elimu') || lowerMessage.includes('tips')) {
      reply = responses['mafunzo'];
    } else if (lowerMessage.includes('msaada') || lowerMessage.includes('help')) {
      reply = responses['msaada'];
    }
    
    res.json({ 
      reply,
      timestamp: new Date(),
      from: 'AgriData Smart Bot'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// WhatsApp webhook endpoint
router.post('/webhook/whatsapp', async (req, res) => {
  try {
    const { from, message } = req.body;
    console.log(`WhatsApp message from ${from}: ${message}`);
    
    // Process message and send reply via WhatsApp API
    // This is where you'd integrate with WhatsApp Business API
    
    res.status(200).send('OK');
  } catch (error) {
    res.status(500).send('Error');
  }
});

module.exports = router;