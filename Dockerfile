FROM node:18    
WORKDIR /user/src/clean-node-api
COPY package*.json ./
RUN npm install --only=production
COPY ./dist ./dist
EXPOSE 5000
CMD ["npm", "start"]