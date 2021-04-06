
describe('dash-case', () => {
  describe('dash-case', () => {
    it('should convert to dash-case', async () => {
      expect(
        sails.helpers.dashCase('Hello World Im here')
      ).to.be.eq('hello-world-im-here');
    });

    it('abcd case', async () => {
      expect(
        sails.helpers.dashCase('abcd')
      ).to.be.eq('abcd');
    });

    it('upper case', async () => {
      expect(
        sails.helpers.dashCase('UPPER-CASE NAME')
      ).to.be.eq('upper-case-name');
    });
  });
});
