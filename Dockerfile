FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm serve

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 9000


CMD [ "serve", "-c", "serve.json", "-s", "dist", "-p", "9000" ]