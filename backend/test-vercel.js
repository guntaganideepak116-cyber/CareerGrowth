
const axios = require('axios');
const API_URL = 'https://career-growth-opr6.vercel.app';
const API_KEY = process.env.GEMINI_API_KEY; // Using env variable instead of hardcoded key

async function testHealth() {
    try {
        const resp = await axios.get(`${API_URL}/api/health`);
        console.log('Health Check:', resp.data);
    } catch (e) {
        console.error('API Error:', e.message);
    }
}

testHealth();
