FROM node:14

ENV NODE_ENV production
ENV ENV production

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8181
CMD [ "npm", "run", "start" ]