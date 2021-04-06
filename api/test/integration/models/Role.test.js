const {userRole} = require('../../../api/enum/role');

describe('Role', () => {
  describe('#find', () => {
    it('default roles should exist', async () => {
      const roles = await Role.find();
      expect(roles).to.be.an('array');
      expect(roles.length).to.be.eq(3);
      expect(roles[0]).to.be.an('object');
      expect(roles[0].name).to.be.a('string');
      const roleNames = roles.map(r => r.name);
      expect(roleNames.includes(userRole.superadmin)).to.be.true;
      expect(roleNames.includes(userRole.admin)).to.be.true;
      expect(roleNames.includes(userRole.user)).to.be.true;
    });

    it('should sanitize role in json', async () => {
      const role = await Role.findOne(1);
      expect(role).to.be.an('object');
      const sanitizedRole = JSON.parse(JSON.stringify(role));
      expect(sanitizedRole).to.not.have.property('createdAt');
      expect(sanitizedRole).to.not.have.property('updatedAt');
    });
  });
});
