require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
    console.log('\n🔍 Checking available Gemini models for your API key...\n');

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    try {
        // Try different model names that might work 
        const modelsToTry = [
            'gemini-1.5-flash', 
            'gemini-1.5-pro',
            'gemini-pro',
            'gemini-1.0-pro',
            'models/gemini-1.5-flash',
            'models/gemini-pro',
        ];

        console.log('Testing model access...\n');

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent('Hello');
                console.log(`✅ ${modelName} - WORKS!`);
                console.log(`   Response: ${result.response.text().substring(0, 50)}...\n`);

                // If we found one that works, save it
                console.log(`\n🎉 SUCCESS! Use this model: "${modelName}"\n`);
                return modelName;
            } catch (error) {
                console.log(`❌ ${modelName} - ${error.message.split(':')[0]}`);
            }
        }

        console.log('\n⚠️ None of the common models work with your API key.');
        console.log('\nPossible reasons:');
        console.log('1. API key region restrictions');
        console.log('2. API key requires additional permissions');
        console.log('3. Account needs verification');
        console.log('\nRecommendation: Use OpenAI instead (add $5 credits)');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    }
}

listModels();
