

module.exports = {

  friendlyName: 'Unsubscribe from signed-in user',

  description: 'Unsubscribe user from updates.',

  fn: async function() {
    await User
      .unsubscribe(this.req, [this.req.session.userId]);
    return;
  }

};
