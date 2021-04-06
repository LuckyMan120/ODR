module.exports = {

  friendlyName: 'Count',

  description: 'Count common.',

  inputs: {
    model: {type: 'string', required: true}
  },

  fn: async function({model}) {
    const Model = sails.models[model.toLowerCase()];
    const criteria = this.req.allParams();
    delete criteria.model;
    if (criteria.or) {
      criteria.or = criteria.or.map(or => {
        if (_.isString(or)) {
          try {
            return JSON.parse(or);
          } catch (err) {
            sails.log.silly(err);
            return or;
          }
        } else {
          return or;
        }
      });
    }
    return {
      count: await Model.count(criteria)
    };
  }

};
