

module.exports = {

  friendlyName: 'Create Invite',

  description: 'Org admin invites users to org.',

  inputs: {
    email: {
      type: 'string',
      required: true,
      custom: e => sails.helpers.validate.email(e)
    },

    role: {type: 'number', defaultsTo: 3}
  },

  exits: {
    inviteSent: {responseType: 'badRequest'},
    userIsInOrg: {responseType: 'badRequest'},
    adminInvite: {responseType: 'badRequest'},
    orgNotFound: {responseType: 'notFound'}
  },

  fn: async function({email, role}) {
    if (
      this.req.session.orgRole !== 'admin' &&
      role === 1
    ) throw {adminInvite: {
      message: sails.__('Can\'t invite admins as staff')
    }};

    const org = await Org.findOne(this.req.session.orgId);
    if (!org) throw 'orgNotFound';

    const user = await User.findOne({email});
    if (user) {
      if (await OrgUser.findOne({
        user: user.id,
        org: this.req.session.orgId
      })) {
        throw {userIsInOrg: {
          message: sails.__('User is in this org')
        }};
      } else {
        return await sails
          .getDatastore()
          .transaction(async tx => {
            const orgUser = await OrgUser
              .create({
                user: user.id,
                org: this.req.session.orgId,
                role
              })
              .fetch()
              .usingConnection(tx);
            await sails.helpers.email.send(
              'orgAdd',
              {
                clientURL: sails.config.custom.clientURL,
                slug: org.slug,
                email
              },
              {
                to: email,
                subject: sails.__('Added to organization')
              }
            );
            return {orgUser};
          });
      }
    }

    if (await OrgInvite.findOne({
      email,
      org: this.req.session.orgId
    })) {
      throw {inviteSent: {
        message: sails.__('Invite already sent')
      }};
    }
    return await sails
      .getDatastore()
      .transaction(async tx => {
        const orgInvite = await OrgInvite
          .create({
            email,
            role,
            user: this.req.session.userId,
            org: this.req.session.orgId
          })
          .fetch()
          .usingConnection(tx);

        const token = await OrgInvite
          .setInviteToken(orgInvite.id, tx);

        await sails.helpers.email.send(
          'orgInvite',
          {
            clientURL: sails.config.custom.clientURL,
            slug: org.slug,
            email,
            token
          },
          {
            to: email,
            subject: sails.__('Organization invite')
          }
        );
        return {orgInvite};
      });
  }

};
