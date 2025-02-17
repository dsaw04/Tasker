FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY ../../package*.json ./  
RUN npm install --omit=dev  

# Copy models (if needed)
COPY ../../models /app/models  

# Copy only daily email job files
COPY . .  

# Run the daily email job
CMD ["node", "/app/dailyTaskEmail.js"]
