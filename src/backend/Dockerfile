FROM node:12.6.0-alpine
ENV NPM_CONFIG_LOGLEVEL warn
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "node", "index.js" ]
