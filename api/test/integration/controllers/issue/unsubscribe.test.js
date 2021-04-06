

describe('issue', () => {
  describe('unsubscribe', () => {
    let issueId = null;

    before(async () => {
      const res = await request()
        .post('/issue/complaint')
        .set('Cookie', testOrgStaffCookie)
        .send({
          name: 'myIssue',
          abn: 11111111112
        });
      expect(res.status).to.be.eq(200);
      issueId = res.body.id;
    });

    it('should refuse if request with http', async () => {
      const res = await request()
        .post('/issue/1/unsubscribe')
        .set('Cookie', testOrgStaffCookie)
        .send();
      expect(res.status).to.be.eq(400);
      expect(res.body.message).to.be.eq(
        'This request is socket only'
      );
    });

    it('should be able to call unsubscribe', async () => {
      const res = await new Promise(resolve => {
        io.socket.post(
          `/issue/${issueId}/unsubscribe`,
          (body, jwr) => resolve(jwr)
        );
      });
      expect(res.statusCode).to.be.eq(200);
    });

  });
});
