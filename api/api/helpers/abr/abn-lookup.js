

module.exports = {

  friendlyName: 'Abn lookup',

  description: 'abr.business.gov.au abn company details lookup',

  inputs: {
    abn: {type: 'number', required: true}
  },

  fn: async function({abn}) {
    const res = await sails.helpers.abr.api()
      .get('AbnDetails.aspx', {
        params: {abn}
      });
    let data = {};
    const callback = _data => data = _data;
    sails.log.silly(`callback ${callback} aspx setup`);
    eval(res.data);
    return data;
  }

};

