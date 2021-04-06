

module.exports = {

  friendlyName: 'Reject mediation invite',

  description: 'An invited participant rejects invitation from other party.',

  inputs: {
    id: {type: 'number', required: true}
  },

  exits: {
    inviteNotFound: {responseType: 'notFound'}
  },

  fn: async function({id}) {
    const mediationInvite = await MediationInvite.findOne({
      id,
      invitedUser: this.req.session.userId
    });
    if (!mediationInvite) throw 'inviteNotFound';
    return await MediationInvite.updateOne({id}).set({
      rejectedAt: new Date().toString()
    });
  }

};
