// frontend/src/pages/Chatbot.js
import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Paper, List, ListItem, ListItemText, Avatar, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import { Send, ArrowBack, WhatsApp, SmartToy } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function Chatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { text: "Habari! Mimi ni AgriData Smart Bot. Ninaweza kukusaidia na: Hali ya hewa, Bei za mananasi, Ushauri wa kilimo, au Chunguza picha. Tuma 'msaada' kwa orodha kamili.", sender: 'bot', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
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

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/chatbot/message', {
        message: input,
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
            <ListItem key={idx} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              <Avatar sx={{ bgcolor: msg.sender === 'user' ? '#FF9800' : '#2E7D32', mr: msg.sender === 'user' ? 0 : 1, ml: msg.sender === 'user' ? 1 : 0 }}>
                {msg.sender === 'user' ? '🧑' : '🤖'}
              </Avatar>
              <Paper sx={{ p: 1.5, maxWidth: '70%', bgcolor: msg.sender === 'user' ? '#FF9800' : '#E8F5E9', color: msg.sender === 'user' ? 'white' : 'black' }}>
                <ListItemText primary={msg.text} secondary={new Date(msg.timestamp).toLocaleTimeString()} />
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
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Andika ujumbe wako kwa Kiswahili..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            sx={{ bgcolor: 'white' }}
          />
          <Button variant="contained" color="primary" onClick={sendMessage}>
            <Send />
          </Button>
        </Box>
        <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
          Jaribu: "hali ya hewa", "bei", "chunguza", "mafunzo", au "msaada"
        </Typography>
      </Paper>
    </Box>
  );
}

export default Chatbot;