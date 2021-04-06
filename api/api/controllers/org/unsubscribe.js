

module.exports = {

  friendlyName: 'Unsubscribe from org',

  description: 'Unsubscribe user from updates from org.',

  fn: async function() {
    const orgUsers = await OrgUser.find({
      user: this.req.session.userId
    }).select(['org']);
    await Org.unsubscribe(this.req, orgUsers.map(orgUser => orgUser.org));
    return;
  }

};
