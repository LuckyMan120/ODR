

describe('org', () => {
  describe('get-issues', () => {
    const req = async (
      query = {},
      cookie = testOrgUserCookie
    ) => await request()
      .get('/org/issues')
      .set('Cookie', cookie)
      .query(query);

    it('should refuse for non admin', async () => {
      const res = await req();
      expect(res.status).to.be.eq(403);
    });

    it('should get org issues', async () => {
      await Issue.create({
        name: 'testIssue',
        pathway: 1,
        org: 2,
        type: 'complaint',
        submittedAt: new Date().getTime()
      });
      await Issue.create({
        name: 'testIssueOtherOrg',
        pathway: 1,
        org: 1,
        type: 'complaint',
        submittedAt: new Date().getTime()
      });
      const res = await req({}, testOrgAdminCookie);
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
      for (const issue of res.body) {
        expect(issue.org).to.be.eq(2);
      }
    });

    it('should accept search query', async () => {
      const name = 'hello world';
      await Issue.create({
        name,
        pathway: 1,
        org: 1,
        type: 'complaint',
        submittedAt: new Date().getTime()
      });
      await Issue.create({
        name,
        pathway: 1,
        org: 2,
        type: 'complaint',
        submittedAt: new Date().getTime()
      });
      const issues = await Issue.find({
        org: 2,
        name: {contains: name.substr(0, name.length / 2)}
      });
      expect(issues.length).to.be.eq(1);
      const res = await req({
        search: name.substr(0, name.length / 2)
      }, testOrgAdminCookie);
      expect(res.status).to.be.eq(200);
      expect(res.body.length).to.be.eq(1);
      expect(res.body[0].name).to.be.eq(name);
    });
  });
});
