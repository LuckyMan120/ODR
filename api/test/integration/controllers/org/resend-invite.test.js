

describe('org', () => {
  describe('resend-invite', () => {
    const req = async (
      id,
      cookie = testOrgAdminCookie
    ) => await request()
      .post(`/org/invite/${id}/resend`)
      .set('Cookie', cookie);

    it('should 404 if invite doesn\'t exists', async () => {
      const res = await req(404);
      expect(res.status).to.be.eq(404);
    });

    it('should be able to resend invite', async () => {
      const invite = await OrgInvite.create({
        email: 'resendInviteTest@test.org',
        user: 7,
        org: 2
      }).fetch();
      const res = await req(invite.id);
      expect(res.status).to.be.eq(200);
    });
  });
});
