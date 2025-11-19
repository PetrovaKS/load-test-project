FROM node:18-bullseye

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/src/main"]