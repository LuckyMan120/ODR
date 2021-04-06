

const bcrypt = require('bcrypt');

describe('OrgInvite', () => {
  describe('#create', () => {
    it('should have role set by default', async () => {
      const orgInvite = await OrgInvite.create({
        email: 'abcd@abcd.abc',
        user: 7,
        org: 2
      }).fetch();
      expect(orgInvite.role).to.be.eq(3);
    });

    it('should generate invite token', async () => {
      let orgInvite = await OrgInvite.create({
        email: 'dcba@abcd.abc',
        user: 7,
        org: 2
      }).fetch();
      const token = await OrgInvite.setInviteToken(orgInvite.id);
      orgInvite = await OrgInvite.findOne(orgInvite.id);
      const compare = await bcrypt.compare(token, orgInvite.token);
      expect(compare).to.be.true;
    });

    it('should sanitize orgInvite in json', async () => {
      const invite = await OrgInvite.create({
        email: 'sanitizeTest@test.org',
        user: 7,
        org: 2
      }).fetch();
      expect(invite).to.be.an('object');
      const sanitizedInvite = JSON.parse(JSON.stringify(invite));
      expect(sanitizedInvite).to.not.have.property('token');
      expect(sanitizedInvite).to.not.have.property('org');
    });
  });
});
