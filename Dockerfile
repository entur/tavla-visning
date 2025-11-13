FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm serve

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

# Build argument for environment
ARG VITE_ENV=prd
ENV VITE_ENV=$VITE_ENV

RUN pnpm run build

EXPOSE 9000

CMD [ "serve", "-s", "dist", "-p", "9000" ]