# Use official Node.js image as the base
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json .
COPY tsconfig.json .

# Install dependencies
RUN npm install -g ts-node typescript && npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Default command (can be overridden)
CMD ["npm", "run", "start"]
