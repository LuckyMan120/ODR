

describe('mediation-invite', () => {
  describe('reject', () => {

    const req = async (
      id,
      cookie = testOrgUserCookie
    ) => await request()
      .put(`/mediation-invite/${id}/reject`)
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

    it('should reject invite', async () => {
      const {id} = await MediationInvite.create({
        sendAt: new Date().toString(),
        invitedUser: 9,
        invitedByUser: 8,
        mediation: mediationId,
        party: partyId
      }).fetch();
      const res = await req(id);
      expect(res.status).to.be.eq(200);

      const mediationInvite = await MediationInvite
        .findOne(id);
      expect(mediationInvite.rejectedAt).to.be.a(
        'string',
        'should set rejectedAt'
      );
      expect(!!mediationInvite.rejectedAt).to.be.true;
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
