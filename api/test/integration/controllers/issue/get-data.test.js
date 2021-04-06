

describe('issue', () => {
  describe('get-data', () => {
    const req = async (id) => await request()
      .get(`/issue/${id}/data`)
      .set('Cookie', userCookie)
      .query();

    let issueId = null;

    before(async () => {
      let res = await request()
        .post('/issue/complaint')
        .set('Cookie', userCookie)
        .send({
          abn: 76954076157
        });
      expect(res.status).to.be.eq(200);
      issueId = res.body.id;
      res = await request()
        .post(`/issue/${issueId}/data`)
        .set('Cookie', userCookie)
        .send({
          value: 'test-value',
          type: 1
        });
      expect(res.status).to.be.eq(200);
      res = await request()
        .post(`/issue/${issueId}/data`)
        .set('Cookie', userCookie)
        .send({
          value: 'test-value',
          type: 2
        });
      expect(res.status).to.be.eq(200);
    });

    it('should return all issue data of issue', async () => {
      const res = await req(issueId);
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.eq(2);
      const party = await IssueParty.findOne({
        issue: issueId,
        initiator: true
      }).select(['id']);
      for (const data of res.body) {
        expect(data).to.satisfy(data => (
          data.type.shared || data.party === party.id
        ));
      }
    });
  });
});
