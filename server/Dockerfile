# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy the rest of the backend code
COPY . .

# Set environment variables
ENV NODE_ENV="production"
ENV PORT=8000

# Expose backend port
EXPOSE 8000

# Start the backend server
CMD ["npm", "start"]
