

module.exports = {

  friendlyName: 'Name lookup',

  description: 'abr.business.gov.au name lookup',

  inputs: {
    name: {type: 'string', required: true}
  },

  fn: async function({name}) {
    const res = await sails.helpers.abr.api()
      .get('MatchingNames.aspx', {
        params: {name}
      });
    let data = {};
    const callback = _data => data = _data;
    sails.log.silly(`callback ${callback} aspx setup`);
    eval(res.data);
    return data;
  }

};

