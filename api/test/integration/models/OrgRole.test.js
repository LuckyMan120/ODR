
const {orgRole} = require('../../../api/enum/role');

describe('OrgRole', () => {
  describe('#find', () => {
    it('roles should exist', async () => {
      const orgRoles = await OrgRole.find();
      expect(orgRoles.length).to.be.eq(3);
      expect(orgRoles[0]).to.be.an('object');
      expect(orgRoles[0].name).to.be.a('string');
      const roleNames = orgRoles.map(r => r.name);
      expect(roleNames.includes(orgRole.admin)).to.be.true;
      expect(roleNames.includes(orgRole.staff)).to.be.true;
      expect(roleNames.includes(orgRole.user)).to.be.true;
    });

    it('should sanitize org role in json', async () => {
      const role = await OrgRole.findOne(1);
      expect(role).to.be.an('object');
      const sanitizedRole = JSON.parse(JSON.stringify(role));
      expect(sanitizedRole).to.not.have.property('createdAt');
      expect(sanitizedRole).to.not.have.property('updatedAt');
    });
  });
});
