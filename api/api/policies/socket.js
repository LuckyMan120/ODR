

module.exports = (req, res, next) => {
  if (!req.isSocket) return next({
    error: 'badRequest',
    message: sails.__('This request is socket only')
  });
  next();
};
