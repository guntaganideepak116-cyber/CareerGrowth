require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
(async () => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const result = await model.generateContent('Create a JSON with field test set to success');
    console.log(' SUCCESS! Gemini API is working!');
    console.log('Response:', result.response.text());
  } catch(e) {
    console.error(' Error:', e.message);
  }
})();
