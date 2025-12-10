FROM node:20-alpine
WORKDIR /app

COPY package.json tsconfig.json ./
COPY packages ./packages
COPY apps/bot ./apps/bot

# Активируем corepack и готовим npm 11.7.0, чтобы workspace:* поддерживался корректно
RUN corepack enable && corepack prepare npm@11.7.0 --activate

# Устанавливаем зависимости в режиме workspaces, чтобы корректно
# резолвились ссылки вида "workspace:*"
RUN npm install --workspaces --include-workspace-root

CMD ["npm", "--workspace", "bot", "run", "dev"]
