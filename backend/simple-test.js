require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    try {
        const result = await model.generateContent('Say hello');
        console.log('✅ SUCCESS! Gemini works!');
        console.log('Response:', result.response.text());
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

test();
