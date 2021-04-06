

module.exports = {

  friendlyName: 'Update org',

  description: 'Update org in session.',

  inputs: {
    name: {type: 'string'},
    abn: {type: 'string'},
    active: {type: 'boolean'}
  },

  fn: async function(inputs) {
    return await Org.updateOne(
      this.req.session.orgId
    ).set(inputs);
  }

};
