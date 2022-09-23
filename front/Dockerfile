FROM node:16 AS build

WORKDIR /services/gour-auth-service/front

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM nginx:alpine
COPY --from=build /services/gour-auth-service/front/build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
