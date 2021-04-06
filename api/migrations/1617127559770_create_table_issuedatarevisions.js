

const async = require('async');

module.exports = {
  'up': (connection, cb) => async.waterfall([
    cb => connection.query(`
    CREATE TABLE \`issuedatarevision\` (
      \`createdAt\` bigint(20) DEFAULT NULL,
      \`updatedAt\` bigint(20) DEFAULT NULL,
      \`id\` int(11) NOT NULL AUTO_INCREMENT,
      \`value\` text,
      \`issueData\` int(11) DEFAULT NULL,
      \`party\` int(11) DEFAULT NULL,
      \`user\` int(11) DEFAULT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`id\` (\`id\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
    `, err => cb(err))
  ], err => {
    if (err) throw new Error(err);
    cb();
  }),
  'down': (connection, cb) => async.waterfall([
    cb => connection.query(`
    'DROP TABLE \`issuedatarevision\;
    `, err => cb(err))
  ], err => {
    if (err) throw new Error(err);
    cb();
  })
};
