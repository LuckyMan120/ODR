

describe('user', () => {
  describe('mediations', () => {
    const req = async (
      params = {},
      cookie = testOrgUserCookie
    ) => await request()
      .get('/user/mediations')
      .set('Cookie', cookie)
      .query(params);

    it('should return list of user mediations', async () => {
      const name = 'Mediation Name';
      const {id} = await Mediation.create({
        name,
        org: 2,
        initiatorPathway: 1,
        partyPathway: 1,
        mediatorPathway: 1
      }).fetch();
      const {id: partyId} = await MediationParty.create().fetch();
      await MediationUser.create({
        user: 9,
        org: 2,
        mediation: id,
        party: partyId
      });

      const res = await req();
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
      expect(res.body[0].mediation).to.be.an('object');
      expect(res.body[0].party).to.be.an('object');
      const mediationFound = res.body.find(medi => medi.mediation.id === id);
      expect(mediationFound).to.be.an('object');
      expect(mediationFound.mediation.id).to.be.eq(id);
      expect(mediationFound.mediation.name).to.be.eq(name);
      expect(mediationFound.role).to.be.an('object');
      expect(mediationFound.role.id).to.be.eq(1);
    });

    it('should paginate', async () => {
      const {id} = await Mediation.create({
        name: 'one',
        org: 2,
        initiatorPathway: 1,
        partyPathway: 1,
        mediatorPathway: 1
      }).fetch();
      await MediationUser.create({
        user: 9,
        org: 2,
        mediation: id
      });

      let res = await req({
        limit: 1,
        skip: 0
      });
      expect(res.body.length).to.be.eq(1);
      const checkId = res.body[0].id;
      res = await req({
        limit: 1,
        skip: 1
      });
      expect(res.body.length).to.be.eq(1);
      expect(res.body[0].id).to.not.be.eq(checkId);
    });

    it('should not return archived mediations', async () => {
      const {id} = await Mediation.create({
        name: 'one',
        org: 3,
        initiatorPathway: 1,
        partyPathway: 1,
        mediatorPathway: 1,
        archived: true
      }).fetch();
      await MediationUser.create({
        user: 9,
        org: 2,
        mediation: id,
        archived: true
      });

      const res = await req();
      expect(res.status).to.be.eq(200);
      const mediationFound = res.body.find(medi => medi.mediation.id === id);
      expect(mediationFound).to.be.undefined;
    });

    it('should return mediations in which user is mediator if user is staff',
    async () => {
      const name = 'mediator';
      const {id} = await Mediation.create({
        name,
        org: 2,
        initiatorPathway: 1,
        partyPathway: 1,
        mediatorPathway: 1
      }).fetch();
      await MediationUser.create({
        user: 8,
        org: 2,
        mediation: id,
        role: 2
      });
      const res = await req({}, testOrgStaffCookie);
      expect(res.body.length).to.be.at.least(1);
      const mediationFound = res.body.find(medi => medi.mediation.id === id);
      expect(mediationFound).to.be.an('object');
      expect(mediationFound.mediation.id).to.be.eq(id);
      expect(mediationFound.mediation.name).to.be.eq(name);
      expect(mediationFound.role).to.be.an('object');
      expect(mediationFound.role.id).to.be.eq(2);
    });

  });
});
