

describe('Pathway', () => {
  describe('#findOneTranslate', () => {
    const name = 'trName';
    let id;

    before(async () => {
      const pathway = await Pathway.create({}).fetch();
      id = pathway.id;
      await PathwayTranslation.create({
        pathway: id,
        name
      });
    });

    it('should return translation', async () => {
      const pathway = await Pathway.findOneTranslate({id});
      expect(pathway.name).to.be.eq(name);
    });
  });
});
