

describe('user', () => {
  describe('set-org', () => {
    const req = async (
      data = {},
      cookie = testOrgUserCookie
    ) => await request()
      .put('/user/org')
      .set('Cookie', cookie)
      .send(data);

    it('should set an an active org on a user', async () => {
      const res = await req({
        org: 2
      });
      expect(res.status).to.be.eq(200);
    });

    it('should not have org data in me', async () => {
      const res = await request()
        .get('/user/me')
        .set('Cookie', noOrgUserCookie)
        .send();
      expect(res.status).to.be.eq(200);
      expect(res.body.org).to.be.undefined;
      expect(res.body.user).to.be.an('object');
    });

    it('should set empty org  (complaints site)', async () => {
      const res = await req({}, noOrgUserCookie);
      expect(res.status).to.be.eq(200);
    });

    it('should error when user has no orgs (mediations site)', async () => {
      await SiteConfig.update({key: 'siteTypes'}, {value: 'mediations'});
      const res = await req({}, noOrgUserCookie);
      expect(res.status).to.be.eq(400);
      expect(res.body.message).to.be.eq('No organizations found');
      await SiteConfig.update({key: 'siteTypes'}, {value: 'complaints'});
    });

    it('should set user org if user has one org',
      async () => {
        const org = 1;
        await OrgUser.create({
          user: 11,
          org
        });
        const res = await req({}, noOrgUserCookie);
        expect(res.status).to.be.eq(200);
        expect(res.body.org.id).to.be.eq(org);
      });

    it('should set user org if user has one org (null)',
      async () => {
        const org = 1;
        const res = await req({org: null}, noOrgUserCookie);
        expect(res.status).to.be.eq(200);
        expect(res.body.org.id).to.be.eq(org);
      });

    it('should return empty when user has more than one org and no org passed',
      async () => {
        await OrgUser.create({
          user: 11,
          org: 2
        });
        const res = await req({}, noOrgUserCookie);
        expect(res.status).to.be.eq(200);
      });

    it('should set org when sent', async () => {
      let org = 1;
      let res = await req({org}, noOrgUserCookie);
      expect(res.status).to.be.eq(200);
      res = await request()
        .get('/user/me')
        .set('Cookie', noOrgUserCookie)
        .send();
      expect(res.body.org.id).to.be.eq(org);
      org = 2;
      res = await req({org}, noOrgUserCookie);
      expect(res.status).to.be.eq(200);
      res = await request()
        .get('/user/me')
        .set('Cookie', noOrgUserCookie)
        .send();
      expect(res.body.org.id).to.be.eq(org);
    });

    it('should error when org is inactive', async () => {
      const org = 9;
      const res = await req({org});
      expect(res.status).to.be.eq(400);
      expect(res.body.message).to.be.eq('Organization not found');
    });

  });
});
