

const stripe = require('stripe');
const stripeClient = stripe(sails.config.stripe.secretKey);

module.exports = {

  friendlyName: 'Stripe',
  sync: true,

  fn: () => stripeClient
};
