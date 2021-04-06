

describe('issue-data', () => {
  describe('destroy', () => {
    const req = async (
      id,
      cookie = testOrgUserCookie
    ) => await request()
      .delete(`/issue-data/${id}`)
      .set('Cookie', cookie)
      .send();

    let id = null;

    before(async () => {
      const {id: issue} = await Issue.create({
        name: 'test-issue',
        type: 'complaint'
      }).fetch();
      const {id: issueDataId} = await IssueData.create({
        value: 'test-value',
        user: 9,
        issue,
        type: 1
      }).fetch();
      id = issueDataId;
    });

    it('should refuse to destroy other users issue-data', async () => {
      const res = await req(id, singleOrgUserCookie);
      expect(res.status).to.be.eq(404);
    });

    it('should remove issue-data', async () => {
      const res = await req(id);
      expect(res.status).to.be.eq(200);
      const issueData = await IssueData.findOne(id);
      expect(issueData).to.be.undefined;
    });
  });
});
