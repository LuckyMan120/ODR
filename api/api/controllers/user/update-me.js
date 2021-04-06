

module.exports = {

  friendlyName: 'Update me',

  description: 'Update logged in user.',

  inputs: {
    password: {
      type: 'string',
      custom: p => sails.helpers.validate.password(p)
    },
    firstName: {type: 'string'},
    lastName: {type: 'string'},
    company: {type: 'string'},
    phone: {type: 'string'}
  },

  fn: async function(inputs) {
    return await User
      .updateOne(this.req.session.userId)
      .set(inputs);
  }

};
