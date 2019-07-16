#!/bin/sh

# replace backend URL to the one specified using env vars
sed -i "s~BACKEND_URL~$BACKEND_URL~g" /usr/share/nginx/html/static/js/*.js

# configure and start nginx
sed -i \
  '/index.htm/a try_files $uri $uri/ /index.html =404;' \
  /etc/nginx/conf.d/default.conf
echo "daemon off;" >> /etc/nginx/nginx.conf
nginx
