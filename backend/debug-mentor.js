require('dotenv').config({ path: 'c:/Users/DELL/OneDrive/Desktop/CareerGrowth(org)/backend/.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function debugChat() {
    console.log('--- DIAGNOSING AI MENTOR ---');
    const mentorKey = process.env.GEMINI_MENTOR_KEY || process.env.GEMINI_API_KEY;
    console.log('Using Key:', mentorKey ? mentorKey.slice(0, 8) + '...' : 'MISSING');
    
    try {
        const genAI = new GoogleGenerativeAI(mentorKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
        console.log('Attempting generateContent with gemini-2.0-flash-lite...');
        const result = await model.generateContent('Hello, are you working?');
        console.log('Response:', result.response.text());
        console.log('SUCCESS! ✅ Mentor Key/Model pair is working.');
    } catch (error) {
        console.error('FAILED! ❌');
        console.error('Error Status:', error.status);
        console.error('Error Message:', error.message);
        if (error.response) {
            console.error('Response Data:', JSON.stringify(await error.response.json(), null, 2));
        }
    }
}

debugChat();
