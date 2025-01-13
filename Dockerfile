# Use an official Node runtime as a parent image with Alpine for smaller size
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Add necessary build dependencies
RUN apk add --no-cache libc6-compat

# Install app dependencies by copying package files first
COPY package*.json ./
RUN npm ci

# Copy Prisma schema and generate Prisma client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of your application code
COPY . .

# Build your Next.js application with ESLint check disabled
ENV DISABLE_ESLINT_PLUGIN=true
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Start the Next.js application in production mode
CMD ["npm", "start"]
