
const axios = require('axios');
require('dotenv').config({ path: 'c:/Users/DELL/OneDrive/Desktop/CareerGrowth(org)/backend/.env' });

async function manualTest() {
    const key = process.env.GEMINI_API_KEY;
    const model = 'gemini-1.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${key}`;
    console.log('Testing URL:', url.substring(0, 80) + '...');
    
    try {
        const resp = await axios.post(url, {
            contents: [{ parts: [{ text: 'hi' }] }]
        });
        console.log('Success!', resp.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.status : error.message);
        if (error.response) console.error('Data:', error.response.data);
    }
}

manualTest();
