FROM node:lts-alpine3.17

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the remaining application files
COPY . .

# Expose the port that the app will use
EXPOSE 3000

# Run the command to start the React app
CMD ["npm", "start"]
