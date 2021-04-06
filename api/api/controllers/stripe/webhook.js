

module.exports = {

  friendlyName: 'Stripe web hook business',

  description: 'Update by type in webhook',

  fn: async function() {
    let event = null;

    if (process.env.NODE_ENV === 'production') {
      event = await sails.helpers.stripe().webhooks.constructEvent(
        this.req.rawBody,
        this.req.headers['stripe-signature'],
        sails.config.stripe.signingSecret
      );
    } else {
      event = this.req.allParams();
    }

    if (event.type === 'checkout.session.completed') {
      await Org
        .updateOne({stripeCustomerId: event.data.object.customer})
        .set({
          stripeSubscriptionStatus: 'active',
          active: true,
          stripeSubscriptionId: event.data.object.subscription
        });
    }

    if (event.type === 'customer.subscription.updated') {
      await Org
        .updateOne({stripeCustomerId: event.data.object.customer})
        .set({
          stripeSubscriptionStatus: event.data.object.status,
          active: event.data.object.status === 'active'
        });
    }

    return;
  }
};
