FROM node:14

RUN mkdir -p /app
COPY . /app
WORKDIR /app

RUN npm install

RUN npm run build:production

EXPOSE 8181
CMD [ "npm", "run", "start" ]