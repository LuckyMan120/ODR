

describe('user', () => {
  describe('me', () => {
    const req = async (cookie = '') => await request()
      .get('/user/me')
      .set('Cookie', cookie)
      .send();

    const singIn = async (data) => await request()
      .post('/user/sign-in')
      .send(data);

    it('should refuse without cookie', async () => {
      const res = await req();
      expect(res.status).to.be.eq(403);
    });

    it('should return with cookie', async () => {
      let res = await singIn({
        email: 'loginTest@gmail.com',
        password: '1234abcd',
        slug: 'org-slug'
      });
      expect(res.status).to.be.eq(200);
      expect(res.header).to.have.property('set-cookie');
      const cookie = res.header['set-cookie'][0];
      res = await req(cookie);
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('user');
      expect(res.body).to.have.property('role');
      expect(res.body).to.have.property('org');
      expect(res.body).to.have.property('orgRole');
    });
  });
});
