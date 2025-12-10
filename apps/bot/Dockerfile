FROM node:20-alpine
WORKDIR /app

COPY package.json tsconfig.json ./
COPY packages ./packages
COPY apps/bot ./apps/bot

RUN npm install --workspace bot --include-workspace-root

CMD ["npm", "--workspace", "bot", "run", "dev"]
