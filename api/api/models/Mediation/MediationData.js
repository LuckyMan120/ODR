/**
 * MediationData.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

/**
 * before update - if value is empty then delete the mediationData item in db
 */

const resetMediationUserState = async mediationData => {

  /**

   RUN THIS AFTER CREATE AND AFTER UPDATE
   THIS SHOULD BE A HELPER? COZ IT IS NEEDED AFTER CREATING
   CASE USER RECORD.

   for each mediationUser related to the relevant mediation:
   We need to return a tree of nav items with their state
      (enabled, disabled) and without ones that are hidden.
    1. get the relevant pathway (based on this mediationUser's
        mediationRole being party or mediator)
    2. foreach step in the relevant pathway  :
            check condition to decide state
              if state is enabled or disabled then add this step to the tree
              if state is hidden, skip it

 Calculation of a step's state:
   Based on step.conditions.
   ATM we only have conditions that relate to
        mediationData and we only have conditions for enable
   example: "show": {}, "enable":
      {"dataExists": [{"dataType": 3, "party": "my", "min": 2}]}
   the enable conditions will only be true mediationData where
          mediationData.party = my partyID
          and there are at least two of those
   the party condition  can be "my", "all", "others"
          (others mean all other parties)
   if condition is an empty object (like "show" above) it return true

 return relevant tree of nav items and their state, so that front end
          can have data it needs to display mediation nav
   */

  return {sillyTemp: mediationData};
};

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    value: {type: 'string'},

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    user: {model: 'user', required: true},
    type: {model: 'dataType', required: true},
    mediation: {model: 'mediation', required: true},
    mediationParty: {model: 'mediationParty', required: true}

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },
  beforeCreate(mediationData, next) {
    // @todo Make me
    mediationData.temp = resetMediationUserState(mediationData);
    next(mediationData);
  }

};

