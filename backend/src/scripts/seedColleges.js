const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const colleges = [
    // ── CS / Tech ──────────────────────────────────────────────────────────
    {
        collegeName: "Indian Institute of Technology (IIT) Bombay",
        address: "Main Gate Rd, IIT Area, Powai, Mumbai, Maharashtra 400076",
        website: "https://www.iitb.ac.in/",
        rating: 4.9,
        coursesOffered: [
            "Computer Science",
            "Artificial Intelligence & Machine Learning",
            "Data Science & Analytics",
            "Cybersecurity",
            "Full Stack Web Development",
            "Software Engineering"
        ],
        location: { latitude: 19.1334, longitude: 72.9133 },
        city: "Mumbai", state: "Maharashtra", country: "India"
    },
    {
        collegeName: "Indian Institute of Science (IISc) Bangalore",
        address: "CV Raman Rd, Bengaluru, Karnataka 560012",
        website: "https://www.iisc.ac.in/",
        rating: 4.8,
        coursesOffered: [
            "Quantum Computing",
            "Bioinformatics & Computational Biology",
            "Aerospace Engineering",
            "Robotics & Automation",
            "Data Science & Analytics"
        ],
        location: { latitude: 13.0184, longitude: 77.5673 },
        city: "Bangalore", state: "Karnataka", country: "India"
    },
    {
        collegeName: "BITS Pilani, Hyderabad Campus",
        address: "Jawahar Nagar, Shameerpet, Hyderabad, Telangana 500078",
        website: "https://www.bits-pilani.ac.in/hyderabad/",
        rating: 4.6,
        coursesOffered: [
            "Software Engineering",
            "Cybersecurity",
            "Embedded Systems",
            "Robotics & Automation",
            "Cloud Computing & Modern Infrastructure"
        ],
        location: { latitude: 17.5449, longitude: 78.5718 },
        city: "Hyderabad", state: "Telangana", country: "India"
    },
    {
        collegeName: "NIT Warangal",
        address: "NIT Warangal Campus, Warangal, Telangana 506004",
        website: "https://www.nitw.ac.in/",
        rating: 4.4,
        coursesOffered: [
            "Computer Science",
            "Mechanical Engineering",
            "Civil Engineering",
            "Electrical & Electronics Engineering",
            "Electronics & Communication Engineering"
        ],
        location: { latitude: 17.9838, longitude: 79.5324 },
        city: "Warangal", state: "Telangana", country: "India"
    },
    {
        collegeName: "Osmania University",
        address: "Osmania University Main Rd, Amberpet, Hyderabad, Telangana 500007",
        website: "https://www.osmania.ac.in/",
        rating: 4.0,
        coursesOffered: [
            "Computer Science",
            "Data Science & Analytics",
            "Business Administration (BBA/MBA)",
            "Hospital Administration & Healthcare Management",
            "Law (LLB / LLM)",
            "Education & Teaching"
        ],
        location: { latitude: 17.4152, longitude: 78.5284 },
        city: "Hyderabad", state: "Telangana", country: "India"
    },
    // ── Medical / Healthcare ───────────────────────────────────────────────
    {
        collegeName: "All India Institute of Medical Sciences (AIIMS) Delhi",
        address: "Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029",
        website: "https://www.aiims.edu/",
        rating: 4.9,
        coursesOffered: [
            "MBBS (General Medicine)",
            "Hospital Administration & Healthcare Management",
            "Master of Hospital Administration (MHA)",
            "Nursing",
            "Pharmacy",
            "Bioinformatics & Computational Biology"
        ],
        location: { latitude: 28.5675, longitude: 77.2100 },
        city: "New Delhi", state: "Delhi", country: "India"
    },
    {
        collegeName: "Nizam's Institute of Medical Sciences (NIMS)",
        address: "Punjagutta, Hyderabad, Telangana 500082",
        website: "https://www.nims.edu.in/",
        rating: 4.2,
        coursesOffered: [
            "MBBS (General Medicine)",
            "Hospital Administration & Healthcare Management",
            "Master of Hospital Administration (MHA)",
            "Nursing",
            "Pharmacy"
        ],
        location: { latitude: 17.4299, longitude: 78.4479 },
        city: "Hyderabad", state: "Telangana", country: "India"
    },
    {
        collegeName: "Manipal Academy of Higher Education",
        address: "MAHE, Manipal, Udupi, Karnataka 576104",
        website: "https://manipal.edu/",
        rating: 4.5,
        coursesOffered: [
            "MBBS (General Medicine)",
            "Nursing",
            "Pharmacy",
            "Dentistry",
            "Hospital Administration & Healthcare Management",
            "Physiotherapy & Rehabilitation"
        ],
        location: { latitude: 13.3479, longitude: 74.7913 },
        city: "Manipal", state: "Karnataka", country: "India"
    },
    // ── Management / Commerce ──────────────────────────────────────────────
    {
        collegeName: "Indian Institute of Management (IIM) Ahmedabad",
        address: "Vastrapur, Ahmedabad, Gujarat 380015",
        website: "https://www.iima.ac.in/",
        rating: 4.9,
        coursesOffered: [
            "Business Administration (BBA/MBA)",
            "Finance & Investment Banking",
            "Marketing & Brand Management",
            "Human Resources Management",
            "Supply Chain & Logistics Management",
            "Entrepreneurship & Startup Management"
        ],
        location: { latitude: 23.0300, longitude: 72.5295 },
        city: "Ahmedabad", state: "Gujarat", country: "India"
    },
    {
        collegeName: "Indian School of Business (ISB) Hyderabad",
        address: "Gachibowli, Hyderabad, Telangana 500111",
        website: "https://www.isb.edu/",
        rating: 4.8,
        coursesOffered: [
            "Business Administration (BBA/MBA)",
            "Finance & Investment Banking",
            "Marketing & Brand Management",
            "Entrepreneurship & Startup Management",
            "Data Science & Analytics"
        ],
        location: { latitude: 17.4498, longitude: 78.3491 },
        city: "Hyderabad", state: "Telangana", country: "India"
    },
    // ── Design / Arts ──────────────────────────────────────────────────────
    {
        collegeName: "National Institute of Design (NID) Ahmedabad",
        address: "Paldi, Ahmedabad, Gujarat 380007",
        website: "https://www.nid.edu/",
        rating: 4.7,
        coursesOffered: [
            "UI / UX & Human-Computer Interaction",
            "Graphic Design & Visual Communication",
            "Fashion & Textile Design",
            "Product & Industrial Design",
            "Animation & Motion Graphics"
        ],
        location: { latitude: 23.0098, longitude: 72.5756 },
        city: "Ahmedabad", state: "Gujarat", country: "India"
    },
    {
        collegeName: "NIFT Hyderabad",
        address: "Marredpally, Secunderabad, Telangana 500026",
        website: "https://www.nift.ac.in/hyderabad/",
        rating: 4.3,
        coursesOffered: [
            "Fashion & Textile Design",
            "Graphic Design & Visual Communication",
            "UI / UX & Human-Computer Interaction",
            "Animation & Motion Graphics"
        ],
        location: { latitude: 17.4542, longitude: 78.4820 },
        city: "Hyderabad", state: "Telangana", country: "India"
    },
    // ── Engineering Specializations ────────────────────────────────────────
    {
        collegeName: "Jawaharlal Nehru Technological University (JNTU) Hyderabad",
        address: "Kukatpally, Hyderabad, Telangana 500085",
        website: "https://www.jntuh.ac.in/",
        rating: 4.0,
        coursesOffered: [
            "Civil Engineering",
            "Mechanical Engineering",
            "Electrical & Electronics Engineering",
            "Electronics & Communication Engineering",
            "Embedded Systems",
            "DevOps & Site Reliability Engineering"
        ],
        location: { latitude: 17.4942, longitude: 78.3940 },
        city: "Hyderabad", state: "Telangana", country: "India"
    },
    {
        collegeName: "Delhi Technological University (DTU)",
        address: "Bawana Rd, Rohini, New Delhi 110042",
        website: "http://www.dtu.ac.in/",
        rating: 4.3,
        coursesOffered: [
            "Computer Science",
            "Civil Engineering",
            "Mechanical Engineering",
            "Electrical & Electronics Engineering",
            "Robotics & Automation",
            "AR / VR / Mixed Reality"
        ],
        location: { latitude: 28.7496, longitude: 77.1183 },
        city: "New Delhi", state: "Delhi", country: "India"
    },
    // ── Law / Education ────────────────────────────────────────────────────
    {
        collegeName: "National Law School of India University (NLSIU)",
        address: "Nagarbhavi, Bangalore, Karnataka 560072",
        website: "https://www.nls.ac.in/",
        rating: 4.8,
        coursesOffered: [
            "Law (LLB / LLM)",
            "Corporate Law & Compliance",
            "Criminal Law & Forensics",
            "Intellectual Property & Technology Law"
        ],
        location: { latitude: 12.9502, longitude: 77.5092 },
        city: "Bangalore", state: "Karnataka", country: "India"
    },
    {
        collegeName: "Symbiosis International University",
        address: "Lavale, Pune, Maharashtra 412115",
        website: "https://www.siu.edu.in/",
        rating: 4.2,
        coursesOffered: [
            "Law (LLB / LLM)",
            "Business Administration (BBA/MBA)",
            "Education & Teaching",
            "Media & Journalism",
            "Digital Marketing",
            "Psychology & Counseling"
        ],
        location: { latitude: 18.5679, longitude: 73.7313 },
        city: "Pune", state: "Maharashtra", country: "India"
    },
    // ── Agriculture / Science ──────────────────────────────────────────────
    {
        collegeName: "Punjab Agricultural University (PAU)",
        address: "Ludhiana, Punjab 141004",
        website: "https://www.pau.edu/",
        rating: 4.1,
        coursesOffered: [
            "Agriculture Science & Farming Technology",
            "Environmental Science & Sustainability",
            "Food Technology & Processing",
            "Biotechnology"
        ],
        location: { latitude: 30.9092, longitude: 75.8039 },
        city: "Ludhiana", state: "Punjab", country: "India"
    },
    // ── Lovely Professional (broad coverage) ──────────────────────────────
    {
        collegeName: "LPU (Lovely Professional University)",
        address: "Phagwara, Punjab 144411",
        website: "https://www.lpu.in/",
        rating: 4.2,
        coursesOffered: [
            "Full Stack Web Development",
            "Cloud Computing & Modern Infrastructure",
            "Digital Marketing",
            "UI / UX & Human-Computer Interaction",
            "Cybersecurity",
            "Data Science & Analytics",
            "DevOps & Site Reliability Engineering",
            "AR / VR / Mixed Reality"
        ],
        location: { latitude: 31.2558, longitude: 75.7051 },
        city: "Phagwara", state: "Punjab", country: "India"
    }
];

async function seedColleges() {
    console.log(`Seeding ${colleges.length} colleges into Firestore...`);

    // Check existing ones to avoid duplication
    const existing = await db.collection('colleges').get();
    const existingNames = new Set(existing.docs.map(d => d.data().collegeName));

    const batch = db.batch();
    let added = 0;

    for (const college of colleges) {
        if (existingNames.has(college.collegeName)) {
            console.log(`  SKIP (exists): ${college.collegeName}`);
            continue;
        }
        const ref = db.collection('colleges').doc();
        batch.set(ref, {
            ...college,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        added++;
        console.log(`  + ${college.collegeName}`);
    }

    if (added > 0) {
        await batch.commit();
        console.log(`\n✅ Successfully seeded ${added} new colleges!`);
    } else {
        console.log('\n✅ All colleges already exist — nothing to add.');
    }
    process.exit(0);
}

seedColleges().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
