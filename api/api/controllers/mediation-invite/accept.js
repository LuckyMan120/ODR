

module.exports = {

  friendlyName: 'Accept mediation invitation',

  description: 'An invited participant accepts invitation from other party.',

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
    return await sails
      .getDatastore()
      .transaction(async tx => {
        const {
          id: userId,
          company,
          firstName,
          lastName
        } = await User
          .findOne(this.req.session.userId);

        const {
          id: partyId
        } = await MediationParty
          .create({
            name: !!company ?
              company :
              `${firstName} ${lastName}`
          })
          .fetch()
          .usingConnection(tx);

        await MediationUser
          .create({
            mediation: mediationInvite.mediation,
            user: userId,
            party: partyId
          })
          .usingConnection(tx);

        return await MediationInvite
          .updateOne(id)
          .set({
            acceptedAt: new Date().toString()
          })
          .usingConnection(tx);
      });
  }

};
