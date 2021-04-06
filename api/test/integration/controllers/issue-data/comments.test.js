

describe('issue-data', () => {
  describe('comments', () => {
    const req = async (
      id,
      query = {},
      cookie = userCookie
    ) => await request()
      .get(`/issue-data/${id}/comments`)
      .set('Cookie', cookie)
      .query(query);

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

    it('should return list of comments for an issue-data', async () => {
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
      const res = await req(id);
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.eq(1);
      expect(res.body[0].text).to.be.eq(text);
      expect(res.body[0].party).to.be.an('object');
      expect(res.body[0].party.id).to.be.eq(_party);
      expect(res.body[0].user).to.be.an('object');
      expect(res.body[0].user.id).to.be.eq(user);
      const comment = await IssueDataComment.findOne({issueData});
      expect(comment.id).to.be.eq(res.body[0].id);
    });

    it('should refuse to return comments if in party', async () => {
      const res = await req(id, {}, testOrgUserCookie);
      expect(res.status).to.be.eq(404);
    });

    it('should be able to paginate comments', async () => {
      await IssueDataComment.create({
        text: 'test',
        issueData: id,
        party,
        user: 6
      });
      const limit = 1;
      let res = await req(id, {limit});
      expect(res.body.length).to.be.eq(limit);
      let skip = 1;
      res = await req(id, {limit, skip});
      expect(res.body.length).to.be.eq(limit);
      skip = 2;
      res = await req(id, {limit, skip});
      expect(res.body.length).to.be.eq(0);
    });
  });
});
