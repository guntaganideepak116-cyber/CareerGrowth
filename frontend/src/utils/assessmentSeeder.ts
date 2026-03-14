import { db } from "@/lib/firebase";
import { collection, writeBatch, doc, getDocs, query, where } from "firebase/firestore";
import { fields, branchesMap } from "@/data/fieldsData";

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
// Category Mappings (Updated for specific handling)
const CATEGORIES = {
    // Specific banks will be used primarily, these are fallbacks
    TECH: ['engineering', 'cloud-computing', 'devops-sre', 'blockchain-web3', 'ar-vr-mr', 'quantum-computing', 'robotics-automation', 'product-management', 'uiux-hci', 'vocational', 'cse', 'ece', 'eee', 'civil', 'mech'],
    SCIENCE: ['medical', 'science', 'bioinformatics-compbio', 'agriculture', 'sports'],
    BUSINESS: ['commerce', 'hospitality'],
    ARTS: ['arts', 'law', 'education', 'design', 'defense']
};

// --- Specific Question Banks ---

const CSE_QUESTIONS = [
    { q: "What is the time complexity of searching in a balanced BST?", opts: ["O(n)", "O(log n)", "O(n^2)", "O(1)"], ans: 1, topic: "Data Structures" },
    { q: "Which of these is a NoSQL database?", opts: ["MySQL", "PostgreSQL", "MongoDB", "Oracle"], ans: 2, topic: "Databases" },
    { q: "What is a deadlock condition?", opts: ["System crash", "Two processes waiting for each other", "Memory leak", "Network failure"], ans: 1, topic: "OS" },
    { q: "OSI layer responsible for routing?", opts: ["Physical", "Data Link", "Network", "Transport"], ans: 2, topic: "Networks" },
    { q: "Principle of hiding internal details?", opts: ["Polymorphism", "Encapsulation", "Inheritance", "Abstraction"], ans: 1, topic: "OOP" },
    { q: "Sorting algorithm with best average case?", opts: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Quick Sort"], ans: 2, topic: "Algorithms" },
    { q: "What does HTTP stand for?", opts: ["HyperText Transfer Protocol", "High Transfer Text Protocol", "HyperText Transmission Process", "Hyper Technical Transfer Protocol"], ans: 0, topic: "Web" },
    { q: "Main memory of a computer is?", opts: ["HDD", "SSD", "RAM", "DVD"], ans: 2, topic: "Hardware" },
    { q: "Smallest unit of data in a computer?", opts: ["Bit", "Byte", "Nibble", "Word"], ans: 0, topic: "Fundamentals" },
    { q: "Which is not an Operating System?", opts: ["Linux", "Windows", "Oracle", "MacOS"], ans: 2, topic: "OS" },
    { q: "What is a Stack?", opts: ["LIFO structure", "FIFO structure", "Random access", "Sorted list"], ans: 0, topic: "Data Structures" },
    { q: "Protocol used for sending emails?", opts: ["HTTP", "FTP", "SMTP", "POP3"], ans: 2, topic: "Networks" }
];

const ECE_QUESTIONS = [
    { q: "Function of a filter?", opts: ["Amplify signal", "Remove unwanted frequencies", "Store charge", "Generate power"], ans: 1, topic: "Signals" },
    { q: "VLSI stands for?", opts: ["Very Large Scale Integration", "Variable Level Signal Integration", "Virtual Local Storage", "Video Large Screen"], ans: 0, topic: "Electronics" },
    { q: "Component used to amplify signals?", opts: ["Resistor", "Capacitor", "Transistor", "Diode"], ans: 2, topic: "Analog" },
    { q: "Gate that outputs high only if all inputs high?", opts: ["OR", "NAND", "AND", "XOR"], ans: 2, topic: "Digital" },
    { q: "What is modulation?", opts: ["Varying carrier properties", "Digitizing signals", "Amplifying power", "Reducing noise"], ans: 0, topic: "Communication" },
    { q: "Unit of frequency?", opts: ["Watt", "Volt", "Hertz", "Ampere"], ans: 2, topic: "Basics" },
    { q: "Function of a diode?", opts: ["Amplify current", "Allow current in one direction", "Store energy", "Measure voltage"], ans: 1, topic: "Components" },
    { q: "What is a Microcontroller?", opts: ["A small computer on a chip", "A large server", "A power supply", "A display unit"], ans: 0, topic: "Embedded" },
    { q: "Kirchhoff's Voltage Law conservation of?", opts: ["Charge", "Energy", "Momentum", "Mass"], ans: 1, topic: "Circuits" },
    { q: "What is PCB?", opts: ["Printed Circuit Board", "Power Control Block", "Process Control Bus", "Program Counter Buffer"], ans: 0, topic: "Hardware" }
];

const EEE_QUESTIONS = [
    { q: "Unit of Resistance?", opts: ["Volt", "Ampere", "Ohm", "Watt"], ans: 2, topic: "Basics" },
    { q: "Ohm's Law relation?", opts: ["V=IR", "I=VR", "R=VI", "P=VI"], ans: 0, topic: "Circuits" },
    { q: "Component that blocks AC?", opts: ["Resistor", "Capacitor", "Inductor", "Diode"], ans: 2, topic: "Components" },
    { q: "Function of Transformer?", opts: ["Convert AC to DC", "Change voltage levels", "Store energy", "Generate power"], ans: 1, topic: "Machines" },
    { q: "Standard AC frequency in India?", opts: ["60Hz", "50Hz", "100Hz", "120Hz"], ans: 1, topic: "Power Systems" },
    { q: "Device converts mechanical to electrical energy?", opts: ["Motor", "Generator", "Inverter", "Rectifier"], ans: 1, topic: "Machines" },
    { q: "Purpose of earthing?", opts: ["Save energy", "Safety from shock", "Increase voltage", "Reduce cost"], ans: 1, topic: "Safety" },
    { q: "Unit of Power?", opts: ["Joule", "Watt", "Newton", "Coulomb"], ans: 1, topic: "Basics" },
    { q: "Material used for filament in bulbs?", opts: ["Copper", "Iron", "Tungsten", "Aluminum"], ans: 2, topic: "Materials" },
    { q: "What is an Inverter?", opts: ["DC to AC converter", "AC to DC converter", "Voltage regulator", "Current limiter"], ans: 0, topic: "Power Electronics" }
];

const CIVIL_QUESTIONS = [
    { q: "Primary function of a foundation?", opts: ["Aesthetics", "Transfer load to ground", "Ventilation", "Storage"], ans: 1, topic: "Structures" },
    { q: "Reinforcement in concrete is usually?", opts: ["Aluminum", "Copper", "Steel", "Plastic"], ans: 2, topic: "Materials" },
    { q: "Instrument for measuring angles?", opts: ["Theodolite", "Thermometer", "Barometer", "Speedometer"], ans: 0, topic: "Surveying" },
    { q: "Measure of fluid resistance to flow?", opts: ["Density", "Viscosity", "Pressure", "Gravity"], ans: 1, topic: "Fluids" },
    { q: "Test for concrete workability?", opts: ["Tensile test", "Slump test", "Impact test", "Hardness test"], ans: 1, topic: "Technology" },
    { q: "BIM stands for?", opts: ["Building Information Modeling", "Basic Infra Management", "Bridge Inspection Method", "Building Internal Map"], ans: 0, topic: "Management" },
    { q: "Main cause of soil erosion?", opts: ["Wind and Water", "Heat", "Magnetism", "Electricity"], ans: 0, topic: "Geotech" },
    { q: "Ratio of cement, sand, aggregate in M20?", opts: ["1:1.5:3", "1:2:4", "1:3:6", "1:1:2"], ans: 0, topic: "Concrete" },
    { q: "Load acting permanently on structure?", opts: ["Live load", "Dead load", "Wind load", "Snow load"], ans: 1, topic: "Structures" },
    { q: "Smallest particle of soil?", opts: ["Sand", "Silt", "Clay", "Gravel"], ans: 2, topic: "Soil Mech" }
];

const MECH_QUESTIONS = [
    { q: "First Law of Thermodynamics conservation of?", opts: ["Mass", "Energy", "Momentum", "Heat"], ans: 1, topic: "Thermo" },
    { q: "Ratio of inertia to viscous force?", opts: ["Reynolds Number", "Mach Number", "Froude Number", "Euler Number"], ans: 0, topic: "Fluids" },
    { q: "Process of heating and slow cooling?", opts: ["Quenching", "Annealing", "Tempering", "Hardening"], ans: 1, topic: "Manufacturing" },
    { q: "Function of flywheel?", opts: ["Store energy", "Cool engine", "Burn fuel", "Lubricate"], ans: 0, topic: "Machines" },
    { q: "Unit of Torque?", opts: ["Newton", "Joule", "Newton-meter", "Watt"], ans: 2, topic: "Mechanics" },
    { q: "Alloy element in stainless steel?", opts: ["Carbon", "Chromium", "Copper", "Zinc"], ans: 1, topic: "Materials" },
    { q: "4-stroke engine power stroke every?", opts: ["1 revolution", "2 revolutions", "4 revolutions", "0.5 revolution"], ans: 1, topic: "IC Engines" },
    { q: "Efficiency of Carnot cycle depends on?", opts: ["Working substance", "Temperatures", "Pressure", "Volume"], ans: 1, topic: "Thermo" },
    { q: "Property of material to resist indentation?", opts: ["Ductility", "Hardness", "Toughness", "Elasticity"], ans: 1, topic: "Materials" },
    { q: "Pump used for high viscosity fluids?", opts: ["Centrifugal", "Reciprocating", "Gear", "Jet"], ans: 2, topic: "Fluids" }
];

const DEVOPS_QUESTIONS = [
    { q: "What is CI/CD?", opts: ["Continuous Integration/Deployment", "Code Integration/Design", "Cloud Interface/Data", "Computer Instruction/Debug"], ans: 0, topic: "Process" },
    { q: "Tool for containerization?", opts: ["Git", "Docker", "Jenkins", "Ansible"], ans: 1, topic: "Tools" },
    { q: "Infrastructure as Code tool?", opts: ["Terraform", "Photoshop", "Excel", "Word"], ans: 0, topic: "IaC" },
    { q: "Kubernetes is used for?", opts: ["Source control", "Container orchestration", "Database management", "Graphics rendering"], ans: 1, topic: "Orchestration" },
    { q: "What is Jenkins?", opts: ["OS", "Automation server", "Database", "IDE"], ans: 1, topic: "CI/CD" },
    { q: "Goal of SRE?", opts: ["Maximize instability", "Reliability and scalability", "Manual deployment", "Slow release cycles"], ans: 1, topic: "SRE" },
    { q: "Version control system?", opts: ["Git", "Node", "React", "Docker"], ans: 0, topic: "VCS" },
    { q: "What is 'Monitoring'?", opts: ["Watching videos", "Tracking system health", "Writing code", "Selling software"], ans: 1, topic: "Ops" },
    { q: "Blue-Green deployment reduces?", opts: ["Cost", "Downtime", "Code size", "Disk space"], ans: 1, topic: "Deployment" },
    { q: "What is a 'Pipeline'?", opts: ["Water pipe", "Automated process workflow", "Electrical wire", "Network cable"], ans: 1, topic: "CI/CD" }
];

const ARVR_QUESTIONS = [
    { q: "Difference between AR and VR?", opts: ["AR adds to reality, VR replaces it", "VR adds to reality, AR replaces it", "No difference", "Both involve headsets only"], ans: 0, topic: "Concepts" },
    { q: "Unity is a?", opts: ["Database", "Game Engine", "Web Browser", "OS"], ans: 1, topic: "Tools" },
    { q: "What is 'HMD'?", opts: ["Head Mounted Display", "Hand Motion Detector", "High Mode Definition", "Heavy Metal Device"], ans: 0, topic: "Hardware" },
    { q: "Latency causes what in VR?", opts: ["Sharper images", "Motion sickness", "Faster gameplay", "Better audio"], ans: 1, topic: "UX" },
    { q: "What is Mixed Reality?", opts: ["Creating music", "Blending physical and digital worlds", "Mixing colors", "Social networking"], ans: 1, topic: "Concepts" },
    { q: "Degrees of Freedom (DoF) in VR?", opts: ["3 and 6", "2 and 4", "1 and 5", "10 and 20"], ans: 0, topic: "Mechanics" },
    { q: "Key component for AR tracking?", opts: ["Printer", "Camera/Sensors", "Mouse", "Speaker"], ans: 1, topic: "Tech" },
    { q: "What is a 'Marker' in AR?", opts: ["A pen", "Visual cue for overlay", "A bookmark", "A milestone"], ans: 1, topic: "Tech" },
    { q: "Field of view (FOV) refers to?", opts: ["Battery life", "Area visible to user", "Screen resolution", "Audio range"], ans: 1, topic: "Hardware" },
    { q: "Language often used in Unity?", opts: ["C#", "Python", "HTML", "SQL"], ans: 0, topic: "Development" }
];

const QUANTUM_QUESTIONS = [
    { q: "Basic unit of quantum info?", opts: ["Bit", "Qubit", "Byte", "Pixel"], ans: 1, topic: "Fundamentals" },
    { q: "What constitutes Superposition?", opts: ["Being in multiple states at once", "Being in one state", "Being very fast", "Being very large"], ans: 0, topic: "Mechanics" },
    { q: "Quantum Entanglement involves?", opts: ["Separating particles", "Linked state of particles", "Tying knots", "Mixing chemicals"], ans: 1, topic: "Mechanics" },
    { q: "Shor's Algorithm is for?", opts: ["Searching", "Factoring integers", "Sorting", "Graphic design"], ans: 1, topic: "Algorithms" },
    { q: "Quantum Speedup refers to?", opts: ["Faster internet", "Computation advantage over classical", "Quick booting", "Fast charging"], ans: 1, topic: "Performance" },
    { q: "What is Decoherence?", opts: ["Loss of quantum state", "Gaining coherence", "Error correction", "Data compression"], ans: 0, topic: "Challenges" },
    { q: "Grover's Algorithm is for?", opts: ["Unstructured search", "Factoring", "Encryption", "Compression"], ans: 0, topic: "Algorithms" },
    { q: "Quantum Gates are?", opts: ["Physical doors", "Operations on qubits", "Security checks", "Payment gateways"], ans: 1, topic: "Circuits" },
    { q: "Which company has a quantum computer?", opts: ["All of these", "IBM", "Google", "Rigetti"], ans: 0, topic: "Industry" },
    { q: "QKD stands for?", opts: ["Quantum Key Distribution", "Quantum Kinetic Device", "Quick Key Data", "Query Key Domain"], ans: 0, topic: "Security" }
];

const BIO_QUESTIONS = [
    { q: "Bioinformatics combines Biology with?", opts: ["Computer Science", "Physics", "Geology", "History"], ans: 0, topic: "Overview" },
    { q: "BLAST tool is used for?", opts: ["Explosions", "Sequence alignment", "Image editing", "Email"], ans: 1, topic: "Tools" },
    { q: "What is a Genome?", opts: ["A gene", "Complete set of DNA", "A protein", "A cell"], ans: 1, topic: "Genetics" },
    { q: "PDB stands for?", opts: ["Protein Data Bank", "Personal Data Base", "Public Domain Bio", "Private DNA Bank"], ans: 0, topic: "Resources" },
    { q: "Central Dogma?", opts: ["DNA->RNA->Protein", "Protein->RNA->DNA", "RNA->DNA->Protein", "DNA->Protein->RNA"], ans: 0, topic: "Fundamentals" },
    { q: "What is NGS?", opts: ["Next Generation Sequencing", "New Gene System", "Non-Genetic Source", "Neo-Global Science"], ans: 0, topic: "Tech" },
    { q: "What handles biological big data?", opts: ["Databases/Algorithms", "Paper files", "Calculators", "Microscopes"], ans: 0, topic: "Methods" },
    { q: "Phylogenetics studies?", opts: ["Evolutionary relationships", "Plant growth", "Cell division", "Virus spread"], ans: 0, topic: "Biology" },
    { q: "CRISPR is a tool for?", opts: ["Gene editing", "Web browsing", "File sharing", "Video streaming"], ans: 0, topic: "Tech" },
    { q: "FASTA format stores?", opts: ["Images", "Nucleotide/Peptide sequences", "Audio", "3D models"], ans: 1, topic: "Formats" }
];

const UIUX_QUESTIONS = [
    { q: "Difference between UI and UX?", opts: ["Visuals vs Experience", "Coding vs Design", "None", "Mobile vs Web"], ans: 0, topic: "Fundamentals" },
    { q: "What is a Wireframe?", opts: ["Blueprint of interface", "A wire sculpture", "Final design", "Code snippet"], ans: 0, topic: "Process" },
    { q: "HCI stands for?", opts: ["Human-Computer Interaction", "High Computer Interface", "Human Control Interface", "Hybrid Code Integration"], ans: 0, topic: "Fundamentals" },
    { q: "Goal of Usability Testing?", opts: ["Find bugs", "Evaluate user ease", "Test server load", "Check security"], ans: 1, topic: "Research" },
    { q: "What is a Persona?", opts: ["A mask", "Fictional user representation", "A password", "A logo"], ans: 1, topic: "Research" },
    { q: "Fitts's Law relates to?", opts: ["Target size and distance", "Color contrast", "Font size", "Page load speed"], ans: 0, topic: "Principles" },
    { q: "What is Prototyping?", opts: ["Creating preliminary model", "Writing final code", "Launching product", "Marketing"], ans: 0, topic: "Process" },
    { q: "Affordance means?", opts: ["Cost", "Clues on how to use object", "Luxury", "Speed"], ans: 1, topic: "Psychology" },
    { q: "Contrast ratio is important for?", opts: ["Accessibility", "Speed", "Storage", "SEO"], ans: 0, topic: "Accessibility" },
    { q: "Responsive design adapts to?", opts: ["User mood", "Screen size/Device", "Time of day", "Weather"], ans: 1, topic: "Design" }
];

// Fallback banks for mapped categories (reusing TECH/SCIENCE where appropriate if specific not defined)
const TECH_QUESTIONS = [
    { q: "Primary function of a variable?", opts: ["Store data", "Display graphics", "Connect internet", "Cool CPU"], ans: 0, topic: "Fundamentals" },
    { q: "LIFO data structure?", opts: ["Queue", "Stack", "Tree", "Graph"], ans: 1, topic: "Data Structures" },
    { q: "API stands for?", opts: ["Application Programming Interface", "Advanced Peripheral Integration", "Automated Process Interaction", "Applied Protocol Instruction"], ans: 0, topic: "Terminology" },
    { q: "Example of OS?", opts: ["Chrome", "Linux", "Word", "Python"], ans: 1, topic: "Systems" },
    { q: "Bit represents?", opts: ["Byte", "0 or 1", "Pixel", "Character"], ans: 1, topic: "Digital" },
    { q: "Purpose of database?", opts: ["Compile code", "Design UI", "Store/Retrieve data", "Manage network"], ans: 2, topic: "Databases" },
    { q: "Secure web protocol?", opts: ["FTP", "HTTP", "HTTPS", "SMTP"], ans: 2, topic: "Security" },
    { q: "Cloud Computing is?", opts: ["High altitude", "Internet-based services", "Weather prediction", "HDD storage"], ans: 1, topic: "Cloud" },
    { q: "Bug in software?", opts: ["Virus", "Hardware failure", "Code error", "Feature"], ans: 2, topic: "Testing" },
    { q: "Web structure language?", opts: ["CSS", "HTML", "JS", "SQL"], ans: 1, topic: "Web" }
];

const SCIENCE_QUESTIONS = [
    { q: "Basic unit of life?", opts: ["Atom", "Molecule", "Cell", "Tissue"], ans: 2, topic: "Biology" },
    { q: "Plants absorb?", opts: ["Oxygen", "Nitrogen", "CO2", "Hydrogen"], ans: 2, topic: "Botany" },
    { q: "Powerhouse of cell?", opts: ["Nucleus", "Ribosome", "Mitochondria", "Golgi"], ans: 2, topic: "Cell Bio" },
    { q: "Symbol for Gold?", opts: ["Ag", "Au", "Fe", "Pb"], ans: 1, topic: "Chemistry" },
    { q: "Red Planet?", opts: ["Venus", "Jupiter", "Mars", "Saturn"], ans: 2, topic: "Astronomy" },
    { q: "Most abundant gas?", opts: ["Oxygen", "CO2", "Nitrogen", "Argon"], ans: 2, topic: "Earth Sci" },
    { q: "Photosynthesis makes?", opts: ["Water", "Food", "Soil", "Rock"], ans: 1, topic: "Botany" },
    { q: "Organ pumping blood?", opts: ["Lungs", "Brain", "Heart", "Liver"], ans: 2, topic: "Anatomy" },
    { q: "Boiling point of water?", opts: ["90C", "100C", "110C", "120C"], ans: 1, topic: "Physics" },
    { q: "Center of atom?", opts: ["Proton", "Electron", "Nucleus", "Neutron"], ans: 2, topic: "Physics" }
];

const BUSINESS_QUESTIONS = [
    { q: "ROI stands for?", opts: ["Return on Investment", "Rate of Inflation", "Risk of Interest", "Return on Income"], ans: 0, topic: "Finance" },
    { q: "Goal of marketing?", opts: ["Hire people", "Make products", "Promote/Sell", "Manage finance"], ans: 2, topic: "Marketing" },
    { q: "USP means?", opts: ["Unique Selling Proposition", "User Service Protocol", "Uniform Sales Price", "Universal Standard Product"], ans: 0, topic: "Strategy" },
    { q: "Balance Sheet shows?", opts: ["Employees", "Marketing", "Assets/Liabilities", "Schedule"], ans: 2, topic: "Accounting" },
    { q: "HR manages?", opts: ["Finance", "Employees", "IT", "Sales"], ans: 1, topic: "Management" },
    { q: "B2B means?", opts: ["Business to Business", "Business to Buyer", "Back to Business", "Buyer to Business"], ans: 0, topic: "Terminology" },
    { q: "Inflation is?", opts: ["Price drop", "Price rise", "Stock rise", "Job drop"], ans: 1, topic: "Economics" },
    { q: "Bear Market implies?", opts: ["Rising prices", "Stable prices", "Falling prices", "High jobs"], ans: 2, topic: "Finance" },
    { q: "Equity is?", opts: ["Debt", "Ownership", "Revenue", "Cost"], ans: 1, topic: "Finance" },
    { q: "4 P's?", opts: ["Product,Price,Place,Promotion", "Plan,People,Profit,Process", "Power,Politics,Perf,People", "Price,Profit,Plan,Pitch"], ans: 0, topic: "Marketing" }
];

const ARTS_QUESTIONS = [
    { q: "Contract purpose?", opts: ["Suggest", "Legally binding", "List ideas", "Summarize"], ans: 1, topic: "Law" },
    { q: "Primary color?", opts: ["Green", "Orange", "Blue", "Purple"], ans: 2, topic: "Design" },
    { q: "Typography is?", opts: ["Maps", "Arranging type", "Painting", "Sculpting"], ans: 1, topic: "Design" },
    { q: "Copyright protects?", opts: ["Inventions", "Brands", "Authorship", "Discoveries"], ans: 2, topic: "Law" },
    { q: "Pedagogy is?", opts: ["Feet study", "Teaching method", "Government", "Art style"], ans: 1, topic: "Education" },
    { q: "Whitespace is?", opts: ["White color", "Empty space", "Error", "Font"], ans: 1, topic: "Design" },
    { q: "Highest Court in India?", opts: ["High", "District", "Supreme", "Tribunal"], ans: 2, topic: "Law" },
    { q: "Abstract Art?", opts: ["Realistic", "Non-representational", "Photos", "Sculptures"], ans: 1, topic: "Arts" },
    { q: "Study of behavior?", opts: ["Bio", "Geo", "Psychology", "Physics"], ans: 2, topic: "Psychology" },
    { q: "Syllabus is?", opts: ["Instrument", "Course topics", "Degree", "Building"], ans: 1, topic: "Education" }
];



const generateQuestionsForField = (fieldId: string, fieldName: string) => {
    let selectedBank = TECH_QUESTIONS; // Default

    // Branch Mapping
    if (fieldId.includes('cse')) selectedBank = CSE_QUESTIONS;
    else if (fieldId.includes('ece')) selectedBank = ECE_QUESTIONS;
    else if (fieldId.includes('eee')) selectedBank = EEE_QUESTIONS;
    else if (fieldId.includes('civil')) selectedBank = CIVIL_QUESTIONS;
    else if (fieldId.includes('mech')) selectedBank = MECH_QUESTIONS;

    // Field Mapping
    else if (fieldId === 'devops-sre') selectedBank = DEVOPS_QUESTIONS;
    else if (fieldId === 'ar-vr-mr') selectedBank = ARVR_QUESTIONS;
    else if (fieldId === 'quantum-computing') selectedBank = QUANTUM_QUESTIONS;
    else if (fieldId === 'bioinformatics-compbio') selectedBank = BIO_QUESTIONS;
    else if (fieldId === 'uiux-hci') selectedBank = UIUX_QUESTIONS;

    // Category Fallbacks
    else if (CATEGORIES.SCIENCE.includes(fieldId)) selectedBank = SCIENCE_QUESTIONS;
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

    const selectableFields = fields.flatMap(f => {
        const branches = branchesMap[f.id] || [];
        return [
            { id: f.id, name: f.name },
            ...branches.map(b => ({ id: b.id, name: b.name }))
        ];
    });

    try {
        let totalQuestions = 0;

        for (const field of selectableFields) {
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
