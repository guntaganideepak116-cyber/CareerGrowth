const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const inputFile = path.join(__dirname, 'my_colleges.csv');
const outputFile = path.join(__dirname, 'formatted_colleges.csv');

const colleges = [];

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

function escapeCsv(val) {
    if (val === null || val === undefined) return "";
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

console.log(`⏳ Reading and transforming ${inputFile}...`);

fs.createReadStream(inputFile)
    .pipe(csv())
    .on('data', (row) => {
        try {
            // Because original CSV headers are: "Sr.No","Type","Name of the University","Address","Zip","state","Status"
            const srNo = row['Sr.No'] || Date.now().toString();
            const name = row['Name of the University'];
            const type = mapType(row['Type']);
            const address = row['Address'] || "";
            const zip = row['Zip'] || "";
            const state = row['state'] || row['State'] || "";
            const status = row['Status'] || "Recognized";

            if (!name) return; // Skip invalid rows

            const collegeId = `UGC-${srNo}-${Math.floor(Math.random() * 1000)}`;
            const collegeName = name.replace(/\r?\n|\r/g, " ");
            const accreditation = `UGC ${status}`;
            const rankingTier = "Unranked";
            const district = ""; // Can be filled in via UI later
            const region = "India";
            const fullAddress = `${address} ${zip}`.trim().replace(/\r?\n|\r/g, " ");
            const website = "";
            const rating = parseFloat((Math.random() * (4.8 - 3.8) + 3.8).toFixed(1));
            const latitude = 0;
            const longitude = 0;
            const searchKeywords = "University|Degree|Higher Education"; // Pipe separated for CSV

            colleges.push({
                collegeId,
                collegeName,
                type,
                accreditation,
                rankingTier,
                state,
                district,
                region,
                address: fullAddress,
                website,
                rating,
                latitude,
                longitude,
                searchKeywords
            });
        } catch (err) {
            console.error(err);
        }
    })
    .on('end', () => {
        const headers = [
            "collegeId", "collegeName", "type", "accreditation", "rankingTier",
            "state", "district", "region", "address", "website", "rating",
            "latitude", "longitude", "searchKeywords"
        ];

        const rows = [headers.join(',')];

        for (const c of colleges) {
            const rowStr = headers.map(h => escapeCsv(c[h])).join(',');
            rows.push(rowStr);
        }

        fs.writeFileSync(outputFile, rows.join('\n'));
        console.log(`✅ Successfully transformed ${colleges.length} colleges!`);
        console.log(`📂 Saved accurately formatted file as: ${outputFile}`);
    });
