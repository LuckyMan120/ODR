const {userRole} = require('../../enum/role');
module.exports = {

  friendlyName: 'Set org',

  description: 'Set users working org.',

  inputs: {
    org: {
      type: 'number',
      allowNull: true
    }
  },

  exits: {
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function({org}) {
    let setOrgUser = null;
    const userId = this.req.session.userId;

    if (!org) {

      const userRoleSession = this.req.session.userRole;

      const orgUsers = await OrgUser
        .find({user: userId})
        .populateAll();
      const activeOrgUsers = orgUsers.filter(orgUser => orgUser.org.active);

      const siteTypes = await SiteConfig
        .findOne({where: {key: 'siteTypes'}, select: ['value']});

      if (activeOrgUsers.length < 1) {
        if (userRoleSession !== userRole.user
          || siteTypes.value === 'complaints') {
          return;
        }
        throw {
          badRequest: {
            message: sails.__('No organizations found')
          }
        };
      } else if (activeOrgUsers.length > 1) {
        return setOrgUser;
      } else {
        setOrgUser = activeOrgUsers[0];
      }
    } else {
      const orgUser = await OrgUser.findOne({
        user: userId,
        org
      })
        .populateAll();
      if (!orgUser || !orgUser.org.active) throw {
        badRequest: {
          message: sails.__('Organization not found')
        }
      };
      setOrgUser = orgUser;
    }
    this.req.session.orgId = setOrgUser.org.id;
    this.req.session.orgRole = setOrgUser.role.name;
    return setOrgUser;
  }
};
