
module.exports = {

  friendlyName: 'Destroy user',

  description: '',

  inputs: {
    id: {type: 'number', required: true}
  },

  fn: async function({id: user}) {
    return await OrgUser.destroyOne({
      user,
      org: this.req.session.orgId
    });
  }

};
