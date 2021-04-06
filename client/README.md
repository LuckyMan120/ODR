# client

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

## Production with Docker

Running in production using docker:

```bash
docker build -t grv3/client .

docker run -p 3000:3000 -e API_URL='http://192.168.1.100:1337' grv3/client
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
