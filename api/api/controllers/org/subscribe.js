

module.exports = {

  friendlyName: 'Subscribe to org',

  description: 'Subscribe user to updates from org.',

  fn: async function() {
    await Org.subscribe(this.req, [this.req.session.orgId]);
    return;
  }

};
