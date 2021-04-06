

describe('org', () => {
  describe('issues-count', () => {
    const req = async (
      query = {},
      cookie = testOrgAdminCookie
    ) => await request()
      .get('/org/issues/count')
      .set('Cookie', cookie)
      .query(query);

    it('should count issues', async () => {
      await Issue.create({
        name: 'test',
        pathway: 1,
        org: 2,
        type: 'complaint',
        submittedAt: new Date().getTime()
      });
      const count = await Issue.count({
        org: 2,
        submittedAt: {'!=': 0}
      });
      const res = await req();
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('count');
      expect(res.body.count).to.be.at.least(1);
      expect(res.body.count).to.be.eq(count);
    });

    it('should accept the criteria', async () => {
      const name = 'sdifujgwepirut';
      await Issue.create({
        name,
        pathway: 1,
        org: 2,
        type: 'complaint',
        submittedAt: new Date().getTime()
      });
      const search = name.substr(0, name.length / 2);
      const org = 2;
      const where = {
        org,
        name: {contains: search},
        submittedAt: {'!=': 0}
      };
      const users = await User.find({
        or: [
          {firstName: {contains: search}},
          {lastName: {contains: search}},
          {email: {contains: search}}
        ]
      }).select(['id']);
      const issueUsers = await IssueUser.find({
        user: users.map(user => user.id),
        org
      }).select(['issue']);
      where.id = [...new Set(issueUsers.map(issueUser => issueUser.issue))];
      const count = await Issue.count(where);
      const res = await req({search});
      expect(res.status).to.be.eq(200);
      expect(res.body.count).to.be.eq(count);
    });
  });
});
