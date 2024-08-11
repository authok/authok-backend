FROM node:22.3.0-alpine3.19 AS dependencies

# OpenJDK
ENV JAVA_HOME="/usr/lib/jvm/default-jvm/"
ENV OPENJDK_VERSION=8

WORKDIR /usr/local/authok.backend

RUN apk --update add bash && \
    apk add --no-cache --virtual build-dependencies dos2unix gcc g++ git make python3 vips-dev openjdk${OPENJDK_VERSION}
# Has to be set explictly to find binaries 
ENV PATH=$PATH:${JAVA_HOME}/bin

COPY package.json .
COPY packages ./packages

# RUN yarn config set registry https://registry.npm.taobao.org
RUN yarn install --frozen-lockfile && yarn cache clean



FROM node:22.3.0-alpine3.19 AS build


# OpenJDK
ENV JAVA_HOME="/usr/lib/jvm/default-jvm/"
ENV OPENJDK_VERSION=8

WORKDIR /usr/local/authok.backend

RUN apk --update add bash && \
    apk add --no-cache --virtual build-dependencies dos2unix gcc g++ git make python3 vips-dev openjdk${OPENJDK_VERSION}
# Has to be set explictly to find binaries 
ENV PATH=$PATH:${JAVA_HOME}/bin

RUN yarn global add @nestjs/cli rimraf

COPY --from=dependencies /usr/local/authok.backend/node_modules ./node_modules
COPY . .

RUN yarn build:tenant-service
RUN yarn build:api-server
RUN yarn build:mgmt-api-server
RUN yarn build:cli



FROM node:22.3.0-alpine3.19 AS production

WORKDIR /usr/local/authok.backend

RUN yarn global add pm2

COPY --from=dependencies /usr/local/authok.backend/package.json .
COPY --from=dependencies /usr/local/authok.backend/node_modules ./node_modules
COPY --from=build /usr/local/authok.backend/dist ./dist
COPY --from=build /usr/local/authok.backend/apps/api-server/views ./apps/api-server/views
COPY --from=build /usr/local/authok.backend/proto ./proto

COPY --from=build /usr/local/authok.backend/libs/support/tenant-support-typeorm/src/ormconfig.tenant.ts ./libs/support/tenant-support-typeorm/src/ormconfig.tenant.ts
COPY --from=build /usr/local/authok.backend/libs/support/tenant-support-typeorm/migrations ./libs/support/tenant-support-typeorm/migrations
COPY --from=build /usr/local/authok.backend/libs/support/infra-support-typeorm/migrations ./libs/support/infra-support-typeorm/migrations


EXPOSE 3003

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone

CMD ["node", "dist/apps/api-server/main.js"]
