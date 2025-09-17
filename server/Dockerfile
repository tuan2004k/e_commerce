# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# Install OS deps for Prisma if needed
RUN apk add --no-cache openssl

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install all deps (tolerate unsynced lockfile in CI)
RUN npm install

# Copy the rest of the server code
COPY . .

# Generate Prisma client (needs schema.prisma)
RUN npx prisma generate

# Expose port
EXPOSE 5000

# Optionally prune dev deps to shrink image
RUN npm prune --omit=dev || true

# Run the app
CMD ["npm", "start"]
