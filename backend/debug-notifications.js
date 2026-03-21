require('dotenv').config({ path: 'c:/Users/DELL/OneDrive/Desktop/CareerGrowth(org)/backend/.env' });
const axios = require('axios');

async function testPushEndpoint() {
    console.log('--- TESTING PUSH NOTIFICATION ENDPOINT ---');
    const baseUrl = 'http://localhost:5000'; // Assuming backend is running locally for this test
    
    try {
        console.log('Sending test push to All Users...');
        // Note: In production, this would need an Admin token. 
        // For local testing, we might need to bypass auth or use a real token.
        const payload = {
            title: "Internal Debug Test",
            body: "If you see this, the backend push logic is alive.",
            url: "/dashboard"
        };
        
        // We can test the FCMService directly instead of the HTTP endpoint to avoid auth issues in this script
        const { FCMService } = require('./src/services/fcmService');
        // We'll just look at the code for now or try to mock the DB
        console.log('FCMService logic check...');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// testPushEndpoint(); // Won't run easily without full env
console.log('Skipping HTTP test, checking FCMService.ts directly for potential silent failures...');
