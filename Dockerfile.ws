FROM node:15.11.0
ENV NODE_ENV=prod

WORKDIR /usr/src/app

RUN npm i yarn -g --loglevel notice --force
RUN npm i pm2 -g

COPY package.json .

COPY apps/ws ./apps/ws
COPY libs/core ./libs/core
COPY libs/shared ./libs/shared

COPY lerna.json .
COPY tsconfig.json .
COPY tsconfig.base.json .

RUN yarn install
RUN yarn bootstrap
RUN yarn build:ws

WORKDIR /usr/src/app/apps/ws
RUN cp src/.env.test dist/src/.env.test
RUN cp src/.env.development dist/src/.env.development
RUN cp src/.env.production dist/src/.env.production

CMD [ "pm2-runtime", "dist/src/main.js" ]
