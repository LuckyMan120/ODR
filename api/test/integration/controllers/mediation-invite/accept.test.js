

describe('mediation-invite', () => {
  describe('accept', () => {

    const req = async (
      id,
      cookie = testOrgUserCookie
    ) => await request()
      .put(`/mediation-invite/${id}/accept`)
      .set('Cookie', cookie)
      .send();

    let mediationId;
    let partyId;

    before(async () => {
      const {id} = await Mediation.create({
        name: 'Mediation Name',
        org: 2,
        initiatorPathway: 1,
        partyPathway: 1,
        mediatorPathway: 1
      }).fetch();
      mediationId = id;
      const {id: _partyId} = await MediationParty.create().fetch();
      partyId = _partyId;
      await MediationUser.create({
        user: 8,
        org: 2,
        mediation: id,
        party: partyId
      });
    });

    it('should accept invitation', async () => {
      const {id} = await MediationInvite.create({
        sendAt: new Date().toString(),
        invitedUser: 9,
        invitedByUser: 8,
        mediation: mediationId,
        party: partyId
      }).fetch();
      const res = await req(id);
      expect(res.status).to.be.eq(200);

      const mediationUser = await MediationUser.findOne({
        mediation: mediationId,
        user: 9
      });
      expect(mediationUser).to.be.an(
        'object',
        'should create a mediationUser for current user'
      );

      const mediationParty = await MediationParty
        .findOne(mediationUser.party);
      expect(mediationParty).to.be.an(
        'object',
        'should create a mediationParty for current user'
      );

      const mediationInvite = await MediationInvite
        .findOne(id);
      expect(mediationInvite.acceptedAt).to.be.a('string');
      expect(
        !!mediationInvite.acceptedAt,
        'should set acceptedAt'
      ).to.be.true;

    });

    it('should fail with other users invite', async () => {
      const {id} = await MediationInvite.create({
        sendAt: new Date().toString(),
        invitedUser: 6,
        invitedByUser: 8,
        mediation: mediationId,
        party: partyId
      }).fetch();
      const res = await req(id);
      expect(res.status).to.be.eq(404);
    });

  });
});
