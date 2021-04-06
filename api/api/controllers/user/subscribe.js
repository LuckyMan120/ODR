

module.exports = {

  friendlyName: 'Subscribe to signed-in user',

  description: 'Subscribe user to updates.',

  fn: async function() {
    await User
      .subscribe(this.req, [this.req.session.userId]);
    return;
  }

};
