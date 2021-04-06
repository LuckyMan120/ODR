
describe('siteConfig', () => {
  describe('update', () => {
    const req = async (
      id,
      params = {},
      cookie = superadminCookie,
    ) => await request()
      .patch(`/siteconfig/${id}`)
      .set('Cookie', cookie)
      .send(params);

    it('should refuse if not site admin or superadmin', async () => {
      const res = await req(1, {}, userCookie);
      expect(res.status).to.be.eq(403);
    });

    it('should update site config not protected', async () => {
      const {id} = await SiteConfig.create({
        key: 'foo',
        value: 'bar',
        inputType: 'text',
        clientSafe: true,
        protected: false
      }).fetch();
      const value = '30';
      const res = await req(id, {value}, adminCookie);
      expect(res.status).to.be.eq(200);
      const siteConfig = await SiteConfig.findOne(id);
      expect(siteConfig.value).to.be.equal(value);
    });

    it('should refuse if site admin update protected', async () => {
      const id = 2;
      const res = await req(id, {value: 'defaultOrg'}, adminCookie);
      expect(res.status).to.be.eq(403);
    });

  });
});

