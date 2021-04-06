

describe('stripe', () => {
  describe('portal', () => {
    const req = async (
      cookie = testOrgAdminCookie
    ) => await request()
      .get('/stripe/portal')
      .set('Cookie', cookie);

    it('should redirect to portal link', async () => {
      const customer = await sails.helpers.stripe()
        .customers.create({name: 'testOrg'});
      await Org.update(2, {stripeCustomerId: customer.id});
      const res = await req();
      expect(res.status).to.be.eq(200);
      expect(res.redirects.length).to.be.eq(1);
    });

  });
});
