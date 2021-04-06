

module.exports = {
  'up': `
    ALTER TABLE \`issuedata\`
    ADD COLUMN \`category\` varchar(255) DEFAULT NULL AFTER \`multi\`;
  `,
  'down': `
    ALTER TABLE \`issuedata\`
    DROP COLUMN \`category\`;
  `
};
