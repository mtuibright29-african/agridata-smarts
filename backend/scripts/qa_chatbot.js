const axios = require('axios');
(async () => {
  try {
    const base = 'http://localhost:5000';
    console.log('1) Testing login with seeded admin');
    let res = await axios.post(base + '/api/auth/login', { phoneNumber: '+255600000001', password: 'AdminPass123' });
    console.log('Login status', res.status);
    const token = res.data.token;

    console.log('2) Testing chatbot text commands');
    const cmds = ['hali ya hewa', 'bei', 'mafunzo', 'msaada', 'chunguza'];
    for (const c of cmds) {
      const r = await axios.post(base + '/api/chatbot/message', { message: c, phoneNumber: '+255600000001' }, { headers: { Authorization: `Bearer ${token}` } }).catch(e=>e.response||e);
      console.log(c, '->', r.data && r.data.reply ? r.data.reply : r.status);
    }

    console.log('3) Testing image upload endpoint (skipped if no sample image)');

    // Try to find a sample image in frontend/public
    const fs = require('fs');
    const path = require('path');
    const sample = path.resolve(__dirname, '../../frontend/public/sample.jpg');
    if (fs.existsSync(sample)) {
      const FormData = require('form-data');
      const form = new FormData();
      form.append('image', fs.createReadStream(sample));
      form.append('phoneNumber', '+255600000001');
      const r = await axios.post(base + '/api/chatbot/image', form, { headers: form.getHeaders() });
      console.log('Image reply:', r.data.reply);
    } else {
      console.log('No sample image found at', sample, '— skipping image upload test');
    }

    console.log('4) Testing WhatsApp send endpoint (skipped if not configured)');
    const trySend = await axios.post(base + '/api/chatbot/send-whatsapp', { to: '+255600000001', body: 'Test message from AgriData QA' }).catch(e=>e.response||e);
    console.log('WhatsApp send response:', trySend.data || trySend.status);

    console.log('QA script completed');
  } catch (err) {
    console.error('QA error', err.message || err);
    process.exit(1);
  }
})();