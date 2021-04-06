

const bcrypt = require('bcrypt');

describe('user', () => {
  describe('password-reset', () => {
    const req = async (id, data) => await request()
      .post(`/user/password-reset`)
      .send(data);

    const id = 2;

    it('should refuse password reset if user doesn\'t exists', async () => {
      const res = await req(999, {
        token: '1234',
        password: '1234abcd'
      });
      expect(res.status).to.be.eq(400);
    });

    it('should refuse with wrong token', async () => {
      const res = await req(id, {
        token: '1234',
        password: '1234abcd'
      });
      expect(res.status).to.be.eq(400);
    });

    it('should validate password', async () => {
      const token = await User.setPasswordResetToken(1);
      const res = await req(id, {
        token,
        password: '1234'
      });
      expect(res.status).to.be.eq(400);
    });

    it('should reset password', async () => {
      const token = await User.setPasswordResetToken(id);
      const password = 'test1234';
      const res = await req(id, {
        email: 'doejohn@gmail.com',
        token,
        password
      });
      expect(res.status).to.be.eq(200);
      const user = await User.findOne({id});
      const compare = await bcrypt.compare(password, user.password);
      expect(compare).to.be.true;
      expect(user.passwordResetToken).to.be.eq('');
    });
  });
});
