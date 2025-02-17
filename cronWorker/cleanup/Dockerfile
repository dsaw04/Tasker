FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY ../../package*.json ./  
RUN npm install --omit=dev  

# Copy models (if needed)
COPY ../../models /app/models  

# Copy only cleanup job files
COPY . .  

# Run the cleanup job
CMD ["node", "/app/cleanupJob.js"]
