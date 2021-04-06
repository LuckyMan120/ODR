

module.exports = {
  'up': `
    ALTER TABLE \`issue\`
    ADD COLUMN \`submittedAt\` DOUBLE DEFAULT NULL AFTER \`closedAt\`;
  `,
  'down': `
    ALTER TABLE \`issue\`
    DROP COLUMN \`submittedAt\`;
  `
};
