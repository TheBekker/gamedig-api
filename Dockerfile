FROM node:14

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN npm run build:production

EXPOSE 8181
CMD [ "npm", "run", "start" ]