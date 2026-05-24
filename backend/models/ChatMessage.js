const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  direction: { type: String, enum: ['inbound', 'outbound'], required: true },
  source: { type: String, enum: ['chatbot', 'image', 'whatsapp'], default: 'chatbot' },
  content: { type: String, required: true },
  meta: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
