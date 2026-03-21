require('dotenv').config({ path: 'c:/Users/DELL/OneDrive/Desktop/CareerGrowth(org)/backend/.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test15() {
    const key = process.env.GEMINI_MENTOR_KEY || process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);
    
    try {
        console.log("Testing gemini-1.5-flash with key:", key.substring(0, 8) + "...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hi");
        console.log("SUCCESS: 1.5-flash is working!");
    } catch (e) {
        console.log("FAILED: 1.5-flash is still not available. Error:", e.message);
        
        console.log("\nTesting gemini-2.0-flash-lite...");
        try {
            const model2 = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
            const result2 = await model2.generateContent("Hi");
            console.log("SUCCESS: 2.0-flash-lite is working!");
        } catch (e2) {
            console.log("FAILED: 2.0-flash-lite also failed. Error:", e2.message);
        }
    }
}

test15();
