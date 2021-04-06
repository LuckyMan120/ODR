

describe('user', () => {
  describe('request-password-reset', () => {
    const req = async (data) => await request()
      .post('/user/request-password-reset')
      .send(data);

    it('should validate email', async () => {
      const res = await req({});
      expect(res.status).to.be.eq(400);
    });

    it('should initiate password reset', async () => {
      const email = 'johndoe@gmail.com';
      const res = await req({email});
      expect(res.status).to.be.eq(200);
      const user = await User.findOne({email});
      expect(user.passwordResetToken).to.be.a('string');
      expect(user.passwordResetToken.length).to.be.at.least(16);
    });
  });
});
