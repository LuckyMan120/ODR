

describe('org', () => {
  describe('users-count', () => {
    const req = async (
      params = {},
      cookie = testOrgAdminCookie
    ) => await request()
      .get('/org/users/count')
      .set('Cookie', cookie)
      .query(params);

    it('should refuse if not org admin', async () => {
      const res = await req({}, testOrgUserCookie);
      expect(res.status).to.be.eq(403);
    });

    it('should return count', async () => {
      const count = await OrgUser.count({
        org: 2
      });
      const res = await req();
      expect(res.status).to.be.eq(200);
      expect(res.body.count).to.be.at.least(count);
    });

    it('should return count with search', async () => {
      const res = await req({
        email: {contains: 'orgAdmin'}
      });
      expect(res.status).to.be.eq(200);
      expect(res.body.count).to.be.eq(1);
    });

    it('should return count with filter by role', async () => {
      const res = await req({
        orgRole: 1
      });
      expect(res.status).to.be.eq(200);
      expect(res.body.count).to.be.eq(1);
    });

    it('should be able to count with {{or: [...{contains: \'\'}]}}',
      async () => {
        const contains = '.org';
        const where = {
          or: [
            {email: {contains}},
            {firstName: {contains}},
            {lastName: {contains}}
          ]
        };
        const {users} = await Org
          .findOne(2, {users: where})
          .select('id');
        const count = await OrgUser.count({
          user: users.map(user => user.id),
          org: 2
        });
        const urlWhere = `or[]={"firstName":{"contains":"${contains}"}}`
          + `&or[]={"lastName":{"contains":"${contains}"}}`
          + `&or[]={"email":{"contains":"${contains}"}}`;
        const res = await req(urlWhere);
        expect(res.status).to.be.eq(200);
        expect(res.body.count).to.be.eq(count);
      });
  });
});
