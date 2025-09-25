# Base image: comes with both Python 3.11 + Node.js 20
FROM nikolaik/python-nodejs:python3.11-nodejs20

# Set working directory inside the container
WORKDIR /app

# Copy everything into the container
COPY . .

# Install Node.js dependencies
RUN npm install

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port Render will use (matches your Node.js index.js)
EXPOSE 10000

# Start the Node.js backend
CMD ["node", "index.js"]
