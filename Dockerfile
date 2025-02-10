FROM node:23-alpine as build-front
RUN mkdir /front
WORKDIR /front
COPY front .

WORKDIR /front/admin-page
RUN npm install
RUN npm run build

WORKDIR /front/client-page
RUN npm install
RUN npm run build

FROM php:8.3-cli as runtime

RUN apt-get update && apt-get install -y \
  --no-install-recommends git zip unzip \
  zlib1g-dev libzip-dev \
  libpng-dev

RUN docker-php-ext-install -j$(nproc) zip gd

ENV COMPOSER_ALLOW_SUPERUSER 1
ENV COMPOSER_HOME /tmp

COPY install-composer.sh /tmp/install-composer.sh
RUN chmod +x /tmp/install-composer.sh
RUN /tmp/install-composer.sh
RUN rm /tmp/install-composer.sh

RUN mkdir /app

WORKDIR /app

COPY server/go-to-cinema .

RUN composer install

RUN cp .env.example .env

RUN mkdir -p database
RUN touch database/database.sqlite
RUN php artisan migrate

COPY --from=build-front /front/admin-page/dist storage/spa/admin
COPY --from=build-front /front/client-page/dist storage/spa/client

COPY start.sh .

CMD ["./start.sh"]
