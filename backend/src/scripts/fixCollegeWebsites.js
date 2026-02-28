const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function fixWebsites() {
    console.log("Fetching all colleges from Firestore...");
    const snapshot = await db.collection('colleges').get();

    let updatedCount = 0;
    const batches = [];
    let currentBatch = db.batch();
    let countInBatch = 0;

    snapshot.forEach(doc => {
        const data = doc.data();
        let website = data.website?.trim();
        let needsUpdate = false;

        // Validation based on user requirements
        if (!website || website === "" || website === "undefined" || website === "null") {
            // Generate a placeholder "official" sounding search if needed, but per prompt instruction:
            // "website: https://www.collegeofficialsite.com"
            website = "https://www.collegeofficialsite.com";
            needsUpdate = true;
        } else if (!website.startsWith("http://") && !website.startsWith("https://")) {
            website = `https://${website}`;
            needsUpdate = true;
        } else if (website.startsWith("http://")) {
            website = website.replace("http://", "https://");
            needsUpdate = true;
        }

        if (needsUpdate) {
            currentBatch.update(doc.ref, { website: website });
            countInBatch++;
            updatedCount++;

            // Commit in chunks of 450 to avoid Firestore limits
            if (countInBatch >= 450) {
                batches.push(currentBatch.commit());
                currentBatch = db.batch();
                countInBatch = 0;
                console.log(`Prepared a batch of 450 updates...`);
            }
        }
    });

    if (countInBatch > 0) {
        batches.push(currentBatch.commit());
    }

    if (batches.length > 0) {
        console.log(`Committing ${updatedCount} website updates to the database...`);
        await Promise.all(batches);
        console.log(`✅ Successfully updated ${updatedCount} colleges with valid secure URLs!`);
    } else {
        console.log("✅ All colleges already have valid secure URLs. No updates needed.");
    }

    process.exit(0);
}

fixWebsites().catch(error => {
    console.error("Script failed:", error);
    process.exit(1);
});
