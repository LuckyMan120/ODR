const {orgRole} = require('../enum/role');

module.exports = (req, res, next) => {
  if (req.session.orgRole === orgRole.admin) {
    return next();
  } else {
    return next({error: 'forbidden'});
  }
};
