

describe('stripe', () => {
  describe('webhook', () => {

    const req = async (data = {}) => await request()
      .post('/stripe/webhook')
      .send(data);

    it('[checkout.session.completed]', async () => {
      const sessionId = 'test_id';
      const customer = 'test_customer';
      const subscription = 'test_subscription';

      const {id} = await Org.create({
        name: 'webhook_test_org',
        slug: 'webhook-test-org',
        stripeCustomerId: customer,
        abn: 81910463257
      }).fetch();

      const res = await req({
        type: 'checkout.session.completed',
        data: {
          object: {
            id: sessionId,
            customer,
            subscription
          }
        }
      });
      expect(res.status).to.be.eq(200);

      const org = await Org.findOne(id);
      expect(org.stripeSubscriptionStatus).to.be.eq('active');
      expect(org.active).to.be.eq(true);
      expect(org.stripeSubscriptionId).to.be.eq(subscription);
    });

    it('[customer.subscription.updated]', async () => {
      const customer = 'test_customer_1';
      const status = 'incomplete';

      const {id} = await Org.create({
        name: 'webhook_test_org_1',
        slug: 'webhook-test-org-one',
        stripeCustomerId: customer,
        abn: 13285469117
      }).fetch();

      const res = await req({
        type: 'customer.subscription.updated',
        data: {
          object: {
            customer,
            status
          }
        }
      });
      expect(res.status).to.be.eq(200);

      const org = await Org.findOne(id);
      expect(org.stripeSubscriptionStatus).to.be.eq(status);
      expect(org.active).to.be.eq(false);
    });

  });
});
