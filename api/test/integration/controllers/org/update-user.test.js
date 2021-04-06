

describe('org', () => {
  describe('update-user', () => {
    const req = async (
      id = 1,
      data = {},
      cookie = testOrgAdminCookie
    ) => await request()
      .put(`/org/user/${id}`)
      .set('Cookie', cookie)
      .send(data);

    it('should refuse if not org admin', async () => {
      const res = await req(undefined, undefined, testOrgUserCookie);
      expect(res.status).to.be.eq(403);
    });

    it('should update org user', async () => {
      const role = 2;
      let orgUser = await OrgUser.findOne({
        user: 9,
        org: 2
      });
      let res = await req(orgUser.user, {role});
      expect(res.status).to.be.eq(200);
      expect(res.body.role).to.be.eq(role);
      expect(orgUser.role).to.not.be.eq(res.body.role);
      orgUser = await OrgUser.findOne(orgUser.id);
      expect(orgUser.role).to.be.eq(role);
      res = await req(orgUser.user, {role: 3});
      orgUser = await OrgUser.findOne(orgUser.id);
      expect(orgUser.role).to.be.eq(3);
    });

    it('should not be able to update user in another org', async () => {
      const res = await req(6, {role: 2});
      expect(res.status).to.be.eq(400);
      expect(res.body.message).to.be.eq('User not found in this organization');
    });

    it('should update multiorg user', async () => {
      const user = 10;
      await OrgUser.create({
        user,
        org: 2,
        role: 3
      });
      const orgUsers = await OrgUser.find({user});
      expect(orgUsers.length).to.be.at.least(2);
      const res = await req(user, {role: 2});
      expect(res.status).to.be.eq(200);
    });

    it('should refuse change of role if the user is the only admin',
      async () => {
        const res = await req(7, {role: 2});
        expect(res.status).to.be.eq(400);
        expect(res.body.message).to.be.eq(`
          This user is the only admin, set another user as an admin first
        `.trim());
      });
  });
});
