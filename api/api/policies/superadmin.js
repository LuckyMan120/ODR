const {userRole} = require('../enum/role');

module.exports = (req, res, next) => {
  if (req.session.userRole === userRole.superadmin) {
    return next();
  } else {
    return next({error: 'forbidden'});
  }
};
