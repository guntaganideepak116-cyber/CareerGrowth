// Test script to verify OpenAI API key
require('dotenv').config();

async function testOpenAI() {
    console.log('\n🔍 Testing OpenAI API Configuration...\n');

    // Check if API key is loaded
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.error('❌ ERROR: OPENAI_API_KEY not found in .env file');
        process.exit(1);
    }

    console.log('✅ API Key found');
    console.log(`   Length: ${apiKey.length} characters`);
    console.log(`   Starts with: ${apiKey.substring(0, 10)}...`);
    console.log(`   Has spaces: ${apiKey.includes(' ') ? '⚠️ YES (PROBLEM!)' : '✅ No'}`);

    // Try to import OpenAI
    let OpenAI;
    try {
        OpenAI = require('openai').default;
        console.log('✅ OpenAI package loaded successfully');
    } catch (error) {
        console.error('❌ ERROR: Failed to load OpenAI package');
        console.error('   Run: npm install openai');
        process.exit(1);
    }

    // Initialize OpenAI client
    let openai;
    try {
        openai = new OpenAI({ apiKey });
        console.log('✅ OpenAI client initialized');
    } catch (error) {
        console.error('❌ ERROR: Failed to initialize OpenAI client');
        console.error('   Error:', error.message);
        process.exit(1);
    }

    // Test API call
    console.log('\n🚀 Making test API call to OpenAI...\n');

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant. Respond in JSON format.',
                },
                {
                    role: 'user',
                    content: 'Say "Hello, API is working!" in JSON format with a field called "message"',
                },
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' },
        });

        const content = response.choices[0]?.message?.content;

        if (content) {
            console.log('✅ SUCCESS! OpenAI API is working!');
            console.log('\nResponse:', content);
            console.log('\n✨ Your OpenAI API key is valid and working correctly!');
            console.log('   The roadmap generation should work now.');
            console.log('\n📝 Next steps:');
            console.log('   1. Restart your backend server (Ctrl+C then npm run dev)');
            console.log('   2. Refresh your frontend');
            console.log('   3. Try generating a roadmap');
        } else {
            console.error('⚠️ WARNING: API responded but no content received');
        }

    } catch (error) {
        console.error('\n❌ FAILED! OpenAI API call failed');
        console.error('\nError Details:');
        console.error('  Type:', error.constructor.name);
        console.error('  Message:', error.message);

        if (error.status) {
            console.error('  HTTP Status:', error.status);
        }

        if (error.status === 401) {
            console.error('\n🔑 PROBLEM: Invalid API Key');
            console.error('   Your OpenAI API key is not valid or has been deactivated.');
            console.error('   Solutions:');
            console.error('   1. Go to https://platform.openai.com/api-keys');
            console.error('   2. Create a new API key');
            console.error('   3. Replace the key in backend/.env');
            console.error('   4. Make sure there are NO SPACES after the = sign');
        } else if (error.status === 429) {
            console.error('\n⚠️ PROBLEM: Rate Limit or Quota Exceeded');
            console.error('   Solutions:');
            console.error('   1. Check your usage at https://platform.openai.com/usage');
            console.error('   2. Add credits to your account');
            console.error('   3. Wait a moment and try again');
        } else if (error.status === 403) {
            console.error('\n⚠️ PROBLEM: Access Denied');
            console.error('   Your account may not have access to GPT-4o-mini');
        } else {
            console.error('\n🌐 Network or API Error');
            console.error('   Full error:', JSON.stringify(error, null, 2));
        }

        process.exit(1);
    }
}

// Run the test
testOpenAI().catch(error => {
    console.error('\n💥 Unexpected error:', error);
    process.exit(1);
});
