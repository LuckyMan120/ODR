

describe('issue', () => {
  describe('create-complaint', () => {
    const req = async (
      data = {},
      cookie = testOrgUserCookie
    ) => await request()
      .post('/issue/complaint')
      .set('Cookie', cookie)
      .send(data);

    it('should create complaint issue', async () => {
      const abn = 11111111111;
      const res = await req({
        abn
      });
      expect(res.status).to.be.eq(200);
      expect(res.body.name).to.be.eq('orgUser orgUser');
      expect(res.body.pathway).to.be.eq(1);
      expect(res.body.org).to.be.eq(1);

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
      expect(issueParties.length).to.be.eq(2);
      const initiatorParty = issueParties.find(i => i.initiator);
      expect(initiatorParty.name).to.be.eq('orgUser orgUser');
      expect(initiatorParty.type).to.be.eq('participant');

      const orgParty = issueParties.find(i => !i.initiator);
      expect(orgParty.name).to.be.eq('OrgName');
      expect(orgParty.type).to.be.eq('responder');
    });

    it('should create new org if it doesn\'t exists', async () => {
      const abn = 49973362606;
      let org = await Org.findOne({abn});
      expect(org).to.be.undefined;
      const res = await req({abn});
      expect(res.status).to.be.eq(200);
      org = await Org.findOne({abn});
      expect(org).to.be.an('object');
      expect(org.abn).to.be.eq(abn);
      expect(
        org.active,
        'org was new so it must be inactive'
      ).to.be.false;
    });

    it('should ignore if not found org', async () => {
      const abn = 21111111111;
      const org = await Org.findOne({abn});
      expect(org).to.be.undefined;
      const res = await req({
        name: 'New Complaint',
        abn
      });
      expect(res.status).to.be.eq(404);
    });

  });
});
