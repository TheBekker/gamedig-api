FROM node:17-alpine
ENV PORT 8181

ENV NODE_OPTIONS --openssl-legacy-provider

# update alpine packages
RUN apk update
RUN apk upgrade --available

RUN mkdir -p /app
WORKDIR /app

COPY . /app

RUN npm audit fix

RUN npm install

RUN npm run build:production

EXPOSE ${PORT}
CMD [ "node", "dist/index" ]