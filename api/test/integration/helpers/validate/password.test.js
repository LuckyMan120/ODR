

describe('validate', () => {
  describe('password', () => {
    it('should validate password', () => {
      const tooShort = 'abc';
      const noNumber = 'noNumber';
      const hasNumberTooShort = 'abc123';
      const goodPassword = '123hasd8';
      expect(sails.helpers.validate.password(tooShort)).to.be.false;
      expect(sails.helpers.validate.password(noNumber)).to.be.false;
      expect(sails.helpers.validate.password(hasNumberTooShort)).to.be.false;
      expect(sails.helpers.validate.password(goodPassword)).to.be.true;
    });
  });
});
