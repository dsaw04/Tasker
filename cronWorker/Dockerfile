FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY ../../package*.json ./
RUN npm install --omit=dev

# Copy models and shared utilities (RabbitMQ)
COPY ../../models /app/models
COPY ../shared /app/shared

# Copy cron worker files
COPY . .

CMD ["node", "cronWorker.js"]
