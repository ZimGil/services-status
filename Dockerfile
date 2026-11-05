# Builds the page and its server on Node.js 12, then keeps only what runs.
FROM node:12.22.12-bullseye AS builder
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build && npm prune --production

FROM node:12.22.12-bullseye-slim
WORKDIR /app
COPY --from=builder /src/package.json /app/package.json
COPY --from=builder /src/node_modules /app/node_modules
COPY --from=builder /src/dist /app/dist
USER node
EXPOSE 8282
CMD ["node", "dist/index.js"]
