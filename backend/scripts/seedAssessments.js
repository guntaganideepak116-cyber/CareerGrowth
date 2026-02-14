const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const FIELD_QUESTIONS = {
    'cse': [
        { question: 'What is the time complexity of searching an element in a balanced binary search tree?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswerIndex: 2, difficulty: 'medium', topic: 'Data Structures' },
        { question: 'Which of the following is a NoSQL database?', options: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle'], correctAnswerIndex: 2, difficulty: 'easy', topic: 'Databases' },
        { question: 'What is the primary purpose of a "Join" in SQL?', options: ['To delete data', 'To combine rows from two or more tables', 'To create a backup', 'To encrypt fields'], correctAnswerIndex: 1, difficulty: 'medium', topic: 'Databases' },
        { question: 'In OOP, what is "Inheritance"?', options: ['Hiding internal details', 'One class acquiring properties of another', 'Executing multiple threads', 'Optimizing memory'], correctAnswerIndex: 1, difficulty: 'easy', topic: 'OOP' },
        { question: 'Which OSI layer is responsible for IP addressing?', options: ['Data Link', 'Transport', 'Network', 'Session'], correctAnswerIndex: 2, difficulty: 'medium', topic: 'Networking' },
        { question: 'What does "REST" stand for in web services?', options: ['Representational State Transfer', 'Remote State Transfer', 'Representational Simple Transfer', 'Remote Simple Transfer'], correctAnswerIndex: 0, difficulty: 'medium', topic: 'Web Services' },
        { question: 'Which data structure follows the LIFO principle?', options: ['Queue', 'Stack', 'Linked List', 'Array'], correctAnswerIndex: 1, difficulty: 'easy', topic: 'Data Structures' },
        { question: 'What is a "Deadlock" in OS?', options: ['A process that finishes early', 'A set of processes each waiting for a resource held by another', 'A system crash', 'A memory leak'], correctAnswerIndex: 1, difficulty: 'medium', topic: 'Operating Systems' },
        { question: 'Which language is primarily used for Android app development?', options: ['Swift', 'Kotlin', 'C#', 'PHP'], correctAnswerIndex: 1, difficulty: 'easy', topic: 'Mobile Dev' },
        { question: 'What is the purpose of the "static" keyword in Java/C++?', options: ['To make a variable dynamic', 'To share a variable/method among all instances of a class', 'To delete a variable', 'To encrypt code'], correctAnswerIndex: 1, difficulty: 'medium', topic: 'OOP' }
    ],
    'ece': [
        { question: 'What is the purpose of a filter in an electronic circuit?', options: ['To increase voltage', 'To remove unwanted frequency components', 'To store charge', 'To measure current'], correctAnswerIndex: 1, difficulty: 'easy', topic: 'Signals' },
        { question: 'What does "VLSI" stand for?', options: ['Very Large System Integration', 'Very Large Scale Integration', 'Variable Level Signal Integration', 'Virtual Local Storage Interface'], correctAnswerIndex: 1, difficulty: 'easy', topic: 'Electronics' },
        { question: 'In an NPN transistor, the majority carriers in the base are:', options: ['Electrons', 'Holes', 'Protons', 'Neutrons'], correctAnswerIndex: 1, difficulty: 'medium', topic: 'Semiconductors' },
        { question: 'Which modulation technique changes the frequency of the carrier signal?', options: ['AM', 'FM', 'PM', 'PCM'], correctAnswerIndex: 1, difficulty: 'easy', topic: 'Communication' },
        { question: 'What is the logic gate that gives a high output only when both inputs are high?', options: ['OR', 'NOT', 'AND', 'XOR'], correctAnswerIndex: 2, difficulty: 'easy', topic: 'Digital Electronics' },
        { question: 'What is the characteristic impedance of a typical coaxial cable?', options: ['50 or 75 Ohms', '100 or 150 Ohms', '10 Ohms', '1000 Ohms'], correctAnswerIndex: 0, difficulty: 'medium', topic: 'Transmission Lines' },
        { question: 'What does a Capacitor store?', options: ['Current', 'Voltage', 'Electric Energy in an Electric Field', 'Magnetic Energy'], correctAnswerIndex: 2, difficulty: 'easy', topic: 'Basic Components' },
        { question: 'What is "Sampling Theorem" also known as?', options: ['Ohm\'s Law', 'Nyquist-Shannon Theorem', 'Fourier Series', 'Bohr\'s Model'], correctAnswerIndex: 1, difficulty: 'medium', topic: 'Signals' },
        { question: 'Which device is used to measure the waveform of electronic signals?', options: ['Multimeter', 'Oscilloscope', 'Wattmeter', 'Ammeter'], correctAnswerIndex: 1, difficulty: 'easy', topic: 'Instruments' },
        { question: 'What is the primary function of a Diode?', options: ['To amplify signals', 'To allow current to flow in only one direction', 'To store charge', 'To regulate speed'], correctAnswerIndex: 1, difficulty: 'easy', topic: 'Electronics' }
    ],
    'mech': [
        { question: 'Which law of thermodynamics states that energy cannot be created or destroyed?', options: ['Zeroth Law', 'First Law', 'Second Law', 'Third Law'], correctAnswerIndex: 1, difficulty: 'easy', topic: 'Thermodynamics' },
        { question: 'What is the purpose of a flywheel in an engine?', options: ['To increase speed', 'To store energy and smooth power', 'To cool the engine', 'To filter fuel'], correctAnswerIndex: 1, difficulty: 'medium', topic: 'Mechanics' },
        { question: 'Which material property describes its ability to resist indentation?', options: ['Ductility', 'Malleability', 'Hardness', 'Toughness'], correctAnswerIndex: 2, difficulty: 'easy', topic: 'Materials Science' },
        { question: 'What is the "Stress-Strain" curve used to determine?', options: ['Weight of material', 'Mechanical properties of a material', 'Color of material', 'Chemical composition'], correctAnswerIndex: 1, difficulty: 'medium', topic: 'Strength of Materials' },
        { question: 'What is "Torque" defined as?', options: ['Linear force', 'Turning or twisting force', 'Speed', 'Pressure'], correctAnswerIndex: 1, difficulty: 'easy', topic: 'Mechanics' },
        { question: 'What is the primary function of a "Governor" in an engine?', options: ['To control fuel', 'To maintain constant speed regardless of load', 'To cool the engine', 'To increase power'], correctAnswerIndex: 1, difficulty: 'medium', topic: 'Control Systems' },
        { question: 'Which type of heat transfer occurs in solids primarily?', options: ['Conduction', 'Convection', 'Radiation', 'Evaporation'], correctAnswerIndex: 0, difficulty: 'easy', topic: 'Heat Transfer' },
        { question: 'What does "CAD" stand for in engineering?', options: ['Computer Aided Design', 'Control and Design', 'Computer Audio Design', 'Calculated Area Design'], correctAnswerIndex: 0, difficulty: 'easy', topic: 'Design' },
        { question: 'What is the compression ratio of a typical petrol engine?', options: ['6:1 to 10:1', '15:1 to 20:1', '2:1', '50:1'], correctAnswerIndex: 0, difficulty: 'medium', topic: 'Thermal' },
        { question: 'Which mechanism converts rotary motion into linear motion?', options: ['Gear pair', 'Rack and Pinion', 'Belt Drive', 'Chain Drive'], correctAnswerIndex: 1, difficulty: 'easy', topic: 'Mechanisms' }
    ],
    'civil': [
        { question: 'What is the primary function of a foundation?', options: ['Aesthetics', 'To transfer load to the ground', 'To keep building cool', 'To provide storage'], correctAnswerIndex: 1, difficulty: 'easy', topic: 'Structural' },
        { question: 'Which material has high compressive strength but low tensile strength?', options: ['Steel', 'Wood', 'Concrete', 'Aluminum'], correctAnswerIndex: 2, difficulty: 'easy', topic: 'Materials' },
        { question: 'What does "GPS" stand for in surveying?', options: ['General Position', 'Global Positioning System', 'Geological Pointing', 'Grid Placement'], correctAnswerIndex: 1, difficulty: 'easy', topic: 'Surveying' },
        { question: 'What is the primary purpose of a "Dam"?', options: ['To store water and regulate flow', 'To create bridge', 'To block wind', 'To house people'], correctAnswerIndex: 0, difficulty: 'easy', topic: 'Water Resources' },
        { question: 'In surveying, what is a "Bench Mark"?', options: ['A comfortable seat', 'A point of known elevation', 'A marketing tool', 'A type of soil'], correctAnswerIndex: 1, difficulty: 'medium', topic: 'Surveying' },
        { question: 'What is "Bearing Capacity" of soil?', options: ['Weight of soil', 'Maximum load the soil can support without failure', 'Water content', 'Color of soil'], correctAnswerIndex: 1, difficulty: 'medium', topic: 'Geotechnical' },
        { question: 'What is the purpose of "Curing" concrete?', options: ['To dry it fast', 'To maintain moisture for hydration', 'To paint it', 'To clean it'], correctAnswerIndex: 1, difficulty: 'easy', topic: 'Concrete Technology' },
        { question: 'Which instrument is used to measure vertical and horizontal angles?', options: ['Theodolite', 'Tape', 'Compass', 'Plumb bob'], correctAnswerIndex: 0, difficulty: 'medium', topic: 'Surveying' },
        { question: 'What is the "Slump Test" used for in concrete?', options: ['To check strength', 'To check workability', 'To check color', 'To check price'], correctAnswerIndex: 1, difficulty: 'easy', topic: 'Concrete Technology' },
        { question: 'What is a "Lintel"?', options: ['A type of soil', 'A horizontal member above an opening', 'A vertical support', 'A roof covering'], correctAnswerIndex: 1, difficulty: 'medium', topic: 'Structural' }
    ],
    'eee': [
        { question: 'What is the unit of electrical resistance?', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], correctAnswerIndex: 2, difficulty: 'easy', topic: 'Basic Electrical' },
        { question: 'Which component steps up or down AC voltage?', options: ['Resistor', 'Capacitor', 'Transformer', 'Diode'], correctAnswerIndex: 2, difficulty: 'easy', topic: 'Machines' },
        { question: 'What is Ohm\'s Law?', options: ['V = I/R', 'V = IR', 'V = I+R', 'V = R/I'], correctAnswerIndex: 1, difficulty: 'easy', topic: 'Basic Electrical' },
        { question: 'What is the frequency of AC supply in most countries like India?', options: ['50 Hz', '60 Hz', '100 Hz', '0 Hz'], correctAnswerIndex: 0, difficulty: 'easy', topic: 'Power Systems' },
        { question: 'Which machine converts electrical energy to mechanical energy?', options: ['Generator', 'Motor', 'Transformer', 'Rectifier'], correctAnswerIndex: 1, difficulty: 'easy', topic: 'Machines' },
        { question: 'What is the power factor of a purely resistive circuit?', options: ['0', '0.5', '1', '-1'], correctAnswerIndex: 2, difficulty: 'medium', topic: 'Circuits' },
        { question: 'What does a Zener diode used for?', options: ['Rectification', 'Voltage Regulation', 'Amplification', 'Switching'], correctAnswerIndex: 1, difficulty: 'medium', topic: 'Electronics' },
        { question: 'What is "Skin Effect" in transmission lines?', options: ['Current flows on the surface of conductor', 'Conductor gets hot', 'Voltage drops', 'Line breaks'], correctAnswerIndex: 0, difficulty: 'medium', topic: 'Power Systems' },
        { question: 'Which device protects an electrical circuit from overcurrent?', options: ['Resistor', 'Fuse/MCB', 'Capacitor', 'Inductor'], correctAnswerIndex: 1, difficulty: 'easy', topic: 'Protection' },
        { question: 'What is the unit of Capacitance?', options: ['Henry', 'Farad', 'Tesla', 'Weber'], correctAnswerIndex: 1, difficulty: 'easy', topic: 'Components' }
    ]
};

async function seed() {
    console.log('--- RELATIVE ASSESSMENT SEEDER ---');
    for (const [fieldId, questions] of Object.entries(FIELD_QUESTIONS)) {
        console.log(`Processing ${fieldId}...`);

        // Add new questions
        for (const q of questions) {
            await db.collection('assessment_questions').add({
                ...q,
                fieldId,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }
        console.log(`✅ Seeded ${questions.length} questions for ${fieldId}`);
    }
    console.log('--- SEEDING COMPLETE ---');
    process.exit(0);
}

seed();
