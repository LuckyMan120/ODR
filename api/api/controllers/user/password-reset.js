

const bcrypt = require('bcrypt');

module.exports = {
  friendlyName: 'Password reset',

  description: '',

  inputs: {
    email: {
      type: 'string',
      required: true,
      custom: e => sails.helpers.validate.email(e)
    },
    token: {type: 'string', required: true},
    password: {
      type: 'string',
      required: true,
      custom: p => sails.helpers.validate.password(p)
    }
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    },
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function({email, token, password}) {
    const user = await User.findOne({
      email: email.toLowerCase()
    });
    if (!user) throw 'notFound';
    const compare = await bcrypt.compare(token, user.passwordResetToken);
    if (!compare) throw 'badRequest';
    await User.updateOne(user.id).set({
      password,
      passwordResetToken: ''
    });
    return;
  }
};
