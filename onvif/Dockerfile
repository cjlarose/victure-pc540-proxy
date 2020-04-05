FROM node:12.16.1-buster

WORKDIR /app

ADD package.json package-lock.json ./
RUN npm install
ADD proxy.js proxy.js

EXPOSE 8080

CMD ["node", "proxy.js"]
