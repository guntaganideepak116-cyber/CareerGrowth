import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

const db = admin.firestore();

// Sample assessment questions for different fields
const sampleQuestions = {
    engineering: [
        {
            question: "What is the primary function of an operating system?",
            options: [
                "Manage hardware and software resources",
                "Create documents and spreadsheets",
                "Browse the internet",
                "Play multimedia files"
            ],
            correctAnswerIndex: 0,
            difficulty: "easy",
            topic: "Operating Systems"
        },
        {
            question: "Which data structure uses LIFO (Last In First Out) principle?",
            options: ["Queue", "Stack", "Array", "Linked List"],
            correctAnswerIndex: 1,
            difficulty: "easy",
            topic: "Data Structures"
        },
        {
            question: "What does HTTP stand for?",
            options: [
                "HyperText Transfer Protocol",
                "High Transfer Text Protocol",
                "HyperText Transmission Process",
                "High Tech Transfer Protocol"
            ],
            correctAnswerIndex: 0,
            difficulty: "easy",
            topic: "Networking"
        },
        {
            question: "Which programming paradigm does Java primarily support?",
            options: [
                "Functional Programming",
                "Object-Oriented Programming",
                "Procedural Programming",
                "Logic Programming"
            ],
            correctAnswerIndex: 1,
            difficulty: "medium",
            topic: "Programming"
        },
        {
            question: "What is the time complexity of binary search?",
            options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
            correctAnswerIndex: 1,
            difficulty: "medium",
            topic: "Algorithms"
        },
        {
            question: "Which SQL command is used to retrieve data from a database?",
            options: ["GET", "SELECT", "FETCH", "RETRIEVE"],
            correctAnswerIndex: 1,
            difficulty: "easy",
            topic: "Databases"
        },
        {
            question: "What does API stand for?",
            options: [
                "Application Programming Interface",
                "Advanced Programming Integration",
                "Application Process Integration",
                "Automated Programming Interface"
            ],
            correctAnswerIndex: 0,
            difficulty: "easy",
            topic: "Software Development"
        },
        {
            question: "Which of the following is NOT a valid IP address class?",
            options: ["Class A", "Class B", "Class E", "Class F"],
            correctAnswerIndex: 3,
            difficulty: "medium",
            topic: "Networking"
        },
        {
            question: "What is the purpose of version control systems like Git?",
            options: [
                "Compile code faster",
                "Track changes and collaborate on code",
                "Debug applications",
                "Deploy applications"
            ],
            correctAnswerIndex: 1,
            difficulty: "easy",
            topic: "Software Development"
        },
        {
            question: "Which layer of the OSI model is responsible for routing?",
            options: [
                "Physical Layer",
                "Data Link Layer",
                "Network Layer",
                "Transport Layer"
            ],
            correctAnswerIndex: 2,
            difficulty: "medium",
            topic: "Networking"
        }
    ],
    medicine: [
        {
            question: "What is the largest organ in the human body?",
            options: ["Heart", "Liver", "Skin", "Brain"],
            correctAnswerIndex: 2,
            difficulty: "easy",
            topic: "Anatomy"
        },
        {
            question: "What is the normal resting heart rate for adults?",
            options: ["40-60 bpm", "60-100 bpm", "100-120 bpm", "120-140 bpm"],
            correctAnswerIndex: 1,
            difficulty: "easy",
            topic: "Physiology"
        },
        {
            question: "Which vitamin is produced when skin is exposed to sunlight?",
            options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin E"],
            correctAnswerIndex: 2,
            difficulty: "easy",
            topic: "Nutrition"
        },
        {
            question: "What is the medical term for high blood pressure?",
            options: ["Hypotension", "Hypertension", "Tachycardia", "Bradycardia"],
            correctAnswerIndex: 1,
            difficulty: "easy",
            topic: "Pathology"
        },
        {
            question: "Which blood type is known as the universal donor?",
            options: ["A+", "B+", "AB+", "O-"],
            correctAnswerIndex: 3,
            difficulty: "medium",
            topic: "Hematology"
        },
        {
            question: "What is the primary function of red blood cells?",
            options: [
                "Fight infections",
                "Transport oxygen",
                "Clot blood",
                "Produce antibodies"
            ],
            correctAnswerIndex: 1,
            difficulty: "easy",
            topic: "Hematology"
        },
        {
            question: "Which organ produces insulin?",
            options: ["Liver", "Kidney", "Pancreas", "Spleen"],
            correctAnswerIndex: 2,
            difficulty: "medium",
            topic: "Endocrinology"
        },
        {
            question: "What is the medical term for a heart attack?",
            options: [
                "Myocardial Infarction",
                "Cardiac Arrest",
                "Angina Pectoris",
                "Arrhythmia"
            ],
            correctAnswerIndex: 0,
            difficulty: "medium",
            topic: "Cardiology"
        },
        {
            question: "How many bones are in the adult human body?",
            options: ["186", "206", "226", "246"],
            correctAnswerIndex: 1,
            difficulty: "easy",
            topic: "Anatomy"
        },
        {
            question: "What is the primary neurotransmitter involved in Parkinson's disease?",
            options: ["Serotonin", "Dopamine", "Acetylcholine", "GABA"],
            correctAnswerIndex: 1,
            difficulty: "hard",
            topic: "Neurology"
        }
    ],
    business: [
        {
            question: "What does ROI stand for in business?",
            options: [
                "Return on Investment",
                "Rate of Interest",
                "Revenue of Income",
                "Return on Income"
            ],
            correctAnswerIndex: 0,
            difficulty: "easy",
            topic: "Finance"
        },
        {
            question: "What is a SWOT analysis used for?",
            options: [
                "Financial forecasting",
                "Strategic planning",
                "Employee evaluation",
                "Product pricing"
            ],
            correctAnswerIndex: 1,
            difficulty: "easy",
            topic: "Strategy"
        },
        {
            question: "What does B2B stand for?",
            options: [
                "Business to Business",
                "Back to Basics",
                "Business to Buyer",
                "Brand to Business"
            ],
            correctAnswerIndex: 0,
            difficulty: "easy",
            topic: "Marketing"
        },
        {
            question: "What is the primary goal of marketing?",
            options: [
                "Reduce costs",
                "Increase sales and customer satisfaction",
                "Manage employees",
                "Develop products"
            ],
            correctAnswerIndex: 1,
            difficulty: "easy",
            topic: "Marketing"
        },
        {
            question: "What is equity in a business context?",
            options: [
                "Total revenue",
                "Ownership value in a company",
                "Total expenses",
                "Market share"
            ],
            correctAnswerIndex: 1,
            difficulty: "medium",
            topic: "Finance"
        },
        {
            question: "What does KPI stand for?",
            options: [
                "Key Performance Indicator",
                "Key Profit Index",
                "Knowledge Process Integration",
                "Key Product Information"
            ],
            correctAnswerIndex: 0,
            difficulty: "easy",
            topic: "Management"
        },
        {
            question: "What is a balance sheet?",
            options: [
                "A record of sales",
                "A financial statement showing assets, liabilities, and equity",
                "An employee roster",
                "A marketing plan"
            ],
            correctAnswerIndex: 1,
            difficulty: "medium",
            topic: "Accounting"
        },
        {
            question: "What is the purpose of a business plan?",
            options: [
                "Track daily expenses",
                "Outline business goals and strategies",
                "Manage inventory",
                "Calculate taxes"
            ],
            correctAnswerIndex: 1,
            difficulty: "easy",
            topic: "Entrepreneurship"
        },
        {
            question: "What does SEO stand for in digital marketing?",
            options: [
                "Sales Enhancement Operation",
                "Search Engine Optimization",
                "Social Engagement Outreach",
                "Strategic Email Optimization"
            ],
            correctAnswerIndex: 1,
            difficulty: "easy",
            topic: "Digital Marketing"
        },
        {
            question: "What is market segmentation?",
            options: [
                "Dividing a market into distinct groups of buyers",
                "Calculating market share",
                "Setting product prices",
                "Analyzing competitors"
            ],
            correctAnswerIndex: 0,
            difficulty: "medium",
            topic: "Marketing"
        }
    ]
};

async function seedAssessmentQuestions() {
    console.log('🌱 Starting to seed assessment questions...\n');

    try {
        const batch = db.batch();
        let totalQuestions = 0;

        for (const [fieldId, questions] of Object.entries(sampleQuestions)) {
            console.log(`📚 Adding questions for field: ${fieldId}`);

            for (const question of questions) {
                const docRef = db.collection('assessment_questions').doc();
                batch.set(docRef, {
                    fieldId,
                    ...question,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
                totalQuestions++;
            }

            console.log(`   ✅ Added ${questions.length} questions for ${fieldId}`);
        }

        await batch.commit();
        console.log(`\n✅ Successfully seeded ${totalQuestions} assessment questions!`);
        console.log('\n📊 Summary:');
        for (const [fieldId, questions] of Object.entries(sampleQuestions)) {
            console.log(`   - ${fieldId}: ${questions.length} questions`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding questions:', error);
        process.exit(1);
    }
}

// Run the seed function
seedAssessmentQuestions();
