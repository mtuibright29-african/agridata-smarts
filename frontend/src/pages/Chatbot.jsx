// frontend/src/pages/Chatbot.js
import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Paper, List, ListItem, ListItemText, Avatar, Typography, AppBar, Toolbar, IconButton, Card, CardContent, Divider, Stack, Chip } from '@mui/material';
import { Send, ArrowBack, WhatsApp, SmartToy } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000`;
const socket = io(API_BASE_URL);

function Chatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { text: "Habari! Mimi ni AgriData Smart Bot. Ninaweza kukusaidia kwa amri zifuatazo: 'hali ya hewa', 'bei', 'chunguza <picha>', 'mazao yangu', 'mafunzo', 'msaada'. Tuma 'msaada' ili kuunganishwa na extension officer. Kwa kushiriki data, unakubali matumizi ya data yako kwa huduma (angalia sera).", sender: 'bot', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef = useRef(null);

  const quickCommands = [
    'hali ya hewa',
    'bei',
    'mafunzo',
    'msaada'
  ];

  const getSummaryText = (analysis) => {
    if (!analysis) return null;
    if (analysis.summary) return analysis.summary;
    if (analysis.raw?.description?.captions?.[0]?.text) return analysis.raw.description.captions[0].text;
    return 'Hakuna uchambuzi wa kina uliopatikana.';
  };

  const renderAnalysisCard = (analysis, imageUrl, previewUrl) => {
    if (!analysis) return null;

    const summary = getSummaryText(analysis);
    const providerName = analysis.provider === 'openai' ? 'OpenAI' : analysis.provider === 'azure' ? 'Azure Computer Vision' : 'AI';
    const caption = analysis.raw?.description?.captions?.[0]?.text;
    const tags = analysis.raw?.tags?.map((tag) => tag.name) || [];
    const healthScore = analysis.fallbackHealthScore;
    const recommendations = analysis.fallbackRecommendations || [];

    return (
      <Card variant="outlined" sx={{ mt: 1, bgcolor: '#F1F8E9' }}>
        <CardContent>
          <Typography variant="subtitle2" color="textSecondary">Uchambuzi wa Picha - {providerName}</Typography>
          {imageUrl || previewUrl ? (
            <Box component="img" src={previewUrl || `${API_BASE_URL}${imageUrl}`} alt="Picha ya mmea" sx={{ width: '100%', height: 'auto', borderRadius: 2, mt: 1, mb: 1 }} />
          ) : null}
          <Typography variant="body2" sx={{ mb: 1 }}>{summary}</Typography>
          {caption ? (
            <Typography variant="caption" display="block" sx={{ mb: 1 }}>Maelezo ya picha: {caption}</Typography>
          ) : null}
          {tags.length > 0 ? (
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
              {tags.slice(0, 6).map((tag) => <Chip key={tag} label={tag} size="small" />)}
            </Stack>
          ) : null}
          {typeof healthScore === 'number' ? (
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 700 }}>Afya ya mmea: {healthScore}%</Typography>
          ) : null}
          {recommendations.length > 0 ? (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2">Mapendekezo ya AI:</Typography>
              <List dense>
                {recommendations.map((item, index) => (
                  <ListItem key={index} sx={{ py: 0, px: 0 }}>
                    <ListItemText primary={`• ${item}`} />
                  </ListItem>
                ))}
              </List>
            </Box>
          ) : null}
        </CardContent>
      </Card>
    );
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchHistory = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/chatbot/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const historyItems = response.data.map((item) => ({
          text: item.content,
          sender: item.direction === 'user' || item.direction === 'inbound' ? 'user' : 'bot',
          timestamp: item.createdAt
        }));

        setMessages((prev) => [prev[0], ...historyItems]);
      } catch (error) {
        console.warn('Unable to load chat history', error);
      }
    };

    fetchHistory();
    scrollToBottom();
    
    socket.on('receive_message', (data) => {
      setMessages(prev => [...prev, { text: data.message, sender: 'bot', timestamp: new Date() }]);
      setIsTyping(false);
    });
    
    return () => socket.off('receive_message');
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (overrideMessage) => {
    const messageText = overrideMessage ?? input;
    if (!messageText.trim()) return;

    const userMessage = { text: messageText, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    if (!overrideMessage) setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chatbot/message`, {
        message: messageText,
        phoneNumber: localStorage.getItem('phoneNumber')
      });

      setTimeout(() => {
        setMessages(prev => [...prev, { text: response.data.reply, sender: 'bot', timestamp: new Date() }]);
        setIsTyping(false);
      }, 1000);

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { text: "Samahani, kuna tatizo la mtandao. Jaribu tena.", sender: 'bot', timestamp: new Date() }]);
      setIsTyping(false);
    }
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/255093653378?text=${encodeURIComponent('Halo, ninahitaji msaada wa kilimo cha mananasi')}`, '_blank');
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate('/dashboard')}>
            <ArrowBack />
          </IconButton>
          <SmartToy sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            AgriData Smart Bot (Kiswahili)
          </Typography>
          <IconButton color="inherit" onClick={openWhatsApp}>
            <WhatsApp />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <Paper sx={{ flex: 1, overflow: 'auto', p: 2, m: 2, bgcolor: '#fff' }}>
        <List>
          {messages.map((msg, idx) => (
            <ListItem
              key={idx}
              sx={{
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start'
              }}
            >
              <Avatar sx={{ bgcolor: msg.sender === 'user' ? '#FF9800' : '#2E7D32', mr: msg.sender === 'user' ? 0 : 1, ml: msg.sender === 'user' ? 1 : 0 }}>
                {msg.sender === 'user' ? '🧑' : '🤖'}
              </Avatar>
              <Paper sx={{ p: 1.5, maxWidth: '70%', bgcolor: msg.sender === 'user' ? '#FF9800' : '#E8F5E9', color: msg.sender === 'user' ? 'white' : 'black' }}>
                <Stack spacing={1}>
                  <ListItemText primary={msg.text} secondary={new Date(msg.timestamp).toLocaleTimeString()} />
                  {msg.analysis && renderAnalysisCard(msg.analysis, msg.imageUrl, msg.previewUrl)}
                </Stack>
              </Paper>
            </ListItem>
          ))}
          {isTyping && (
            <ListItem>
              <Avatar sx={{ bgcolor: '#2E7D32' }}>🤖</Avatar>
              <Paper sx={{ p: 1.5 }}>
                <Typography variant="body2">AgriData Bot inaandika...</Typography>
              </Paper>
            </ListItem>
          )}
        </List>
        <div ref={messagesEndRef} />
      </Paper>
      
      <Paper sx={{ p: 2, m: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Andika ujumbe wako kwa Kiswahili..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            sx={{ bgcolor: 'white' }}
          />
          <Button variant="contained" color="primary" onClick={() => sendMessage()}>
            <Send />
          </Button>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
          {quickCommands.map((command) => (
            <Button key={command} variant="outlined" size="small" onClick={() => sendMessage(command)}>
              {command}
            </Button>
          ))}
        </Stack>
        <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="chat-image-upload"
            type="file"
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              const preview = URL.createObjectURL(file);
              const form = new FormData();
              form.append('image', file);
              form.append('phoneNumber', localStorage.getItem('phoneNumber') || '');
              setMessages(prev => [...prev, { text: 'Pakia picha...', sender: 'user', timestamp: new Date() }]);
              try {
                const res = await axios.post(`${API_BASE_URL}/api/chatbot/image`, form, { headers: { 'Content-Type': 'multipart/form-data' } });
                setMessages(prev => [...prev, { text: res.data.reply || 'Samahani, hatukuweza kuchanganua picha.', sender: 'bot', timestamp: new Date(), analysis: res.data.analysis, imageUrl: res.data.url, previewUrl: preview }]);
              } catch (err) {
                setMessages(prev => [...prev, { text: 'Kosa la mtandao wakati wa kuchapisha picha.', sender: 'bot', timestamp: new Date() }]);
              }
            }}
          />
          <label htmlFor="chat-image-upload">
            <Button variant="outlined" component="span">Tuma Picha</Button>
          </label>
          <Button variant="text" onClick={openWhatsApp} startIcon={<WhatsApp />}>Wasiliana kwa WhatsApp</Button>
        </Box>
        <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
          Amri zilizopendekezwa: "hali ya hewa", "bei", "chunguza &lt;picha&gt;", "mazao yangu", "mafunzo", "msaada"
        </Typography>
      </Paper>
    </Box>
  );
}

export default Chatbot;