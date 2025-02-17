FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY ../package*.json ./  
RUN npm install --omit=dev  

# Copy models (if needed)
COPY ../utils /app/utils  

# Copy only email job files
COPY . .  

# Run the cleanup job
CMD ["node", "dailyTaskEmail.js"]
