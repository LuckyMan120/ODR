

describe('org', () => {
  describe('lookup', () => {
    const req = async (
      query = {},
      cookie = testOrgUserCookie
    ) => await request()
      .get('/org/lookup')
      .set('Cookie', cookie)
      .query(query);

    it('should look up orgs by ANB', async () => {
      const abn = 12123123123;
      const org = await Org.create({
        name: 'Lookup Org',
        slug: 'lookup-org',
        abn
      }).fetch();
      const res = await req({abn});
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
      expect(res.body[0].abn).to.be.eq(org.abn);
      expect(res.body[0].name).to.be.eq(org.name);
      expect(res.body[0]).to.not.have.property('id');
      expect(res.body[0]).to.not.have.property('plan');
      expect(res.body[0]).to.not.have.property('priceId');
      expect(res.body[0]).to.not.have.property('stripeCustomerId');
      expect(res.body[0]).to.not.have.property('stripeSessionId');
      expect(res.body[0]).to.not.have.property('subscriptionStatus');
      expect(res.body[0]).to.not.have.property('trialEnds');
    });

    it('should look up orgs by abn from abr.business.gov.au', async () => {
      const abn = 97142690659;
      const res = await req({abn});
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
      expect(res.body[0].abn).to.be.eq(abn);
      expect(res.body[0].name).to.be.eq('KARNI PTY LTD');
      expect(res.body[0]).to.not.have.property('id');
      expect(res.body[0]).to.not.have.property('plan');
      expect(res.body[0]).to.not.have.property('priceId');
      expect(res.body[0]).to.not.have.property('stripeCustomerId');
      expect(res.body[0]).to.not.have.property('stripeSessionId');
      expect(res.body[0]).to.not.have.property('subscriptionStatus');
      expect(res.body[0]).to.not.have.property('trialEnds');
    });

    it('should lookup org by name from abr.business.gov.au', async () => {
      const res = await req({name: 'test'});
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
      expect(res.body[0].abn).to.be.eq(58725115040);
      expect(res.body[0].name).to.be.eq('T.E.S.T.');
      expect(res.body[0]).to.not.have.property('id');
      expect(res.body[0]).to.not.have.property('plan');
      expect(res.body[0]).to.not.have.property('priceId');
      expect(res.body[0]).to.not.have.property('stripeCustomerId');
      expect(res.body[0]).to.not.have.property('stripeSessionId');
      expect(res.body[0]).to.not.have.property('subscriptionStatus');
      expect(res.body[0]).to.not.have.property('trialEnds');
    });

    it('should not return looked up abn if abn org exists', async () => {
      const abn = 44224944655;
      const name = 'TestLookUpOrg';
      await Org.create({
        name,
        slug: 'test-look-up-org',
        abn
      }).fetch();
      const res = await req({abn});
      expect(res.status).to.be.eq(200);
      expect(res.body.length).to.be.eq(1);
      expect(res.body[0].abn).to.be.eq(abn);
      expect(res.body[0].name).to.be.eq(name);
    });

  });
});
