FROM node:12.16.1-buster AS builder

WORKDIR /app
ADD package.json package-lock.json ./
RUN npm install
ADD tsconfig.json ./
ADD src ./src
RUN npm run build

FROM node:12.16.1-buster

WORKDIR /app
ADD package.json package-lock.json ./
RUN npm install
COPY --from=builder /app/lib ./lib
ADD . ./

EXPOSE 554

CMD ["npm", "start"]
