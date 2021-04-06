
module.exports = {

  friendlyName: 'Orgs',

  description: 'Users orgs.',

  fn: async function() {
    const orgUsers = await OrgUser.find({
      user: this.req.session.userId,
      role: [1, 2]
    })
    .populate('org')
    .populate('role');

    return orgUsers
      .filter(orgUser => orgUser.org.active)
      .map((orgUser) => {
        orgUser.org.orgRole = orgUser.role.name;
        return orgUser.org;
      });
  }

};
