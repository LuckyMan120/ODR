

module.exports = {

  friendlyName: 'Plans',

  description: 'Plans stripe.',

  inputs: {

  },

  exits: {

  },

  fn: async function() {
    const list = await sails.helpers.stripe().plans.list();
    return list.data;

  }

};
