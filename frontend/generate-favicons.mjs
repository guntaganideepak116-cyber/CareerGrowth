import { createRequire } from 'module';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Check if sharp is available, install if not
let sharp;
try {
    const require = createRequire(import.meta.url);
    sharp = require('sharp');
} catch {
    console.log('Installing sharp...');
    execSync('npm install sharp --save-dev', { stdio: 'inherit', cwd: __dirname });
    const require = createRequire(import.meta.url);
    sharp = require('sharp');
}

const svgPath = path.join(__dirname, 'public', 'favicon.svg');
const svgBuffer = readFileSync(svgPath);

const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
];

console.log('Generating favicon files...\n');

for (const { name, size } of sizes) {
    const outPath = path.join(__dirname, 'public', name);
    await sharp(svgBuffer)
        .resize(size, size)
        .png({ quality: 100, compressionLevel: 9 })
        .toFile(outPath);
    console.log(`✅ Generated: ${name} (${size}x${size})`);
}

// Generate favicon.ico (16x16 + 32x32 combined using 32x32 PNG as base)
const icoBuffer = await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toBuffer();

// Write favicon.ico (using PNG format, browsers accept this)
const icoPath = path.join(__dirname, 'public', 'favicon.ico');
writeFileSync(icoPath, icoBuffer);
console.log('✅ Generated: favicon.ico (32x32)');

console.log('\n🎉 All favicon files generated successfully!');
