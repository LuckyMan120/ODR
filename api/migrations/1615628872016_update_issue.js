

module.exports = {
  'up': `
    ALTER TABLE \`issue\`
    ADD COLUMN \`responderEngagedAt\` DOUBLE DEFAULT NULL AFTER \`submittedAt\`;
  `,
  'down': `
    ALTER TABLE \`issue\`
    DROP COLUMN \`responderEngagedAt\`;
  `
};
