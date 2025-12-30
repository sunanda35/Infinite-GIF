const express = require('express');
const { createCanvas } = require('canvas');
const GIFEncoder = require('gifencoder');

const app = express();

app.get('/live-status.gif', (req, res) => {
    const width = 300;
    const height = 100;
    
    const encoder = new GIFEncoder(width, height);
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d', { alpha: false }); 

    // Headers to try and force the browser to render frames as they come
    res.writeHead(200, {
        'Content-Type': 'image/gif',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Connection': 'keep-alive'
    });

    const stream = encoder.createReadStream();
    stream.pipe(res);

    encoder.start();
    encoder.setRepeat(0);   // Repeat 0 is standard for infinite loops
    encoder.setDelay(1000); // 1 FPS is much lighter on the CPU
    encoder.setQuality(20);
    // Higher number = lower quality = faster processing



    const drawFrame = () => {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);

        // Draw Data
        ctx.fillStyle = '#0f0';
        ctx.font = '20px Monospace';
        ctx.fillText(`BTC: $${(Math.random() * 100000).toFixed(2)}`, 10, 40);
        ctx.fillText(`TIME: ${new Date().toLocaleTimeString()}`, 10, 70);

        encoder.addFrame(ctx);
    };

    // Run immediately
    drawFrame();

    const interval = setInterval(() => {
        if (res.writableFinished || res.closed) {
            clearInterval(interval);
            return;
        }
        drawFrame();
    }, 1000);

    req.on('close', () => {
        clearInterval(interval);
        encoder.finish();
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Infinite GIF Server running on http://localhost:${PORT}/live-status.gif`);
});
