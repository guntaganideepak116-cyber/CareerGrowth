const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const sampleColleges = [
    {
        collegeName: "Indian Institute of Technology (IIT) Bombay",
        address: "Main Gate Rd, IIT Area, Powai, Mumbai, Maharashtra 400076",
        website: "https://www.iitb.ac.in/",
        rating: 4.9,
        coursesOffered: ["Computer Science", "Artificial Intelligence & Machine Learning", "Mechanical Engineering", "Civil Engineering"],
        location: {
            latitude: 19.1334,
            longitude: 72.9133
        },
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        collegeName: "Indian Institute of Science (IISc) Bangalore",
        address: "CV Raman Rd, Bengaluru, Karnataka 560012",
        website: "https://www.iisc.ac.in/",
        rating: 4.8,
        coursesOffered: ["Data Science & Analytics", "Quantum Computing", "Bioinformatics & Computational Biology", "Aerospace Engineering"],
        location: {
            latitude: 13.0184,
            longitude: 77.5673
        },
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        collegeName: "BITS Pilani, Hyderabad Campus",
        address: "Jawahar Nagar, Shameerpet, Hyderabad, Telangana 500078",
        website: "https://www.bits-pilani.ac.in/hyderabad/",
        rating: 4.6,
        coursesOffered: ["Software Engineering", "Cybersecurity", "Embedded Systems", "Robotics & Automation"],
        location: {
            latitude: 17.5449,
            longitude: 78.5718
        },
        city: "Hyderabad",
        state: "Telangana",
        country: "India",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        collegeName: "LPU (Lovely Professional University)",
        address: "Jalandhar - Delhi, G.T. Road, Phagwara, Punjab 144411",
        website: "https://www.lpu.in/",
        rating: 4.2,
        coursesOffered: ["Full Stack Web Development", "Cloud Computing & Modern Infrastructure", "Digital Marketing", "UI / UX & Human-Computer Interaction"],
        location: {
            latitude: 31.2558,
            longitude: 75.7051
        },
        city: "Phagwara",
        state: "Punjab",
        country: "India",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
];

async function seedColleges() {
    console.log("Seeding sample colleges...");
    const batch = db.batch();
    
    sampleColleges.forEach(college => {
        const ref = db.collection('colleges').doc();
        batch.set(ref, college);
    });
    
    await batch.commit();
    console.log("Successfully seeded 4 colleges!");
}

seedColleges().catch(console.error);
