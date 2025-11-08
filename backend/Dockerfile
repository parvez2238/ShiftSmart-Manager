FROM node:18-alpine AS build-frontend
WORKDIR /build
COPY frontend/package.json ./frontend/package.json
COPY frontend/package-lock.json* ./frontend/package-lock.json*
RUN cd frontend && npm install
COPY frontend ./frontend
RUN cd frontend && npm run build

FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend ./
COPY --from=build-frontend /build/frontend/dist ./public
EXPOSE 4000
CMD ["node", "server.js"]
