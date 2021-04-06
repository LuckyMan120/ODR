

describe('siteConfig', () => {
  describe('client-get-config', () => {
    const req = async (
      params = {},
      cookie = {}
    ) => await request()
      .get('/siteconfig/client')
      .set('Cookie', cookie)
      .query(params);

    it('should return all site config', async () => {
      const count = await SiteConfig.count({clientSafe: true});
      const res = await req();
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.equal(count);
    });

  });
});

