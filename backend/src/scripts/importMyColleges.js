const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}
const db = admin.firestore();

const csvFileName = 'my_colleges.csv';
const csvFilePath = path.join(__dirname, csvFileName);

if (!fs.existsSync(csvFilePath)) {
    console.error(`❌ Error: File not found at ${csvFilePath}`);
    process.exit(1);
}

const colleges = [];

console.log(`\n⏳ Reading and parsing ${csvFileName}...`);

// Helper to map UGC types to our system types
function mapType(ugcType) {
    if (!ugcType) return "Private";
    const t = ugcType.toLowerCase();
    if (t.includes('state')) return 'State University';
    if (t.includes('central')) return 'Central University';
    if (t.includes('deemed')) return 'Deemed';
    if (t.includes('private')) return 'Private';
    return 'Government';
}

// Read and Parse CSV File
fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
        try {
            // Trim keys in case of weird CSV formatting issues
            const getVal = (key) => (row[key] || row[`"${key}"`] || Object.values(row).find(v => v === row[key]))?.trim();

            // Extract from standard columns of UGC list
            const srNo = row['Sr.No'] || row['Sr.No.'] || Date.now().toString();
            const name = row['Name of the University'];
            const type = mapType(row['Type']);
            const address = row['Address'] || "";
            const zip = row['Zip'] || "";
            const state = row['state'] || row['State'] || "";
            const status = row['Status'] || "Recognized";

            if (!name) return; // Skip empty rows

            const collegeId = `UGC-${srNo}-${Math.floor(Math.random() * 1000)}`;

            const college = {
                collegeId: collegeId,
                collegeName: name,
                type: type,
                accreditation: `UGC ${status}`,
                rankingTier: "Unranked", // Defaulting to Unranked for bulk import
                state: state,
                district: "", // Difficult to extract accurately from address
                region: "India",
                address: `${address} ${zip}`.trim(),
                website: "",
                rating: parseFloat((Math.random() * (4.8 - 3.8) + 3.8).toFixed(1)), // Random realistic rating
                location: {
                    latitude: 0,
                    longitude: 0
                },
                city: "",
                country: "India",
                searchKeywords: ["University", "Degree", "Higher Education"],
                coursesOffered: ["Undergraduate", "Postgraduate"],
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            };

            colleges.push(college);
        } catch (err) {
            console.error(`⚠️ Error parsing row:`, err.message);
        }
    })
    .on('end', async () => {
        console.log(`✅ CSV Parsing Complete. Found ${colleges.length} valid universities.\n`);

        if (colleges.length === 0) {
            console.log("No colleges found to import. Check your CSV format.");
            process.exit(0);
        }

        console.log("⏳ Uploading to Firestore database in batches...");

        try {
            const batches = [];
            let currentBatch = db.batch();
            let count = 0;

            for (const college of colleges) {
                const docRef = db.collection('colleges').doc(college.collegeId);
                currentBatch.set(docRef, college);
                count++;

                // Firestore batch limit is 500
                if (count % 450 === 0) {
                    batches.push(currentBatch.commit());
                    currentBatch = db.batch();
                    console.log(`   Prepared batch of 450... (${count}/${colleges.length})`);
                }
            }

            if (count % 450 !== 0) {
                batches.push(currentBatch.commit());
            }

            await Promise.all(batches);
            console.log(`\n🎉 SUCCESS! Uploaded ${count} universities into the database.`);
            process.exit(0);

        } catch (uploadError) {
            console.error("\n❌ Upload failed:", uploadError);
            process.exit(1);
        }
    });
