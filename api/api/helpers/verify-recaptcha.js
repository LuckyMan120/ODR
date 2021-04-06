

const axios = require('axios');

module.exports = {
  friendlyName: 'Verify recaptcha',
  description: 'Sends a request to google to verify recaptcha',
  inputs: {
    response: {type: 'string', required: true}
  },
  async fn({response}) {
    const res = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify?' +
      `secret=${sails.config.recaptcha.secretKey}&` +
      `response=${response}`
    );
    return res.data.success;
  }
};
