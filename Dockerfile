FROM node:alpine


WORKDIR /app

COPY package*.json ./ 

COPY .  .

RUN npm install

RUN npm run build


EXPOSE 5050

CMD ["node", "dist/main/server.js"]