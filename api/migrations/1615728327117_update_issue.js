

module.exports = {
  'up': `
    ALTER TABLE \`issue\`
    ADD COLUMN \`status\` varchar(255)
      DEFAULT NULL AFTER \`responderEngagedAt\`,
    ADD COLUMN \`note\` varchar(255) DEFAULT NULL AFTER \`status\`;
  `,
  'down': `
    ALTER TABLE \`issue\`
    DROP COLUMN \`status\`,
    DROP COLUMN \`note\`;
  `
};
