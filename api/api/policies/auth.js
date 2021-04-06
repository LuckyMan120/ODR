

module.exports = (req, res, next) => {
  if (!req.session.userId) return next({error: 'forbidden'});
  next();
};
