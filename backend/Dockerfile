FROM node:6.7.0

MAINTAINER Joe Ridenour, dev@joesapps.net

WORKDIR /var/www/professor-redwood.backend

ENV NODE_ENV=production

## Copy our package.json and run the install
COPY package.json .
COPY package-lock.json .
RUN npm install --silent

## Copy all the other things we need and
COPY src ./src

## Expose the ports we want here
EXPOSE 3000

ENTRYPOINT ["npm", "start"]
