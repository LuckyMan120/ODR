

describe('issue', () => {
  describe('withdraw', () => {
    const req = async (
      id,
      data = {},
      cookie = userCookie
    ) => await request()
      .put(`/issue/${id}/withdraw`)
      .set('Cookie', cookie)
      .send(data);

    it('should withdraw an issue', async () => {
      let res = await request()
        .post('/issue/complaint')
        .set('Cookie', userCookie)
        .send({
          name: 'myIssue',
          abn: 11111111112
        });
      expect(res.status).to.be.eq(200);
      const issueId = res.body.id;

      const note = 'test note text';

      res = await req(issueId, {note});
      expect(res.status).to.be.eq(200);
      const issue = await Issue.findOne(issueId);
      expect(issue.closedAt).to.be.at.least(1);
      expect(issue.note).to.be.eq(note);
      expect(issue.status).to.be.eq('closedWithdrawn');
    });

    it('should not be able to withdraw again same issue', async () => {
      let res = await request()
        .post('/issue/complaint')
        .set('Cookie', userCookie)
        .send({
          name: 'myIssue',
          abn: 11111111112
        });
      expect(res.status).to.be.eq(200);
      const issueId = res.body.id;

      res = await req(issueId);
      expect(res.status).to.be.eq(200);

      res = await req(issueId);
      expect(res.status).to.be.eq(400);
      expect(res.body.message).to.be.eq(
        'This issue was withdrawn/escalated already'
      );
    });

    it('should withdraw an issue', async () => {
      const statuses = [
        'closedWithdrawn',
        'closedEscalatedMediation',
        'closedEscalatedOmbudsman'
      ];

      for (let i = 0; i < statuses.length; i++) {
        const status = statuses[i];
        let res = await request()
          .post('/issue/complaint')
          .set('Cookie', userCookie)
          .send({
            name: 'myIssue',
            abn: 11111111112
          });
        expect(res.status).to.be.eq(200);
        const issueId = res.body.id;

        res = await req(issueId, {status});
        const issue = await Issue.findOne(issueId);
        expect(issue.status).to.be.eq(status);
      }

    });
  });
});
