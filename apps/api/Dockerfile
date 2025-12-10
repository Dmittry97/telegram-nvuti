FROM node:20-alpine
WORKDIR /app

COPY package.json tsconfig.json ./
COPY packages ./packages
COPY apps/api ./apps/api

# Используем фиксированную версию npm через npx, ставим только workspace api
RUN npx -y npm@11.7.0 install --workspace api --include-workspace-root

# Собираем общий пакет, чтобы api использовал compiled JS/CJS
RUN npx -y npm@11.7.0 --workspace shared run build

CMD ["npm", "--workspace", "api", "run", "start:dev"]
