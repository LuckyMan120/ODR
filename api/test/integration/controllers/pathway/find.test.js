

describe('pathway', () => {
  describe('find', () => {
    const req = async (
      query = {},
      cookie = superadminCookie
    ) => await request()
      .get('/pathway')
      .set('Cookie', cookie)
      .query(query);

    it('should get pathway with translation', async () => {
      const name = 'test_name';
      const pathway = await Pathway.create().fetch();
      await PathwayTranslation.create({
        pathway: pathway.id,
        name,
        locale: 'en-gb'
      });
      const res = await req({
        where: {id: pathway.id}
      });
      expect(res.status).to.be.eq(200);
      expect(res.body.length).to.be.at.least(1);
      expect(res.body[0].name).to.be.eq(name);
    });

    it('should get pathway without translation', async () => {
      const pathway = await Pathway.create().fetch();
      const res = await req({
        where: {id: pathway.id}
      });
      expect(res.status).to.be.eq(200);
      expect(res.body.length).to.be.at.least(1);
      expect(res.body[0].name).to.be.eq('');
    });

  });
});
