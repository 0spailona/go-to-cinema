#!/bin/sh

# Laravel ignores system enviroment

[ -z "$ADMIN_MAIL" ] || echo "ADMIN_MAIL=$ADMIN_MAIL" >> .env
[ -z "$ADMIN_PASSWORD" ] || echo "ADMIN_PASSWORD=$ADMIN_PASSWORD" >> .env
[ -z "$PUBLIC_URL" ] || echo "PUBLIC_URL=$PUBLIC_URL" >> .env

exec php artisan serve --host 0.0.0.0 --port 80
