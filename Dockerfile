FROM node:8-alpine

WORKDIR /server

COPY . /server
RUN npm install
RUN npm run tsc

EXPOSE 3000
CMD [ "npm", "run", "start.prod" ]
