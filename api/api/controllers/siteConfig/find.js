const {userRole} = require('../../enum/role');
module.exports = {
  friendlyName: 'Get config',

  description: 'Get all config',

  fn: async function() {
    const parseBlueprintOptions = this.req.options.parseBlueprintOptions ||
      this.req._sails.config.blueprints.parseBlueprintOptions;
    this.req.options.blueprintAction = 'find';
    const {criteria} = parseBlueprintOptions(this.req);
    if (this.req.session.userRole === userRole.admin)
      criteria.where.protected = false;
    return await SiteConfig.find(criteria);
  }

};
