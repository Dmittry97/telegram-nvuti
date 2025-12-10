FROM node:20-alpine
WORKDIR /app

COPY package.json tsconfig.json ./
COPY packages ./packages
COPY apps/api ./apps/api

RUN npm install --workspace api --include-workspace-root

CMD ["npm", "--workspace", "api", "run", "start:dev"]
