FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm serve

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_BACKEND_URL=https://tavla-api.entur.no
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

RUN pnpm run build

EXPOSE 9000

CMD [ "serve", "-s", "dist", "-p", "9000" ]