

const async = require('async');

module.exports = {
  'up': (connection, cb) => async.waterfall([
    cb => connection.query(`
      CREATE TABLE \`archive\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`fromModel\` varchar(255) DEFAULT NULL,
        \`originalRecord\` longtext,
        \`originalRecordId\` longtext,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`datatype\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) DEFAULT NULL,
        \`activityDesc\` varchar(255) DEFAULT NULL,
        \`shared\` tinyint(1) DEFAULT NULL,
        \`multi\` tinyint(1) DEFAULT NULL,
        \`options\` longtext,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`issue\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) DEFAULT NULL,
        \`type\` varchar(255) DEFAULT NULL,
        \`pathway\` int(11) DEFAULT NULL,
        \`org\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`issuedata\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`value\` varchar(255) DEFAULT NULL,
        \`sortOrder\` double DEFAULT NULL,
        \`multi\` tinyint(1) DEFAULT NULL,
        \`user\` int(11) DEFAULT NULL,
        \`issue\` int(11) DEFAULT NULL,
        \`type\` int(11) DEFAULT NULL,
        \`party\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`issueparty\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) DEFAULT NULL,
        \`initiator\` tinyint(1) DEFAULT NULL,
        \`type\` varchar(255) DEFAULT NULL,
        \`issue\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`issuepartystep\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`show\` tinyint(1) DEFAULT NULL,
        \`enabled\` tinyint(1) DEFAULT NULL,
        \`completed\` tinyint(1) DEFAULT NULL,
        \`completedAt\` double DEFAULT NULL,
        \`startedAt\` double DEFAULT NULL,
        \`stepName\` varchar(255) DEFAULT NULL,
        \`party\` int(11) DEFAULT NULL,
        \`issue\` int(11) DEFAULT NULL,
        \`step\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`issuerole\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`issueuser\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`initiator\` tinyint(1) DEFAULT NULL,
        \`acceptedAt\` double DEFAULT NULL,
        \`state\` longtext,
        \`pathway\` int(11) DEFAULT NULL,
        \`issue\` int(11) DEFAULT NULL,
        \`user\` int(11) DEFAULT NULL,
        \`role\` int(11) DEFAULT NULL,
        \`party\` int(11) DEFAULT NULL,
        \`invitedBy\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`mediation\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) DEFAULT NULL,
        \`closed\` tinyint(1) DEFAULT NULL,
        \`archived\` tinyint(1) DEFAULT NULL,
        \`org\` int(11) DEFAULT NULL,
        \`initiatorPathway\` int(11) DEFAULT NULL,
        \`partyPathway\` int(11) DEFAULT NULL,
        \`mediatorPathway\` int(11) DEFAULT NULL,
        \`type\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`mediationactivity\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`dataBefore\` longtext,
        \`dataAfter\` longtext,
        \`shared\` tinyint(1) DEFAULT NULL,
        \`userName\` varchar(255) DEFAULT NULL,
        \`type\` int(11) DEFAULT NULL,
        \`dataType\` int(11) DEFAULT NULL,
        \`mediation\` int(11) DEFAULT NULL,
        \`user\` int(11) DEFAULT NULL,
        \`party\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`mediationactivitytype\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) DEFAULT NULL,
        \`desc\` varchar(255) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`mediationdata\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`value\` varchar(255) DEFAULT NULL,
        \`user\` int(11) DEFAULT NULL,
        \`type\` int(11) DEFAULT NULL,
        \`mediation\` int(11) DEFAULT NULL,
        \`mediationParty\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`mediationinvite\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`email\` varchar(255) DEFAULT NULL,
        \`initiator\` tinyint(1) DEFAULT NULL,
        \`sentAt\` varchar(255) DEFAULT NULL,
        \`acceptedAt\` varchar(255) DEFAULT NULL,
        \`rejectedAt\` varchar(255) DEFAULT NULL,
        \`invitedUser\` int(11) DEFAULT NULL,
        \`invitedByUser\` int(11) DEFAULT NULL,
        \`role\` int(11) DEFAULT NULL,
        \`mediation\` int(11) DEFAULT NULL,
        \`party\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`mediationparty\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) DEFAULT NULL,
        \`type\` varchar(255) DEFAULT NULL,
        \`initiator\` tinyint(1) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`mediationrole\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`mediationtype\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) DEFAULT NULL,
        \`archived\` tinyint(1) DEFAULT NULL,
        \`defaultInitiatorPathway\` int(11) DEFAULT NULL,
        \`defaultPartyPathway\` int(11) DEFAULT NULL,
        \`defaultMediatorPathway\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`mediationuser\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`initiator\` tinyint(1) DEFAULT NULL,
        \`state\` longtext,
        \`lastStep\` double DEFAULT NULL,
        \`archived\` tinyint(1) DEFAULT NULL,
        \`user\` int(11) DEFAULT NULL,
        \`mediation\` int(11) DEFAULT NULL,
        \`party\` int(11) DEFAULT NULL,
        \`role\` int(11) DEFAULT NULL,
        \`org\` int(11) DEFAULT NULL,
        \`pathway\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`mediationuserstep\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`show\` tinyint(1) DEFAULT NULL,
        \`enabled\` tinyint(1) DEFAULT NULL,
        \`startedAt\` double DEFAULT NULL,
        \`lastUpdatedAt\` double DEFAULT NULL,
        \`completedAt\` double DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`mediationuserstep_step__pathwaystep_step_pathwaystep\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`mediationuserstep_step\` int(11) DEFAULT NULL,
        \`pathwaystep_step_pathwaystep\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`notdatatype\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) DEFAULT NULL,
        \`shared\` tinyint(1) DEFAULT NULL,
        \`activityDesc\` varchar(255) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`org\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) DEFAULT NULL,
        \`website\` varchar(255) DEFAULT NULL,
        \`phone\` varchar(255) DEFAULT NULL,
        \`abn\` double DEFAULT NULL,
        \`active\` tinyint(1) DEFAULT NULL,
        \`slug\` varchar(255) DEFAULT NULL,
        \`plan\` varchar(255) DEFAULT NULL,
        \`priceId\` varchar(255) DEFAULT NULL,
        \`stripeCustomerId\` varchar(255) DEFAULT NULL,
        \`stripeSessionId\` varchar(255) DEFAULT NULL,
        \`subscriptionStatus\` varchar(255) DEFAULT NULL,
        \`trialEnds\` tinyint(1) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`),
        UNIQUE KEY \`abn\` (\`abn\`),
        UNIQUE KEY \`slug\` (\`slug\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`orginvite\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`email\` varchar(255) DEFAULT NULL,
        \`token\` varchar(255) DEFAULT NULL,
        \`user\` int(11) DEFAULT NULL,
        \`org\` int(11) DEFAULT NULL,
        \`role\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`orgrole\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`orguser\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`user\` int(11) DEFAULT NULL,
        \`org\` int(11) DEFAULT NULL,
        \`role\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`pathway\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`active\` tinyint(1) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`pathwaystep\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) DEFAULT NULL,
        \`linkTo\` varchar(255) DEFAULT NULL,
        \`sortOrder\` double DEFAULT NULL,
        \`options\` longtext,
        \`component\` varchar(255) DEFAULT NULL,
        \`pathway\` int(11) DEFAULT NULL,
        \`parent\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`pathwaystepcomponent\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`key\` varchar(255) DEFAULT NULL,
        \`sortOrder\` double DEFAULT NULL,
        \`step\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`pathwaytranslation\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`locale\` varchar(255) DEFAULT NULL,
        \`name\` varchar(255) DEFAULT NULL,
        \`pathway\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`role\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`name\` varchar(255) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`siteconfig\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`key\` varchar(255) DEFAULT NULL,
        \`value\` varchar(255) DEFAULT NULL,
        \`inputType\` varchar(255) DEFAULT NULL,
        \`data\` varchar(255) DEFAULT NULL,
        \`clientSafe\` tinyint(1) DEFAULT NULL,
        \`protected\` tinyint(1) DEFAULT NULL,
        \`desc\` varchar(255) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`),
        UNIQUE KEY \`key\` (\`key\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
      `, err => cb(err)),

    cb => connection.query(`
      CREATE TABLE \`user\` (
        \`createdAt\` bigint(20) DEFAULT NULL,
        \`updatedAt\` bigint(20) DEFAULT NULL,
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`email\` varchar(255) DEFAULT NULL,
        \`password\` varchar(255) DEFAULT NULL,
        \`firstName\` varchar(255) DEFAULT NULL,
        \`lastName\` varchar(255) DEFAULT NULL,
        \`company\` varchar(255) DEFAULT NULL,
        \`phone\` varchar(255) DEFAULT NULL,
        \`passwordResetToken\` varchar(255) DEFAULT NULL,
        \`role\` int(11) DEFAULT NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`id\` (\`id\`),
        UNIQUE KEY \`email\` (\`email\`)
      ) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
      `, err => cb(err))

  ], err => {
    if (err) throw new Error(err);
    cb();
  })
};
