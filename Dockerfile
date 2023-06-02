# Use a smaller base image
FROM node:14-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variable for production
ENV NODE_ENV=production

# Expose the port
EXPOSE 3000

# Set the startup command
CMD ["node", "index.js"]