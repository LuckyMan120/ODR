const userRole = {
  admin: 'siteAdmin',
  superadmin: 'superadmin',
  auth: 'auth',
  user: 'siteUser'
};

const orgRole = {
  admin: 'orgAdmin',
  staff: 'orgStaff',
  user: 'orgUser',
  any: 'orgRoleAny'
};

module.exports = {
  orgRole,
  userRole
};
