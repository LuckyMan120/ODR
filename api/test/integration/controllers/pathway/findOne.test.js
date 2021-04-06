

describe('pathway', () => {
  describe('findOne', () => {
    const req = async (
      id,
      query = {},
      cookie = superadminCookie
    ) => await request()
      .get(`/pathway/${id}`)
      .set('Cookie', cookie)
      .query(query);

    it('should return pathways /w translations', async () => {
      const name = 'pathway name en-gb';
      const {id} = await Pathway.create({active: true}).fetch();
      await PathwayTranslation.create({
        pathway: id,
        locale: 'en-gb',
        name
      });
      let res = await req(id);
      expect(res.status).to.be.eq(200);
      expect(res.body.name).to.be.eq(name);
      expect(res.body.translations).to.be.undefined;
      res = await req(id, {translations: true});
      expect(res.status).to.be.eq(200);
      expect(res.body.translations).to.be.an('object');
      expect(res.body.translations['en-gb']).to.be.an('object');
      expect(res.body.translations['en-gb'].name).to.be.eq(name);
    });
  });
});
