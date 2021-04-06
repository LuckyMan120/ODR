/**
 * Mediation.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    name: {type: 'string'},
    closed: {type: 'boolean', defaultsTo: false},
    archived: {type: 'boolean', defaultsTo: false},
    // @todo lastActionAt

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    org: {model: 'org', required: true},
    initiatorPathway: {model: 'pathway', required: true},
    partyPathway: {model: 'pathway', required: true},
    mediatorPathway: {model: 'pathway', required: true},
    type: {model: 'mediationType'}

    // @todo mediationData, triageData

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    // users: {collection: 'user', via: 'mediation', through: 'mediationUser'},
    // mediationUsers: {collection: 'mediationUser', via: 'mediation'},
    // parties: {
    //   collection: 'mediationParty',
    //   via: 'mediation',
    //   through: 'mediationUser'
    // }
  },

  beforeCreate(mediation, next) {
    if (!mediation.type) mediation.type = 1;
    next();
  }
};

