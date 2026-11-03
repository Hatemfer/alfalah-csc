# Multi-stage production build for Alfalah Backend (NestJS)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root or backend package files
COPY backend/package*.json ./

RUN npm install

COPY backend/ ./

RUN npm run build

# Production Runner Stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Install production dependencies only
COPY backend/package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copy compiled code from builder stage
COPY --from=builder /app/dist ./dist

# Create uploads directory with appropriate write permissions
RUN mkdir -p uploads && chown -R node:node /app

USER node

EXPOSE 4000

CMD ["node", "dist/main"]
