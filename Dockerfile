# syntax=docker/dockerfile:1
FROM node:16-slim as base

ENV NODE_ENV=production

WORKDIR /Users/josephlin/hackreactor/SDC/Overview-API

COPY package*.json ./

RUN npm i -g typescript && npm i

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]

EXPOSE 8000

