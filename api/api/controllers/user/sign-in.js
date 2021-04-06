

const bcrypt = require('bcrypt');

module.exports = {
  friendlyName: 'Sign in',

  description: 'User sign in',

  inputs: {
    email: {
      type: 'string',
      required: true,
      custom: e => sails.helpers.validate.email(e)
    },
    password: {
      type: 'string',
      required: true
    },
    slug: {
      type: 'string'
    }
  },

  exits: {
    badRequest: {
      responseType: 'badRequest',
      description: 'Username or password is incorrect'
    }
  },

  fn: async function({email, password, slug}) {
    const user = await User
      .findOne({email: email.toLowerCase()})
      .populate('role');

    if (!user) throw {
      badRequest: {
        message: sails.__(
          'The email and password combination you provided is incorrect'
        )
      }
    };

    const pass = await bcrypt.compare(password, user.password);
    if (!pass) throw {
      badRequest: {
        message: sails.__(
          'The email and password combination you provided is incorrect'
        )
      }
    };

    if (slug) {
      const org = await Org.findOne({
        slug: slug,
        active: true
      });

      if (!org) throw {
        badRequest: {
          message: sails.__('The requested organization was not found, '
            + 'so login in is not possible. '
            + 'Please contact the organization for more details'
          )
        }
      };

      const orgUserData = {user: user.id, org: org.id};
      const {id} = await OrgUser.findOrCreate(orgUserData, orgUserData);
      const orgUser = await OrgUser.findOne(id)
        .populate('role');

      if (!orgUser) throw {
        badRequest: {
          message: sails.__(
            'The email and password combination you provided is incorrect'
          )
        }
      };

      this.req.session.orgId = org.id;
      this.req.session.orgRole = orgUser.role.name;
    } else {
      const orgUsers = await OrgUser
        .find({
          user: user.id,
          role: [1, 2]
        })
        .select(['org']);

      const orgs = await Org.find({
        id: orgUsers.map(ou => ou.org),
        active: true
      });

      const {value: siteTypes} = await SiteConfig
        .findOne({key: 'siteTypes'})
        .select(['value']);

      if (!orgs.length && siteTypes === 'mediations') {
        throw {
          badRequest: {
            message: sails.__('The requested organization was not found, '
              + 'so login in is not possible. '
              + 'Please contact the organization for more details'
            )
          }
        };
      } else if (orgs.length === 1) {
        this.req.session.orgId = orgs[0].id;
        this.req.session.orgRole = orgUsers.find(ou => ou.org === orgs[0].id);
      } else {
        this.req.session.orgId = null;
        this.req.session.orgRole = null;
      }

    }

    this.req.session.userId = user.id;
    this.req.session.userRole = user.role.name;
    return;
  }

};
