

module.exports = {

  friendlyName: 'Invites count',

  description: 'Count invites in an org',

  fn: async function() {
    return {
      count: await OrgInvite
        .count({
          ...this.req.allParams(),
          org: this.req.session.orgId
        })
    };
  }

};
