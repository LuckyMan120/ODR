

module.exports = {

  friendlyName: 'Create company',

  description: 'create org and orgUser.',

  inputs: {
    name: {type: 'string', required: true},
    website: {type: 'string'},
    phone: {type: 'string'},
    abn: {
      type: 'number',
      required: true,
      custom: abn => sails.helpers.validate.abn(abn)
    },
    priceId: {type: 'string', required: true}
  },
  exits: {
    badRequest: {responseType: 'badRequest'}
  },

  fn: async function(
    {
      name,
      website,
      phone,
      abn,
      priceId
    }) {
    return await sails
    .getDatastore()
    .transaction(async tx => {

      const orgCheck = await Org
        .findOne({abn})
        .usingConnection(tx);

      if (orgCheck) throw {
        badRequest: {
          message: sails.__(`The business with this ABN `
          + `already exists in our system.`
          + ` Please contact us at info@guidedresolution.com` +
          ` if you are the owner of this business`)
        }
      };

      // api lookup org abn to get name
      const abnOrg = await sails.helpers.abr.abnLookup(abn);
      const {Abn} = abnOrg;
      if (!Abn) throw {
        badRequest: {
          message: sails.__(`Abn Not valid`)
        }
      };

      // Get user
      const user = await User
        .findOne(this.req.session.userId)
        .usingConnection(tx);

      if (!user) throw {
        badRequest: {
          message: sails.__(`User not found`)
        }
      };

      const stripe = await sails.helpers.stripe();

      const customer = await stripe.customers.create({
        name,
        email: user.email
      });

      const org = await Org
        .create({
          name,
          abn,
          website,
          phone,
          stripeCustomerId: customer.id
        })
        .usingConnection(tx)
        .fetch();

      await OrgUser
        .create({
          user: user.id,
          org: org.id,
          role: 1
        })
        .usingConnection(tx);

      const stripeSession = await stripe.checkout.sessions.create({
        customer: customer.id,
        'success_url': `${sails.config.custom.clientURL}/subscribe/success`,
        'cancel_url': `${sails.config.custom.clientURL}/subscribe/cancel`,
        'payment_method_types': ['card'],
        'line_items': [
          {
            price: priceId,
            quantity: 1
          }
        ],
        mode: 'subscription'
      });

      return {
        stripeSessionId: stripeSession.id
      };
    });
  }
};
