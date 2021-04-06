

module.exports = async function(req, res, next) {
  const result = await sails.helpers.verifyRecaptcha(
    req.param('captcha', 'empty')
  );
  if (!result) return next({
    error: 'badRequest',
    message: sails.__('Bad captcha')
  });
  return next();
};
