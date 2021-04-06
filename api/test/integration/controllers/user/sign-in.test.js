

describe('user', () => {
  describe('sign-in', () => {
    const req = async (data, cookie) => {
      if (cookie) {
        return await request()
          .post('/user/sign-in')
          .set('Cookie', cookie)
          .send(data);
      } else {
        return await request()
          .post('/user/sign-in')
          .send(data);
      }
    };

    const email = 'johndoe@gmail.com';
    const password = '1234abcd';
    const slug = 'org-slug';
    const orgId = 1;
    const userId = 1;

    it('should refuse if org not found', async () => {
      const res = await req({
        email,
        password,
        slug: 'dont-exist'
      });
      expect(res.status).to.be.eq(400);
      expect(res.body.message).to.be.eq(
        'The requested organization was not found, '
        + 'so login in is not possible. '
        + 'Please contact the organization for more details'
      );
    });

    it('should refuse login if user doesn\'t exist', async () => {
      const res = await req({
        email: 'doNotExists@gmail.com',
        password: '1234abcd',
        slug
      });
      expect(res.status).to.be.eq(400);
      expect(res.body.message).to.be.eq(
        'The email and password combination you provided is incorrect'
      );
    });

    it('should validate email', async () => {
      const res = await req({
        email: 'notAnEmail',
        password,
        slug
      });
      expect(res.status).to.be.eq(400);
    });

    it('should accept if user not in org and add user to org', async () => {
      const res = await req({
        email,
        password,
        slug: 'unnamed-org'
      });
      expect(res.status).to.be.eq(200);
      const user = await User.findOne({email});
      expect(user).to.be.an('object');
      const orgUser = await OrgUser.findOne({
        user: user.id,
        org: 3
      });
      expect(orgUser).to.be.an('object');
    });

    it('should log in', async () => {
      await OrgUser
        .create({
          org: orgId,
          user: userId,
          role: 2
        });
      const res = await req({
        email,
        password,
        slug
      });
      expect(res.status).to.be.eq(200);
    });

    it('should not have org set on double login', async () => {
      const email = 'doubleLogin@test.org';
      const password = '1234abcd';
      const firstName = 'doubleLogin';
      const lastName = 'doubleLogin';
      const user = await User.create({
        email,
        password,
        firstName,
        lastName
      }).fetch();
      await OrgUser.create({
        user: user.id,
        org: 1
      });
      await OrgUser.create({
        user: user.id,
        org: 2
      });
      let res = await req({
        email,
        password,
        slug: 'test-org'
      });
      expect(res.status).to.be.eq(200);
      expect(res.header).to.have.property('set-cookie');
      const cookie = res.header['set-cookie'][0];
      res = await request()
        .get('/user/me')
        .set('Cookie', cookie)
        .send();
      expect(res.status).to.be.eq(200);
      expect(res.body.user).to.be.an('object');
      expect(res.body.role).to.be.an('object');
      expect(res.body.org).to.be.an('object');
      expect(res.body.orgRole).to.be.an('object');
      res = await req({
        email,
        password
      }, cookie);
      expect(res.status).to.be.eq(200);
      res = await request()
        .get('/user/me')
        .set('Cookie', cookie)
        .send();
      expect(res.status).to.be.eq(200);
      expect(res.body.user).to.be.an('object');
      expect(res.body.role).to.be.an('object');
      expect(res.body).to.not.have.property('org');
      expect(res.body).to.not.have.property('orgRole');
    });

    it('should refuse if org is inactive', async () => {
      const res = await req({
        email: 'orgUser@test.org',
        password,
        slug: 'org-inactive'
      });
      expect(res.status).to.be.eq(400);
    });
  });
});
