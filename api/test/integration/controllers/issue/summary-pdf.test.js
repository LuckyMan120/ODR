

describe('issue', () => {
  describe('summary-pdf', () => {
    const req = async (
      id,
      cookie = userCookie
    ) => await request()
      .get(`/issue/${id}/summary-pdf`)
      .set('Cookie', cookie);

    let issueId = null;

    before(async () => {
      const res = await request()
        .post('/issue/complaint')
        .set('Cookie', userCookie)
        .send({
          name: 'myIssue',
          abn: 11111111112 // test org
        });
      expect(res.status).to.be.eq(200);
      issueId = res.body.id;
    });

    it('should respond with issue pdf', async () => {
      const res = await req(issueId);
      expect(res.status).to.be.eq(200);
      expect(res.headers['content-type']).to.be.eq('application/pdf');
    });

    it('should respond to org admin', async () => {
      const res = await req(issueId, testOrgAdminCookie);
      expect(res.status).to.be.eq(200);
    });

    it('should respond to org staff', async () => {
      const res = await req(issueId, testOrgStaffCookie);
      expect(res.status).to.be.eq(200);
    });
  });
});
