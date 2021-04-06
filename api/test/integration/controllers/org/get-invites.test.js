

describe('org', () => {
  describe('get-invites', () => {
    const req = async (
      params = {},
      cookie = testOrgAdminCookie
    ) => await request()
      .get('/org/invites')
      .set('Cookie', cookie)
      .query(params);

    it('should refuse if not orgAdmin', async () => {
      const res = await req({}, testOrgUserCookie);
      expect(res.status).to.be.eq(403);
    });

    it('should get list of invites', async () => {
      const invite = await OrgInvite.create({
        email: 'invitedUser@test.org',
        user: 7,
        org: 2
      }).fetch();
      const count = await OrgInvite.count({
        org: 2
      });
      expect(invite).to.be.an('object');
      const res = await req();
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
      expect(res.body.length).to.be.eq(count);
      expect(res.body[0].user).to.be.an('object');
      expect(res.body[0].role).to.be.an('object');
    });
  });
});
