FROM node:12.6.0-alpine AS build
ENV NPM_CONFIG_LOGLEVEL warn
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
EXPOSE 80
WORKDIR /usr/share/nginx/html
RUN sed -i \
  '/index.htm/a try_files $uri $uri/ /index.html =404;' \
  /etc/nginx/conf.d/default.conf
COPY --from=build /app/build .
COPY init.sh .
RUN chmod +x init.sh
CMD [ "./init.sh" ]
