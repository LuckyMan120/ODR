

const {URL} = require('url');
const axios = require('axios');

describe('html-to-pdf', () => {
  describe('html-to-pdf', () => {
    it('should return pdf url', async () => {
      const url = await sails.helpers.htmlToPdf(
        '<h1>Test</h1>'
      );
      let validUrl = null;
      try {
        new URL(url);
        validUrl = true;
      } catch (err) {
        console.error(err);
        validUrl = false;
      }
      expect(validUrl).to.be.true;
      const res = await axios.get(url);
      expect(res.headers['content-type']).to.be.eq('application/pdf');
    });
  });
});
