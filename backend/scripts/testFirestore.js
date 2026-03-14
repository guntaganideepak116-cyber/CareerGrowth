const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function test() {
    console.log('Testing Firestore write...');
    try {
        await db.collection('assessment_questions').add({
            fieldId: 'test-field',
            question: 'Is this a test?',
            options: ['Yes', 'No'],
            correctAnswerIndex: 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log('✅ Success!');
    } catch (e) {
        console.error('❌ Failed:', e);
    }
    process.exit(0);
}
test();
