const axios = require('axios');
require('dotenv').config({ path: 'c:/Users/DELL/OneDrive/Desktop/CareerGrowth(org)/backend/.env' });

async function listModelsMentor() {
    const key = process.env.GEMINI_MENTOR_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    console.log('Listing Models with Mentor Key:', key.substring(0, 8) + '...');
    
    try {
        const resp = await axios.get(url);
        console.log('Available models:', resp.data.models.map(m => m.name));
    } catch (error) {
        console.error('Error listing models:', error.response ? error.response.status : error.message);
        if (error.response) console.error('Data:', error.response.data);
    }
}

listModelsMentor();
