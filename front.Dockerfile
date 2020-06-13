FROM node:12 as c-c_compile-front
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
