

module.exports = {

  friendlyName: 'Destroy invite',

  description: 'Cancel invite.',

  inputs: {
    id: {type: 'number', required: true}
  },

  fn: async function({id}) {
    return await OrgInvite.destroyOne({
      id,
      org: this.req.session.orgId
    });
  }

};
