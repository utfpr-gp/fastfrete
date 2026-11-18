FROM node:22-bookworm-slim
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci -w apps/api --ignore-scripts && chmod -R a+rwX /app/node_modules
RUN mkdir -p apps/api/node_modules && chmod a+rwX apps/api/node_modules
WORKDIR /app/apps/api
EXPOSE 3000
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run prisma:seed && npm run start:dev"]
