#!/bin/sh

APOLLO_APPID=xauth-user \
APOLLO_HOST=${APOLLO_HOST} \
APOLLO_NAMESPACE=application \
APOLLO_PORT=8080 \
APOLLO_ClUSTER=dev \
APOLLO_ENV=dev \
APOLLO_TOKEN=${APOLLO_TOKEN} \
yarn nest start --watch service-auth
