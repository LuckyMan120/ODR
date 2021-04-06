

module.exports = {

  friendlyName: 'Users',

  description: 'Find org users.',

  fn: async function() {
    const parseBlueprintOptions = this.req.options.parseBlueprintOptions ||
      this.req._sails.config.blueprints.parseBlueprintOptions;
    this.req.options.blueprintAction = 'find';
    const {criteria} = parseBlueprintOptions(this.req);
    criteria.select = ['id'];
    let orgRole = null;
    if (criteria.where.orgRole) {
      orgRole = criteria.where.orgRole;
      delete criteria.where.orgRole;
    }
    const {users} = await Org
      .findOne(this.req.session.orgId, {users: criteria})
      .select('id');
    const where = {
      user: users.map(user => user.id),
      org: this.req.session.orgId
    };
    if (orgRole) where.role = orgRole;
    return await OrgUser.find(where)
      .populate('user')
      .populate('role');
  }

};
