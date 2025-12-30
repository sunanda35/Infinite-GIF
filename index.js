const express = require('express');
const { createCanvas } = require('canvas');
const GIFEncoder = require('gifencoder');

const app = express();

// Cache Variables
// This prevents the server from melting if too many people view it at once.
let lastBuffer = null;
let lastGenerated = 0;

app.get('/live-status.gif', (req, res) => {
    const now = Date.now();

    // Check Cache
    // If we generated a frame less than 900ms ago, just send that one.
    if (lastBuffer && (now - lastGenerated) < 900) {
        res.set({
            'Content-Type': 'image/gif',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Refresh': '1' // Tell browser to reload in 1 second
        });
        return res.send(lastBuffer);
    }

    const width = 300;
    const height = 100;
    
    // Setup Canvas & Encoder
    const encoder = new GIFEncoder(width, height);
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d', { alpha: false }); 

    // Draw the Frame (Just ONE frame, no loop)
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Draw Data
    ctx.fillStyle = '#0f0';
    ctx.font = '20px Monospace';
    ctx.fillText(`BTC: $${(Math.random() * 100000).toFixed(2)}`, 10, 40);
    ctx.fillText(`TIME: ${new Date().toLocaleTimeString()}`, 10, 70);

    // Encode the Single Frame
    encoder.start();
    encoder.setRepeat(-1);   // -1 = No Loop (Single frame)
    encoder.setQuality(20);  // 20 = High performance
    encoder.addFrame(ctx);
    encoder.finish();

    // Update Cache & Send
    const buffer = encoder.out.getData();
    lastBuffer = buffer;
    lastGenerated = now;

    res.set({
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Refresh': '1' // <--- The Magic Header
    });

    res.send(buffer);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Infinite GIF Server running on http://localhost:${PORT}/live-status.gif`);
});