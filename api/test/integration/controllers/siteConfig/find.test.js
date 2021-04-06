

describe('siteConfig', () => {
  describe('get-config', () => {
    const req = async (
      params = {},
      cookie = superadminCookie
    ) => await request()
      .get('/siteconfig')
      .set('Cookie', cookie)
      .query(params);

    it('should refuse if not site admin or superadmin', async () => {
      const res = await req({}, userCookie);
      expect(res.status).to.be.eq(403);
    });

    it('should get site config not protected', async () => {
      const count = await SiteConfig.count({
        protected: false
      });
      const res = await req({}, adminCookie);
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.equal(count);
    });

    it('should get all site config', async () => {
      const count = await SiteConfig.count();
      const res = await req({});
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.equal(count);
    });

  });
});

