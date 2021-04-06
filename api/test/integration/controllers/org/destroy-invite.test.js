

describe('org', () => {
  describe('destroy-invite', () => {
    const req = async (
      id,
      cookie = testOrgAdminCookie
    ) => await request()
      .delete(`/org/invite/${id}`)
      .set('Cookie', cookie)
      .send();

    it('should cancel invite', async () => {
      const {id} = await OrgInvite.create({
        email: 'cancelInvite@test.org',
        user: 7,
        org: 2
      }).fetch();
      const res = await req(id);
      expect(res.status).to.be.eq(200);
      const orgInvite = await OrgInvite.findOne(id);
      expect(orgInvite).to.be.undefined;
    });
  });
});
