# =========================
# Builder
# =========================
FROM node:22-bookworm-slim AS build
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Limpiar dev deps
RUN npm ci --only=production && npm cache clean --force

ENV PLAYWRIGHT_BROWSERS_PATH=0
RUN npx playwright install --with-deps chromium

# =========================
# Imagen final
# =========================
FROM node:22-bookworm-slim AS prod
WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PLAYWRIGHT_BROWSERS_PATH=0

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
COPY --from=build /usr/src/app/generated ./generated

USER node
EXPOSE 3000

CMD ["node", "dist/src/main.js"]
