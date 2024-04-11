# Use the official Node.js image with LTS version
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY src .

# Build TypeScript files
# RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Command to run your application
# CMD ["npm", "start"]
