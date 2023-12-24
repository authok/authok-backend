#!/bin/sh

APOLLO_APPID=xauth-user \
APOLLO_HOST=apollo-dev.dev.lucfish.com \
APOLLO_NAMESPACE=application \
APOLLO_PORT=8080 \
APOLLO_ClUSTER=dev \
APOLLO_ENV=dev \
APOLLO_TOKEN=abaee9951b7f1f70e3eec8533c2d3efcea5a7ae1 \
yarn nest start --watch service-auth
