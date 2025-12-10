FROM node:20-alpine
WORKDIR /app

COPY package.json tsconfig.json ./
COPY packages ./packages
COPY apps/api ./apps/api

# Обновляем npm, т.к. штатная версия в node:20-alpine не понимает workspace:*
RUN npm install -g npm@11.7.0

# Устанавливаем зависимости в режиме workspaces, чтобы корректно
# резолвились ссылки вида "workspace:*"
RUN npm install --workspaces --include-workspace-root

CMD ["npm", "--workspace", "api", "run", "start:dev"]
