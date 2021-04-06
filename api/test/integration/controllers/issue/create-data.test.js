

describe('issue', () => {
  describe('create-data', () => {
    const req = async (
      id,
      data = {},
      cookie = testOrgUserCookie
    ) => await request()
      .post(`/issue/${id}/data`)
      .set('Cookie', cookie)
      .send(data);

    let issueId = null;

    before(async () => {
      const res = await request()
        .post('/issue/complaint')
        .set('Cookie', testOrgUserCookie)
        .send({
          name: 'myIssue',
          abn: 11111111111
        });
      expect(res.status).to.be.eq(200);
      issueId = res.body.id;
    });

    it('should create issue data for issue', async () => {
      const value = 'test-value';
      const type = 1;
      const res = await req(issueId, {
        value,
        type
      });
      expect(res.status).to.be.eq(200);
      expect(res.body.value).to.be.eq(value);

      const issueData = await IssueData.findOne(res.body.id);
      expect(issueData).to.be.an('object');
      expect(issueData.user).to.be.eq(9);
      expect(issueData.issue).to.be.eq(issueId);
      expect(issueData.type).to.be.eq(type);
    });

    it(`
      should refuse to create issue data
      if user is not related to issue via issue party
    `, async () => {
      const res = await req(issueId, {
        value: 'test-value',
        type: 1
      }, singleOrgUserCookie);
      expect(res.status).to.be.eq(404);
    });

    it('should update issue updatedAt', async () => {
      let issue = await Issue.findOne(issueId);
      const updatedAt = issue.updatedAt;
      const res = await req(issueId, {
        value: 'test-value',
        type: 2
      });
      expect(res.status).to.be.eq(200);
      issue = await Issue.findOne(issueId);
      expect(updatedAt).to.not.eq(issue.updatedAt);
    });

    it('should create with category', async () => {
      const value = 'test-value';
      const type = 1;
      const category = 'test-category';
      const res = await req(issueId, {
        value,
        type,
        category
      });
      expect(res.status).to.be.eq(200);
      expect(res.body.value).to.be.eq(value);
      expect(res.body.category).to.be.eq(category);

      const issueData = await IssueData.findOne(res.body.id);
      expect(issueData).to.be.an('object');
      expect(issueData.user).to.be.eq(9);
      expect(issueData.issue).to.be.eq(issueId);
      expect(issueData.type).to.be.eq(type);
      expect(issueData.category).to.be.eq(category);
    });
  });
});
