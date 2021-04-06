

describe('common', () => {
  describe('count', () => {
    const req = async (
      params = {},
      cookie = superadminCookie
    ) => await request()
      .get('/org/count')
      .set('Cookie', cookie)
      .query(params);

    it('should return org count', async () => {
      const res = await req();
      expect(res.status).to.be.eq(200);
      expect(res.body.count).to.be.at.least(3);
    });

    it('should accept criteria', async () => {
      const res = await req({
        slug: 'unnamed-org'
      });
      expect(res.body.count).to.be.eq(1);
    });
  });
});
