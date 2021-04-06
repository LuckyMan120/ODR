

const async = require('async');

module.exports = {
  'up': (connection, cb) => async.waterfall([
    cb => connection.query(`
    CREATE TABLE \`issuedatacomment\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`text\` varchar(255) DEFAULT NULL,
        \`issueData\` int(11) DEFAULT NULL,
        \`party\` int(11) DEFAULT NULL,
        \`user\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
    `, err => cb(err)),
    cb => connection.query(`
    CREATE TABLE \`issuedatastatus\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`value\` varchar(255) DEFAULT NULL,
        \`issueData\` int(11) DEFAULT NULL,
        \`party\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
    `, err => cb(err))
  ], err => {
    if (err) throw new Error(err);
    cb();
  }),
  'down': (connection, cb) => async.waterfall([
    cb => connection.query(`
    'DROP TABLE \`issuedatacomment\;
    `, err => cb(err)),
    cb => connection.query(`
    'DROP TABLE \`issuedatastatus\;
    `, err => cb(err))
  ], err => {
    if (err) throw new Error(err);
    cb();
  })
};
