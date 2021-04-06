

module.exports = {
  friendlyName: 'Request password reset',

  description: 'Request password reset.',

  inputs: {
    email: {
      type: 'string',
      required: true,
      custom: e => sails.helpers.validate.email(e)
    }
  },

  fn: async function({email}) {
    const user = await User.findOne({email});
    if (!user) return;
    await sails
      .getDatastore()
      .transaction(async tx => {
        const token = await User.setPasswordResetToken(user.id, tx);
        await sails.helpers.email.send(
          'passwordReset',
          {
            clientURL: sails.config.custom.clientURL,
            email: user.email,
            token
          },
          {
            to: email,
            subject: sails.__('Password reset request')
          }
        );
      });
    return;
  }
};
