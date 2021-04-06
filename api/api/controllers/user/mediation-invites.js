

module.exports = {

  friendlyName: 'Users mediation invites',

  description: 'List of users invites to mediations.',

  fn: async function() {
    return await MediationInvite.find({
      invitedUser: this.req.session.userId
    }).populate('invitedByUser');
  }

};
