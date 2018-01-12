FROM node:8-alpine

ENV NODE_ENV production

WORKDIR /server

COPY . /server
RUN npm install
RUN npm run tsc

EXPOSE 3000
CMD [ "npm", "run", "start.prod" ]
