const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function quickSeed() {
    console.log('Fast-tracking essential questions...');
    const data = {
        'cse': { question: 'What is O(log n) search time characteristic of?', options: ['Array', 'Balanced BST', 'Linked List', 'Stack'], correctAnswerIndex: 1, difficulty: 'medium' },
        'ece': { question: 'What is VLSI primary focus?', options: ['Big systems', 'Integrated circuits on one chip', 'Signal wires', 'Virtual storage'], correctAnswerIndex: 1, difficulty: 'easy' },
        'mech': { question: 'First law of thermodynamics relates to?', options: ['Entropy', 'Energy conservation', 'Absolute zero', 'Pressure'], correctAnswerIndex: 1, difficulty: 'easy' },
        'civil': { question: 'Primary foundation purpose?', options: ['Style', 'Load transfer', 'Cooling', 'Storage'], correctAnswerIndex: 1, difficulty: 'easy' },
        'eee': { question: 'Unit of resistance?', options: ['Watt', 'Ampere', 'Ohm', 'Volt'], correctAnswerIndex: 2, difficulty: 'easy' }
    };

    for (const [fid, q] of Object.entries(data)) {
        await db.collection('assessment_questions').add({ ...q, fieldId: fid, createdAt: admin.firestore.FieldValue.serverTimestamp() });
        console.log(`Added question for ${fid}`);
    }
    console.log('Done!');
    process.exit(0);
}
quickSeed();
