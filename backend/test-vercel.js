
const axios = require('axios');
const API_URL = 'https://career-growth-opr6.vercel.app';
const API_KEY = 'AIzaSyATy-Dxy6-YJA2dFPFyclKikV43NUzrCj4'; // Reusing your Gemini key for general test? No.

async function testHealth() {
    try {
        const resp = await axios.get(`${API_URL}/api/health`);
        console.log('Health Check:', resp.data);
    } catch (e) {
        console.error('API Error:', e.message);
    }
}

testHealth();
