

describe('user', () => {
  describe('orgs', () => {
    const req = async (
      cookie = testOrgUserCookie
    ) => await request()
      .get('/user/orgs')
      .set('Cookie', cookie);

    it(
      `
        should return list of logged in user\'s orgs,
        only where user is admin or staff
      `,
      async () => {
        let res = await req();
        expect(res.status).to.be.eq(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.at.least(0);
        res = await req(testOrgAdminCookie);
        expect(res.status).to.be.eq(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.at.least(1);
        expect(res.body[0].slug).to.be.a('string');
      }
    );

  });
});
