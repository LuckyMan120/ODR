

describe('validate', () => {
  describe('slug', () => {
    it('should validate slug', () => {
      expect(sails.helpers.validate.slug('not a slug')).to.be.eq(false);
      const slugTooShort = 'abc';
      expect(sails.helpers.validate.slug(slugTooShort)).to.be.eq(false);
      expect(sails.helpers.validate.slug('proper-slug')).to.be.eq(true);
      expect(sails.helpers.validate.slug('slug-1234')).to.be.eq(true);
    });
  });
});
