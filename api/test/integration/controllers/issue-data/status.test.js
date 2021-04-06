

describe('issue-data', () => {
  describe('status', () => {
    const req = async (
      id,
      cookie = userCookie
    ) => await request()
      .get(`/issue-data/${id}/status`)
      .set('Cookie', cookie);

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

    it('should get status of issue-data', async () => {
      const res = await req(id);
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.eq(2);
      expect(res.body[0].value).to.be.eq('none');
      expect(res.body[1].value).to.be.eq('none');
    });

    it('should refuse if not in party of an issue of issue-data', async () => {
      const res = await req(id, testOrgUserCookie);
      expect(res.status).to.be.eq(404);
    });
  });
});
