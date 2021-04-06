
module.exports = {

  friendlyName: 'Add user',

  description: 'Add a user to an org.',

  inputs: {
    user: {type: 'number', required: true},
    role: {type: 'number', defaultsTo: 3}
  },

  fn: async function({user, role}) {
    return await OrgUser.create({
      user,
      role,
      org: this.req.session.orgId
    }).fetch();
  }

};
