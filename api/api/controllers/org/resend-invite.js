

module.exports = {

  friendlyName: 'Resend invite',

  description: 'Resend invitation.',

  inputs: {
    id: {type: 'number', required: true}
  },

  exits: {
    noOrgInviteFound: {responseType: 'notFound'}
  },

  fn: async function({id}) {
    const {slug} = await Org.findOne(this.req.session.orgId);
    const orgInvite = await OrgInvite.findOne(id);
    if (!orgInvite) throw 'noOrgInviteFound';

    const {id: orgInviteId, email} = orgInvite;
    return await sails
      .getDatastore()
      .transaction(async tx => {
        const token = await OrgInvite.setInviteToken(orgInviteId, tx);
        await sails.helpers.email.send(
          'orgInvite',
          {
            clientURL: sails.config.custom.clientURL,
            slug,
            email,
            token
          },
          {
            to: email,
            subject: sails.__('Organization invite')
          }
        );
      });
  }

};
