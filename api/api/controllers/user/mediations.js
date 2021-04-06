

module.exports = {
  friendlyName: 'User Mediations',

  description: 'Mediations of user.',

  inputs: {
    limit: {type: 'number', defaultsTo: 30},
    skip: {type: 'number', defaultsTo: 0}
  },

  fn: async function({limit, skip}) {
    const where = {
      user: this.req.session.userId,
      org: this.req.session.orgId,
      archived: false
    };

    if (this.req.session.orgRole === 'user') where.role = 1;
    if (this.req.session.orgRole === 'staff') where.role = 2;

    return await MediationUser.find(where)
      .limit(limit)
      .skip(skip)
      .populate('mediation')
      .populate('party')
      .populate('role');
  }
};
