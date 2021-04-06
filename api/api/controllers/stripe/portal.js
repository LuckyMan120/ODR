module.exports = {

  friendlyName: 'Stripe get portal link',

  description: 'Get link to accept Stripe portal',

  exits: {
    orgNotFound: {responseType: 'badRequest'}
  },

  fn: async function() {
    const org = await Org
      .findOne(this.req.session.orgId)
      .select(['name', 'stripeCustomerId']);
    if (!org) throw 'orgNotFound';

    const stripe = await sails.helpers.stripe();

    let stripeCustomerId = org.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({name: org.name});
      stripeCustomerId = customer.id;
    }

    const session = await stripe.billingPortal.sessions.create({
      'customer': stripeCustomerId,
      'return_url': sails.config.custom.clientURL
    });

    this.res.redirect(session.url);
  }
};
