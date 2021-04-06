const {orgRole} = require('../enum/role');

module.exports = (req, res, next) => {
  if ([orgRole.admin, orgRole.staff, orgRole.user]
    .includes(req.session.orgRole)) {
    return next();
  } else {
    return next({error: 'forbidden'});
  }
};
