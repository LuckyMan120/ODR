

describe('issue', () => {
  describe('party', () => {
    const req = async (
      id,
      cookie = testOrgUserCookie
    ) => await request()
      .get(`/issue/${id}/party`)
      .set('Cookie', cookie)
      .send();

    let issueId = null;

    before(async () => {
      const res = await request()
        .post('/issue/complaint')
        .set('Cookie', testOrgUserCookie)
        .send({
          name: 'myIssue',
          abn: 13069942552
        });
      expect(res.status).to.be.eq(200);
      issueId = res.body.id;
    });

    it('should return party of an issue for logged in user', async () => {
      const res = await req(issueId);
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('object');
      expect(res.body.issue).to.be.eq(issueId);
      expect(res.body.initiator).to.be.true;
    });
  });
});
