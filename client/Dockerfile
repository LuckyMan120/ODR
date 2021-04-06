FROM node:14.15.3
WORKDIR /usr/src/client
COPY package*.json ./
RUN npm ci
COPY . .
ENV NODE_OPTIONS=--max_old_space_size=4096
ENV NODE_ENV=production
RUN npm run build
CMD ["npm", "start"]
