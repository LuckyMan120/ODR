

module.exports = {

  friendlyName: 'Update user',

  description: 'Update user in org.',

  inputs: {
    id: {type: 'number', required: true},
    role: {type: 'number', required: true}
  },

  exits: {
    notFound: {responseType: 'badRequest'},
    lastAdmin: {responseType: 'badRequest'}
  },

  fn: async function({id: user, role}) {
    if (role !== 1) {
      const orgAdmins = await OrgUser.find({
        org: this.req.session.orgId,
        role: 1,
        user: {'!=': user}
      });
      if (!orgAdmins.length) {
        throw {
          lastAdmin: {
            message: sails.__(`
              This user is the only admin, set another user as an admin first
            `.trim())
          }
        };
      }
    }

    const orgUser = await OrgUser.updateOne({
      user,
      org: this.req.session.orgId
    }).set({role});
    if (!orgUser) throw {
      notFound: {
        message: sails.__('User not found in this organization')
      }
    };
    return orgUser;
  }

};
