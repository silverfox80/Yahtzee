# Use the official Node.js 18 LTS image as the base image for building
FROM node:18.20 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the entire project to the container
COPY . ./

# Build the Next.js app
RUN npm run build

# Use a lightweight Node.js image for the production environment
FROM node:18.20-slim AS runner

# Set the working directory
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV production

# Copy the build output and necessary files from the builder stage
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/node_modules /app/node_modules

# Expose the port that the Next.js app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "run", "start"]
