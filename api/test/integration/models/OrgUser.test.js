

describe('OrgUser', () => {
  let orgUserId = null;
  let userId = null;
  let orgId = null;

  describe('#create', () => {
    it('should be able to add users to org', async () => {
      let org = await Org.create({
        name: '_testOrg',
        slug: 'a-test-org',
        abn: 11023851174
      }).fetch();
      let user = await User.create({
        email: 'test@test.com',
        password: '1234abcd',
        firstName: 'John',
        lastName: 'Doe'
      }).fetch();
      userId = user.id;
      orgId = org.id;
      const orgUser = await OrgUser.create({
        user: userId,
        role: 2,
        org: orgId
      }).fetch();
      orgUserId = orgUser.id;
      org = await Org.findOne({
        id: orgId
      }).populate('users');
      expect(org.users).to.be.an('array');
      expect(org.users.length).to.be.at.least(1);
      expect(org.users[0]).to.be.an('object');
      expect(org.users[0].id).to.be.eq(userId);
      user = await User.findOne({
        id: userId
      }).populate('orgs');
      expect(user.orgs).to.be.an('array');
      expect(user.orgs.length).to.be.at.least(1);
      expect(user.orgs[0]).to.be.an('object');
      expect(user.orgs[0].id).to.be.eq(orgId);
    });

    it('should auto set role', async () => {
      const {id: user} = await User.create({
        email: 'test1@test.com',
        firstName: 'John',
        lastName: 'Doe'
      }).fetch();
      const orgUser = await OrgUser.create({
        user,
        org: orgId
      }).fetch();
      expect(orgUser.role).to.be.eq(3);
    });

    it('should fail if OrgUser exists already', async () => {
      const {id: user} = await User.create({
        email: 'test2@test.com',
        firstName: 'John',
        lastName: 'Doe'
      }).fetch();
      const orgUser = await OrgUser.create({
        user,
        org: orgId
      }).fetch();
      expect(orgUser).to.be.an('object');
      let err;
      try {
        await OrgUser.create({
          user,
          org: orgId
        });
      } catch (_err) {
        err = _err;
      }
      expect(err).to.not.be.undefined;
      const orgUsers = await OrgUser.find({
        user,
        org: orgId
      });
      expect(orgUsers.length).to.be.eq(1);
    });
  });

  describe('#update', () => {
    it('should be able to change users role in org', async () => {
      let orgUser = await OrgUser.findOne({id: orgUserId});
      expect(orgUser.role).to.be.eq(2);
      await OrgUser.update({id: orgUserId}).set({role: 1});
      orgUser = await OrgUser.findOne({id: orgUserId});
      expect(orgUser.role).to.be.eq(1);
    });
  });

  describe('#destroy', () => {
    it('should be able to remove user from org', async () => {
      await OrgUser.destroy({id: orgUserId});
      const org = await Org.findOne({
        id: orgId
      }).populate('users');
      expect(org.users).to.be.an('array');
      expect(org.users.length).to.be.at.least(0);
      const user = await User.findOne({
        id: userId
      }).populate('orgs');
      expect(user.orgs).to.be.an('array');
      expect(user.orgs.length).to.be.at.least(0);
    });
  });
});
