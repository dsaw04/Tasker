FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY ../../package*.json ./
RUN npm install --omit=dev

# Copy shared utilities (RabbitMQ)
COPY ../shared /app/shared

# Copy queue worker files
COPY . .

CMD ["node", "queueWorker.js"]