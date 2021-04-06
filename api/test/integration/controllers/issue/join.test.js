
describe('issue', () => {
  describe('join', () => {
    const req = async (
      id,
      cookie = testOrgStaffCookie
    ) => await request()
      .post(`/issue/${id}/join`)
      .set('Cookie', cookie)
      .send();

    let issueId = null;

    before(async () => {
      const res = await request()
        .post('/issue/complaint')
        .set('Cookie', testOrgUserCookie)
        .send({
          name: 'myIssue',
          abn: 11111111112
        });
      expect(res.status).to.be.eq(200);
      issueId = res.body.id;
    });

    it('should refuse for non staff or admin', async () => {
      const res = await req(issueId, testOrgUserCookie);
      expect(res.status).to.be.eq(403);
    });

    it('should respond', async () => {
      let usersCount = await IssueUser.count({
        issue: issueId
      });
      expect(usersCount).to.be.eq(1);
      const res = await req(issueId);
      expect(res.status).to.be.eq(200);
      usersCount = await IssueUser.count({
        issue: issueId
      });
      expect(usersCount).to.be.eq(2);
      const issueUser = await IssueUser.findOne({
        issue: issueId,
        user: 8
      }).populate('party');
      expect(issueUser).to.be.an('object');
      expect(issueUser.party).to.be.an('object');
      expect(issueUser.party.type).to.be.eq('responder');
      expect(issueUser.party.initiator).to.be.eq(false);
    });
  });
});
