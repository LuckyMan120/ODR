/**
 * OrgInvite.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const bcrypt = require('bcrypt');

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    email: {
      type: 'string',
      required: true,
      custom: e => sails.helpers.validate.email(e)
    },

    token: {type: 'string'},

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    user: {model: 'user', required: true},
    org: {model: 'org', required: true},
    role: {model: 'orgRole'}

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

  customToJSON() {
    const {
      token,
      org,
      ...data
    } = this;
    sails.log.silly('Sanitizing', {
      token,
      org
    });
    return data;
  },

  async beforeCreate(orgInvite, next) {
    const existingOrgInvite = await OrgInvite.findOne({
      email: orgInvite.email,
      user: orgInvite.user,
      org: orgInvite.org
    });
    if (!orgInvite.role) orgInvite.role = 3;
    if (existingOrgInvite) {
      return next({message: 'Invite already sent'});
    } else {
      return next();
    }
  },

  async setInviteToken(id, tx) {
    const token = sails.helpers.generateUuid();
    const set = {
      token: await bcrypt.hash(
        token,
        sails.config.bcrypt.saltRounds
      )
    };
    if (tx) {
      await OrgInvite.updateOne({id}).set(set).usingConnection(tx);
    } else {
      await OrgInvite.updateOne({id}).set(set);
    }
    return token;
  }

};

