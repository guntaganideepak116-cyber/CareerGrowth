import { db } from "@/lib/firebase";
import { collection, writeBatch, doc, getDocs, query, where } from "firebase/firestore";
import { fields } from "@/data/fieldsData";

// Helper to create questions
const createQuestion = (
    fieldId: string,
    question: string,
    options: string[],
    correctIndex: number,
    topic: string
) => ({
    fieldId,
    question,
    options,
    correctAnswer: correctIndex, // Stored as number 0-3
    difficulty: "basic",
    topic,
    createdAt: new Date().toISOString(),
});

// Category Mappings
const CATEGORIES = {
    TECH: ['engineering', 'cloud-computing', 'devops-sre', 'blockchain-web3', 'ar-vr-mr', 'quantum-computing', 'robotics-automation', 'product-management', 'uiux-hci', 'vocational'],
    SCIENCE: ['medical', 'science', 'bioinformatics-compbio', 'agriculture', 'sports'],
    BUSINESS: ['commerce', 'hospitality'],
    ARTS: ['arts', 'law', 'education', 'design', 'defense']
};

// Question Banks
const TECH_QUESTIONS = [
    { q: "What is the primary function of a variable in programming?", opts: ["To store data values", "To display graphics", "To connect to the internet", "To physically cool the CPU"], ans: 0, topic: "Fundamentals" },
    { q: "Which data structure operates on a Last-In, First-Out (LIFO) principle?", opts: ["Queue", "Stack", "Tree", "Graph"], ans: 1, topic: "Data Structures" },
    { q: "What does API stand for?", opts: ["Application Programming Interface", "Advanced Peripheral Integration", "Automated Process Interaction", "Applied Protocol Instruction"], ans: 0, topic: "Terminology" },
    { q: "Which of the following is an example of an Operating System?", opts: ["Google Chrome", "Linux", "Microsoft Word", "Python"], ans: 1, topic: "Systems" },
    { q: "In binary code, what does a 'bit' represent?", opts: ["A byte of data", "A 0 or 1", "A pixel", "A character"], ans: 1, topic: "Digital Logic" },
    { q: "What is the main purpose of a database?", opts: ["To compile code", "To design user interfaces", "To store and retrieve data efficiently", "To manage network traffic"], ans: 2, topic: "Databases" },
    { q: "Which protocol is primarily used for securing web traffic?", opts: ["FTP", "HTTP", "HTTPS", "SMTP"], ans: 2, topic: "Security" },
    { q: "What is 'Cloud Computing'?", opts: ["Computing at high altitudes", "Delivery of computing services over the internet", "Weather prediction using computers", "Storing data on hard drives"], ans: 1, topic: "Cloud" },
    { q: "What is a 'bug' in software development?", opts: ["A virus", "A hardware malfunction", "An error or flaw in the code", "A feature"], ans: 2, topic: "Testing" },
    { q: "Which language is primarily used for web page structure?", opts: ["CSS", "HTML", "JavaScript", "SQL"], ans: 1, topic: "Web Dev" },
    { q: "What does CPU stand for?", opts: ["Central Processing Unit", "Computer Personal Unit", "Central Power Unit", "Central Program Utility"], ans: 0, topic: "Hardware" },
    { q: "What is 'Latency' in networking?", opts: ["Bandwidth speed", "Data loss", "Time delay in data transmission", "Signal strength"], ans: 2, topic: "Networking" },
    { q: "Which of these is a version control system?", opts: ["Jira", "Git", "Slack", "Docker"], ans: 1, topic: "Tools" },
    { q: "What is the purpose of an IP address?", opts: ["To identify a device on a network", "To store passwords", "To encrypt data", "To speed up the internet"], ans: 0, topic: "Networking" },
    { q: "What does 'Open Source' mean?", opts: ["Software that costs money", "Software with source code available for modification", "Software that connects to the open internet", "Software without security"], ans: 1, topic: "Industry" },
];

const SCIENCE_QUESTIONS = [
    { q: "What is the basic unit of life?", opts: ["Atom", "Molecule", "Cell", "Tissue"], ans: 2, topic: "Biology" },
    { q: "Which gas do plants absorb from the atmosphere?", opts: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], ans: 2, topic: "Botany" },
    { q: "What is the powerhouse of the cell?", opts: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Apparatus"], ans: 2, topic: "Cell Biology" },
    { q: "What is the chemical symbol for Gold?", opts: ["Ag", "Au", "Fe", "Pb"], ans: 1, topic: "Chemistry" },
    { q: "Which planet is known as the Red Planet?", opts: ["Venus", "Jupiter", "Mars", "Saturn"], ans: 2, topic: "Astronomy" },
    { q: "What is the most abundant gas in Earth's atmosphere?", opts: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"], ans: 2, topic: "Earth Science" },
    { q: "What is the process by which plants make food?", opts: ["Respiration", "Photosynthesis", "Digestion", "Transpiration"], ans: 1, topic: "Botany" },
    { q: "Which organ pumps blood in the human body?", opts: ["Lungs", "Brain", "Heart", "Liver"], ans: 2, topic: "Anatomy" },
    { q: "What is the boiling point of water at sea level?", opts: ["90°C", "100°C", "110°C", "120°C"], ans: 1, topic: "Physics" },
    { q: "What is the center of an atom called?", opts: ["Proton", "Electron", "Nucleus", "Neutron"], ans: 2, topic: "Physics" },
    { q: "Which vitamin is produced by the body when exposed to sunlight?", opts: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin B12"], ans: 2, topic: "Health" },
    { q: "What is the study of fungi called?", opts: ["Botany", "Zoology", "Mycology", "Virology"], ans: 2, topic: "Biology" },
    { q: "What force keeps us on the ground?", opts: ["Magnetism", "Friction", "Gravity", "Tension"], ans: 2, topic: "Physics" },
    { q: "Which element has the atomic number 1?", opts: ["Helium", "Hydrogen", "Lithium", "Carbon"], ans: 1, topic: "Chemistry" },
    { q: "What is the main function of red blood cells?", opts: ["Fight infection", "Clot blood", "Carry oxygen", "Digest food"], ans: 2, topic: "Physiology" },
];

const BUSINESS_QUESTIONS = [
    { q: "What does 'ROI' stand for?", opts: ["Return on Investment", "Rate of Inflation", "Risk of Interest", "Return on Income"], ans: 0, topic: "Finance" },
    { q: "What is the primary goal of marketing?", opts: ["To hire employees", "To create products", "To promote and sell products/services", "To manage finances"], ans: 2, topic: "Marketing" },
    { q: "What allows a business to differ from its competitors?", opts: ["Unique Selling Proposition (USP)", "Tax ID", "Location", "CEO Name"], ans: 0, topic: "Strategy" },
    { q: "What is a 'Balance Sheet'?", opts: ["A list of employees", "A marketing plan", "A financial statement of assets, liabilities, and equity", "A production schedule"], ans: 2, topic: "Accounting" },
    { q: "Which department manages employee relations?", opts: ["Finance", "Human Resources (HR)", "IT", "Sales"], ans: 1, topic: "Management" },
    { q: "What does 'B2B' mean?", opts: ["Business to Business", "Business to Buyer", "Back to Business", "Buyer to Business"], ans: 0, topic: "Terminology" },
    { q: "What is 'Inflation'?", opts: ["Decrease in prices", "Increase in the general price level of goods and services", "Increase in stock market", "Decrease in employment"], ans: 1, topic: "Economics" },
    { q: "What implies a 'Bear Market'?", opts: ["Rising stock prices", "Stable prices", "Falling stock prices", "High employment"], ans: 2, topic: "Finance" },
    { q: "What is 'Equity'?", opts: ["Debt owed", "Ownership interest in an asset", "Monthly revenue", "Operating cost"], ans: 1, topic: "Finance" },
    { q: "What is the 4 P's of marketing?", opts: ["Product, Price, Place, Promotion", "Planning, People, Profit, Process", "Power, Politics, Performance, People", "Price, Profit, Plan, Pitch"], ans: 0, topic: "Marketing" },
    { q: "What acts as a medium of exchange?", opts: ["Goods", "Services", "Money", "Barter"], ans: 2, topic: "Economics" },
    { q: "What is a 'Startup'?", opts: ["A large corporation", "A government agency", "A newly established business", "A non-profit"], ans: 2, topic: "Entrepreneurship" },
    { q: "What involves managing the flow of goods?", opts: ["Marketing", "Supply Chain Management", "Accounting", "HR"], ans: 1, topic: "Operations" },
    { q: "What is 'Net Income'?", opts: ["Total Revenue", "Revenue minus Expenses", "Total Assets", "Total Liabilities"], ans: 1, topic: "Accounting" },
    { q: "What is a 'Stakeholder'?", opts: ["Only the owner", "Only the customer", "Anyone interested in or affected by the business", "Only the employees"], ans: 2, topic: "Business Ethics" },
];

const ARTS_QUESTIONS = [
    { q: "What is the primary purpose of a 'Contract'?", opts: ["To suggest guidelines", "To create legally binding obligations", "To list ideas", "To summarize a meeting"], ans: 1, topic: "Law" },
    { q: "Which color is primary?", opts: ["Green", "Orange", "Blue", "Purple"], ans: 2, topic: "Design" },
    { q: "What is 'Typography'?", opts: ["Map making", "The art of arranging type", "Painting on canvas", "Sculpting"], ans: 1, topic: "Design" },
    { q: "What does 'Copyright' protect?", opts: ["Inventions", "Brand names", "Original works of authorship", "Discoveries"], ans: 2, topic: "Law" },
    { q: "What is a 'Pedagogy'?", opts: ["Medical study of feet", "The method and practice of teaching", "A type of government", "An art style"], ans: 1, topic: "Education" },
    { q: "In design, what is 'Whitespace'?", opts: ["The color white", "Empty space around elements", "A printing error", "A type of font"], ans: 1, topic: "Design" },
    { q: "What is the highest court in India?", opts: ["High Court", "District Court", "Supreme Court", "Tribunal"], ans: 2, topic: "Law" },
    { q: " What is 'Abstract Art'?", opts: ["Realistic portraits", "Art that does not attempt to represent external reality accurately", "Photographs", "Sculptures of animals"], ans: 1, topic: "Arts" },
    { q: "What is the study of human behavior called?", opts: ["Biology", "Geology", "Psychology", "Physics"], ans: 2, topic: "Psychology" },
    { q: "What is a 'Syllabus'?", opts: ["A musical instrument", "A summary of topics to be covered in a course", "A type of degree", "A school building"], ans: 1, topic: "Education" },
    { q: "What is 'UX' Design?", opts: ["User Experience Design", "Universal Xylophone Design", "Under X-ray Design", "User Xerography Design"], ans: 0, topic: "Design" },
    { q: "What is a 'Plaintiff'?", opts: ["The person being sued", "The judge", "The person who brings a case against another", "The lawyer"], ans: 2, topic: "Law" },
    { q: "What color is created by mixing Red and Yellow?", opts: ["Green", "Purple", "Orange", "Brown"], ans: 2, topic: "Color Theory" },
    { q: "What is 'Public Policy'?", opts: ["Private company rules", "Government actions to address public issues", "Individual opinions", "School rules"], ans: 1, topic: "Policy" },
    { q: "Which of these is a visual element?", opts: ["Texture", "Sound", "Taste", "Smell"], ans: 0, topic: "Design" },
];


const generateQuestionsForField = (fieldId: string, fieldName: string) => {
    let selectedBank = TECH_QUESTIONS;

    if (CATEGORIES.SCIENCE.includes(fieldId)) selectedBank = SCIENCE_QUESTIONS;
    else if (CATEGORIES.BUSINESS.includes(fieldId)) selectedBank = BUSINESS_QUESTIONS;
    else if (CATEGORIES.ARTS.includes(fieldId)) selectedBank = ARTS_QUESTIONS;

    // Create questions based on the bank, shuffling options to ensure randomness in correct index even if bank is static
    return selectedBank.map((item, index) => {
        // We want to randomize the position of the correct answer
        // The bank 'ans' is the index of the correct option in 'item.opts'

        const correctText = item.opts[item.ans];
        const otherOptions = item.opts.filter((_, i) => i !== item.ans);

        // Shuffle options: Insert correct text at a random position
        const newCorrectIndex = Math.floor(Math.random() * 4);
        const finalOptions = [...otherOptions];
        finalOptions.splice(newCorrectIndex, 0, correctText);

        // Ensure we have exactly 4 options by trimming or padding if bank had issues (safety)
        // The banks above have exactly 4, so this is fine.

        return createQuestion(
            fieldId,
            item.q, // Use the generic question
            finalOptions,
            newCorrectIndex,
            item.topic
        );
    });
};

export const seedAssessmentQuestions = async () => {
    console.log("Starting Assessment Seed...");

    try {
        let totalQuestions = 0;

        for (const field of fields) {
            const qBatch = writeBatch(db);

            // Delete existing
            const existingQ = query(collection(db, "assessment_questions"), where("fieldId", "==", field.id));
            const snapshot = await getDocs(existingQ);
            snapshot.docs.forEach((doc) => {
                qBatch.delete(doc.ref);
            });

            // Generate new
            const questions = generateQuestionsForField(field.id, field.name);

            questions.forEach((q) => {
                const newDocRef = doc(collection(db, "assessment_questions"));
                qBatch.set(newDocRef, q);
            });

            await qBatch.commit();
            totalQuestions += questions.length;
            console.log(`Processed ${field.name}: ${questions.length} questions`);
        }

        return { success: true, count: totalQuestions };
    } catch (error) {
        console.error("Seeding failed:", error);
        return { success: false, error };
    }
};
