const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { OpenAI } = require('openai');

const extensionToMime = {
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif'
};

const getDataUrl = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = extensionToMime[ext] || 'image/jpeg';
  const imageBuffer = fs.readFileSync(filePath);
  return `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
};

const extractText = (response) => {
  if (!response) return '';
  if (typeof response.output_text === 'string' && response.output_text.trim()) {
    return response.output_text.trim();
  }

  const textParts = [];
  const walk = (node) => {
    if (!node) return;
    if (typeof node === 'string') {
      textParts.push(node);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (typeof node === 'object') {
      if (node.type === 'output_text' && node.text) {
        textParts.push(node.text);
      } else if (node.text) {
        textParts.push(node.text);
      } else if (node.content) {
        walk(node.content);
      }
    }
  };

  walk(response.output);
  return textParts.join(' ').trim();
};

const analyzeWithOpenAI = async (filePath) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const client = new OpenAI({ apiKey });
  const dataUrl = getDataUrl(filePath);
  const prompt = 'Changanua picha ya mmea wa kilimo cha mananasi na toa ripoti fupi kwa Kiswahili kuhusu afya ya mmea, dalili za ugonjwa, na mapendekezo ya hatua za kuchukua.';

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: dataUrl } }
        ]
      }
    ],
    max_tokens: 350
  });

  const summary = response.choices?.[0]?.message?.content;
  return {
    provider: 'openai',
    summary: summary || 'AI haikuweza kutoa uchambuzi wa picha.',
    raw: response
  };
};

const analyzeWithAzure = async (filePath) => {
  const endpoint = process.env.AZURE_COMPUTER_VISION_ENDPOINT;
  const key = process.env.AZURE_COMPUTER_VISION_KEY;
  if (!endpoint || !key) {
    throw new Error('Azure Computer Vision config is not set');
  }

  const url = `${endpoint.replace(/\/+$/, '')}/vision/v3.2/analyze?visualFeatures=Description,Tags,Color`;
  const imageBuffer = fs.readFileSync(filePath);

  const response = await axios.post(url, imageBuffer, {
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      'Content-Type': 'application/octet-stream'
    }
  });

  const description = response.data?.description?.captions?.[0]?.text || 'Hakuna maelezo ya picha yaliyopatikana.';
  const tags = (response.data?.tags || []).map((tag) => tag.name).join(', ');
  const summary = `Maelezo: ${description}. Vidokezo: ${tags || 'hakuna vitambulisho maalum.'}`;

  return {
    provider: 'azure',
    summary,
    raw: response.data
  };
};

const verifyOpenAIConnection = async () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key_here') {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const client = new OpenAI({ apiKey });
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: 'Please respond with a single word: OK.'
      }
    ],
    max_tokens: 10
  });

  const summary = response.choices?.[0]?.message?.content || 'No response text returned';
  return {
    provider: 'openai',
    status: 'connected',
    summary
  };
};

const verifyAzureConnection = async () => {
  const endpoint = process.env.AZURE_COMPUTER_VISION_ENDPOINT;
  const key = process.env.AZURE_COMPUTER_VISION_KEY;
  if (!endpoint || !key) {
    throw new Error('Azure Computer Vision config is not set');
  }

  const url = `${endpoint.replace(/\/+$/, '')}/vision/v3.2/models`;
  const response = await axios.get(url, {
    headers: {
      'Ocp-Apim-Subscription-Key': key
    }
  });

  return {
    provider: 'azure',
    status: 'connected',
    models: response.data
  };
};

const analyzeWithGemini = async (filePath) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeType = extensionToMime[ext] || 'image/jpeg';
  const imageBuffer = fs.readFileSync(filePath);
  const base64Data = imageBuffer.toString('base64');

  const prompt = 'Changanua picha ya mmea wa kilimo cha mananasi na toa ripoti fupi kwa Kiswahili kuhusu afya ya mmea, dalili za ugonjwa, na mapendekezo ya hatua za kuchukua.';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await axios.post(url, {
    contents: [{
      parts: [
        { text: prompt },
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        }
      ]
    }]
  }, {
    headers: { 'Content-Type': 'application/json' }
  });

  const summary = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return {
    provider: 'gemini',
    summary: summary || 'AI haikuweza kutoa uchambuzi wa picha kwa kutumia Gemini.',
    raw: response.data
  };
};

const verifyGeminiConnection = async () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await axios.post(url, {
    contents: [{
      parts: [{ text: 'Please respond with a single word: OK.' }]
    }]
  }, {
    headers: { 'Content-Type': 'application/json' }
  });

  const summary = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response text returned';
  return {
    provider: 'gemini',
    status: 'connected',
    summary: summary.trim()
  };
};

const analyzeImage = async (filePath) => {
  if (process.env.GEMINI_API_KEY) {
    return analyzeWithGemini(filePath);
  }
  if (process.env.OPENAI_API_KEY) {
    return analyzeWithOpenAI(filePath);
  }
  if (process.env.AZURE_COMPUTER_VISION_ENDPOINT && process.env.AZURE_COMPUTER_VISION_KEY) {
    return analyzeWithAzure(filePath);
  }
  throw new Error('No image analysis provider is configured. Set GEMINI_API_KEY, OPENAI_API_KEY or AZURE_COMPUTER_VISION_ENDPOINT/AZURE_COMPUTER_VISION_KEY.');
};

module.exports = {
  analyzeImage,
  verifyOpenAIConnection,
  verifyAzureConnection,
  verifyGeminiConnection
};

