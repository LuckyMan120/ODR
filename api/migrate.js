
const mysql = require('mysql');
const migration = require('mysql-migrations');
const sails = require('sails');

console.log('----------- Lifting Sails to access configuration -----------');
sails.lift({
  port: 3002,
  models: {migrate: 'safe'},
  log: {level: 'silent'},
  session: {adapter: null},
  fixtures: {}
}, err => {
  if (err) throw err;
  console.log('----------- Running migrations -----------');
  console.log(sails.config.datastores.default.url);
  const connection = mysql.createPool(sails.config.datastores.default.url);
  migration.init(connection, __dirname + '/migrations', err => {
    if (err) throw new Error(err);
    sails.lower(err => {
      if (err) throw new Error(err);
      console.log('----------- Migrations complete -----------');
      console.log('----------- Lowering Sails -----------');
      // process.exit(0);
    });
  });
});
