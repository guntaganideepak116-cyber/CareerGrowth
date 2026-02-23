const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Install jimp if not present
try {
    require.resolve('jimp');
} catch {
    console.log('Installing jimp...');
    execSync('npm install jimp --save-dev', { stdio: 'inherit' });
}

const publicDir = path.join(__dirname, 'public');

// CareerGrowth favicon - create programmatically using Jimp
// Teal gradient background (#0F766E) with white arrow/chart icon

async function createFavicon(size) {
    // Create base image with teal background
    const image = new Jimp(size, size, 0x0F766EFF);

    // Add rounded corner effect (darken corners)
    const radius = Math.floor(size * 0.19);

    // Draw rounded rectangle by clearing corners
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const dx = Math.min(x, size - 1 - x);
            const dy = Math.min(y, size - 1 - y);
            if (dx < radius && dy < radius) {
                const dist = Math.sqrt((radius - dx) ** 2 + (radius - dy) ** 2);
                if (dist > radius) {
                    image.setPixelColor(0x00000000, x, y);
                }
            }
        }
    }

    // Scale factor
    const s = size / 512;

    // Draw bar chart bars (white, semi-transparent)
    const bars = [
        { x: 80, y: 340, w: 72, h: 172, opacity: 0.3 },
        { x: 178, y: 280, w: 72, h: 232, opacity: 0.45 },
        { x: 276, y: 210, w: 72, h: 302, opacity: 0.6 },
    ];

    for (const bar of bars) {
        const alpha = Math.floor(bar.opacity * 255);
        const color = Jimp.rgbaToInt(255, 255, 255, alpha);
        const bx = Math.floor(bar.x * s);
        const by = Math.floor(bar.y * s);
        const bw = Math.floor(bar.w * s);
        const bh = Math.floor(bar.h * s);
        for (let px = bx; px < bx + bw && px < size; px++) {
            for (let py = by; py < by + bh && py < size; py++) {
                if (px >= 0 && py >= 0) image.setPixelColor(color, px, py);
            }
        }
    }

    // Draw rising line (white, thick)
    const linePoints = [
        [90 * s, 380 * s],
        [200 * s, 280 * s],
        [295 * s, 320 * s],
        [420 * s, 155 * s],
    ];

    const lineThickness = Math.max(2, Math.floor(14 * s));
    const lineColor = Jimp.rgbaToInt(255, 255, 255, 255);

    function drawLine(x0, y0, x1, y1) {
        const dx = x1 - x0, dy = y1 - y0;
        const steps = Math.max(Math.abs(dx), Math.abs(dy)) * 2;
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const cx = Math.floor(x0 + dx * t);
            const cy = Math.floor(y0 + dy * t);
            for (let ox = -lineThickness; ox <= lineThickness; ox++) {
                for (let oy = -lineThickness; oy <= lineThickness; oy++) {
                    if (ox * ox + oy * oy <= lineThickness * lineThickness) {
                        const px = cx + ox, py = cy + oy;
                        if (px >= 0 && px < size && py >= 0 && py < size) {
                            image.setPixelColor(lineColor, px, py);
                        }
                    }
                }
            }
        }
    }

    for (let i = 0; i < linePoints.length - 1; i++) {
        drawLine(linePoints[i][0], linePoints[i][1], linePoints[i + 1][0], linePoints[i + 1][1]);
    }

    // Draw arrowhead at tip
    const tipX = Math.floor(420 * s), tipY = Math.floor(155 * s);
    const arrowSize = Math.max(3, Math.floor(22 * s));
    const arrowPoints = [
        [tipX, tipY],
        [tipX - arrowSize, tipY + arrowSize * 2],
        [tipX + arrowSize, tipY + arrowSize * 2],
    ];
    // Fill arrowhead triangle
    const minY = Math.min(...arrowPoints.map(p => p[1]));
    const maxY = Math.max(...arrowPoints.map(p => p[1]));
    for (let py = minY; py <= maxY; py++) {
        const t = (py - minY) / (maxY - minY);
        const lx = Math.floor(arrowPoints[0][0] + (arrowPoints[1][0] - arrowPoints[0][0]) * t);
        const rx = Math.floor(arrowPoints[0][0] + (arrowPoints[2][0] - arrowPoints[0][0]) * t);
        for (let px = Math.min(lx, rx); px <= Math.max(lx, rx); px++) {
            if (px >= 0 && px < size && py >= 0 && py < size) {
                image.setPixelColor(lineColor, px, py);
            }
        }
    }

    // Draw accent dots on line nodes
    const dots = [
        { x: 90 * s, y: 380 * s, r: 9 * s },
        { x: 200 * s, y: 280 * s, r: 9 * s },
        { x: 295 * s, y: 320 * s, r: 11 * s },
    ];
    for (const dot of dots) {
        const dotColor = Jimp.rgbaToInt(255, 255, 255, 230);
        const r = Math.max(2, Math.floor(dot.r));
        for (let ox = -r; ox <= r; ox++) {
            for (let oy = -r; oy <= r; oy++) {
                if (ox * ox + oy * oy <= r * r) {
                    const px = Math.floor(dot.x) + ox;
                    const py = Math.floor(dot.y) + oy;
                    if (px >= 0 && px < size && py >= 0 && py < size) {
                        image.setPixelColor(dotColor, px, py);
                    }
                }
            }
        }
    }

    return image;
}

async function main() {
    const sizes = [
        { name: 'favicon-16x16.png', size: 16 },
        { name: 'favicon-32x32.png', size: 32 },
        { name: 'apple-touch-icon.png', size: 180 },
        { name: 'android-chrome-192x192.png', size: 192 },
        { name: 'android-chrome-512x512.png', size: 512 },
    ];

    console.log('🎨 Generating CareerGrowth favicons...\n');

    for (const { name, size } of sizes) {
        const img = await createFavicon(size);
        const outPath = path.join(publicDir, name);
        await img.writeAsync(outPath);
        console.log(`✅ ${name} (${size}x${size})`);
    }

    // Write favicon.ico as a copy of favicon-32x32.png (widely accepted)
    const ico32 = await createFavicon(32);
    await ico32.writeAsync(path.join(publicDir, 'favicon.ico'));
    console.log('✅ favicon.ico (32x32)');

    console.log('\n🎉 All favicon files generated successfully!');
}

main().catch(console.error);
