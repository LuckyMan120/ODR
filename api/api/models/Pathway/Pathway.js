/**
 * Pathway.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    active: {type: 'boolean', defaultsTo: true}

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
  },

  async findTranslate(criteria = {}, locale = 'en-gb') {
    const pathways = await Pathway.find(criteria);
    for (let i = 0; i < pathways.length; i++) {
      const pathwayTranslation = await PathwayTranslation
        .findOne({
          pathway: pathways[i].id,
          locale
        })
        .select('name');
      if (pathwayTranslation) {
        pathways[i].name = pathwayTranslation.name;
      } else {
        pathways[i].name = '';
      }
    }
    return pathways;
  },

  async findOneTranslate(criteria = {}, locale = 'en-gb') {
    const pathway = await Pathway.findOne(criteria);
    const pathwayTranslation = await PathwayTranslation
      .findOne({
        pathway: pathway.id,
        locale
      })
      .select('name');
    if (pathwayTranslation) {
      pathway.name = pathwayTranslation.name;
    } else {
      pathway.name = '';
    }
    return pathway;
  }

};
