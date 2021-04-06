

const async = require('async');

module.exports = {
  'up': (connection, cb) => async.waterfall([
    cb => connection.query(`
      ALTER TABLE \`issuedata\` CHANGE \`value\` \`value\`
      TEXT CHARACTER SET latin1
      COLLATE latin1_swedish_ci NULL DEFAULT NULL;
    `, err => cb(err)),
    cb => connection.query(`
      UPDATE \`datatype\`
      SET \`shared\` = '1'
      WHERE \`datatype\`.\`id\` = 11;
    `, err => cb(err))
  ], err => {
    if (err) throw new Error(err);
    cb();
  }),
  'down': (connection, cb) => async.waterfall([
    cb => connection.query(`
      ALTER TABLE \`issuedata\` MODIFY \`value\` varchar(255);
    `, err => cb(err)),
    cb => connection.query(`
      UPDATE \`datatype\`
      SET \`shared\` = '0'
      WHERE \`datatype\`.\`id\` = 11;
    `, err => cb(err))
  ], err => {
    if (err) throw new Error(err);
    cb();
  })
};
