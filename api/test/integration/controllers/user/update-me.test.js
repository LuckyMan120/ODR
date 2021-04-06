

const bcrypt = require('bcrypt');

describe('user', () => {
  describe('update-me', () => {
    const req = async (
      data = {},
      cookie = updateUserCookie
    ) => await request()
      .put('/user/me')
      .set('Cookie', cookie)
      .send(data);

    it('should update logged in user', async () => {
      const password = 'abcd1234';
      const firstName = 'new_firstName';
      const lastName = 'new_lastName';
      const company = 'new_company';
      const phone = 'new_phone';
      const res = await req({
        password,
        firstName,
        lastName,
        company,
        phone
      });
      expect(res.status).to.be.eq(200);
      expect(res.body.password).to.not.be.eq(password);
      expect(res.body.firstName).to.be.eq(firstName);
      expect(res.body.lastName).to.be.eq(lastName);
      expect(res.body.company).to.be.eq(company);
      expect(res.body.phone).to.be.eq(phone);
      const user = await User.findOne(13);
      const compare = await bcrypt.compare(password, user.password);
      expect(compare).to.be.true;
      expect(user.firstName).to.be.eq(firstName);
      expect(user.lastName).to.be.eq(lastName);
      expect(user.company).to.be.eq(company);
      expect(user.phone).to.be.eq(phone);
    });
  });
});
