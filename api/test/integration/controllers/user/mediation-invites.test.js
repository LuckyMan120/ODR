

describe('user', () => {
  describe('mediation-invites', () => {

    const req = async (
      cookie = testOrgUserCookie
    ) => await request()
      .get('/user/mediation-invites')
      .set('Cookie', cookie)
      .send();

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

    it('should get a list of requests', async () => {
      const {id} = await MediationInvite.create({
        sendAt: new Date().toString(),
        invitedUser: 9,
        invitedByUser: 8,
        mediation: mediationId,
        party: partyId
      }).fetch();
      const res = await req();
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('array');
      const mediationInvite = res.body.find(mi => mi.id === id);
      expect(mediationInvite).to.be.an('object');
      expect(mediationInvite.invitedByUser).to.be.an('object');
      expect(mediationInvite.invitedByUser).to.have.property('firstName');
      expect(mediationInvite.invitedByUser).to.have.property('lastName');
    });

    it('should add invite to user after register', async () => {
      const email = 'asd7123jklasd9@test.org';
      const password = '1234abcd';
      const slug = 'test-org';
      const invite = await MediationInvite.create({
        email,
        sendAt: new Date().toString(),
        invitedByUser: 8,
        mediation: mediationId,
        party: partyId
      }).fetch();
      let res = await request()
        .post('/user/register')
        .send({
          email,
          firstName: 'asd7123jklasd9',
          lastName: 'asd7123jklasd9',
          slug
        });
      expect(res.status).to.be.eq(200);
      await User.updateOne({email}).set({password});
      res = await request()
        .post('/user/sign-in')
        .send({
          email,
          password,
          slug
        });
      expect(res.status).to.be.eq(200);
      res = await req(res.header['set-cookie'][0]);
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.eq(1);
      expect(res.body[0].id).to.be.eq(invite.id);
    });

  });
});
