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
        collegeId: "IITB-001",
        collegeName: "Indian Institute of Technology (IIT) Bombay",
        type: "Government",
        accreditation: "NAAC A++",
        rankingTier: "Top",
        state: "Maharashtra",
        district: "Mumbai Suburban",
        region: "West",
        address: "Main Gate Rd, IIT Area, Powai, Mumbai, Maharashtra 400076",
        website: "https://www.iitb.ac.in/",
        officialBrochureLink: "https://www.iitb.ac.in/en/academics/academic-programmes",
        rating: 4.9,
        location: { latitude: 19.1334, longitude: 72.9133 },
        city: "Mumbai",
        country: "India",
        fieldsOffered: [
            {
                fieldName: "Computer Science & IT",
                specializations: [
                    { specializationName: "Computer Science", degreeType: "B.Tech", duration: "4 Years", eligibility: "10+2 PCM with JEE Advanced", intakeCapacity: 120 },
                    { specializationName: "Data Science & Analytics", degreeType: "B.Tech", duration: "4 Years", eligibility: "10+2 PCM with JEE Advanced", intakeCapacity: 60 }
                ]
            },
            {
                fieldName: "Engineering & Technology",
                specializations: [
                    { specializationName: "Software Engineering", degreeType: "M.Tech", duration: "2 Years", eligibility: "B.Tech with GATE", intakeCapacity: 40 }
                ]
            },
            {
                fieldName: "AI & Emerging Technologies",
                specializations: [
                    { specializationName: "Artificial Intelligence & Machine Learning", degreeType: "B.Tech", duration: "4 Years", eligibility: "10+2 PCM with JEE Advanced", intakeCapacity: 60 },
                    { specializationName: "Cybersecurity", degreeType: "M.Tech", duration: "2 Years", eligibility: "B.Tech with GATE", intakeCapacity: 30 }
                ]
            }
        ],
        searchKeywords: ["Computer Science", "Artificial Intelligence & Machine Learning", "Data Science & Analytics", "Cybersecurity", "Software Engineering"]
    },
    {
        collegeId: "IISCB-002",
        collegeName: "Indian Institute of Science (IISc) Bangalore",
        type: "Government",
        accreditation: "NAAC A++",
        rankingTier: "Top",
        state: "Karnataka",
        district: "Bengaluru Urban",
        region: "South",
        address: "CV Raman Rd, Bengaluru, Karnataka 560012",
        website: "https://www.iisc.ac.in/",
        officialBrochureLink: "https://www.iisc.ac.in/admissions/",
        rating: 4.8,
        location: { latitude: 13.0184, longitude: 77.5673 },
        city: "Bangalore",
        country: "India",
        fieldsOffered: [
            {
                fieldName: "Engineering & Technology",
                specializations: [
                    { specializationName: "Robotics & Automation", degreeType: "M.Tech", duration: "2 Years", eligibility: "B.Tech with GATE", intakeCapacity: 30 }
                ]
            },
            {
                fieldName: "AI & Emerging Technologies",
                specializations: [
                    { specializationName: "Quantum Computing", degreeType: "M.Tech", duration: "2 Years", eligibility: "B.Tech/MSc with GATE/NET", intakeCapacity: 20 },
                    { specializationName: "Bioinformatics & Computational Biology", degreeType: "M.Tech", duration: "2 Years", eligibility: "B.Tech/MSc with GATE", intakeCapacity: 25 },
                    { specializationName: "Data Science & Analytics", degreeType: "M.Tech", duration: "2 Years", eligibility: "B.Tech with GATE", intakeCapacity: 40 }
                ]
            }
        ],
        searchKeywords: ["Quantum Computing", "Bioinformatics & Computational Biology", "Robotics & Automation", "Data Science & Analytics"]
    },
    {
        collegeId: "BITSH-003",
        collegeName: "BITS Pilani, Hyderabad Campus",
        type: "Private",
        accreditation: "NAAC A",
        rankingTier: "Tier 1",
        state: "Telangana",
        district: "Medchal-Malkajgiri",
        region: "South",
        address: "Jawahar Nagar, Shameerpet, Hyderabad, Telangana 500078",
        website: "https://www.bits-pilani.ac.in/hyderabad/",
        officialBrochureLink: "https://www.bitsadmission.com/",
        rating: 4.6,
        location: { latitude: 17.5449, longitude: 78.5718 },
        city: "Hyderabad",
        country: "India",
        fieldsOffered: [
            {
                fieldName: "Computer Science & IT",
                specializations: [
                    { specializationName: "Software Engineering", degreeType: "B.E.", duration: "4 Years", eligibility: "10+2 PCM with BITSAT", intakeCapacity: 150 },
                    { specializationName: "Cybersecurity", degreeType: "M.E.", duration: "2 Years", eligibility: "B.E./B.Tech with BITS HD/GATE", intakeCapacity: 50 },
                    { specializationName: "Embedded Systems", degreeType: "M.E.", duration: "2 Years", eligibility: "B.E./B.Tech with BITS HD", intakeCapacity: 50 },
                    { specializationName: "Cloud Computing & Modern Infrastructure", degreeType: "M.E.", duration: "2 Years", eligibility: "B.E./B.Tech required", intakeCapacity: 40 }
                ]
            },
            {
                fieldName: "Engineering & Technology",
                specializations: [
                    { specializationName: "Robotics & Automation", degreeType: "B.E.", duration: "4 Years", eligibility: "10+2 PCM", intakeCapacity: 60 }
                ]
            }
        ],
        searchKeywords: ["Software Engineering", "Cybersecurity", "Embedded Systems", "Robotics & Automation", "Cloud Computing & Modern Infrastructure"]
    },
    {
        collegeId: "LPU-004",
        collegeName: "LPU (Lovely Professional University)",
        type: "Private",
        accreditation: "NAAC A++",
        rankingTier: "Tier 2",
        state: "Punjab",
        district: "Kapurthala",
        region: "North",
        address: "Jalandhar - Delhi, G.T. Road, Phagwara, Punjab 144411",
        website: "https://www.lpu.in/",
        officialBrochureLink: "https://www.lpu.in/programmes",
        rating: 4.2,
        location: { latitude: 31.2558, longitude: 75.7051 },
        city: "Phagwara",
        country: "India",
        fieldsOffered: [
            {
                fieldName: "Computer Science & IT",
                specializations: [
                    { specializationName: "Full Stack Web Development", degreeType: "B.Tech", duration: "4 Years", eligibility: "10+2 with LPUNEST", intakeCapacity: 300 },
                    { specializationName: "Cloud Computing & Modern Infrastructure", degreeType: "B.Tech", duration: "4 Years", eligibility: "10+2 with LPUNEST", intakeCapacity: 120 },
                    { specializationName: "UI / UX & Human-Computer Interaction", degreeType: "B.Design", duration: "4 Years", eligibility: "10+2", intakeCapacity: 60 },
                    { specializationName: "DevOps & Site Reliability Engineering", degreeType: "M.Tech", duration: "2 Years", eligibility: "B.Tech", intakeCapacity: 40 }
                ]
            },
            {
                fieldName: "Marketing & Sales",
                specializations: [
                    { specializationName: "Digital Marketing", degreeType: "MBA", duration: "2 Years", eligibility: "Graduation with LPUNEST", intakeCapacity: 150 }
                ]
            },
            {
                fieldName: "AI & Emerging Technologies",
                specializations: [
                    { specializationName: "AR / VR / Mixed Reality", degreeType: "B.Tech", duration: "4 Years", eligibility: "10+2", intakeCapacity: 60 },
                    { specializationName: "Data Science & Analytics", degreeType: "B.Tech", duration: "4 Years", eligibility: "10+2", intakeCapacity: 120 },
                    { specializationName: "Cybersecurity", degreeType: "B.Tech", duration: "4 Years", eligibility: "10+2", intakeCapacity: 120 }
                ]
            }
        ],
        searchKeywords: ["Full Stack Web Development", "Cloud Computing & Modern Infrastructure", "Digital Marketing", "UI / UX & Human-Computer Interaction", "DevOps & Site Reliability Engineering", "AR / VR / Mixed Reality", "Data Science & Analytics", "Cybersecurity"]
    },
    // ── Healthcare / Medicine ───────────────────────────────────────────────
    {
        collegeId: "AIIMS-005",
        collegeName: "All India Institute of Medical Sciences (AIIMS) Delhi",
        type: "Government",
        accreditation: "NMC Approved",
        rankingTier: "Top",
        state: "Delhi",
        district: "New Delhi",
        region: "North",
        address: "Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029",
        website: "https://www.aiims.edu/",
        officialBrochureLink: "https://www.aiimsexams.ac.in/",
        rating: 4.9,
        location: { latitude: 28.5675, longitude: 77.2100 },
        city: "New Delhi",
        country: "India",
        fieldsOffered: [
            {
                fieldName: "Medicine & Surgery",
                specializations: [
                    { specializationName: "MBBS (General Medicine)", degreeType: "MBBS", duration: "5.5 Years", eligibility: "10+2 PCB with NEET", intakeCapacity: 125 }
                ]
            },
            {
                fieldName: "Healthcare Management",
                specializations: [
                    { specializationName: "Hospital Administration & Healthcare Management", degreeType: "MHA", duration: "2 Years", eligibility: "MBBS/BDS/BSc Nursing", intakeCapacity: 15 },
                    { specializationName: "Master of Hospital Administration (MHA)", degreeType: "MHA", duration: "2 Years", eligibility: "MBBS/BDS/BSc Nursing", intakeCapacity: 15 }
                ]
            }
        ],
        searchKeywords: ["MBBS (General Medicine)", "Hospital Administration & Healthcare Management", "Master of Hospital Administration (MHA)"]
    },
    // ── Law / Education ────────────────────────────────────────────────────
    {
        collegeId: "NLSIU-006",
        collegeName: "National Law School of India University (NLSIU)",
        type: "Autonomous",
        accreditation: "BCI Approved",
        rankingTier: "Top",
        state: "Karnataka",
        district: "Bengaluru Urban",
        region: "South",
        address: "Nagarbhavi, Bangalore, Karnataka 560072",
        website: "https://www.nls.ac.in/",
        officialBrochureLink: "https://www.nls.ac.in/admissions/",
        rating: 4.8,
        location: { latitude: 12.9502, longitude: 77.5092 },
        city: "Bangalore",
        country: "India",
        fieldsOffered: [
            {
                fieldName: "Law & Legal Studies",
                specializations: [
                    { specializationName: "Law (LLB / LLM)", degreeType: "BA LLB (Hons)", duration: "5 Years", eligibility: "10+2 with CLAT", intakeCapacity: 120 },
                    { specializationName: "Corporate Law & Compliance", degreeType: "LLM", duration: "1 Year", eligibility: "LLB with CLAT PG", intakeCapacity: 50 },
                    { specializationName: "Criminal Law & Forensics", degreeType: "LLM", duration: "1 Year", eligibility: "LLB with CLAT PG", intakeCapacity: 30 },
                    { specializationName: "Intellectual Property & Technology Law", degreeType: "LLM", duration: "1 Year", eligibility: "LLB with CLAT PG", intakeCapacity: 30 }
                ]
            }
        ],
        searchKeywords: ["Law (LLB / LLM)", "Corporate Law & Compliance", "Criminal Law & Forensics", "Intellectual Property & Technology Law"]
    }
];

async function seedAdvancedColleges() {
    console.log(`Starting Advanced Seeding of ${colleges.length} colleges into Firestore...`);

    // First, let's clear existing colleges to avoid duplicates and schema mixing
    const existing = await db.collection('colleges').get();

    // We will clear existing colleges so the new structure takes over cleanly.
    if (!existing.empty) {
        console.log(`Deleting ${existing.size} existing legacy colleges...`);
        const delBatch = db.batch();
        existing.forEach(doc => {
            delBatch.delete(doc.ref);
        });
        await delBatch.commit();
        console.log("Deleted old colleges.");
    }

    const batch = db.batch();
    let added = 0;

    for (const college of colleges) {
        const ref = db.collection('colleges').doc(college.collegeId);
        batch.set(ref, {
            ...college,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        added++;
        console.log(`  + ${college.collegeName} [${college.rankingTier}]`);
    }

    if (added > 0) {
        await batch.commit();
        console.log(`\n✅ Successfully seeded ${added} Advanced structure colleges!`);
    } else {
        console.log('\n❌ No colleges added.');
    }
    process.exit(0);
}

seedAdvancedColleges().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
