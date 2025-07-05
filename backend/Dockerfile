# syntax=docker/dockerfile:1

# Development stage
FROM node:18-alpine AS development

RUN npm i -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm i

COPY . .

RUN pnpm run build

# Production stage
FROM node:18-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN npm i -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm i --prod

COPY --from=development /app/dist ./dist

CMD ["node", "dist/main"] 