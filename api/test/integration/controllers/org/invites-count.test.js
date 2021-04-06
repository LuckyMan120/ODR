

describe('org', () => {
  describe('invites-count', () => {
    const req = async (
      params = {},
      cookie = testOrgAdminCookie
    ) => await request()
      .get('/org/invites/count')
      .set('Cookie', cookie)
      .query(params);

    it('should count invites', async () => {
      await OrgInvite.create({
        email: 'countTest@test.org',
        user: 7,
        org: 2
      });
      const count = await OrgInvite.count({
        org: 2
      });
      const res = await req();
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('count');
      expect(res.body.count).to.be.at.least(1);
      expect(res.body.count).to.be.eq(count);
    });

    it('should accept query params', async () => {
      const email = 'countTestQueryParams@test.org';
      await OrgInvite.create({
        email,
        user: 7,
        org: 2
      });
      const res = await req({email});
      expect(res.body.count).to.be.eq(1);
    });

    it('should not count other orgs invites', async () => {
      const email = 'otherOrgInvite@test.org';
      await OrgInvite.create({
        email,
        user: 1,
        org: 1
      });
      const res = await req({email});
      expect(res.body.count).to.be.eq(0);
    });
  });
});
