FROM node:18-buster-slim

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install

COPY . .
EXPOSE 4000
CMD [ "npm", "start" ]