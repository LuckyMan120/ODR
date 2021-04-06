

describe('pathway', () => {
  describe('update', () => {
    const req = async (
      id,
      data = {},
      cookie = superadminCookie
    ) => await request()
      .put(`/pathway/${id}`)
      .set('Cookie', cookie)
      .send(data);

    it('should update pathway /w translation', async () => {
      const name = 'new update pathway test';
      const {id} = await Pathway.create().fetch();
      const {
        id: pathwayTranslationId
      } = await PathwayTranslation.create({
        pathway: id,
        locale: 'en-gb',
        name: 'test'
      }).fetch();
      const res = await req(id, {
        translations: {
          'en-gb': {
            name
          }
        }
      });
      expect(res.status).to.be.eq(200);
      expect(res.body.name).to.be.eq(name);
      const pathwayTranslation = await PathwayTranslation
        .findOne(pathwayTranslationId);
      expect(pathwayTranslation.name).to.be.eq(name);
    });
  });
});
