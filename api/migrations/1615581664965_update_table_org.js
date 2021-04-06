

const async = require('async');

module.exports = {
  'up': (connection, cb) => async.waterfall([
    cb => connection.query(`
      ALTER TABLE \`org\`
      DROP COLUMN \`plan\`,
      DROP COLUMN \`priceId\`,
      DROP COLUMN \`stripeCustomerId\`,
      DROP COLUMN \`stripeSessionId\`,
      DROP COLUMN \`subscriptionStatus\`,
      DROP COLUMN \`trialEnds\`;
    `, err => cb(err)),
    cb => connection.query(`
      ALTER TABLE \`org\`
      ADD COLUMN \`stripeSubscriptionId\` varchar(255) AFTER \`slug\`,
      ADD COLUMN \`stripeCustomerId\` varchar(255)
        AFTER \`stripeSubscriptionId\`,
      ADD COLUMN \`stripeSubscriptionStatus\` varchar(255) DEFAULT 'incomplete'
        AFTER \`stripeCustomerId\`;
    `, err => cb(err))
  ], err => {
    if (err) throw new Error(err);
    cb();
  }),
  'down': (connection, cb) => async.waterfall([
    cb => connection.query(`
      ALTER TABLE \`org\`
      DROP COLUMN \`stripeSubscriptionId\`,
      DROP COLUMN \`stripeCustomerId\`,
      DROP COLUMN \`stripeSubscriptionStatus\`;
    `, err => cb(err)),
    cb => connection.query(`
      ALTER TABLE \`org\`
      ADD COLUMN \`plan\` varchar(255) DEFAULT NULL AFTER \`slug\`,
      ADD COLUMN \`priceId\` varchar(255) DEFAULT NULL AFTER \`plan\`,
      ADD COLUMN \`stripeCustomerId\` varchar(255) DEFAULT NULL'
        AFTER \`priceId\`,
      ADD COLUMN \`stripeSessionId\` varchar(255) DEFAULT NULL
        AFTER \`stripeCustomerId\`,
      ADD COLUMN \`subscriptionStatus\` varchar(255) DEFAULT NULL
        AFTER \`stripeSessionId\`,
      ADD COLUMN \`trialEnds\` tinyint(1) DEFAULT NULL
        AFTER \`subscriptionStatus\`;
    `, err => cb(err))
  ], err => {
    if (err) throw new Error(err);
    cb();
  })
};
