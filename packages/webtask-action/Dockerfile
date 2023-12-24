FROM node:16-alpine3.11 AS dependencies

WORKDIR /usr/local/webtask-action

RUN apk --update add bash && \
    apk add --no-cache --virtual build-dependencies dos2unix gcc g++ git make python3 python2 py2-setuptools vips-dev

COPY package.json .

RUN yarn install --frozen-lockfile && yarn cache clean



FROM node:16-alpine3.11 AS build

WORKDIR /usr/local/webtask-action

RUN apk --update add bash && \
    apk add --no-cache --virtual build-dependencies dos2unix gcc g++ git make python3 python2 py2-setuptools vips-dev
RUN yarn global add @nestjs/cli rimraf

COPY --from=dependencies /usr/local/webtask-action/node_modules ./node_modules
COPY . .

RUN yarn build



FROM node:16-alpine3.11 AS production

WORKDIR /usr/local/webtask-action

RUN yarn global add pm2

COPY --from=dependencies /usr/local/webtask-action/package.json .
COPY --from=dependencies /usr/local/webtask-action/node_modules ./node_modules
COPY --from=build /usr/local/webtask-action/dist ./dist

EXPOSE 3003

CMD ["node", "dist/main.js"]
