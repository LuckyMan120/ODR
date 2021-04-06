const {userRole} = require('../../enum/role');
module.exports = {

  friendlyName: 'Update config',

  description: 'Update config value by key',

  inputs: {
    id: {type: 'number', required: true},
    value: {type: 'string', required: true}
  },

  exits: {
    forbidden: {
      responseType: 'forbidden'
    }
  },

  fn: async function({id, value}) {
    return await sails
      .getDatastore()
      .transaction(async tx => {
        const siteConfig = await SiteConfig
          .findOne(id)
          .usingConnection(tx);
        if (
          this.req.session.userRole === userRole.admin
          && siteConfig.protected
        ) throw 'forbidden';
        return await SiteConfig
          .updateOne(id)
          .set({value})
          .usingConnection(tx);
      });
  }

};
