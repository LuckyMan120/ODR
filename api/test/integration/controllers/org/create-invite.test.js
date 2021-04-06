

describe('org', () => {
  describe('create-invite', () => {
    const req = async (
      data = {},
      cookie = testOrgAdminCookie
    ) => await request()
      .post('/org/invite')
      .set('Cookie', cookie)
      .send(data);

    const email = 'inviteMe@test.org';

    it('should refuse if not admin', async () => {
      const res = await req({email}, testOrgUserCookie);
      expect(res.status).to.be.eq(403);
    });

    it('should send invite', async () => {
      const res = await req({
        email,
        role: 2
      });
      expect(res.status).to.be.eq(200);
      const invite = await OrgInvite.findOne({email});
      expect(invite).to.be.an('object');
      expect(invite.email).to.be.eq(email);
      expect(invite.user).to.be.eq(7);
      expect(invite.org).to.be.eq(2);
      expect(invite.role).to.be.eq(2);
    });

    it('should not create double invite', async () => {
      const res = await req({
        email: 'inviteMe@test.org'
      });
      expect(res.status).to.be.eq(400);
      expect(res.body.message).to.be.eq('Invite already sent');
    });

    it('should add to org after register', async () => {
      const res = await request()
        .post('/user/register')
        .send({
          email,
          password: '1234abcd',
          firstName: 'inviteMe',
          lastName: 'inviteMe',
          slug: 'test-org'
        });
      expect(res.status).to.be.eq(200);
      const user = await User.findOne({email});
      expect(user).to.be.an('object');
      const orgUser = await OrgUser.findOne({
        user: user.id,
        org: 2
      });
      expect(orgUser).to.be.an('object');
    });

    it('should not create if user is in org', async () => {
      const res = await req({
        email: 'orgUser@test.org'
      });
      expect(res.status).to.be.eq(400);
      expect(res.body.message).to.be.eq('User is in this org');
    });

    it('should add user if user already registered', async () => {
      const email = 'existingInviteUser@test.org';
      const res = await req({email});
      expect(res.status).to.be.eq(200);
      const orgUser = await OrgUser.findOne({
        user: 14,
        org: 2
      });
      expect(orgUser).to.be.an('object');
      const invite = await OrgInvite.findOne({email});
      expect(invite).to.be.undefined;
    });

    it('should not accept admin type invite if user is staff', async () => {
      const res = await req({
        email: 'tryAdminInvite@test.org',
        role: 1
      }, testOrgStaffCookie);
      expect(res.status).to.be.eq(400);
      expect(res.body.message).to.be.eq('Can\'t invite admins as staff');
    });

  });
});
