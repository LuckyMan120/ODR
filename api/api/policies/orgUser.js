const {orgRole} = require('../enum/role');

module.exports = (req, res, next) => {
  if (req.session.orgRole === orgRole.user) {
    return next();
  } else {
    return next({error: 'forbidden'});
  }
};
