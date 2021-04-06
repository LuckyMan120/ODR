

describe('user', () => {
  describe('issues', () => {
    const req = async (
      cookie = testOrgUserCookie
    ) => await request()
      .get('/user/issues')
      .set('Cookie', cookie)
      .send();

    it('should get user issues', async () => {
      const {id: issue} = await Issue.create({
        name: 'issue',
        pathway: 1,
        org: 2,
        type: 'complaint'
      }).fetch();
      await IssueUser.create({
        user: 9,
        issue,
        role: 'participant'
      });
      const res = await req();
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
      expect(res.body[0]).to.have.property('parties');
    });
  });
});
