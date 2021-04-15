FROM node:latest
LABEL org.opencontainers.image.source=https://github.com/circlesland/auth-server

WORKDIR /usr/o-platform/auth-server

COPY packages/client /usr/o-platform/auth-server/packages/client
COPY packages/data /usr/o-platform/auth-server/packages/data
COPY packages/mailer /usr/o-platform/auth-server/packages/mailer
COPY packages/server /usr/o-platform/auth-serverh/packages/server
COPY packages/util /usr/o-platform/auth-server/packages/util

COPY build-circles-auth-server.sh /usr/o-platform/auth-server/build-circles-auth-server.sh
COPY package.json /usr/o-platform/auth-server/package.json
COPY package-lock.json /usr/o-platform/auth-server/package-lock.json
COPY lerna.json /usr/o-platform/auth-server/lerna.json

RUN /usr/o-platform/auth-server/build.sh

WORKDIR /usr/o-platform/auth-server/packages/server/dist
CMD ["node", "main.js"]