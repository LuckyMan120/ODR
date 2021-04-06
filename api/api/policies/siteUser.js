const {userRole} = require('../enum/role');

module.exports = (req, res, next) => {
  if (req.session.userRole === userRole.user) {
    return next();
  } else {
    return next({error: 'forbidden'});
  }
};
