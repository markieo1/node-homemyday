FROM node:8-alpine

RUN apk --no-cache add --virtual builds-deps build-base python
ENV NODE_ENV production
ENV MONGODB_URI mongodb://mongo:27017/homemyday

WORKDIR /server

COPY . /server
RUN npm install
RUN npm rebuild bcrypt --build-from-source
RUN npm run tsc

EXPOSE 3000
CMD [ "npm", "run", "start.prod" ]
