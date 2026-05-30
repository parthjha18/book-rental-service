FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend source code
COPY . .

# Expose port 5001
EXPOSE 5001

# Start the application
CMD ["npm", "start"]
