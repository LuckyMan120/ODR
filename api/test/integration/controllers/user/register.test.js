
describe('user', () => {
  describe('register', () => {
    const req = async (data) => await request()
      .post('/user/register')
      .send(data);

    const slug = 'org-slug';

    it('should validate email', async () => {
      const res = await req({
        email: 'not an email',
        firstName: 'John',
        lastName: 'Doe',
        slug
      });
      expect(res.status).to.be.eq(400);
    });

    it('should refuse with no email, firstName, lastName', async () => {
      let res = await req({
        email: 'email@gmail.com',
        firstName: 'John',
        slug
      });
      expect(res.status).to.be.eq(400);
      res = await req({
        email: 'email@gmail.com',
        lastName: 'Doe',
        slug
      });
      expect(res.status).to.be.eq(400);
      res = await req({
        firstName: 'John',
        lastName: 'Doe',
        slug
      });
      expect(res.status).to.be.eq(400);
    });

    it('should refuse if org doesn\'t exist', async () => {
      const res = await req({
        email: 'email@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        slug: 'slug-that-doesnt-exists'
      });
      expect(res.status).to.be.eq(400);
    });

    it('should refuse if org inactive', async () => {
      const res = await req({
        email: 'email@gmail.com',
        firstName: 'John',
        lastName: 'Doe',
        slug: 'org-inactive'
      });
      expect(res.status).to.be.eq(400);
    });

    it('should register', async () => {
      const email = 'newUser@email.com';
      const firstName = 'John';
      const lastName = 'Doe';
      const phone = '+77012331142';
      const company = 'testCompany';
      const slug = 'org-slug';
      const res = await req({
        email,
        firstName,
        lastName,
        phone,
        company,
        slug
      });
      expect(res.status).to.be.eq(200);
      const user = await User.findOne({email});
      expect(user).to.be.an('object');
      expect(user.email).to.be.eq(email.toLowerCase());
      expect(user.firstName).to.be.eq(firstName);
      expect(user.lastName).to.be.eq(lastName);
      expect(user.phone).to.be.eq(phone);
      expect(user.company).to.be.eq(company);
      const orgUser = await OrgUser.findOne({
        user: user.id,
        org: 1
      });
      expect(orgUser).to.be.an('object');
    });

    it('should refuse register if email exists', async () => {
      const email = 'newUser@email.com';
      const firstName = 'John';
      const lastName = 'Doe';
      const phone = '+77012331142';
      const company = 'testCompany';
      const slug = 'org-slug';
      const res = await req({
        email,
        firstName,
        lastName,
        phone,
        company,
        slug
      });
      expect(res.status).to.be.eq(400);
      expect(res.body.code).to.be.eq('E_UNIQUE');
      expect(res.body.message)
        .to.be.eq(`Sorry, this email is already taken.<br />`
          + `Please enter a new email, or sign-in using this one.`);
    });

    it('should return token if registering using valid token', async () => {
      const email = 'regInviteUser@test.org';
      const orgInvite = await OrgInvite.create({
        email,
        org: 2,
        user: 7,
        role: 1
      }).fetch();
      const token = await OrgInvite.setInviteToken(orgInvite.id);
      const res = await req({
        email,
        firstName: 'firstName',
        lastName: 'lastName',
        slug: 'test-org',
        token
      });
      expect(res.status).to.be.eq(200);
      expect(res.body.token).to.be.a('string');
    });

    it('should register without org', async () => {
      const email = 'newUserComplain@email.com';
      const firstName = 'John';
      const lastName = 'Doe';
      const phone = '+77012331142';
      const company = 'testCompany';
      const res = await req({
        email,
        firstName,
        lastName,
        phone,
        company
      });
      expect(res.status).to.be.eq(200);
      const user = await User.findOne({email});
      expect(user).to.be.an('object');
      expect(user.email).to.be.eq(email.toLowerCase());
      expect(user.firstName).to.be.eq(firstName);
      expect(user.lastName).to.be.eq(lastName);
      expect(user.phone).to.be.eq(phone);
      expect(user.company).to.be.eq(company);
    });

    it('should refuse without org on mediation site', async () => {
      await SiteConfig.update({key: 'siteTypes'}, {value: 'mediations'});
      const email = 'newUserComplain@email.com';
      const firstName = 'John';
      const lastName = 'Doe';
      const phone = '+77012331142';
      const company = 'testCompany';
      const res = await req({
        email,
        firstName,
        lastName,
        phone,
        company
      });
      expect(res.status).to.be.eq(400);
      expect(res.body.message)
        .to.be.eq('Registration to this site is by invitation only');
      await SiteConfig.update({key: 'siteTypes'}, {value: 'complaints'});
    });

  });
});
