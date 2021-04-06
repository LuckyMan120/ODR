

describe('org', () => {
  describe('update by id', () => {
    const req = async (
      id,
      data = {},
      cookie = adminCookie
    ) => await request()
      .put(`/org/${id}`)
      .set('Cookie', cookie)
      .send(data);

    it('should refuse not logged in', async () => {
      const res = await req(2, {}, '');
      expect(res.status).to.be.eq(403);
    });

    it('should update org but not update org slug or abn', async () => {
      const id = 2;
      const name = 'TestOrg(updated) from update api';
      const abn = 12345678902;
      const active = false;
      const slug = 'test-org-update';
      const oldOrg = await Org.findOne(id);
      const res = await req(id, {
        name,
        abn,
        active,
        slug
      });
      expect(res.status).to.be.eq(200);
      const org = await Org.findOne(id);
      expect(org.name).to.be.eq(name);
      expect(org.active).to.be.eq(active);
      expect(org.abn).to.be.eq(oldOrg.abn);
      expect(org.slug).to.be.eq(oldOrg.slug);
      await Org.updateOne(id, {active: true});
    });

    it('should update org slug', async () => {
      const name = 'TestOrg(updated) from update api';
      const abn = 12345678903;
      const active = false;
      const slug = 'test-org-update';
      const res = await req(2, {
        name,
        abn,
        active,
        slug
      }, superadminCookie);
      expect(res.status).to.be.eq(200);
      const org = await Org.findOne(2);
      expect(org.name).to.be.eq(name);
      expect(org.abn).to.be.eq(abn);
      expect(org.active).to.be.eq(active);
      expect(org.slug).to.be.eq('test-org-update');
      await Org.updateOne(2, {active: true, slug: 'test-org'});
    });

  });
});
