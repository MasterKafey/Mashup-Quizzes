FROM node:22 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:1.27-alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html

COPY .docker/config/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80