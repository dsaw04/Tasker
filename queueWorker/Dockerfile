FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies (from queueWorker/)
COPY package*.json ./  
RUN npm install --omit=dev  

# Copy utils (contains RabbitMQ and other shared utilities)
COPY utils /app/utils  

# Copy all queue worker files
COPY . .  

# Start the service using npm
CMD ["npm", "start"]
