require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
(async () => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent('Create a JSON with field "test": "success"');
    const text = result.response.text();
    console.log(' GEM INI WORKS!');
    console.log('Response:', text);
  } catch(e) {
    console.error(' Error:', e.message);
  }
})();
