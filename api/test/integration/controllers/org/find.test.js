

describe('org', () => {
  describe('find', () => {
    const req = async (cookie = '') => await request()
      .get('/org')
      .set('Cookie', cookie)
      .send();

    it('should refuse without cookie', async () => {
      const res = await req();
      expect(res.status).to.be.eq(403);
    });

    it('should return list of org for admin', async () => {
      const res = await req(adminCookie);
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
    });

    it('should return list of org for superadmin', async () => {
      const res = await req(superadminCookie);
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
    });
  });
});
