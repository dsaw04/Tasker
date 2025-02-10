# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build React app
RUN npm run build

# Install and use a lightweight web server
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]
