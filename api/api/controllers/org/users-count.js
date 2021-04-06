module.exports = {

  friendlyName: 'Users count',

  description: 'Count users in org',

  fn: async function() {
    const criteria = {
      where: this.req.allParams(),
      limit: 1000,
      select: ['id']
    };

    let orgRole = null;
    if (criteria.where.orgRole) {
      orgRole = criteria.where.orgRole;
      delete criteria.where.orgRole;
    }

    if (criteria.where.or) {
      criteria.where.or = criteria.where.or.map(or => {
        if (_.isString(or)) {
          try {
            return JSON.parse(or);
          } catch (err) {
            sails.log.silly(err);
            return or;
          }
        } else {
          return or;
        }
      });
    }

    const {users} = await Org
      .findOne(this.req.session.orgId, {users: criteria})
      .select('id');
    const where = {
      user: users.map(user => user.id),
      org: this.req.session.orgId
    };
    if (orgRole) where.role = orgRole;
    return {
      count: await OrgUser.count(where)
    };
  }

};
