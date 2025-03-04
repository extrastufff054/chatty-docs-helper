
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the application code
COPY . .

# Build the TypeScript server
RUN npm run build:server

# Build the frontend application
RUN npm run build

# Create uploads directory
RUN mkdir -p uploads

# Expose the port
EXPOSE 5000

# Command to run the application
CMD ["node", "dist/server.js"]
