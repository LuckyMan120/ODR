

describe('pathway', () => {
  describe('create', () => {
    const req = async (
      data = {},
      cookie = superadminCookie
    ) => await request()
      .post('/pathway')
      .set('Cookie', cookie)
      .send(data);

    it('should create pathway', async () => {
      const name = 'en-gb translate';
      const res = await req({
        active: true,
        translations: {
          'en-gb': {name}
        }
      });
      expect(res.status).to.be.eq(200);
      const pathway = await Pathway.findOne(res.body.id);
      expect(pathway).to.be.an('object');
      const pathwayEnGb = await PathwayTranslation.findOne({
        pathway: res.body.id
      });
      expect(pathwayEnGb).to.be.an('object');
      expect(pathwayEnGb.name).to.be.eq(name);
    });
  });
});
