FROM node:20-alpine
WORKDIR /app

COPY package.json tsconfig.json ./
COPY packages ./packages
COPY apps/api ./apps/api

# Устанавливаем зависимости в режиме workspaces, чтобы корректно
# резолвились ссылки вида "workspace:*"
RUN npm install --workspaces --include-workspace-root

CMD ["npm", "--workspace", "api", "run", "start:dev"]
