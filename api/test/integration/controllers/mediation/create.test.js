

describe('mediation', () => {
  describe('create', () => {
    const req = async (
      params = {},
      cookie = testOrgUserCookie
    ) => await request()
      .post('/mediation')
      .set('Cookie', cookie)
      .query(params);

    xit('should create a mediation (/w invite)', async () => {
      const email = 'invite@email.me';

      const res = await req({email});
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('object');
      expect(res.body.id).to.be.a('number');

      const mediation = await Mediation
        .findOne(res.body.id)
        .populate('type')
        .populate('parties')
        .populate('mediationUsers');

      expect(mediation.type).to.be.an('object');
      expect(mediation.type.id).to.be.eq(1);

      expect(mediation).to.be.an('object');
      expect(mediation.org).to.be.eq(2);

      expect(mediation.mediationUsers).to.be.an('array');
      expect(mediation.mediationUsers.length).to.be.eq(1);
      expect(mediation.mediationUsers[0].role).to.be.eq(1);

      expect(mediation.parties).to.be.an('array');
      expect(mediation.parties.length).to.be.eq(1);
      expect(mediation.parties[0]).to.be.an('object');

      const mediationInvite = await MediationInvite.findOne({
        email,
        invitedByUser: 9,
        mediation: mediation.id,
        party: mediation.parties[0].id,
        role: 1
      });
      expect(mediationInvite).to.be.an('object');

      const orgInvite = await OrgInvite.findOne({
        email,
        user: 9,
        org: 2
      });
      expect(orgInvite).to.be.an('object');
    });

    xit(
      'should set party name to user first/last name if no profile',
      async () => {
        const res = await req({email: 'asfjoi234ojasd0@test.org'});
        const mediation = await Mediation
          .findOne(res.body.id)
          .populate('parties');
        const mediationUsers = await MediationUser.find({
          party: mediation.parties[0].id
        }).populate('user');
        expect(mediationUsers.length).to.be.eq(1);
        expect(mediation.parties[0].name).to.be.eq(
          mediationUsers[0].user.firstName +
          ' ' +
          mediationUsers[0].user.firstName,
          'Party name set to `firstName lastName`'
        );
      }
    );

    xit(
      'should set party name to company if user has one set ion profile',
      async () => {
        const company = 'myComp';
        await User.updateOne(9).set({company});
        const res = await req({email: 'asdhj123kjhasd@test.org'});
        const mediation = await Mediation
          .findOne(res.body.id)
          .populate('parties');
        const mediationUsers = await MediationUser.find({
          party: mediation.parties[0].id
        }).populate('user');
        expect(mediationUsers.length).to.be.eq(1);
        expect(mediation.parties[0].name).to.be.eq(
          company,
          'Party name set to user.company'
        );
      }
    );

    xit(
      'should set default mediation name',
      async () => {
        const email = 'asdadhjajb123897@test.org';
        const res = await req({email});
        const mediation = await Mediation
          .findOne(res.body.id)
          .populate('parties');
        const mediationUsers = await MediationUser.find({
          party: mediation.parties[0].id
        }).populate('user');
        expect(mediationUsers.length).to.be.eq(1);
        expect(mediation.name).to.be.eq(
          mediation.parties[0].name + ' & ' + email
        );
      }
    );

    it('should set user on invite if exists', async () => {
      const email = 'asdqweg1231gsdfg@test.org';
      const user = await User.create({
        email,
        firstName: 'asdqweg1231gsdfg',
        lastName: 'asdqweg1231gsdfg'
      }).fetch();
      const res = await req({email});
      expect(res.status).to.be.eq(200);

      const mediationInvite = await MediationInvite.findOne({
        mediation: res.body.id
      });
      expect(mediationInvite).to.be.an('object');
      expect(mediationInvite.invitedUser).to.be.eq(user.id);

      const orgInvite = await OrgInvite.findOne({email});
      expect(orgInvite).to.be.undefined;
    });

  });
});
