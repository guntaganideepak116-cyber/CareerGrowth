
require('dotenv').config({ path: 'c:/Users/DELL/OneDrive/Desktop/CareerGrowth(org)/backend/.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    const key = process.env.GEMINI_API_KEY;
    console.log('Testing with gemini-2.0-flash...');
    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent('Say hello');
        console.log('Response:', result.response.text());
        console.log('SUCCESS! ✅');
    } catch (error) {
        console.error('Error ❌:', error);
    }
}

testGemini();
