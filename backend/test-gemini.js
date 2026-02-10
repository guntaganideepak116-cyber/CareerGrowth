// Test script to verify Gemini API key
require('dotenv').config();

async function testGemini() {
    console.log('\n🔍 Testing Gemini API Configuration...\n');

    // Check if API key is loaded
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.error('❌ ERROR: GEMINI_API_KEY not found in .env file');
        process.exit(1);
    }

    console.log('✅ API Key found');
    console.log(`   Length: ${apiKey.length} characters`);
    console.log(`   Starts with: ${apiKey.substring(0, 10)}...`);

    // Try to import Gemini
    let GoogleGenerativeAI;
    try {
        const module = require('@google/generative-ai');
        GoogleGenerativeAI = module.GoogleGenerativeAI;
        console.log('✅ Google Generative AI package loaded successfully');
    } catch (error) {
        console.error('❌ ERROR: Failed to load Google Generative AI package');
        console.error('   Run: npm install @google/generative-ai');
        process.exit(1);
    }

    // Initialize Gemini client
    let genAI;
    try {
        genAI = new GoogleGenerativeAI(apiKey);
        console.log('✅ Gemini client initialized');
    } catch (error) {
        console.error('❌ ERROR: Failed to initialize Gemini client');
        console.error('   Error:', error.message);
        process.exit(1);
    }

    // Test API call
    console.log('\n🚀 Making test API call to Gemini...\n');

    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.7,
                responseMimeType: 'application/json',
            },
        });

        const result = await model.generateContent('Say "Hello, Gemini API is working!" in JSON format with a field called "message"');
        const response = await result.response;
        const content = response.text();

        if (content) {
            console.log('✅ SUCCESS! Gemini API is working!');
            console.log('\nResponse:', content);
            console.log('\n✨ Your Gemini API key is valid and working correctly!');
            console.log('   The roadmap generation should work now.');
            console.log('\n📝 Next steps:');
            console.log('   1. Restart your backend server (Ctrl+C then npm run dev)');
            console.log('   2. Refresh your frontend');
            console.log('   3. Try generating a roadmap');
            console.log('\n💰 Gemini is FREE with generous limits:');
            console.log('   - 15 requests per minute');
            console.log('   - 1,500 requests per day');
            console.log('   - No billing required!');
        } else {
            console.error('⚠️ WARNING: API responded but no content received');
        }

    } catch (error) {
        console.error('\n❌ FAILED! Gemini API call failed');
        console.error('\nError Details:');
        console.error('  Type:', error.constructor.name);
        console.error('  Message:', error.message);

        if (error.message.includes('API_KEY_INVALID')) {
            console.error('\n🔑 PROBLEM: Invalid API Key');
            console.error('   Your Gemini API key is not valid.');
            console.error('   Solutions:');
            console.error('   1. Go to https://aistudio.google.com/apikey');
            console.error('   2. Create a new API key');
            console.error('   3. Replace the key in backend/.env');
            console.error('   4. Make sure there are NO SPACES after the = sign');
        } else if (error.message.includes('quota')) {
            console.error('\n⚠️ PROBLEM: Quota Exceeded');
            console.error('   You have exceeded the free tier limits.');
            console.error('   Wait a moment and try again.');
        } else {
            console.error('\n🌐 Network or API Error');
            console.error('   Full error:', error);
        }

        process.exit(1);
    }
}

// Run the test
testGemini().catch(error => {
    console.error('\n💥 Unexpected error:', error);
    process.exit(1);
});
