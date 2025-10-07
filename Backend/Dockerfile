# Base image: Python 3.11 + Node.js 20
FROM nikolaik/python-nodejs:python3.11-nodejs20

# Set working directory
WORKDIR /app

# -----------------------------
# Copy dependency files first for caching
# -----------------------------
COPY package*.json ./
COPY requirements.txt ./requirements.txt

# Install Node.js dependencies
RUN npm install

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install FFmpeg for yt-dlp
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# -----------------------------
# Copy rest of your Backend code
# -----------------------------
COPY . .

# Ensure cookies.txt is available for youtube_transcribe.py
COPY python/cookies.txt ./python/cookies.txt

# Optional: copy .env
COPY .env .env

# Expose port used by Node.js backend
EXPOSE 10000

# Start Node.js backend
CMD ["node", "server.js"]
