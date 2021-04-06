FROM node:14.15.3
ENV NODE_ENV=production
WORKDIR /usr/src/api
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node", "app", "up"]