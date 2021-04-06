

module.exports = {

  friendlyName: 'Find',

  description: 'Find pathway.',

  inputs: {

  },

  exits: {

  },

  fn: async function() {
    const parseBlueprintOptions = this.req.options.parseBlueprintOptions ||
      this.req._sails.config.blueprints.parseBlueprintOptions;
    this.req.options.blueprintAction = 'find';
    const {criteria} = parseBlueprintOptions(this.req);
    return await Pathway.findTranslate(criteria, this.req.getLocale());
  }

};
