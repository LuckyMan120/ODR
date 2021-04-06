

module.exports = {

  friendlyName: 'Get invites',

  description: 'Get invites for org',

  fn: async function() {
    const parseBlueprintOptions = this.req.options.parseBlueprintOptions ||
      this.req._sails.config.blueprints.parseBlueprintOptions;
    this.req.options.blueprintAction = 'find';
    const {criteria} = parseBlueprintOptions(this.req);
    criteria.where.org = this.req.session.orgId;
    return await OrgInvite
      .find(criteria)
      .populate('user')
      .populate('role');
  }

};
