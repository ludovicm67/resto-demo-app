FROM node:12.6.0-alpine
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY index.js .
CMD [ "node", "index.js" ]
