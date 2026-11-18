FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci -w apps/web --ignore-scripts && chmod -R a+rwX /app/node_modules
RUN mkdir -p apps/web/node_modules && chmod a+rwX apps/web/node_modules
WORKDIR /app/apps/web
EXPOSE 3001
CMD ["sh", "-c", "npx nuxt prepare && npx nuxt dev --host 0.0.0.0 --port 3001"]
