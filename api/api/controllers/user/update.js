const {userRole} = require('../../enum/role');

module.exports = {

  friendlyName: 'Update user',

  description: 'Update user by id',

  inputs: {
    id: {type: 'number', required: true},
    company: {type: 'string'},
    email: {type: 'string'},
    firstName: {type: 'string'},
    lastName: {type: 'string'},
    phone: {type: 'string'},
    role: {type: 'number'}
  },

  exits: {
    forbidden: {
      responseType: 'forbidden'
    }
  },

  fn: async function(inputs) {
    if (this.req.session.userRole === userRole.admin)
      delete inputs.role;

    return await User.updateOne(
      inputs.id
    ).set(inputs);
  }

};
