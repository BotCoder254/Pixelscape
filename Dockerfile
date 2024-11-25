# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Add environment variables
ARG REACT_APP_UNSPLASH_ACCESS_KEY
ENV REACT_APP_UNSPLASH_ACCESS_KEY=$REACT_APP_UNSPLASH_ACCESS_KEY

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the app
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

# Expose the port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "build", "-l", "3000"] 