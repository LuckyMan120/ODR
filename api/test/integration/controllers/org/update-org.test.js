

describe('org', () => {
  describe('update', () => {
    const req = async (
      data = {},
      cookie = testOrgAdminCookie
    ) => await request()
      .put(`/org`)
      .set('Cookie', cookie)
      .send(data);

    it('should refuse not logged in', async () => {
      const res = await req({}, '');
      expect(res.status).to.be.eq(403);
    });

    it('should update org', async () => {
      const name = 'TestOrg(updated)';
      const abn = 12345678901;
      const active = false;
      const res = await req({
        name,
        abn,
        active
      });
      expect(res.status).to.be.eq(200);
      const org = await Org.findOne(2);
      expect(org.name).to.be.eq(name);
      expect(org.abn).to.be.eq(abn);
      expect(org.active).to.be.eq(active);
      await Org.updateOne(2, {active: true});
    });
  });
});
