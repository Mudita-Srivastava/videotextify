# Use Node.js base image
FROM node:20

# Install Python + ffmpeg
RUN apt-get update && apt-get install -y python3 python3-pip ffmpeg

# Set working directory
WORKDIR /app

# Copy all backend files
COPY . .

# Install Node.js dependencies
RUN npm install

# Install Python dependencies
RUN pip3 install -r requirements.txt

# Expose port for Render
EXPOSE 10000

# Start backend
CMD ["node", "index.js"]
