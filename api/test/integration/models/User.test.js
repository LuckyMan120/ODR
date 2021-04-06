

const bcrypt = require('bcrypt');

describe('User', () => {
  describe('#create', () => {
    it('should create a user', async () => {
      const email = 'johndoe123@gmail.com';
      const password = '1234abcd';
      const firstName = 'John';
      const lastName = 'Doe';
      const user = await User.create({
        email,
        password,
        firstName,
        lastName
      }).fetch();
      expect(user).to.be.an('object');
      expect(user.email).to.be.eq(email);
      expect(user.firstName).to.be.eq(firstName);
      expect(user.lastName).to.be.eq(lastName);
      expect(user.role).to.be.eq(3);

      expect(user.password).to.not.be.eq(password);
      const compare = await bcrypt.compare(password, user.password);
      expect(compare).to.be.true;
    });

    it('should create user without a password', async () => {
      const email = 'johndoe12345@gmail.com';
      const firstName = 'John';
      const lastName = 'Doe';
      const user = await User.create({
        email,
        firstName,
        lastName
      }).fetch();
      expect(user).to.be.an('object');
    });

    it('should sanitize user in json', async () => {
      const email = 'johndoe1337@gmail.com';
      const firstName = 'John';
      const lastName = 'Doe';
      const user = await User.create({
        email,
        firstName,
        lastName
      }).fetch();
      expect(user).to.be.an('object');
      const sanitizedUser = JSON.parse(JSON.stringify(user));
      expect(sanitizedUser).to.not.have.property('password');
      expect(sanitizedUser).to.not.have.property('passwordResetToken');
      expect(sanitizedUser).to.not.have.property('createdAt');
      expect(sanitizedUser).to.not.have.property('updatedAt');
    });
  });
});
