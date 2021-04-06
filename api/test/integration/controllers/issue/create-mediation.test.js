

describe('issue', () => {
  describe('create-mediation', () => {
    const req = async (
      data = {},
      cookie = testOrgUserCookie
    ) => await request()
      .post('/issue/mediation')
      .set('Cookie', cookie)
      .send(data);

    it('should create mediation issue', async () => {
      const name = 'myIssue';
      const pathway = 1;
      const res = await req({
        name,
        pathway
      });
      expect(res.status).to.be.eq(200);
      expect(res.body.name).to.be.eq(name);
      expect(res.body.pathway).to.be.eq(pathway);
      expect(res.body.org).to.be.eq(2);

      const issueUser = await IssueUser.findOne({
        issue: res.body.id
      }).populate('party');
      expect(issueUser).to.be.an('object');
      expect(issueUser.user).to.be.eq(9);
      expect(issueUser.issue).to.be.eq(res.body.id);
      expect(
        issueUser.initiator,
        'first created an issue, so user must be an initiator'
      ).to.be.true;
      expect(issueUser.party.type).to.be.eq('participant');

      const issueParties = await IssueParty.find({
        issue: res.body.id
      });
      expect(issueParties.length).to.be.eq(1);
      const issueParty = issueParties[0];
      expect(issueParty.name).to.be.eq('TestOrg');
      expect(issueParty.type).to.be.eq('participant');
    });
  });
});
