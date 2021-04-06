

const async = require('async');

module.exports = {
  'up': (connection, cb) => async.waterfall([
    cb => connection.query(`
      ALTER TABLE \`issue\`
      ADD COLUMN \`resolvedAt\` DOUBLE DEFAULT NULL AFTER \`name\`,
      ADD COLUMN \`agreedAt\` DOUBLE DEFAULT NULL AFTER \`resolvedAt\`,
      ADD COLUMN \`closedAt\` DOUBLE DEFAULT NULL AFTER \`agreedAt\`;
    `, err => cb(err)),
    cb => connection.query(`
      ALTER TABLE \`issueuser\`
      MODIFY COLUMN \`role\` VARCHAR(255);
    `, err => cb(err))
  ], err => {
    if (err) throw new Error(err);
    cb();
  }),
  'down': (connection, cb) => async.waterfall([
    cb => connection.query(`
      ALTER TABLE \`issue\`
      DROP COLUMN \`resolvedAt\`,
      DROP COLUMN \`agreedAt\`,
      DROP COLUMN \`closedAt\`;
    `, err => cb(err)),
    cb => connection.query(`
      ALTER TABLE \`issueuser\`
      MODIFY COLUMN \`role\` INT(11);
    `, err => cb(err))
  ], err => {
    if (err) throw new Error(err);
    cb();
  })
};
