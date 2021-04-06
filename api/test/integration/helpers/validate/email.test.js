

describe('validate', () => {
  describe('email', () => {
    it('should validate email', () => {
      expect(sails.helpers.validate.email('notAnEmail')).to.be.false;
      expect(sails.helpers.validate.email('email@gmail.com')).to.be.true;
      expect(sails.helpers.validate.email('+email@gmail.com')).to.be.true;
    });
  });
});
