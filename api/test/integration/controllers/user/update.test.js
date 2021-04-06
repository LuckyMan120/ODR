
describe('user', () => {
  describe('update user by id', () => {
    const req = async (
      id,
      data = {},
      cookie = adminCookie
    ) => await request()
      .put(`/user/${id}`)
      .set('Cookie', cookie)
      .send(data);

    it('should update user by id', async () => {
      const firstName = 'new_firstName';
      const lastName = 'new_lastName';
      const company = 'new_company';
      const phone = 'new_phone';
      const res = await req(6, {
        firstName,
        lastName,
        company,
        phone
      });
      expect(res.status).to.be.eq(200);
      expect(res.body.firstName).to.be.eq(firstName);
      expect(res.body.lastName).to.be.eq(lastName);
      expect(res.body.company).to.be.eq(company);
      expect(res.body.phone).to.be.eq(phone);
      const user = await User.findOne(6);
      expect(user.firstName).to.be.eq(firstName);
      expect(user.lastName).to.be.eq(lastName);
      expect(user.company).to.be.eq(company);
      expect(user.phone).to.be.eq(phone);
    });

    it('should refuse admin update user role to superadmin', async () => {
      const role = 1;
      const res = await req(6, {
        role
      });
      expect(res.status).to.be.eq(200);
      const user = await User.findOne(6);
      expect(user.role).to.be.eq(3);
    });
  });
});
