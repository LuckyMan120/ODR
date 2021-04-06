

module.exports = {
  'up': `
    CREATE TABLE \`notification\` (
      \`createdAt\` bigint(20) DEFAULT NULL,
      \`updatedAt\` bigint(20) DEFAULT NULL,
      \`id\` int(11) NOT NULL AUTO_INCREMENT,
      \`text\` varchar(255) DEFAULT NULL,
      \`readAt\` double DEFAULT NULL,
      \`dismissed\` tinyint(1) DEFAULT NULL,
      \`user\` int(11) DEFAULT NULL,
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`id\` (\`id\`)
    ) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;
  `,
  'down': 'DROP TABLE \`notification\`;'
};
