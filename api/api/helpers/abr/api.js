

const axios = require('axios');
const abr = axios.create({
  baseURL: 'https://abr.business.gov.au/json/',
  params: {
    guid: sails.config.abr.guid
  }
});

module.exports = {
  sync: true,
  fn: () => abr
};
