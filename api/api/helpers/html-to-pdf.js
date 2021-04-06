

const axios = require('axios');

module.exports = {
  friendlyName: 'Html to PDF',
  description: 'Converts given html to a PDF file',
  inputs: {
    html: {type: 'string', required: true},
    title: {type: 'string', defaultsTo: ''},
    options: {type: 'ref'}
  },

  async fn({html, title, options = {}}) {
    try {
      const res = await axios.post('https://v2018.api2pdf.com/chrome/html', {
        html,
        fileName: (title || `PDF_${Date.now()}`) + '.pdf',
        options: {
          orientation: 'landscape',
          pageSize: 'A4',
          ...options
        }
      }, {
        headers: {
          'Authorization': sails.config.api2pdf.apiKey
        }
      });
      if (res.status === 200) return res.data.pdf;
      else throw res;
    } catch (err) {
      throw err;
    }
  }
};
