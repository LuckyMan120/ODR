

module.exports = {

  friendlyName: 'Version',

  description: 'Read and display version file for deployment purposes.',

  exits: {
    notFound: {
      responseType: 'notFound',
      description: 'Incase version file is not found.'
    }
  },

  fn: async function() {
    try {
      return require('../../../version.json');
    } catch (err) {
      sails.log.silly(err);
      throw 'notFound';
    }

  }
};
