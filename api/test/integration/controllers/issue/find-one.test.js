

describe('issue', () => {
  describe('find-one', () => {
    const req = async (
      id,
      cookie = userCookie
    ) => await request()
      .get(`/issue/${id}`)
      .set('Cookie', cookie);

    const abn = 11111111112;

    let issueId = null;

    before(async () => {
      const res = await request()
        .post('/issue/complaint')
        .set('Cookie', userCookie)
        .send({abn});
      expect(res.status).to.be.eq(200);
      issueId = res.body.id;
    });

    it('should return issue', async () => {
      const res = await req(issueId);
      expect(res.status).to.be.eq(200);
      expect(res.body.id).to.be.eq(issueId);
    });

    it('should not return issue if not in a party', async () => {
      const res = await req(issueId, testOrgUserCookie);
      expect(res.status).to.be.eq(404);
    });

    it('should return issue parties', async () => {
      const res = await req(issueId);
      expect(res.status).to.be.eq(200);
      expect(res.body.id).to.be.eq(issueId);
      expect(res.body.parties).to.be.an('array');
      expect(res.body.parties.length).to.be.at.least(1);
    });
  });
});
