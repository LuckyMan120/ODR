

const bcrypt = require('bcrypt');

module.exports = {
  friendlyName: 'Register',

  description: 'Register user.',

  inputs: {
    email: {
      type: 'string',
      required: true,
      custom: e => sails.helpers.validate.email(e)
    },
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true
    },
    slug: {
      type: 'string'
    },
    phone: {type: 'string'},
    company: {type: 'string'},

    token: {type: 'string'}
  },

  exits: {
    badRequest: {responseType: 'badRequest'},
    emailTaken: {responseType: 'badRequest'}
  },

  fn: async function({
    email,
    firstName,
    lastName,
    slug,
    phone,
    company,
    token: inviteToken
  }) {
    const siteTypes = await SiteConfig
      .findOne({where: {key: 'siteTypes'}, select: ['value']});

    if (siteTypes.value === 'mediations' && !inviteToken) {
      throw {
        badRequest: {
          message: sails.__('Registration to this site is by invitation only')
        }
      };
    }

    const user = await User.findOne({email}).select(['id']);
    if (user) throw {
      badRequest: {
        message: sails.__('Sorry, this email is already taken.<br />' +
          'Please enter a new email, or sign-in using this one.'),
        code: 'E_UNIQUE'
      }
    };

    if (slug) {
      if (!sails.helpers.validate.slug(slug)) {
        throw {
          badRequest: {
            message: sails.__('Slug invalid')
          }
        };
      }

      const org = await Org.findOne({slug});
      if (!org) throw {
        badRequest: {
          message: sails.__('Organization not found')
        }
      };

      if (!org.active) throw {
        badRequest: {
          message: sails.__('The requested organization is inactive, '
            + 'so registration is not possible. '
            + 'Please contact the organization for more details')
        }
      };

      return await sails
        .getDatastore()
        .transaction(async tx => {
          const user = await User.create({
            email,
            firstName,
            lastName,
            phone,
            company
          })
            .usingConnection(tx)
            .fetch();

          if (inviteToken) {
            const orgInvite = await OrgInvite.findOne({
              org: org.id,
              email
            });

            if (
              orgInvite &&
              await bcrypt.compare(inviteToken, orgInvite.token)
            ) {
              await OrgUser
                .create({
                  user: user.id,
                  org: org.id,
                  role: orgInvite.role
                })
                .usingConnection(tx);

              await OrgInvite
                .destroyOne(orgInvite.id)
                .usingConnection(tx);

              return {
                token: await User.setPasswordResetToken(user.id, tx)
              };
            }
          }

          await MediationInvite
            .update({email})
            .set({invitedUser: user.id})
            .usingConnection(tx);

          await OrgUser
            .create({
              user: user.id,
              org: org.id,
              role: 3
            })
            .usingConnection(tx);

          const token = await User
            .setPasswordResetToken(user.id, tx);

          await sails.helpers.email.send(
            'registration',
            {
              clientURL: sails.config.custom.clientURL,
              email: user.email,
              firstName: user.firstName,
              token
            },
            {
              to: email,
              subject: sails.__('Welcome to Guided Compliance')
            }
          );
        });
    } else {
      return await sails
        .getDatastore()
        .transaction(async tx => {
          const user = await User.create({
            email,
            firstName,
            lastName,
            phone,
            company
          })
            .usingConnection(tx)
            .fetch();

          const token = await User
            .setPasswordResetToken(user.id, tx);

          await sails.helpers.email.send(
            'registration',
            {
              clientURL: sails.config.custom.clientURL,
              email: user.email,
              firstName: user.firstName,
              token
            },
            {
              to: email,
              subject: sails.__('Welcome to Guided Compliance')
            }
          );
        });
    }
  }

};
