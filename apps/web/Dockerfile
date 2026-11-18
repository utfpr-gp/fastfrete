FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci -w apps/web --ignore-scripts
COPY apps/web apps/web
WORKDIR /app/apps/web
RUN npx nuxt prepare && npm run build
ENV NITRO_HOST=0.0.0.0 NITRO_PORT=3001
EXPOSE 3001
CMD ["node", ".output/server/index.mjs"]
