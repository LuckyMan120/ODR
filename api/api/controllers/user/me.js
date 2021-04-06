

module.exports = {
  friendlyName: 'Me',

  description: 'Me user.',

  fn: async function() {
    const user = await User.findOne(this.req.session.userId);
    const res = {user};
    if (this.req.session.orgId) {
      const {org, role} = await OrgUser
        .findOne({
          user: user.id,
          org: this.req.session.orgId
        })
        .populate('org')
        .populate('role');
      res.org = org;
      res.orgRole = role;
    }

    return {
      ...res,
      role: await Role.findOne(user.role)
    };
  }
};
