# Use Node.js official image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port (if needed for web app)
# EXPOSE 3000

# Command to run the demo
CMD [ "node", "examples/demo.js" ]