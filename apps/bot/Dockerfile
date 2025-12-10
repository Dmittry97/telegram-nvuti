FROM node:20-alpine
WORKDIR /app

COPY package.json tsconfig.json ./
COPY packages ./packages
COPY apps/bot ./apps/bot

# Используем фиксированную версию npm через npx
RUN npx -y npm@11.7.0 install --workspaces --include-workspace-root

CMD ["npm", "--workspace", "bot", "run", "dev"]
