

describe('PathwayStep', () => {
  describe('#create', () => {

    let pathway;

    before(async () => {
      const {id} = await Pathway.create({
        name: 'test'
      }).fetch();
      pathway = id;
    });

    it('should set sortOrder to the next highest one', async () => {
      let pathwayStep = await PathwayStep.create({
        name: 'test',
        linkTo: 'test',
        pathway
      }).fetch();
      expect(pathwayStep.sortOrder).to.be.eq(1);
      pathwayStep = await PathwayStep.create({
        name: 'test',
        linkTo: 'test',
        pathway
      }).fetch();
      expect(pathwayStep.sortOrder).to.be.eq(2);
      pathwayStep = await PathwayStep.create({
        name: 'test',
        linkTo: 'test',
        pathway
      }).fetch();
      expect(pathwayStep.sortOrder).to.be.eq(3);
    });

    it('should be able to set sortOrder manually', async () => {
      const sortOrder = 999;
      const pathwayStep = await PathwayStep.create({
        name: 'test',
        linkTo: 'test',
        pathway,
        sortOrder
      }).fetch();
      expect(pathwayStep.sortOrder).to.be.eq(sortOrder);
    });

    it('should sortOrder separately for orders with parent', async () => {
      let parentPathwayStep = await PathwayStep.create({
        name: 'test',
        linkTo: 'test',
        pathway
      }).fetch();

      let childPathwayStep = await PathwayStep.create({
        name: 'test',
        linkTo: 'test',
        pathway,
        parent: parentPathwayStep.id
      }).fetch();
      expect(childPathwayStep.sortOrder).to.be.eq(1);
      childPathwayStep = await PathwayStep.create({
        name: 'test',
        linkTo: 'test',
        pathway,
        parent: parentPathwayStep.id
      }).fetch();
      expect(childPathwayStep.sortOrder).to.be.eq(2);
      childPathwayStep = await PathwayStep.create({
        name: 'test',
        linkTo: 'test',
        pathway,
        parent: parentPathwayStep.id
      }).fetch();
      expect(childPathwayStep.sortOrder).to.be.eq(3);

      parentPathwayStep = await PathwayStep.create({
        name: 'test',
        linkTo: 'test',
        pathway
      }).fetch();

      childPathwayStep = await PathwayStep.create({
        name: 'test',
        linkTo: 'test',
        pathway,
        parent: parentPathwayStep.id
      }).fetch();
      expect(childPathwayStep.sortOrder).to.be.eq(1);
      childPathwayStep = await PathwayStep.create({
        name: 'test',
        linkTo: 'test',
        pathway,
        parent: parentPathwayStep.id
      }).fetch();
      expect(childPathwayStep.sortOrder).to.be.eq(2);
      childPathwayStep = await PathwayStep.create({
        name: 'test',
        linkTo: 'test',
        pathway,
        parent: parentPathwayStep.id
      }).fetch();
      expect(childPathwayStep.sortOrder).to.be.eq(3);

    });

  });
});
