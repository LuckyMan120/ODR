

describe('issue-data', () => {
  describe('create-comment', () => {
    const req = async (
      id,
      data = {},
      cookie = userCookie
    ) => await request()
      .post(`/issue-data/${id}/comment`)
      .set('Cookie', cookie)
      .send(data);

    let issueId = null;
    let id = null;

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
    });

    it('should be able to create a comment', async () => {
      const text = 'foo bar';
      const res = await req(id, {text});
      expect(res.status).to.be.eq(200);
      const comments = await IssueDataComment.find({
        issueData: id
      });
      expect(comments.length).to.be.eq(1);
      expect(comments[0].text).to.be.eq(text);
    });

    it('should refuse if not in party', async () => {
      const res = await req(id, {text: 'foo bar'}, testOrgUserCookie);
      expect(res.status).to.be.eq(404);
    });
  });
});
