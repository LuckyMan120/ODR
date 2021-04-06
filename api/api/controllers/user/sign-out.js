module.exports = {

  friendlyName: 'Sign out',

  description: 'User sign out',

  fn: async function() {
    this.req.session.orgId = null;
    this.req.session.orgRole = null;
    this.req.session.userId = null;
    this.req.session.userRole = null;
    return;
  }

};
