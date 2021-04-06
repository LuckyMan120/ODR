

describe('user', () => {
  describe('sign-out', () => {
    const req = async (cookie = '') => await request()
      .post('/user/sign-out')
      .set('Cookie', cookie)
      .send();

    it('should refuse if not logged in', async () => {
      const res = await req();
      expect(res.status).to.be.eq(403);
    });

    it('should log out', async () => {
      const cookie = await signIn({
        email: 'logOutUser@test.org',
        password: '1234abcd'
      });
      let res = await req(cookie);
      expect(res.status).to.be.eq(200);
      res = await req(cookie);
      expect(res.status).to.be.eq(403);
    });
  });
});
