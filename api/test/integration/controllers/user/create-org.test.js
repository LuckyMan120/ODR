

describe('user', () => {
  describe('create-org', () => {
    const req = async (
      data = {},
      cookie = userCookie
    ) => await request()
      .post('/user/org')
      .set('Cookie', cookie)
      .send(data);

    it('should create org', async () => {
      const name = 'newTestOrg';
      const website = 'newTestOrg.com';
      const phone = '77777777777';
      const abn = 39504396984;
      const priceId = 'price_1IVYYIFbQ8J3dYIzZKj7fC46';
      const res = await req({
        name,
        website,
        phone,
        abn,
        priceId
      });
      expect(res.status).to.be.eq(200);
      expect(res.body.stripeSessionId).to.be.a('string');
      const org = await Org.findOne({abn});
      expect(org).to.be.an('object');
      expect(org.name).to.be.eq(name);
      expect(org.phone).to.be.eq(phone);
      expect(org.website).to.be.eq(website);
    });
  });
});
