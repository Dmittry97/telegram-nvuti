FROM node:20-alpine
WORKDIR /app

COPY package.json tsconfig.json ./
COPY packages ./packages
COPY apps/api ./apps/api

# Используем конкретную версию npm через npx, чтобы гарантировать поддержку workspace:*
RUN npx -y npm@11.7.0 install --workspaces --include-workspace-root

CMD ["npm", "--workspace", "api", "run", "start:dev"]
