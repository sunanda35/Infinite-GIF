# Infinite GIF - The "Never-Ending" Image

# 📡 Dynamic Live-Status GIF

A lightweight Node.js server that generates a real-time GIF image. Perfect for embedding live data (crypto prices, server stats, or "now playing" info as dummy data) into places that don't support JavaScript, like `GitHub Readmes` or `Emails`.

## 🚀 How it works
Standard "Infinite GIFs" cause browsers to show a permanent loading spinner. This project uses the `HTTP Refresh Header Hack` to serve a single-frame GIF that tells the browser to re-request the image every second, ensuring smooth updates without the "loading" UI.

## 🛠️ Installation

1. **Clone the repo:**
   ```bash
   git clone https://github.com/sunanda35/Infinite-GIF.git
   cd Infinite-GIF
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the server:**
   ```bash
   npm start
   ```

4. **View it:**
   Open your browser to `http://localhost:3000/live-status.gif`.