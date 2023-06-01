# Use a specific LTS version of Node.js as the base image
FROM node:16-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json separately
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the project files to the working directory
COPY . .

# Expose the port specified in the Nest.js application
ENV PORT=8080
EXPOSE $PORT

# Start the Nest.js application
CMD [ "sh", "-c", "source .env && npm run start:prod" ]