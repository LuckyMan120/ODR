
# Run

```bash
# install modules
npm ci
# run with change watch & linting
npm run dev
# run with change watch, no linting
npm run serve
# run production (up in the end will enable auto migrations)
NODE_ENV=production node app up
```

# Test

```bash
npm test

# run one test
npx mocha 'test/integration/controllers/common/ping.test.js' --file test/lifecycle.test.js --timeout 80000
```

> Note that config/local.js can override test configuration so you have to make sure your local configuration will not prevent tests from running.

# Tests with Docker

Running tests locally requires you to have mysql and redis installed.
Two ways of using Docker environment to run tests:

## 1. Run test in API container

Attach shell to a container and run `npm run test`
```bash
docker exec -it grv3_api_1 bash

cd api

npm run test
```

[Shell could be attached using vscode docker extension](https://code.visualstudio.com/docs/remote/attach-container)

Obvious downside is that api container is attached to a grv3 database, and running tests will mess up your data, it will drop it and fill it with all test fixtures and test results. After such test runs you'll be required to restart api with `models: {migrate: 'drop'}` in your config/local.js file.

## 2. Run docker-compose.test.yml

Use this if you want a api test environment to be separate from your dev env. Running docker-compose.test.yml will lift a separate containers for db, redis and api just for testing purposes.

> Note that first run of grv3_test-api_1 will fail, you'll need to restart the container after grv3_test-db_1 finished initialization process.

```bash
docker-compose -f docker-compose.test.yml up -d
```

# API Docs

Api docs through [Postman](https://www.postman.com/) collection is stored in `doc/`.

# Email

With default configuration, in test mode, all emails will be written to `.tmp/email.txt`.
Configuration: [sails-hook-email](https://www.npmjs.com/package/sails-hook-email)

# Production

Running in production with docker (minimal configuration):
```bash
docker build -t grv3/api .

docker run -p 1337:1337 -e sails_datastores__default__url='mysql://root:root@192.168.1.100:3306/grv3' -e sails_session__url='redis://192.168.1.100:6379' grv3/api
```

# api

a [Sails v1](https://sailsjs.com) application


### Links

+ [Sails framework documentation](https://sailsjs.com/get-started)
+ [Version notes / upgrading](https://sailsjs.com/documentation/upgrading)
+ [Deployment tips](https://sailsjs.com/documentation/concepts/deployment)
+ [Community support options](https://sailsjs.com/support)
+ [Professional / enterprise options](https://sailsjs.com/enterprise)


### Version info

This app was originally generated on Mon Oct 26 2020 16:22:12 GMT+0600 (East Kazakhstan Time) using Sails v1.2.4.

<!-- Internally, Sails used [`sails-generate@1.17.1`](https://github.com/balderdashy/sails-generate/tree/v1.17.1/lib/core-generators/new). -->



<!--
Note:  Generators are usually run using the globally-installed `sails` CLI (command-line interface).  This CLI version is _environment-specific_ rather than app-specific, thus over time, as a project's dependencies are upgraded or the project is worked on by different developers on different computers using different versions of Node.js, the Sails dependency in its package.json file may differ from the globally-installed Sails CLI release it was originally generated with.  (Be sure to always check out the relevant [upgrading guides](https://sailsjs.com/upgrading) before upgrading the version of Sails used by your app.  If you're stuck, [get help here](https://sailsjs.com/support).)
-->

