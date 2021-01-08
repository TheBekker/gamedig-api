FROM node:14.15.4-slim
ENV PORT 8181

RUN mkdir -p /app
WORKDIR /app

COPY . /app

RUN npm install

RUN npm run build:production

EXPOSE ${PORT}
CMD [ "node", "dist/index" ]