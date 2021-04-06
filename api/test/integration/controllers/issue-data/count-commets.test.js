

describe('issue-data', () => {
  describe('count-comment', () => {
    const req = async (
      id,
      cookie = userCookie
    ) => await request()
      .get(`/issue-data/${id}/comments/count`)
      .set('Cookie', cookie);

    let issueId = null;
    let id = null;
    let party = null;

    before(async () => {
      let res = await request()
          .post('/issue/complaint')
          .set('Cookie', userCookie)
          .send({
            name: 'myIssue',
            abn: 13069942552
          });
      expect(res.status).to.be.eq(200);
      issueId = res.body.id;
      res = await request()
          .post(`/issue/${issueId}/data`)
          .set('Cookie', userCookie)
          .send({
            value: 'test',
            type: 1
          });
      id = res.body.id;
      party = res.body.party;
    });

    it('should be able to count comments', async () => {
      const text = 'test';
      const issueData = id;
      const _party = party;
      const user = 6;
      await IssueDataComment.create({
        text,
        issueData,
        party: _party,
        user
      });
      const count = await IssueDataComment.count({
        issueData: id
      });
      const res = await req(id);
      expect(res.status).to.be.eq(200);
      expect(res.body.count).to.be.eq(count);
    });

    it('should refuse if not in party', async () => {
      const res = await req(id, testOrgUserCookie);
      expect(res.status).to.be.eq(404);
    });
  });
});
