module.exports = {

  friendlyName: 'Start a mediation (by a party)',

  description: 'Create mediation, add user and party.',

  inputs: {
    email: {
      type: 'string',
      required: true,
      custom: e => sails.helpers.validate.email(e),
      description: 'Email of a person to invite.'
    },
    type: {
      type: 'number',
      defaultsTo: 1,
      description: 'One of the MediationType ids.'
    }
  },

  fn: async function({email, type}) {
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
          id: partyId,
          name: partyName
        } = await MediationParty
          .create({
            name: !!company ?
              company :
              `${firstName} ${lastName}`,
            initiator: true
          })
          .fetch()
          .usingConnection(tx);

        const mediation = await Mediation
          .create({
            org: this.req.session.orgId,
            name: partyName + ' & ' + email,
            initiatorPathway: 1,
            partyPathway: 1,
            mediatorPathway: 1,
            type
          })
          .fetch()
          .usingConnection(tx);

        await MediationUser
          .create({
            mediation: mediation.id,
            user: userId,
            initiator: true,
            party: partyId
          })
          .usingConnection(tx);

        const counterpartyUser = await User
          .findOne({email})
          .usingConnection(tx);

        const inviteData = {
          invitedByUser: userId,
          mediation: mediation.id,
          party: partyId
        };

        if (!counterpartyUser) {
          const {id} = await OrgInvite.create({
            email,
            user: userId,
            org: this.req.session.orgId
          })
          .fetch()
          .usingConnection(tx);

          const token = await OrgInvite
            .setInviteToken(id, tx);

          inviteData.email = email;

          const {slug} = await Org
            .findOne(this.req.session.orgId)
            .select(['slug']);

          await sails.helpers.email.send('mediationInvite', {
            clientURL: sails.config.custom.clientURL,
            email,
            token,
            slug
          }, {
            to: email,
            subject: sails.__('Welcome')
          });
        } else {
          inviteData.invitedUser = counterpartyUser.id;
        }

        await MediationInvite
          .create(inviteData)
          .usingConnection(tx);

        // @todo: mediationActivity

        return mediation;
      });
  }

};
