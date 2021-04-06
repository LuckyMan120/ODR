/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const bcrypt = require('bcrypt');

async function hashPassword(password) {
  return await bcrypt.hash(
    password,
    sails.config.bcrypt.saltRounds
  );
}

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    email: {
      type: 'string',
      required: true,
      unique: true,
      custom: e => sails.helpers.validate.email(e)
    },

    password: {
      type: 'string',
      custom: p => sails.helpers.validate.password(p)
    },

    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true
    },

    company: {type: 'string'},

    phone: {type: 'string'},

    passwordResetToken: {type: 'string'},

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    role: {model: 'role'},

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    orgs: {collection: 'org', via: 'user', through: 'orgUser'},
    issues: {
      collection: 'issue',
      via: 'user',
      through: 'issueUser'
    }

  },

  customToJSON() {
    const {
      password,
      passwordResetToken,
      createdAt,
      updatedAt,
      ...data
    } = this;
    sails.log.silly('Sanitizing', {
      password,
      passwordResetToken,
      createdAt,
      updatedAt
    });
    return data;
  },

  async beforeCreate(user, next) {
    if (!user.role) user.role = 3;
    if (!user.password) user.password = sails.helpers.generateUuid();
    user.email = user.email.toLowerCase();
    user.password = await hashPassword(user.password);
    next();
  },

  async beforeUpdate(user, next) {
    if (user.password) {
      user.password = await hashPassword(user.password);
    }
    next();
  },

  async setPasswordResetToken(id, tx) {
    const token = sails.helpers.generateUuid();
    const set = {
      passwordResetToken: await bcrypt.hash(
        token,
        sails.config.bcrypt.saltRounds
      )
    };
    if (tx) {
      await User.updateOne({id}).set(set).usingConnection(tx);
    } else {
      await User.updateOne({id}).set(set);
    }
    return token;
  }

};

