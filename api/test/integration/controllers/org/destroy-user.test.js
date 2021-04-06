

describe('user', () => {
  describe('destroy-user', () => {
    const org = 2;
    const req = async (
      id,
      cookie = testOrgAdminCookie
    ) => await request()
      .delete(`/org/user/${id}`)
      .set('Cookie', cookie)
      .send();

    it('should refuse if not org admin', async () => {
      const res = await req(undefined, testOrgUserCookie);
      expect(res.status).to.be.eq(403);
    });

    it('should delete user from org', async () => {
      const user = await User.create({
        email: 'testOrgDeleteUser@test.org',
        firstName: 'testOrgDeleteUser',
        lastName: 'testOrgDeleteUser'
      }).fetch();
      let orgUser = await OrgUser.create({
        org,
        user: user.id,
        role: 3
      }).fetch();
      const res = await req(user.id);
      expect(res.status).to.be.eq(200);
      orgUser = await OrgUser.findOne(orgUser.id);
      expect(orgUser).to.be.undefined;
    });

    it('should delete multiorg user', async () => {
      const user = 10;
      const orgUsers = await OrgUser.find({user});
      expect(orgUsers.length).to.be.at.least(2);
      const res = await req(user);
      expect(res.status).to.be.eq(200);
    });
  });
});
