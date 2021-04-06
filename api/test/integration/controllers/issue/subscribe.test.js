

describe('issue', () => {
  describe('subscribe', () => {

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
        .post('/issue/1/subscribe')
        .set('Cookie', testOrgStaffCookie)
        .send();
      expect(res.status).to.be.eq(400);
      expect(res.body.message).to.be.eq(
        'This request is socket only'
      );
    });

    it('should be able to call subscribe', async () => {
      const res = await new Promise(resolve => {
        io.socket.post(
          `/issue/${issueId}/subscribe`,
          (body, jwr) => resolve(jwr)
        );
      });
      expect(res.statusCode).to.be.eq(200);
    });

    it('should receive published events after subscribe', done => {
      const data = {foo: 'bar'};
      io.socket.on('issue', msg => {
        expect(msg).to.be.eql(data);
        done();
      });
      setTimeout(() => Issue.publish([issueId], data), 0);
    });

  });
});
