

describe('org', () => {
  describe('add-user', () => {
    const req = async (
      params = {},
      cookie = testOrgAdminCookie
    ) => await request()
      .post('/org/user')
      .set('Cookie', cookie)
      .query(params);

    it('should refuse if not org admin', async () => {
      const res = await req({}, testOrgUserCookie);
      expect(res.status).to.be.eq(403);
    });

    it('should be able to add user to org', async () => {
      const {id: user} = await User.create({
        email: 'newOrgUser@test.org',
        firstName: 'newOrgUser',
        lastName: 'newOrgUser'
      }).fetch();
      const res = await req({
        user,
        role: 2
      });
      expect(res.status).to.be.eq(200);
      const orgUser = await OrgUser.findOne({
        user,
        org: 2
      });
      expect(orgUser).to.be.an('object');
    });

    it('should set role to user by default', async () => {
      const {id: user} = await User.create({
        email: 'newOrgUser2@test.org',
        firstName: 'newOrgUser2',
        lastName: 'newOrgUser2'
      }).fetch();
      const res = await req({
        user
      });
      expect(res.status).to.be.eq(200);
      const orgUser = await OrgUser.findOne({
        user,
        org: 2
      });
      expect(orgUser).to.be.an('object');
      expect(orgUser.role).to.be.eq(3);
    });
  });
});
