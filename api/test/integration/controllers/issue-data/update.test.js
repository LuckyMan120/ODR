

describe('issue-data', () => {
  describe('update', () => {
    const req = async (
      id,
      data = {},
      cookie = testOrgUserCookie
    ) => await request()
      .put(`/issue-data/${id}`)
      .set('Cookie', cookie)
      .send(data);

    let issueId = null;
    let id = null;

    before(async () => {
      const issue = await Issue.create({
        name: 'test-issue',
        type: 'complaint'
      }).fetch();
      issueId = issue.id;
      const {id: issueDataId} = await IssueData.create({
        value: 'test-value',
        user: 9,
        issue: issueId,
        type: 1
      }).fetch();
      id = issueDataId;
    });

    it('should update issueData', async () => {
      const value = 'new-test-value';
      const res = await req(id, {
        value
      });
      expect(res.status).to.be.eq(200);
      expect(res.body.value).to.be.eq(value);
      const {value: newValue} = await IssueData.findOne(id);
      expect(newValue).to.be.eq(value);
    });

    it('should refuse to update other users issue data', async () => {
      const res = await req(id, {
        value: 'test-value'
      }, singleOrgUserCookie);
      expect(res.status).to.be.eq(404);
    });

    it('should update issue updatedAt', async () => {
      let issue = await Issue.findOne(issueId);
      const updatedAt = issue.updatedAt;
      const res = await req(id, {
        value: 'new-test-value'
      });
      expect(res.status).to.be.eq(200);
      issue = await Issue.findOne(issueId);
      expect(updatedAt).to.not.eq(issue.updatedAt);
    });

    it('should update issueData with category', async () => {
      const value = 'new-test-value';
      const category = 'test-category';
      const res = await req(id, {
        value,
        category
      });
      expect(res.status).to.be.eq(200);
      expect(res.body.value).to.be.eq(value);
      expect(res.body.category).to.be.eq(category);
      const {
        value: newValue,
        category: newCategory
      } = await IssueData.findOne(id);
      expect(newValue).to.be.eq(value);
      expect(newCategory).to.be.eq(category);
    });
  });
});
