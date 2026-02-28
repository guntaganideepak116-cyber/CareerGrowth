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

// Get the CSV file path from command line arguments
const csvFileName = process.argv[2];

if (!csvFileName) {
    console.error(`
❌ Error: Please provide the CSV file name!

👉 SMART WORK USAGE INSTRUCTIONS:
1. Place your CSV file in the 'backend/src/scripts' folder.
2. Run this command: node src/scripts/importCsvColleges.js your-file.csv

📝 CSV FORMAT REQUIRED (Headers must match exactly):
collegeId, collegeName, type, accreditation, rankingTier, state, district, region, address, website, rating, latitude, longitude, searchKeywords

- 'type' should be: Government, Private, Autonomous, Deemed, Central University, or State University
- 'rankingTier' should be: Top, Tier 1, Tier 2, Tier 3, or Unranked
- 'searchKeywords' should be separated by a pipe character (|). Example: Computer Science|Data Science|Artificial Intelligence
`);
    process.exit(1);
}

const csvFilePath = path.join(__dirname, csvFileName);

if (!fs.existsSync(csvFilePath)) {
    console.error(`❌ Error: File not found at ${csvFilePath}`);
    process.exit(1);
}

const colleges = [];

console.log(`\n⏳ Reading and parsing ${csvFileName}...`);

// Read and Parse CSV File
fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
        // Parse CSV Row into advanced JSON structure
        try {
            const college = {
                collegeId: row.collegeId?.trim() || `COL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                collegeName: row.collegeName?.trim(),
                type: row.type?.trim() || "Private",
                accreditation: row.accreditation?.trim() || "Not Accredited",
                rankingTier: row.rankingTier?.trim() || "Unranked",
                state: row.state?.trim(),
                district: row.district?.trim() || row.city?.trim() || "",
                region: row.region?.trim() || "India",
                address: row.address?.trim() || "",
                website: row.website?.trim() || "",
                rating: parseFloat(row.rating) || 4.0,
                location: {
                    latitude: parseFloat(row.latitude) || 0,
                    longitude: parseFloat(row.longitude) || 0
                },
                city: row.district?.trim() || "",
                country: "India",
                // Convert pipe-separated string "CS|IT|AI" -> ["CS", "IT", "AI"]
                searchKeywords: row.searchKeywords ? row.searchKeywords.split('|').map(k => k.trim()) : [],
                // Mapping searchKeywords to coursesOffered for backward compatibility across the app
                coursesOffered: row.searchKeywords ? row.searchKeywords.split('|').map(k => k.trim()) : [],
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            };

            // Only add if it has a name
            if (college.collegeName) {
                colleges.push(college);
            }
        } catch (err) {
            console.error(`⚠️ Error parsing row for ${row.collegeName}:`, err.message);
        }
    })
    .on('end', async () => {
        console.log(`✅ CSV Parsing Complete. Found ${colleges.length} valid colleges.\n`);

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
                // Use a generated ref or collegeId as the doc ID
                const docRef = db.collection('colleges').doc(college.collegeId);

                currentBatch.set(docRef, college);
                count++;

                // Firestore batch limit is 500
                if (count % 450 === 0) {
                    batches.push(currentBatch.commit());
                    currentBatch = db.batch();
                    console.log(`   Prepared batch of 450...`);
                }
            }

            // Push the remainder
            if (count % 450 !== 0) {
                batches.push(currentBatch.commit());
            }

            await Promise.all(batches);
            console.log(`\n🎉 SUCCESS! Uploaded ${count} colleges intelligently into the database.`);
            process.exit(0);

        } catch (uploadError) {
            console.error("\n❌ Upload failed:", uploadError);
            process.exit(1);
        }
    });
