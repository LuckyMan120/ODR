

describe('user', () => {
  describe('get-users', () => {
    const req = async (params, cookie = testOrgAdminCookie) => await request()
      .get('/org/users')
      .set('Cookie', cookie)
      .query(params);

    it('should refuse if not org admin', async () => {
      const res = await req({}, testOrgUserCookie);
      expect(res.status).to.be.eq(403);
    });

    it('should get org users', async () => {
      const res = await req();
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
    });

    it('should paginate', async () => {
      let res = await req({
        limit: 1
      });
      expect(res.status).to.be.eq(200);
      expect(res.body.length).to.be.eq(1);
      res = await req({
        skip: 1,
        limit: 2
      });
      expect(res.status).to.be.eq(200);
      expect(res.body.length).to.be.eq(2);
    });

    it('should search by email', async () => {
      const res = await req({
        email: {contains: 'orgAdmin'}
      });
      expect(res.status).to.be.eq(200);
      expect(res.body.length).to.be.eq(1);
      expect(res.body[0].user.email)
        .to.be.eq('orgAdmin@test.org'.toLowerCase());
    });

    it('should filter by role', async () => {
      const res = await req({
        orgRole: 1
      });
      expect(res.status).to.be.eq(200);
      expect(res.body.length).to.be.eq(1);
      expect(res.body[0].user.email)
        .to.be.eq('orgAdmin@test.org'.toLowerCase());
    });
  });
});
