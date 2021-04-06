const {orgRole} = require('../enum/role');

module.exports = (req, res, next) => {
  if (req.session.orgRole === orgRole.staff) {
    return next();
  } else {
    return next({error: 'forbidden'});
  }
};
